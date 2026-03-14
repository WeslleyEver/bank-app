# SECURITY PIN Flow

## 1. Objetivo

Definir o **fluxo operacional oficial** da feature `SECURITY` para a v1, cobrindo:

- setup do `PIN` transacional;
- confirmação do `PIN`;
- abertura de challenge transacional;
- validação do `PIN`;
- tentativas inválidas e bloqueio temporário;
- cancelamento;
- integração com `Pix`;
- contrato entre `presentation`, `services`, `store` e `infra`.

Este documento transforma a arquitetura e as regras de negócio em **sequência executável de implementação**, reduzindo ambiguidade para desenvolvimento manual e para uso por agentes.

---

## 2. Escopo da v1

A v1 cobre o fluxo completo de challenge transacional por `PIN` para autorizar operações sensíveis.

O primeiro caso obrigatório de uso é:

- `Pix`.

A v1 **não cobre**:

- biometria como fluxo ativo;
- OTP como fluxo ativo;
- reset completo de PIN por produto;
- autorização remota pelo backend;
- múltiplos métodos simultâneos de challenge na UI.

A ausência desses itens não autoriza decisões que acoplem o fluxo exclusivamente ao `Pix` ou exclusivamente ao `PIN`.

---

## 3. Princípios do fluxo

1. O challenge pertence ao `SECURITY`, não ao `Pix`.
2. O `Pix` apenas solicita autorização de operação sensível.
3. Nenhuma tela sozinha autoriza operação.
4. A decisão final de autorização pertence ao serviço de challenge.
5. A store guarda estado funcional do fluxo, nunca segredo bruto.
6. A persistência do material seguro do PIN é isolada da store.
7. Cancelamento é diferente de falha.
8. Erro técnico é diferente de `PIN inválido`.
9. Bloqueio temporário é regra central do domínio, não efeito visual.
10. Todo resultado do fluxo deve ser tipado.

---

## 4. Componentes participantes do fluxo

## 4.1 Presentation

Responsável por:

- abrir telas/modais de setup e challenge;
- coletar entrada do usuário;
- renderizar loading, erro, bloqueio e sucesso;
- encaminhar ações do usuário para hooks/services.

Não é responsável por:

- validar hash;
- contar tentativas;
- decidir bloqueio;
- persistir PIN;
- autorizar diretamente a operação sensível.

## 4.2 Hooks

Responsáveis por:

- conectar UI à store;
- expor actions estáveis;
- encapsular estado derivado para consumo da tela.

## 4.3 Services

Responsáveis por:

- orquestrar setup;
- orquestrar validação;
- abrir e concluir challenge;
- aplicar regras de tentativas e bloqueio;
- retornar resultados tipados.

## 4.4 Store

Responsável por:

- refletir estado funcional atual da feature.

Estado mínimo recomendado:

- `hasPin`
- `isPinValidated`
- `failedAttempts`
- `isBlocked`
- `blockUntil`
- `currentChallenge`
- `lastError`
- `isLoading`

A store **nunca** guarda:

- PIN bruto;
- confirmação do PIN;
- hash completo do PIN como dado de UI;
- salt como estado de interface.

## 4.5 Infra

Responsável por:

- leitura/escrita do material seguro;
- geração de salt;
- derivação/hash do PIN;
- comparação segura;
- normalização do storage seguro.

---

## 5. Tipos de resultado do fluxo

Todo fluxo deve terminar em um resultado funcional explícito.

## 5.1 Resultado do setup

Sugestão de estados:

- `success`
- `invalid_format`
- `confirmation_mismatch`
- `storage_error`
- `unknown_error`

## 5.2 Resultado da validação de PIN

Sugestão de estados:

- `authorized`
- `denied`
- `blocked`
- `not_configured`
- `validation_error`
- `storage_error`

## 5.3 Resultado do challenge transacional

Sugestão de estados:

- `authorized`
- `cancelled`
- `denied`
- `blocked`
- `not_configured`
- `error`

### Regra obrigatória

A feature chamadora deve reagir ao **resultado tipado**, nunca inferir comportamento a partir de mensagens soltas.

---

## 6. Fluxo oficial de setup do PIN

## 6.1 Gatilhos permitidos

O setup do PIN pode ser iniciado por:

- onboarding de segurança;
- primeiro acesso ao módulo SECURITY;
- primeira operação sensível sem PIN configurado.

## 6.2 Sequência oficial

1. UI inicia o fluxo de criação de PIN.
2. Usuário informa o PIN.
3. Usuário informa a confirmação do PIN.
4. Hook aciona `setupPin(pin, confirmation)`.
5. Service valida formato do PIN.
6. Service valida igualdade entre PIN e confirmação.
7. Service solicita à infra a geração de `salt`.
8. Service solicita à infra a derivação/hash do PIN.
9. Service persiste apenas material permitido.
10. Service atualiza store com `hasPin = true`.
11. Service limpa estados transitórios.
12. UI recebe resultado `success` e encerra o fluxo.

## 6.3 Regras obrigatórias

- nada é persistido antes da confirmação válida;
- PIN inválido por formato falha antes de qualquer persistência;
- confirmação divergente falha antes de qualquer persistência;
- store global não recebe PIN bruto;
- logs nunca exibem PIN, hash ou salt.

## 6.4 Fluxo de falha

### Caso: formato inválido

- service retorna `invalid_format`;
- store pode atualizar `lastError` tipado;
- UI informa erro e permanece no fluxo.

### Caso: confirmação divergente

- service retorna `confirmation_mismatch`;
- nada é persistido;
- UI informa divergência e permite nova tentativa.

### Caso: erro técnico de persistência

- service retorna `storage_error`;
- `hasPin` permanece `false`;
- UI informa falha técnica sem marcar setup como concluído.

---

## 7. Fluxo oficial de abertura de challenge

## 7.1 Objetivo

Permitir que qualquer feature solicite autorização de operação sensível sem conhecer o mecanismo interno do PIN.

## 7.2 Contrato recomendado

Exemplo conceitual:

```ts
requestTransactionalChallenge({
  type: 'PIX_TRANSFER',
  metadata: {
    amount,
    destination,
  },
})
```

## 7.3 Sequência oficial

1. Feature chamadora solicita o challenge.
2. SECURITY cria `currentChallenge` na store.
3. SECURITY verifica se há PIN configurado.
4. Se não houver PIN, retorna `not_configured`.
5. Se houver bloqueio ativo, retorna `blocked`.
6. Se estiver apto, SECURITY abre a UI de challenge.
7. Usuário informa o PIN ou cancela.
8. SECURITY conclui o fluxo com resultado tipado.
9. Feature chamadora decide executar ou abortar a operação com base no resultado.

### Regra obrigatória

A operação sensível só pode começar após resultado `authorized`.

---

## 8. Fluxo oficial de validação do PIN

## 8.1 Pré-condições

Antes de validar, o service deve checar:

- se existe `currentChallenge` ativo, quando aplicável;
- se existe PIN configurado;
- se não há bloqueio em vigor;
- se o PIN recebido está completo e em formato válido.

## 8.2 Sequência oficial

1. Usuário submete o PIN completo.
2. Hook aciona `validatePin(pin)`.
3. Service verifica bloqueio ativo.
4. Service lê material seguro persistido.
5. Service deriva/hash do PIN recebido usando o `salt` salvo.
6. Service compara com o material persistido.
7. Se a comparação for válida:
   - zera tentativas inválidas;
   - limpa erro anterior;
   - marca `isPinValidated = true` no escopo do challenge atual;
   - conclui o challenge como `authorized`.
8. Se a comparação falhar:
   - incrementa `failedAttempts`;
   - verifica se atingiu limite;
   - se não atingiu, retorna `denied`;
   - se atingiu, aplica bloqueio e retorna `blocked`.

## 8.3 Regras obrigatórias

- falha técnica não incrementa tentativas;
- PIN parcial não conta como tentativa;
- sucesso limpa estado transitório de erro;
- `authorized` deve ser resultado explícito, não apenas ausência de erro.

---

## 9. Fluxo de tentativas inválidas e bloqueio

## 9.1 Política da v1

- máximo de **3 tentativas inválidas consecutivas**;
- após exceder o limite, aplicar **bloqueio temporário de 5 minutos**.

## 9.2 Sequência em falha simples

1. usuário informa PIN incorreto;
2. validação conclui comparação inválida;
3. `failedAttempts` é incrementado;
4. `lastError` recebe erro tipado de PIN inválido;
5. UI exibe erro funcional.

## 9.3 Sequência em bloqueio

1. usuário falha na tentativa que ultrapassa o limite;
2. service calcula `blockUntil`;
3. store atualiza:
   - `isBlocked = true`
   - `blockUntil = <timestamp>`
4. resultado final da submissão passa a ser `blocked`;
5. UI informa bloqueio e impede nova submissão até expiração.

## 9.4 Expiração do bloqueio

Ao abrir novo challenge ou tentar nova validação, o service deve:

1. verificar `blockUntil`;
2. se o horário já expirou:
   - limpar `isBlocked`;
   - limpar `blockUntil`;
   - resetar `failedAttempts` para zero;
3. prosseguir normalmente.

### Regra obrigatória

A expiração do bloqueio deve ser verificada pelo domínio/serviço, não só pela UI.

---

## 10. Fluxo de cancelamento

## 10.1 Conceito

Cancelamento ocorre quando o usuário desiste voluntariamente do challenge antes da autorização.

## 10.2 Sequência oficial

1. challenge é iniciado;
2. UI abre tela/modal de PIN;
3. usuário fecha, volta ou aciona cancelar;
4. hook/service chama `cancelCurrentChallenge()`;
5. store limpa `currentChallenge` e estados transitórios do fluxo;
6. SECURITY retorna `cancelled` para a feature chamadora.

## 10.3 Regras obrigatórias

- cancelamento não conta como tentativa inválida;
- cancelamento não executa a operação sensível;
- cancelamento não altera `hasPin`;
- cancelamento não deve ser tratado como erro técnico.

---

## 11. Fluxo quando não há PIN configurado

## 11.1 Sequência oficial

1. feature solicita challenge;
2. SECURITY verifica ausência de material seguro persistido;
3. SECURITY retorna `not_configured`;
4. produto decide redirecionar para setup de PIN.

## 11.2 Regra obrigatória

A ausência de PIN configurado deve ser tratada como estado funcional claro, não como erro genérico.

---

## 12. Fluxo de integração com Pix

## 12.1 Regra principal

O `Pix` não valida PIN diretamente.

O `Pix` deve apenas solicitar autorização transacional ao `SECURITY` e executar a operação somente em caso de `authorized`.

## 12.2 Sequência oficial do Pix

1. usuário preenche dados do Pix;
2. usuário confirma intenção de envio;
3. a camada de orquestração do Pix solicita challenge ao SECURITY;
4. SECURITY executa o fluxo de challenge;
5. resultado do challenge retorna ao fluxo do Pix;
6. somente se o resultado for `authorized`, o `sendPixUseCase` é executado;
7. se o resultado for `denied`, `blocked`, `cancelled`, `not_configured` ou `error`, o envio não é executado.

## 12.3 Regra de implementação obrigatória

O ponto que efetivamente dispara a operação sensível deve estar protegido por challenge.

É proibido confiar apenas em:

- navegação prévia por tela de confirmação;
- estado local da tela;
- flag visual temporária;
- ter digitado PIN em alguma etapa anterior sem resultado formal do service.

## 12.4 Resultado esperado por caso

### Caso: `authorized`

- prossegue com `sendPixUseCase`;
- loading e feedback seguem o fluxo normal do Pix.

### Caso: `denied`

- não executa `sendPixUseCase`;
- exibe erro funcional de PIN inválido.

### Caso: `blocked`

- não executa `sendPixUseCase`;
- exibe bloqueio com referência temporal.

### Caso: `cancelled`

- não executa `sendPixUseCase`;
- encerra o fluxo sem enviar.

### Caso: `not_configured`

- não executa `sendPixUseCase`;
- produto pode redirecionar para setup de PIN.

### Caso: `error`

- não executa `sendPixUseCase`;
- exibe falha técnica apropriada.

---

## 13. Limpeza de estado do fluxo

## 13.1 Quando limpar

O SECURITY deve limpar estado transitório nos seguintes casos:

- setup concluído com sucesso;
- challenge concluído;
- challenge cancelado;
- logout;
- troca de conta;
- reset futuro de PIN.

## 13.2 O que limpar

- `currentChallenge`
- flags transitórias de loading
- erros transitórios do fluxo
- `isPinValidated` associado ao challenge atual

## 13.3 O que não limpar indevidamente

Sem motivo explícito, não limpar:

- material persistido do PIN;
- estado estrutural de `hasPin`;
- bloqueio ativo ainda válido.

---

## 14. Contratos mínimos recomendados

## 14.1 Services

Sugestão de contratos mínimos:

- `setupPin(pin, confirmation)`
- `validatePin(pin)`
- `requestTransactionalChallenge(request)`
- `cancelCurrentChallenge()`
- `clearSecurityState()`
- `clearSecurityOnLogout()`
- `clearSecurityOnAccountChange()`

## 14.2 Hooks

Sugestão de hooks mínimos:

- `useSecurity()`
- `usePinSetup()`
- `useTransactionalChallenge()`

## 14.3 Types

Sugestão de tipos mínimos:

- `SecurityState`
- `SecurityChallengeRequest`
- `SecurityChallengeType`
- `SecurityChallengeResult`
- `SecurityValidationResult`
- `PinSetupResult`

---

## 15. Proibições explícitas

É proibido:

- salvar PIN bruto em store, storage, log ou analytics;
- permitir que o `Pix` importe validador de PIN diretamente;
- executar operação sensível após challenge sem resultado tipado;
- incrementar tentativas por cancelamento;
- transformar erro técnico em `PIN inválido`;
- deixar a UI decidir sozinha bloqueio ou expiração;
- manter `currentChallenge` inconsistente após conclusão do fluxo.

---

## 16. Critérios de aceite do fluxo

O fluxo será considerado corretamente implementado quando:

- usuário conseguir criar PIN com confirmação válida;
- nada for persistido antes da confirmação;
- challenge puder ser solicitado por contrato reutilizável;
- validação correta autorizar a operação;
- PIN inválido incrementar tentativas corretamente;
- bloqueio temporário impedir novas validações;
- cancelamento não executar a operação;
- Pix só executar após resultado `authorized`;
- store não guardar segredo bruto;
- resultado do fluxo for previsível, tipado e reutilizável.
