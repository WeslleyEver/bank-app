# SECURITY Architecture

## 1. Objetivo

Definir a arquitetura oficial da feature `SECURITY` para o app bancário, com foco em **autenticação transacional** e **autorização de operações sensíveis**, garantindo:

- separação clara entre `AUTH` e `SECURITY`;
- dependências consistentes entre módulos;
- base sólida para `PIN`, `biometria` e `OTP` no futuro;
- reutilização do challenge transacional por múltiplas features;
- prevenção de acoplamento direto entre `Pix` e mecanismo de credencial.

Este documento serve como **fonte de verdade arquitetural** para implementação manual e para uso por agentes/assistentes de código.

---

## 2. Escopo oficial da feature SECURITY

A feature `SECURITY` é responsável por toda a **segurança transacional local do app**, isto é, a validação adicional exigida antes de executar operações sensíveis.

### SECURITY é responsável por

- modelar e validar a **credencial transacional** do usuário;
- gerenciar o estado de segurança local do app;
- decidir quando uma operação exige **challenge transacional**;
- executar e orquestrar o fluxo de challenge;
- persistir com segurança o material necessário para validação local;
- controlar tentativas inválidas e bloqueio temporário;
- expor uma API pública reutilizável para outras features;
- preparar a base para múltiplos métodos de autenticação transacional.

### SECURITY não é responsável por

- login de conta;
- refresh token;
- sessão autenticada do usuário;
- acesso token / refresh token;
- roteamento inicial por autenticação;
- cadastro, recuperação ou identidade de conta no backend;
- regras de negócio específicas do Pix.

---

## 3. Escopo oficial do AUTH

A feature `AUTH` é responsável por **autenticação de sessão**.

### AUTH é responsável por

- login e logout;
- restauração de sessão;
- refresh token;
- sessão do usuário autenticado;
- identidade da conta logada;
- dados mínimos para bootstrap da aplicação.

### AUTH não é responsável por

- PIN transacional;
- challenge transacional;
- tentativas inválidas de credencial transacional;
- bloqueio temporário de validação transacional;
- regras de autorização de operação sensível.

---

## 4. Regra principal de dependência

### Regra obrigatória

- `SECURITY` **pode** depender de contratos expostos por `AUTH`.
- `AUTH` **não pode** depender de `SECURITY`.
- `shared` **não pode** depender de nenhuma feature.
- features de negócio como `PIX`, `CARDS`, `TRANSFER`, etc. **podem depender da API pública de `SECURITY`**, mas **não podem depender da implementação interna do PIN**.

### Motivo

`AUTH` representa autenticação de sessão. `SECURITY` representa autenticação transacional. A sessão pode existir sem challenge transacional, mas operações sensíveis não devem conhecer o mecanismo interno da credencial.

### Regra prática

Qualquer import de `AUTH` para dentro de `SECURITY` deve ser feito apenas por:

- tipos públicos;
- providers públicos;
- contratos estáveis.

`AUTH` nunca deve importar:

- store de security;
- services internos de security;
- hooks internos de security;
- infra de storage de PIN.

---

## 5. Princípios arquiteturais

1. **Segurança transacional é feature de domínio, não utilitário técnico.**
2. **Pix não conhece PIN. Pix conhece challenge/autorização.**
3. **Store nunca guarda segredo bruto.**
4. **Persistência segura é centralizada e isolada.**
5. **Validação e bloqueio são regras de domínio, não regras de UI.**
6. **Toda operação sensível deve passar por um contrato único de autorização.**
7. **Toda extensão futura deve preservar compatibilidade com novos métodos** (`PIN`, `biometria`, `OTP`).
8. **Nenhum log pode vazar segredo, hash, salt ou valor digitado.**
9. **UI consome estados tipados; não interpreta storage diretamente.**
10. **A ausência de AUTH não autoriza acoplamento indevido.** Se `AUTH` ainda não existir como feature madura, usar abstrações, não atalhos.

---

## 6. Estrutura mínima obrigatória da feature

```txt
src/features/security/
  constants/
  errors/
  hooks/
  infra/
  presentation/
  services/
  store/
  types/
  index.ts
```

### Responsabilidade de cada pasta

#### `types/`
Tipos públicos e internos da feature.

Exemplos:
- `security.types.ts`
- `security-challenge.types.ts`
- `security-credential.types.ts`
- `security-result.types.ts`

#### `constants/`
Constantes de domínio e configuração controlada.

Exemplos:
- número máximo de tentativas;
- duração de bloqueio temporário;
- nomes de chaves de storage;
- tipos de challenge;
- métodos suportados.

#### `services/`
Use cases e orquestração de regra de negócio.

Exemplos:
- `setupPin`
- `validatePin`
- `requestTransactionalChallenge`
- `resetSecurityState`
- `clearSecurityOnAccountChange`

#### `hooks/`
Hooks de consumo da feature pela UI.

Exemplos:
- `useSecurity`
- `useTransactionalChallenge`
- `usePinSetup`

#### `store/`
Estado derivado, previsível e observável da feature.

#### `infra/`
Persistência segura, adapters, crypto helpers e gateways locais.

#### `presentation/`
Telas, componentes, containers e fluxos visuais.

#### `errors/`
Tipos, códigos, mapper, factory e helpers de erro.

#### `index.ts`
**Única porta de entrada pública da feature.**

---

## 7. API pública oficial da feature

A feature `SECURITY` deve expor uma API pública mínima e estável.

### Exemplo de contrato público

```ts
export { useSecurityStore } from './store/security.store';
export { setupPin } from './services/setupPin';
export { validatePin } from './services/validatePin';
export { requestTransactionalChallenge } from './services/requestTransactionalChallenge';
export { cancelCurrentChallenge } from './services/cancelCurrentChallenge';
export { clearSecurityState } from './services/clearSecurityState';
export { securityErrorFactory } from './errors/security-error.factory';
export type {
  SecurityMethod,
  SecurityChallengeType,
  SecurityChallengeRequest,
  SecurityChallengeResult,
  SecurityValidationResult,
  SecurityState,
} from './types';
```

### Regra obrigatória

Nenhuma feature externa pode importar arquivos internos de `SECURITY` fora do `index.ts`.

### Proibição explícita

É proibido em outras features importar diretamente:

- `infra/*`
- `store/*`
- `services/*` internos sem passar por `index.ts`
- implementações específicas de `PIN`

---

## 8. Modelo de domínio de segurança

### 8.1 Credencial transacional

Credencial transacional é o mecanismo usado para autorizar uma operação sensível após o usuário já estar autenticado na sessão.

### 8.2 Métodos suportados

A arquitetura deve nascer preparada para:

- `PIN`
- `BIOMETRY`
- `OTP`

### 8.3 Método inicial obrigatório

Na primeira versão, o único método implementado será:

- `PIN`

### 8.4 Conceito de usuário com PIN configurado

Um usuário é considerado com PIN configurado quando existir material persistido e válido contendo, no mínimo:

- hash derivado do PIN;
- salt;
- metadados de versão/algoritmo;
- metadados de controle de segurança.

A existência de um booleano em memória **não é suficiente** para determinar que o usuário tem PIN.

### 8.5 Conceito de challenge transacional

Challenge transacional é uma solicitação temporária de autorização para permitir a execução de uma operação sensível.

Exemplos de operações que exigem challenge:

- envio de Pix;
- pagamento;
- alteração de dados sensíveis;
- resgate ou transferência;
- confirmação de operação financeira crítica.

### 8.6 Regra de autorização

Uma operação sensível só pode ser executada quando o challenge retornar um resultado de sucesso explícito.

### 8.7 Regras obrigatórias do resultado

O resultado do challenge deve ser tipado e distinguir no mínimo:

- `authorized`
- `cancelled`
- `denied`
- `blocked`
- `not_configured`
- `error`

---

## 9. Regras do PIN

## 9.1 Setup do PIN

Fluxo mínimo:

1. usuário informa PIN;
2. usuário confirma PIN;
3. sistema valida consistência;
4. sistema deriva material seguro;
5. sistema persiste material seguro;
6. sistema marca estado como `hasPin = true`.

### Regras obrigatórias

- nada é persistido antes da confirmação;
- PIN bruto não pode ir para store global;
- PIN bruto não pode ser logado;
- confirmação divergente deve retornar erro tipado;
- setup não deve depender do Pix;
- setup deve poder ser invocado por onboarding ou primeira operação sensível.

## 9.2 Validação do PIN

Fluxo mínimo:

1. usuário digita o PIN;
2. sistema recupera material seguro persistido;
3. sistema recalcula derivação/hash com o salt salvo;
4. sistema compara de forma segura;
5. em sucesso, autoriza challenge;
6. em falha, incrementa tentativas;
7. ao atingir limite, aplica bloqueio temporário.

### Regras obrigatórias

- comparação não usa texto puro persistido;
- sucesso limpa erro transitório e tentativas acumuladas, se essa for a política adotada;
- falha retorna erro tipado;
- validação nunca modifica a feature chamadora diretamente;
- a feature chamadora recebe apenas o resultado do challenge.

## 9.3 Tentativas inválidas

### Política base recomendada

- máximo de **3 tentativas inválidas consecutivas**;
- ao exceder o limite, bloquear temporariamente por **5 minutos**.

Esses valores devem ser constantes da feature, não hardcoded em UI.

## 9.4 Bloqueio temporário

Quando bloqueado:

- nenhum novo challenge por PIN deve ser autorizado até `blockUntil`;
- a UI deve receber estado claro de bloqueio;
- o tempo restante deve ser derivado do estado, não de lógica espalhada em tela.

## 9.5 Reset de PIN

Na v1, reset de PIN pode ficar **fora do escopo de implementação**, mas a arquitetura deve prever esse caminho.

### Regra obrigatória

A ausência do fluxo de reset **não autoriza** decisões que inviabilizem futura implementação.

---

## 10. Persistência segura do PIN

## 10.1 Regra principal

O PIN nunca pode ser salvo em texto puro.

## 10.2 Persistir somente

- hash/derivação do PIN;
- salt;
- versão do algoritmo;
- metadados de controle (`failedAttempts`, `blockUntil`, timestamps, se necessário).

## 10.3 Não persistir

- PIN em texto puro;
- confirmação do PIN;
- cópias intermediárias em store global;
- logs com valor digitado.

## 10.4 Isolamento obrigatório

O storage do PIN deve ser separado do storage de sessão/autenticação.

### Consequência prática

Mesmo que ambos usem `SecureStore`, as chaves, adapters e services devem ser isolados por contexto.

## 10.5 Estratégia recomendada

- `expo-secure-store` para persistência local segura;
- helper de derivação/hash em `infra/crypto`;
- versionamento do algoritmo para futura migração;
- leitura/escrita centralizada em um único gateway da feature.

## 10.6 Eventos de limpeza

Definir comportamento explícito para:

- `logout`
- troca de conta
- reinstalação
- reset de PIN

### Regra recomendada

- **logout simples**: não apagar PIN automaticamente, salvo exigência de negócio;
- **troca de conta**: limpar obrigatoriamente o material de segurança da conta anterior;
- **reset de PIN**: remover material anterior antes da nova configuração;
- **reinstalação**: tratada naturalmente pela limpeza do armazenamento local do app.

Se o produto exigir outro comportamento, isso deve ser documentado e centralizado em regra de negócio.

---

## 11. Store da feature SECURITY

## 11.1 Objetivo

A store existe para refletir **estado de segurança da UI e da orquestração**, nunca para guardar segredo bruto.

## 11.2 Estado mínimo recomendado

```ts
type SecurityState = {
  hasPin: boolean;
  isPinValidated: boolean;
  failedAttempts: number;
  isBlocked: boolean;
  blockUntil: string | null;
  currentChallenge: SecurityChallengeRequest | null;
  lastErrorCode: SecurityErrorCode | null;
};
```

## 11.3 Proibições

A store nunca pode guardar:

- PIN bruto;
- confirmação do PIN;
- hash completo para uso arbitrário fora do serviço;
- salt exposto para consumo de tela;
- payload sensível sem necessidade.

## 11.4 Limpeza obrigatória

A feature deve expor serviços claros para limpeza de estado em:

- cancelamento de challenge;
- sucesso do challenge;
- troca de conta;
- reset de segurança;
- bootstrap inconsistente.

---

## 12. Contrato de challenge transacional

## 12.1 Regra central

Features de negócio não pedem “validar PIN”. Elas pedem “autorizar operação sensível”.

## 12.2 Contrato mínimo

```ts
type SecurityChallengeRequest = {
  type: 'PIX_TRANSFER' | 'PAYMENT' | 'CARD_ACTION' | 'GENERIC_SENSITIVE_ACTION';
  reason?: string;
  metadata?: Record<string, unknown>;
};

type SecurityChallengeResult =
  | { status: 'authorized'; method: 'PIN' }
  | { status: 'cancelled' }
  | { status: 'denied'; errorCode: 'PIN_INVALID' }
  | { status: 'blocked'; until: string }
  | { status: 'not_configured' }
  | { status: 'error'; errorCode: string };
```

## 12.3 Regra de isolamento

O challenge conhece o método atual de segurança.

A feature chamadora **não** conhece:

- como o PIN é armazenado;
- como ele é validado;
- quantas tentativas existem;
- como o bloqueio é aplicado.

---

## 13. Integração com Pix

## 13.1 Regra obrigatória

`Pix` depende do contrato de challenge de `SECURITY`, não do mecanismo de `PIN`.

## 13.2 Fluxo correto

1. usuário confirma dados do Pix;
2. feature Pix solicita `requestTransactionalChallenge(...)`;
3. `SECURITY` executa o challenge;
4. somente em `authorized`, o Pix chama `sendPixUseCase`;
5. em `cancelled`, `denied`, `blocked` ou `error`, o Pix não executa a transação.

## 13.3 Proibição explícita

É proibido:

- chamar validação de PIN diretamente de telas do Pix;
- importar services internos de PIN dentro do Pix;
- considerar tela de PIN como proteção suficiente se houver outros caminhos para executar `sendPixUseCase`.

## 13.4 Regra de robustez

A garantia final deve estar na **orquestração da operação**, não apenas na camada visual.

---

## 14. Erros e observabilidade

## 14.1 Erros tipados obrigatórios

Códigos mínimos recomendados:

- `PIN_NOT_CONFIGURED`
- `PIN_CONFIRMATION_MISMATCH`
- `PIN_INVALID`
- `PIN_BLOCKED`
- `SECURITY_STORAGE_ERROR`
- `SECURITY_VALIDATION_ERROR`
- `SECURITY_CHALLENGE_CANCELLED`
- `SECURITY_UNKNOWN_ERROR`

## 14.2 Regras de log

Logs podem registrar:

- tipo do challenge;
- resultado do challenge;
- contagem de tentativas sem valor digitado;
- ocorrência de bloqueio;
- falhas de storage/infra;
- contexto técnico seguro.

Logs não podem registrar:

- PIN digitado;
- confirmação do PIN;
- hash bruto completo em texto de log;
- salt em texto de log;
- dados sensíveis da transação além do necessário.

## 14.3 Regra de UX

A UI deve receber estados claros e tipados. A UI não deve adivinhar causa de falha por string solta.

---

## 15. Relação com shared

## 15.1 Regra obrigatória

`shared` é base neutra. `shared` não depende de features.

## 15.2 Pode existir em shared

- tipos genéricos utilitários;
- contratos genéricos de provider;
- wrappers técnicos neutros;
- componentes visuais genéricos;
- helpers sem semântica de domínio.

## 15.3 Não pode existir em shared

- regra de PIN;
- regra de challenge transacional;
- tentativas e bloqueio do módulo security;
- decisões de Pix;
- semântica de AUTH/SECURITY.

---

## 16. Anti-padrões proibidos

1. `AUTH` importar `SECURITY` para armazenar token.
2. `Pix` importar `validatePin` diretamente.
3. salvar PIN bruto em store.
4. salvar PIN bruto em storage.
5. logs com PIN digitado.
6. challenge implementado apenas em tela, sem proteção na orquestração.
7. features acessando arquivos internos de `SECURITY` fora do `index.ts`.
8. regras de tentativas e bloqueio hardcoded na UI.
9. ausência de tipagem para resultados de challenge.
10. acoplamento do challenge ao Pix como se fosse caso único.

---

## 17. Sequência oficial de implementação

### Fase 1 — Base da feature

1. fundação da feature `SECURITY`;
2. definição do domínio;
3. persistência segura do PIN;
4. store da feature.

### Fase 2 — Autenticação transacional

5. fluxo de criação de PIN;
6. fluxo de validação do PIN;
7. challenge transacional reutilizável.

### Fase 3 — Primeiro caso real

8. integração com Pix.

### Fase 4 — Robustez

9. erros e observabilidade;
10. testes de fechamento.

---

## 18. Critérios de aceite arquitetural

A arquitetura de `SECURITY` só será considerada pronta quando:

- `SECURITY` for uma feature real, e não um storage técnico;
- responsabilidades de `AUTH` e `SECURITY` estiverem documentadas e respeitadas;
- `AUTH` não depender de `SECURITY`;
- `shared` não depender de features;
- `Pix` depender do contrato de challenge, não do PIN;
- store não guardar segredo bruto;
- persistência do PIN for isolada e segura;
- tentativas inválidas e bloqueio estiverem centralizados no domínio;
- erros estiverem tipados;
- a API pública da feature estiver definida;
- a base estiver pronta para crescer para biometria e OTP.

---

## 19. Recomendação objetiva para este projeto

### Decisão recomendada 1

Se hoje existir qualquer código de “secure token storage” dentro de `SECURITY`, isso deve ser tratado como dívida arquitetural e removido do escopo da feature transacional.

### Decisão recomendada 2

Mesmo que `AUTH` ainda não esteja implementado como feature madura, a arquitetura já deve nascer com as fronteiras corretas.

### Decisão recomendada 3

A primeira integração real de `SECURITY` deve ser com `Pix`, mas o contrato do challenge deve ser genérico desde o primeiro commit.

### Decisão recomendada 4

A v1 deve implementar apenas `PIN`, porém toda modelagem pública deve usar conceitos que permitam múltiplos métodos.

---

## 20. Resumo executivo

- `AUTH` autentica sessão.
- `SECURITY` autentica operação sensível.
- `Pix` pede autorização transacional, não PIN.
- store não guarda segredo bruto.
- storage do PIN é isolado do storage de sessão.
- challenge é reutilizável e extensível.
- regras de tentativas e bloqueio pertencem ao domínio.
- `shared` permanece neutro.
- a API pública de `SECURITY` é a única porta de entrada para outras features.

