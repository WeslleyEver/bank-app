# SECURITY Implementation Plan (v1)

## 1. Objetivo

Definir o plano oficial de implementação da feature `SECURITY` no app bancário, com foco em:

- criação de uma feature real, e não apenas utilitário técnico;
- implementação de `PIN` transacional na v1;
- criação de `challenge` reutilizável para operações sensíveis;
- primeira integração real com `PIX`;
- preservação da separação entre `AUTH`, `SECURITY`, `PIX` e `shared`.

Este documento serve como guia de execução para time, agent e revisão técnica.

---

## 2. Escopo de entrega da v1

A entrega da v1 inclui:

- fundação arquitetural da feature `SECURITY`;
- domínio de `PIN` transacional;
- persistência segura isolada;
- store de segurança sem segredo bruto;
- fluxo de setup de PIN;
- fluxo de validação de PIN;
- challenge transacional reutilizável;
- integração do challenge com `Pix`;
- erros tipados e observabilidade segura;
- testes de fechamento.

A entrega da v1 não inclui:

- biometria ativa;
- OTP ativo;
- reset completo de PIN com backend;
- políticas avançadas por device;
- challenge remoto/orquestrado por backend.

A ausência desses itens não autoriza arquitetura que inviabilize sua adição futura.

---

## 3. Dependências documentais obrigatórias

A implementação deve respeitar estes documentos como fonte de verdade:

- `security-architecture.md`
- `security-business-rules.md`
- `security-pin-flow.md`
- `security-errors.md`
- `security-pix-integration.md`

Se houver conflito entre código existente e esses documentos, a implementação deve seguir os documentos e tratar o código atual como legado a ser ajustado.

---

## 4. Estratégia oficial de execução

A execução da v1 deve seguir esta ordem obrigatória:

1. **Fase 1 — Fundação da feature**
2. **Fase 2 — Domínio e persistência**
3. **Fase 3 — Estado e API pública**
4. **Fase 4 — Setup de PIN**
5. **Fase 5 — Validação de PIN**
6. **Fase 6 — Challenge transacional**
7. **Fase 7 — Integração com Pix**
8. **Fase 8 — Erros e observabilidade**
9. **Fase 9 — Testes e fechamento**

Nenhuma fase posterior deve começar contornando decisões não fechadas da fase anterior.

---

## 5. Fase 1 — Fundação da feature SECURITY

## 5.1 Objetivo

Criar a fundação arquitetural da feature `SECURITY` com escopo oficial, estrutura mínima e API pública prevista.

## 5.2 Entregáveis

Criar a estrutura mínima:

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

Criar ao menos os arquivos base:

```txt
src/features/security/index.ts
src/features/security/types/security.types.ts
src/features/security/types/security-challenge.types.ts
src/features/security/types/security-result.types.ts
src/features/security/constants/security.constants.ts
```

## 5.3 Ações obrigatórias

- definir a API pública inicial da feature;
- remover qualquer entendimento de que `SECURITY` é apenas storage de token;
- separar o escopo de `AUTH` e `SECURITY`;
- revisar imports existentes que violem a direção de dependência;
- garantir que `shared` continue sem depender de feature.

## 5.4 Critérios de aceite

A fase está concluída somente quando:

- `SECURITY` existir como feature real em pastas;
- houver `index.ts` como porta pública;
- a responsabilidade da feature estiver clara no código;
- nenhuma outra feature importar internals de `SECURITY` fora da API pública;
- `AUTH -> SECURITY` não exista como dependência indevida.

## 5.5 Antipadrões proibidos

- criar `SECURITY` apenas com `infra/`;
- deixar `PIN` espalhado em `shared`;
- expor storage interno como API pública;
- usar `security` como nome para utilitário genérico de token do auth.

---

## 6. Fase 2 — Domínio e persistência segura

## 6.1 Objetivo

Definir o modelo de domínio da segurança transacional e a persistência segura do material do PIN.

## 6.2 Entregáveis

Criar tipos de domínio como base:

```ts
export type SecurityMethod = 'pin';

export type SecurityChallengeType = 'pix.send';

export type PinSetupStatus = 'not_configured' | 'configured';

export type SecurityCredentialMetadata = {
  algorithmVersion: string;
  createdAt: string;
  updatedAt: string;
};

export type PinCredentialRecord = {
  hash: string;
  salt: string;
  algorithmVersion: string;
  failedAttempts: number;
  blockUntil: string | null;
  createdAt: string;
  updatedAt: string;
};
```

Criar infraestrutura mínima:

```txt
src/features/security/infra/security-storage.keys.ts
src/features/security/infra/security-storage.types.ts
src/features/security/infra/pin-credential.storage.ts
src/features/security/infra/pin-crypto.service.ts
```

## 6.3 Ações obrigatórias

- definir chave própria de storage para material do PIN;
- persistir apenas `hash`, `salt` e metadados seguros;
- garantir que o PIN nunca seja salvo em texto puro;
- centralizar leitura e escrita do material do PIN;
- definir política de limpeza em logout, troca de conta e reset de PIN;
- versionar o algoritmo de derivação desde a v1.

## 6.4 Decisões obrigatórias da v1

- PIN numérico de 6 dígitos;
- persistência local segura;
- hash/derivação com salt;
- bloqueio temporário com metadado persistido;
- sem reset completo de PIN nesta fase.

## 6.5 Critérios de aceite

A fase está concluída somente quando:

- não houver nenhum caminho salvando PIN bruto;
- toda persistência do PIN passar por um único storage service;
- toda derivação/comparação passar por um único crypto service;
- failed attempts e block metadata estiverem definidos no modelo;
- a limpeza em troca de conta e logout estiver desenhada e implementável.

## 6.6 Antipadrões proibidos

- salvar PIN em store, AsyncStorage comum, logs ou params de rota;
- espalhar `hash`/`salt` em múltiplos serviços;
- misturar token de sessão com material de PIN no mesmo contrato sem separação semântica;
- tratar ausência de dado como PIN inválido.

---

## 7. Fase 3 — Store e API pública do SECURITY

## 7.1 Objetivo

Criar o estado previsível da feature e fechar os contratos públicos consumidos por UI e outras features.

## 7.2 Entregáveis

Store mínima:

```ts
export type SecurityState = {
  hasPin: boolean;
  isPinValidated: boolean;
  failedAttempts: number;
  isBlocked: boolean;
  blockUntil: string | null;
  currentChallenge: SecurityChallengeRequest | null;
  lastErrorCode: SecurityErrorCode | null;
};
```

Arquivos mínimos:

```txt
src/features/security/store/security.store.ts
src/features/security/store/security.store.types.ts
src/features/security/services/loadSecurityState.ts
src/features/security/services/clearSecurityState.ts
src/features/security/index.ts
```

## 7.3 Ações obrigatórias

- garantir que a store nunca receba PIN bruto;
- garantir que a store reflita challenge, tentativas e bloqueio;
- expor somente contratos públicos estáveis no `index.ts`;
- definir nomes consistentes para status e resultados.

## 7.4 Critérios de aceite

A fase está concluída somente quando:

- a store não guardar segredo bruto;
- a UI puder observar `hasPin`, `isBlocked`, `blockUntil` e `currentChallenge`;
- a feature tiver uma API pública mínima e consistente;
- internals da feature não precisarem ser importados por outras features.

## 7.5 Antipadrões proibidos

- usar store como fonte de verdade do segredo;
- colocar lógica de derivação/compare dentro da store;
- expor diretamente adapters de infra;
- retornar strings soltas em vez de resultados tipados.

---

## 8. Fase 4 — Setup de PIN

## 8.1 Objetivo

Permitir que o usuário crie e confirme a credencial transacional pela primeira vez.

## 8.2 Entregáveis

Arquivos mínimos:

```txt
src/features/security/services/startPinSetup.ts
src/features/security/services/confirmPinSetup.ts
src/features/security/hooks/usePinSetup.ts
src/features/security/presentation/screens/PinSetupScreen.tsx
src/features/security/presentation/screens/PinConfirmScreen.tsx
```

## 8.3 Ações obrigatórias

- criar fluxo de digitação inicial do PIN;
- criar fluxo de confirmação do PIN;
- validar formato antes da confirmação;
- validar consistência entre PIN e confirmação;
- persistir somente após confirmação bem-sucedida;
- atualizar o estado para `hasPin = true` somente após persistência bem-sucedida.

## 8.4 Regras obrigatórias

- nada é persistido após a primeira digitação isolada;
- confirmação divergente não conta como tentativa inválida de challenge;
- falha técnica de persistência não pode marcar usuário como configurado;
- tela não pode decidir sozinha o estado final sem service oficial.

## 8.5 Critérios de aceite

A fase está concluída somente quando:

- o usuário conseguir concluir setup com confirmação correta;
- confirmação divergente produzir erro tipado correto;
- nada for persistido antes da confirmação;
- o app conseguir distinguir corretamente `tem PIN` vs `não tem PIN`.

## 8.6 Antipadrões proibidos

- persistir PIN logo após primeiro input;
- deixar tela salvar diretamente no storage;
- misturar setup de PIN com login/auth;
- usar navegação como única fonte de verdade do fluxo.

---

## 9. Fase 5 — Validação de PIN

## 9.1 Objetivo

Implementar a autenticação transacional real baseada em PIN.

## 9.2 Entregáveis

Arquivos mínimos:

```txt
src/features/security/services/validatePin.ts
src/features/security/services/registerFailedAttempt.ts
src/features/security/services/resetFailedAttempts.ts
src/features/security/services/checkSecurityBlock.ts
src/features/security/presentation/screens/PinChallengeScreen.tsx
```

Resultado mínimo esperado:

```ts
export type SecurityValidationResult =
  | { status: 'authorized' }
  | { status: 'denied'; reason: 'invalid_pin'; failedAttempts: number; remainingAttempts: number }
  | { status: 'blocked'; blockUntil: string }
  | { status: 'not_configured' }
  | { status: 'unavailable'; code: SecurityErrorCode };
```

## 9.3 Ações obrigatórias

- validar formato antes da comparação segura;
- recuperar material seguro persistido;
- executar comparação via crypto service;
- incrementar tentativas em falha de PIN correto no formato;
- bloquear temporariamente ao atingir o limite;
- resetar tentativas em sucesso;
- retornar resultado tipado previsível.

## 9.4 Regras obrigatórias

- falha técnica não pode virar `invalid_pin`;
- usuário bloqueado não deve consumir tentativa adicional;
- cancelamento não conta como falha;
- sucesso deve limpar erro anterior e tentativas falhas.

## 9.5 Critérios de aceite

A fase está concluída somente quando:

- validação correta funcionar com resultado previsível;
- tentativas falhas forem persistidas e refletidas na store;
- bloqueio temporário funcionar de forma centralizada;
- sucesso resetar tentativas e estado de erro adequadamente.

## 9.6 Antipadrões proibidos

- comparar PIN dentro da UI;
- incrementar tentativa em erro técnico;
- usar `throw` genérico para todos os casos de validação;
- deixar a tela calcular o bloqueio.

---

## 10. Fase 6 — Challenge transacional reutilizável

## 10.1 Objetivo

Desacoplar o fluxo de autorização de qualquer feature específica, principalmente do Pix.

## 10.2 Entregáveis

Arquivos mínimos:

```txt
src/features/security/services/requestTransactionalChallenge.ts
src/features/security/services/cancelCurrentChallenge.ts
src/features/security/hooks/useTransactionalChallenge.ts
src/features/security/types/security-challenge.types.ts
```

Contrato mínimo sugerido:

```ts
export type SecurityChallengeRequest = {
  type: 'pix.send';
  context: {
    amount?: number;
    targetId?: string;
  };
};

export type SecurityChallengeResult =
  | { status: 'authorized' }
  | { status: 'denied'; reason: 'invalid_pin' }
  | { status: 'blocked'; blockUntil: string }
  | { status: 'not_configured' }
  | { status: 'cancelled' }
  | { status: 'unavailable'; code: SecurityErrorCode };
```

## 10.3 Ações obrigatórias

- encapsular abertura do challenge em service próprio;
- centralizar o ciclo de vida do challenge ativo;
- permitir cancelamento explícito;
- separar resultado de challenge de erro técnico;
- garantir extensão futura para biometria/OTP sem refactor no Pix.

## 10.4 Critérios de aceite

A fase está concluída somente quando:

- o Pix puder solicitar challenge sem conhecer PIN;
- o challenge tiver contrato tipado e estável;
- cancelamento for resultado terminal próprio;
- a API estiver preparada para múltiplos métodos no futuro.

## 10.5 Antipadrões proibidos

- `Pix -> validatePin(pin)` direto;
- expor tela de PIN como API da feature;
- resolver challenge só por navegação e side effects implícitos;
- acoplar challenge a `pix.send` de forma irreversível.

---

## 11. Fase 7 — Integração com Pix

## 11.1 Objetivo

Aplicar o challenge transacional no primeiro caso real de operação sensível.

## 11.2 Entregáveis

- ponto oficial de autorização antes da execução do envio Pix;
- ajuste do fluxo visual para challenge, falha, bloqueio e cancelamento;
- revisão de todos os caminhos que executam Pix para impedir bypass.

## 11.3 Ações obrigatórias

- localizar todos os pontos que hoje executam `sendPixUseCase` diretamente;
- centralizar a execução do Pix atrás do ponto oficial de challenge;
- impedir execução em caso de `denied`, `blocked`, `not_configured`, `cancelled` e `unavailable`;
- permitir execução apenas em `authorized`.

## 11.4 Regra arquitetural obrigatória

A proteção não pode existir apenas na tela de confirmação.

A orquestração da operação também deve exigir challenge, para impedir que qualquer outro fluxo execute Pix sem autorização transacional.

## 11.5 Critérios de aceite

A fase está concluída somente quando:

- Pix exigir challenge antes do envio;
- não houver execução sem autorização;
- cancelamento interromper a operação sem efeitos colaterais;
- todos os caminhos relevantes de envio Pix estiverem protegidos.

## 11.6 Antipadrões proibidos

- chamar `sendPixUseCase` direto da UI sem contrato de autorização;
- proteger só uma tela e esquecer outros chamadores;
- tratar `cancelled` como sucesso parcial;
- tratar `not_configured` como `denied`.

---

## 12. Fase 8 — Erros e observabilidade

## 12.1 Objetivo

Fechar previsibilidade entre domínio, UI e logs sem vazamento de segredo.

## 12.2 Entregáveis

Arquivos mínimos:

```txt
src/features/security/errors/security-error.types.ts
src/features/security/errors/security-error.factory.ts
src/features/security/errors/security-error.mapper.ts
src/features/security/observability/security.logger.ts
```

Conjunto mínimo de códigos:

- `SECURITY_PIN_NOT_CONFIGURED`
- `SECURITY_PIN_CONFIRMATION_MISMATCH`
- `SECURITY_PIN_FORMAT_INVALID`
- `SECURITY_PIN_INVALID`
- `SECURITY_PIN_BLOCKED`
- `SECURITY_STORAGE_READ_FAILED`
- `SECURITY_STORAGE_WRITE_FAILED`
- `SECURITY_VALIDATION_FAILED`
- `SECURITY_CHALLENGE_CANCELLED`
- `SECURITY_CHALLENGE_UNAVAILABLE`

## 12.3 Ações obrigatórias

- diferenciar erro de negócio, erro de estado, erro técnico e erro de fluxo;
- criar mapper para UI com semântica clara;
- criar logger seguro sem vazar PIN, hash, salt ou payload sensível;
- registrar apenas contexto mínimo seguro.

## 12.4 Critérios de aceite

A fase está concluída somente quando:

- a UI reagir por código/resultado tipado;
- logs não contiverem segredos;
- erro técnico não virar PIN inválido;
- cancelamento não virar erro de validação.

## 12.5 Antipadrões proibidos

- usar string matching na UI (`includes('invalid')` etc.);
- logar valores digitados;
- colapsar todos os erros em um único `UNKNOWN` sem classificação;
- usar mensagens em inglês/pt como contrato lógico em vez de codes.

---

## 13. Fase 9 — Testes e fechamento

## 13.1 Objetivo

Cobrir os fluxos críticos e garantir que `AUTH` e `PIX` permaneçam íntegros.

## 13.2 Matriz mínima de testes

### Setup de PIN

- cria PIN com confirmação correta;
- rejeita confirmação divergente;
- rejeita formato inválido;
- não persiste antes da confirmação.

### Persistência

- salva apenas hash, salt e metadados;
- nunca salva PIN bruto;
- limpa corretamente em cenários previstos.

### Validação

- autoriza PIN correto;
- rejeita PIN incorreto;
- incrementa tentativas inválidas;
- bloqueia após limite;
- respeita bloqueio vigente;
- reseta tentativas em sucesso.

### Challenge

- retorna `authorized` em sucesso;
- retorna `cancelled` quando cancelado;
- retorna `not_configured` sem PIN;
- retorna `blocked` quando bloqueado.

### Pix

- não executa sem autorização;
- executa apenas após `authorized`;
- não executa em `denied`;
- não executa em `cancelled`;
- não executa em `blocked`.

### Integridade do AUTH

- bootstrap de sessão continua funcionando;
- restore/auth flow não quebra;
- logout limpa o que deve limpar;
- não há reintrodução de `AUTH -> SECURITY` indevido.

## 13.3 Critérios de aceite

A implementação só pode ser considerada concluída quando:

- fluxos críticos de SECURITY estiverem cobertos;
- integração com Pix estiver coberta;
- AUTH continuar íntegro;
- nenhum dado sensível vazar em teste, log ou estado.

---

## 14. Ordem prática de execução por task

## Task 1 — Foundation

Entregar:

- estrutura da feature;
- `index.ts`;
- tipos base;
- constants base;
- revisão de dependência indevida.

## Task 2 — Domain

Entregar:

- tipos de challenge;
- tipos de credential;
- tipos de resultado;
- regra de tentativas e bloqueio modelada.

## Task 3 — Secure persistence

Entregar:

- storage keys;
- credential storage service;
- crypto service;
- limpeza de dados.

## Task 4 — Store

Entregar:

- `SecurityState`;
- store;
- load/reset state;
- API pública inicial.

## Task 5 — PIN setup

Entregar:

- service de setup;
- confirmação;
- hooks;
- telas/components básicos.

## Task 6 — PIN validation

Entregar:

- validatePin;
- failed attempts;
- block control;
- retorno tipado.

## Task 7 — Challenge

Entregar:

- request challenge;
- cancel challenge;
- hook reutilizável;
- contrato final para features.

## Task 8 — Pix integration

Entregar:

- ponto oficial de challenge;
- revisão de todos os chamadores de Pix;
- fluxo de UI alinhado.

## Task 9 — Errors & observability

Entregar:

- error codes;
- factory;
- mapper;
- logger seguro.

## Task 10 — Final tests

Entregar:

- testes unitários;
- testes de integração;
- revisão final de dependência;
- checklist de fechamento.

---

## 15. Definition of Done global da feature

A feature `SECURITY` só é considerada pronta quando todos os itens abaixo forem verdadeiros:

1. `SECURITY` é uma feature real com API pública própria.
2. `AUTH` e `SECURITY` têm fronteiras claras.
3. Não existe dependência arquitetural indevida.
4. O PIN nunca é salvo em texto puro.
5. A store nunca guarda segredo bruto.
6. O challenge é reutilizável e não acoplado ao Pix.
7. Pix só executa após autorização explícita.
8. Cancelamento é tratado corretamente.
9. Tentativas e bloqueio funcionam de forma previsível.
10. Erros são tipados.
11. Logs não vazam segredo.
12. Testes cobrem fluxos críticos.
13. A base permite evolução futura para biometria e OTP.

---

## 16. Regras finais para agent/implementação assistida

O agent deve obedecer estas regras sem exceção:

- não criar atalhos para “fazer funcionar” pulando challenge;
- não importar internals de `SECURITY` fora da API pública;
- não acoplar `PIX` ao conceito de PIN;
- não usar UI como fonte única de regra;
- não persistir ou logar segredo bruto;
- não transformar erro técnico em erro de credencial;
- não reintroduzir `AUTH -> SECURITY`;
- não considerar a feature pronta sem testes e critérios de aceite.

Quando houver dúvida de implementação, a prioridade de decisão deve ser:

1. preservar fronteiras arquiteturais;
2. preservar segurança de dados;
3. preservar previsibilidade do domínio;
4. preservar extensibilidade futura;
5. só então otimizar ergonomia de código.

---

## 17. Resumo executivo

A implementação correta da v1 de `SECURITY` deve seguir esta linha:

- primeiro estruturar a feature;
- depois fechar domínio e persistência segura;
- depois criar store e API pública;
- depois implementar setup e validação de PIN;
- depois transformar isso em challenge reutilizável;
- depois integrar com Pix;
- por fim fechar erros, observabilidade e testes.

A implementação não deve começar pelo Pix.

A implementação não deve começar pela tela.

A implementação não deve começar salvando PIN.

A implementação deve começar pela **arquitetura e pelos contratos**.
