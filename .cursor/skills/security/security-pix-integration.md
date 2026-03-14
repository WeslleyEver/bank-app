# SECURITY ↔ PIX Integration (v1)

## 1. Objetivo

Definir a integração oficial entre a feature **SECURITY** e a feature **PIX** para garantir que operações sensíveis só sejam executadas após **autorização transacional válida**.

Este documento descreve:

- onde o challenge entra no fluxo do Pix
- quais módulos podem se comunicar
- quais dependências são permitidas
- como impedir bypass de segurança
- como o Pix deve reagir aos resultados do challenge
- como manter a integração preparada para evoluir além de PIN

---

## 2. Princípios obrigatórios

### 2.1. Pix não valida PIN
A feature **PIX nunca valida PIN diretamente**.

PIX não pode:

- ler storage de segurança
- comparar PIN
- calcular hash
- contar tentativas
- decidir bloqueio
- conhecer regra interna de credential

Essas responsabilidades pertencem exclusivamente à feature **SECURITY**.

---

### 2.2. Pix consome autorização, não credencial
PIX deve trabalhar com o conceito de:

- **challenge transacional**
- **resultado de autorização**

PIX não deve trabalhar com o conceito de:

- PIN bruto
- hash de PIN
- mecanismo específico de autenticação

Isso garante que no futuro a autenticação transacional possa evoluir para:

- PIN
- biometria
- OTP
- combinação de métodos

sem obrigar refactor na feature PIX.

---

### 2.3. Operação sensível só executa após challenge autorizado
Toda operação Pix classificada como sensível só pode prosseguir após receber de SECURITY um resultado explícito de autorização.

Na v1, considera-se sensível:

- envio de Pix

Logo, **sendPixUseCase** não pode ser executado de forma solta por UI ou por qualquer outro fluxo sem passar pelo ponto oficial de challenge.

---

### 2.4. A proteção não pode existir apenas na tela
Não é suficiente abrir uma tela de PIN antes do envio.

A regra de segurança deve existir também na **orquestração da operação**, para impedir que outra tela, hook, teste, atalho ou fluxo futuro execute Pix sem challenge.

---

## 3. Responsabilidades por feature

## 3.1. SECURITY é responsável por

- decidir se a operação exige challenge
- abrir challenge
- validar credencial transacional
- controlar tentativas inválidas
- aplicar bloqueio temporário
- retornar resultado tipado
- registrar erros e observabilidade de segurança

---

## 3.2. PIX é responsável por

- iniciar o pedido de autorização para uma operação sensível
- aguardar o resultado do challenge
- executar a operação somente quando autorizado
- interromper a operação quando negado, cancelado, bloqueado ou indisponível
- refletir corretamente loading, erro e feedback ao usuário

---

## 3.3. AUTH é responsável por

- autenticação de sessão
- token, refresh, restore, logout

AUTH não valida challenge transacional.

---

## 3.4. shared é responsável por

- contratos e utilidades genéricas reutilizáveis
- tipos ou abstrações neutras, quando realmente compartilháveis

shared não pode depender de PIX nem de SECURITY.

---

## 4. Direção de dependência

A direção correta deve ser:

- `PIX -> SECURITY`
- `SECURITY -> AUTH` (permitido apenas se necessário para contexto de usuário/sessão)
- `SECURITY -> shared`
- `PIX -> shared`

Não é permitido:

- `SECURITY -> PIX`
- `AUTH -> SECURITY` para validar challenge
- `PIX -> infra interna de SECURITY`
- `PIX -> store interna de SECURITY`
- `PIX -> storage de SECURITY`

---

## 5. Ponto oficial de integração

## 5.1. Regra arquitetural
A integração oficial deve acontecer por um contrato de alto nível da feature SECURITY.

Exemplos válidos de contrato:

- `requestTransactionalChallenge(...)`
- `authorizeSensitiveOperation(...)`
- `useTransactionalChallenge()`

O nome concreto pode variar, mas a semântica é obrigatória:

> PIX solicita autorização transacional a SECURITY e recebe um resultado tipado.

---

## 5.2. Resultado mínimo esperado
O contrato entre PIX e SECURITY deve retornar um resultado previsível.

Exemplo conceitual:

```ts
export type SecurityChallengeResult =
  | { status: 'authorized' }
  | { status: 'denied'; reason: 'invalid_pin' }
  | { status: 'blocked'; blockUntil: string }
  | { status: 'not_configured' }
  | { status: 'cancelled' }
  | { status: 'unavailable'; code: string };
```

PIX deve depender do **resultado** e não da implementação interna que gerou esse resultado.

---

## 5.3. Contexto da operação
SECURITY deve receber contexto suficiente para saber qual operação está sendo autorizada.

Exemplo conceitual:

```ts
export type SecurityChallengeContext = {
  operation: 'pix.send';
  amount?: number;
  targetId?: string;
};
```

Na v1, o contexto mínimo esperado para Pix é:

- tipo da operação
- valor
- identificador do destinatário, quando aplicável

Esse contexto não existe para o Pix validar PIN, e sim para:

- permitir rastreabilidade interna
- suportar política futura por tipo de operação
- dar contexto visual ao challenge

---

## 6. Fluxo oficial de envio Pix com challenge

## 6.1. Sequência obrigatória
A sequência oficial da v1 deve ser esta:

1. usuário inicia envio Pix
2. PIX coleta e valida dados próprios da operação
3. PIX solicita challenge transacional ao SECURITY
4. SECURITY avalia estado atual
5. SECURITY retorna um resultado tipado
6. PIX decide o próximo passo com base no resultado
7. somente em `authorized` a execução do Pix é liberada
8. após sucesso do Pix, a UI exibe confirmação

---

## 6.2. Fluxo detalhado

### Caso `authorized`
PIX pode executar a operação.

A autorização vale apenas para a operação em curso.

Não é permitido reutilizar implicitamente a autorização para outras operações futuras.

---

### Caso `denied`
PIX não executa a operação.

A UI deve informar falha de autenticação transacional.

A operação deve permanecer interrompida.

---

### Caso `blocked`
PIX não executa a operação.

A UI deve informar bloqueio temporário e, quando disponível, o tempo restante.

---

### Caso `not_configured`
PIX não executa a operação.

A UI deve redirecionar para o fluxo oficial de setup de PIN ou onboarding de segurança, conforme a regra do produto.

Na v1, esse estado não pode ser tratado como sucesso parcial.

---

### Caso `cancelled`
PIX não executa a operação.

Cancelamento não conta como tentativa inválida.

A UI deve retornar ao fluxo anterior de forma estável.

---

### Caso `unavailable`
PIX não executa a operação.

Esse estado representa falha técnica de segurança, por exemplo:

- storage indisponível
- estado inconsistente
- erro interno inesperado

Esse caso não pode ser tratado como `PIN inválido`.

---

## 7. Onde o challenge deve ficar no código

## 7.1. Regra principal
O challenge deve estar acoplado ao **fluxo de autorização da operação**, e não somente à tela visual.

A recomendação arquitetural da v1 é que exista uma camada orquestradora do envio Pix, por exemplo:

- `sendPixWithSecurityChallengeUseCase`
- `authorizeAndSendPixUseCase`
- `useSendPixFlow`

Essa camada faz:

1. pedir autorização ao SECURITY
2. executar `sendPixUseCase` apenas se autorizado

---

## 7.2. O que não fazer
Não é permitido deixar a tela fazer isto sozinha:

1. abrir modal/tela de PIN
2. se parecer sucesso, chamar `sendPixUseCase`

Esse desenho é frágil porque permite bypass quando outro fluxo chamar `sendPixUseCase` diretamente.

---

## 7.3. Regra de encapsulamento
`sendPixUseCase` deve ser tratado como operação de domínio Pix, mas a aplicação não deve expor caminhos livres que o chamem sem challenge quando o caso de uso exigir autenticação transacional.

Em outras palavras:

- o domínio Pix continua sabendo enviar Pix
- a aplicação cria um fluxo protegido para operações reais do usuário
- a UI pública deve usar o fluxo protegido

---

## 8. Contrato recomendado de integração

## 8.1. Contrato de SECURITY
Exemplo conceitual:

```ts
export type RequestTransactionalChallengeInput = {
  context: SecurityChallengeContext;
};

export type RequestTransactionalChallenge = (
  input: RequestTransactionalChallengeInput,
) => Promise<SecurityChallengeResult>;
```

---

## 8.2. Contrato de integração no Pix
Exemplo conceitual:

```ts
export type SendPixProtectedInput = {
  to: string;
  amount: number;
};

export async function sendPixWithSecurityChallenge(
  input: SendPixProtectedInput,
): Promise<SendPixProtectedResult> {
  const challenge = await requestTransactionalChallenge({
    context: {
      operation: 'pix.send',
      amount: input.amount,
      targetId: input.to,
    },
  });

  if (challenge.status !== 'authorized') {
    return mapChallengeResultToPixResult(challenge);
  }

  return sendPixUseCase(input.to, input.amount);
}
```

O código concreto pode variar, mas a regra é:

- Pix chama SECURITY
- SECURITY responde
- só então Pix executa

---

## 9. Regras de UI para o Pix

## 9.1. Loading
O fluxo deve distinguir:

- loading de challenge
- loading de envio Pix

A UI não deve colapsar esses estados de forma que o usuário não entenda se:

- está validando a segurança
- está enviando a transação

---

## 9.2. Feedback
A UI deve refletir claramente cada resultado:

- PIN inválido
- bloqueio temporário
- PIN não configurado
- cancelamento
- falha técnica
- sucesso da transação

Mensagens devem ser claras, mas nunca vazar detalhes sensíveis.

---

## 9.3. Repetição segura
Se a validação falhar, o usuário pode tentar novamente conforme a política de tentativas.

Se a operação for cancelada, a UI pode permitir nova tentativa manual.

Se houver bloqueio, a UI não pode ficar abrindo challenge repetidamente sem respeitar `blockUntil`.

---

## 10. Regras de observabilidade

## 10.1. O que pode ser logado
Pode ser logado:

- início de challenge para operação `pix.send`
- resultado do challenge por categoria
- bloqueio aplicado
- operação cancelada
- operação Pix executada após autorização
- falhas técnicas de integração

---

## 10.2. O que nunca pode ser logado
Nunca pode ser logado:

- PIN bruto
- hash do PIN
- salt
- valor digitado pelo usuário
- segredo derivado
- payload sensível que permita reconstrução de credencial

---

## 10.3. Correlação
Quando houver observabilidade, os eventos devem permitir correlacionar:

- challenge solicitado
- challenge autorizado/negado/cancelado/bloqueado
- envio Pix iniciado
- envio Pix concluído/falhado

sem expor material sensível.

---

## 11. Regras de erro entre SECURITY e PIX

## 11.1. Separação obrigatória
O fluxo deve separar claramente:

- erro de challenge
- erro de operação Pix

Exemplos:

- `PIN_INVALID` não é erro de Pix
- `PIX_INSUFFICIENT_FUNDS` não é erro de SECURITY
- `SECURITY_STORAGE_ERROR` não vira `PIN_INVALID`
- `PIX_NETWORK_ERROR` não invalida o challenge retrospectivamente

---

## 11.2. Mapeamento para o Pix
PIX pode converter o resultado do challenge em estados de UI próprios, mas sem reescrever a semântica do SECURITY.

Exemplo:

- `blocked` -> mostrar bloqueio e não enviar
- `cancelled` -> abortar silenciosamente ou com aviso leve
- `not_configured` -> redirecionar para setup
- `denied` -> informar credencial inválida
- `unavailable` -> informar indisponibilidade temporária

---

## 12. Regras contra bypass

## 12.1. Toda entrada pública de envio Pix deve usar fluxo protegido
Se houver mais de uma tela, botão, atalho ou entrypoint para envio Pix, todos devem convergir para a mesma orquestração protegida.

---

## 12.2. Não duplicar lógica de challenge em múltiplas telas
A lógica de challenge não deve ser reimplementada em cada tela.

Ela deve estar centralizada em hook, service ou use case reutilizável.

---

## 12.3. Não confiar em flags visuais
Não é permitido usar apenas flags de UI como:

- `hasValidatedPin`
- `modalClosedSuccessfully`

para decidir executar Pix, se não houver resultado tipado vindo do fluxo oficial de SECURITY.

---

## 12.4. Não deixar use case sensível “solto” no app
Se o app expõe `sendPixUseCase` diretamente para múltiplos lugares, deve haver disciplina de arquitetura para que fluxos de usuário sempre usem a versão protegida.

Se necessário, a camada pública usada pela UI deve ser apenas a versão protegida.

---

## 13. Evolução futura
A integração v1 já deve nascer compatível com evolução para:

- biometria
- OTP
- regras por valor da transação
- regras por tipo de operação
- challenge adaptativo
- autenticação combinada

Para isso, PIX não pode depender do mecanismo concreto de autenticação.

PIX deve depender apenas de:

- contexto da operação
- resultado da autorização

---

## 14. Critérios de aceite arquitetural

A integração SECURITY ↔ PIX só é considerada correta quando todos os critérios abaixo forem verdadeiros:

1. PIX não valida PIN diretamente.
2. PIX não acessa storage interno do SECURITY.
3. PIX não importa infra interna do SECURITY.
4. O envio Pix só executa após resultado `authorized`.
5. Cancelamento interrompe a operação sem contar tentativa inválida.
6. Bloqueio interrompe a operação e informa estado à UI.
7. `not_configured` interrompe a operação e redireciona para setup.
8. Falha técnica de SECURITY não é tratada como PIN inválido.
9. Todos os entrypoints públicos de envio Pix usam a mesma orquestração protegida.
10. O fluxo está preparado para aceitar métodos futuros além de PIN.

---

## 15. Antipadrões proibidos

São proibidos os seguintes desenhos:

- PIX importando `validatePin()` diretamente para comparar PIN
- PIX lendo storage de segurança
- PIX conhecendo `failedAttempts` como regra interna de domínio
- tela chamando `sendPixUseCase` diretamente após fechar modal sem resultado tipado
- lógica de challenge copiada em várias telas
- tratar erro técnico como falha de PIN
- permitir envio Pix quando challenge foi cancelado
- permitir envio Pix quando challenge está bloqueado
- permitir envio Pix sem setup de PIN quando a política exigir challenge

---

## 16. Resumo executivo

A integração correta é:

- PIX pede autorização transacional ao SECURITY
- SECURITY resolve challenge e retorna resultado tipado
- PIX só executa a transação quando o resultado for `authorized`
- nenhuma parte do Pix conhece PIN ou lógica interna de credencial

Em resumo:

> **PIX depende de autorização transacional, não de PIN.**

Esse é o princípio que mantém a arquitetura segura, extensível e compatível com evolução futura do app bancário.
