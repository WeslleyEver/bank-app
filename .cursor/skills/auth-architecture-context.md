# CURSOR SKILL

# AUTH ARCHITECTURE CONTEXT — OFICIAL

Este documento é a referência oficial para análise, manutenção e evolução do módulo `AUTH`.

Toda resposta, análise e implementação relacionada ao `AUTH` deve respeitar este documento.

O objetivo atual NÃO é expandir escopo.
O objetivo atual é finalizar a revisão arquitetural do `AUTH` com mentalidade de app bancário.

---

# 1. CONTEXTO DO PROJETO

Aplicação bancária em React Native com Expo.

Arquitetura:
- camadas
- organização modular por feature
- responsabilidades bem separadas
- foco em previsibilidade e consistência

Módulos principais:
- `features/auth` → identidade, login, logout, recuperação de senha, sessão, bootstrap de autenticação
- `features/security` → PIN transacional, biometria, challenge, proteção de ações sensíveis
- `shared` → infraestrutura reutilizável e agnóstica de feature

Diretriz atual:
- o `AUTH` está quase finalizado
- o foco imediato é revisão final do `AUTH`
- `SECURITY` só deve avançar depois que o `AUTH` estiver sólido

---

# 2. OBJETIVO DO AUTH

O `AUTH` deve ser a fundação confiável de autenticação e sessão do app.

Responsabilidades do `AUTH`:
- login
- logout
- recuperação de senha
- cadastro PF
- cadastro PJ
- bootstrap de autenticação
- restauração de sessão
- hidratação da sessão
- controle global de autenticação
- decisão de rota inicial baseada em autenticação/onboarding

O `AUTH` deve ser pré-moldado para produção.
Isso significa foco em:
- consistência
- centralização
- previsibilidade
- invalidação correta
- ausência de múltiplas fontes de verdade

---

# 3. O QUE O AUTH NÃO DEVE FAZER

O `AUTH` NÃO deve implementar:
- PIN transacional
- biometria
- challenge de segurança
- autenticação forte para operação financeira
- confirmação de transações sensíveis
- antifraude transacional

Essas responsabilidades pertencem ao `SECURITY`.

---

# 4. REGRAS DE DEPENDÊNCIA

Regras obrigatórias:

- `shared` pode ser dependido por `features`
- `shared` NÃO pode depender de `features`
- `AUTH` pode depender de `shared`
- `SECURITY` pode depender de `AUTH`
- `AUTH` NÃO deve depender de `SECURITY`

Se existir dependência `AUTH -> SECURITY`, isso deve ser tratado como dívida arquitetural.

Nunca tratar `AUTH -> SECURITY` como padrão aceitável.

---

# 5. FLUXO ARQUITETURAL OFICIAL

Fluxo principal obrigatório:

`screen → hook → service → datasource → api → httpClient`

Camadas complementares permitidas quando necessário:
- `mapper`
- `session`
- `store`
- `observability`

Fluxos válidos derivados:
- `screen → hook → service → datasource → api → httpClient`
- `service → mapper`
- `service → sessionManager`
- `store → sessionManager.restore()`
- `store → sessionManager.clear()`
- `authTokenProvider → sessionStorage.getTokens()`
- `auth401Interceptor → refreshTokenService → sessionManager`

Regras obrigatórias:
- screen não chama datasource
- screen não chama api
- hook não chama api
- hook não manipula token
- service não navega
- datasource não persiste sessão
- api não acessa store
- `shared` não conhece regras internas do `AUTH`

---

# 6. ESTRUTURA ESPERADA

Estrutura principal esperada em `src/features/auth/`:

- `api`
- `data/datasources`
- `errors`
- `hooks`
- `infra`
- `observability`
- `presentation/screens`
- `services`
- `session`
- `store`
- `types`

A estrutura pode evoluir, mas a separação de responsabilidade não pode se perder.

---

# 7. PAPÉIS DAS CAMADAS

## screen
Serve para UI.

Pode:
- renderizar
- disparar ações do hook
- exibir loading
- exibir erro

Não pode:
- conter regra de negócio
- acessar datasource
- acessar token
- persistir sessão
- limpar sessão

## hook
Faz a ponte entre UI e caso de uso.

Pode:
- validar input de tela
- sanitizar input
- chamar service
- expor estado para UI

Não pode:
- acessar token diretamente
- persistir sessão diretamente
- chamar datasource diretamente
- navegar por conta de regra de autenticação complexa

## service
Orquestra caso de uso.

Pode:
- chamar datasource
- chamar mapper
- chamar `sessionManager` quando fizer parte do caso de uso
- aplicar regra de negócio do `AUTH`

Não pode:
- acessar UI
- navegar
- manipular estado visual
- usar atalhos fora do fluxo oficial de sessão

## datasource
Representa a fonte externa.

Pode:
- usar `api`
- adaptar resposta externa para contrato interno

Não pode:
- persistir sessão
- acessar UI
- navegar
- conter regra visual

## api
Encapsula chamadas HTTP do `AUTH`.

Pode:
- chamar endpoints do `AUTH`
- usar `httpClient`

Não pode:
- mexer na store
- mexer em navegação
- persistir sessão
- decidir autenticação global

## mapper
Adapta payload externo para modelo interno.

Pode:
- converter resposta de backend/mock
- unificar shape interno

Não pode:
- persistir sessão
- navegar
- acessar UI

## session
Camada crítica do `AUTH`.

Inclui:
- `sessionManager`
- `sessionStorage`
- `sessionHydrator`
- `sessionExpirationService`
- tipos de sessão

Deve ser altamente previsível.

## store
Reflete autenticação global em memória.

A store:
- não é a origem da sessão
- não é dona da persistência
- não deve inventar sessão

## observability
Registra eventos internos do `AUTH` sem dados sensíveis.

---

# 8. REGRA MAIS IMPORTANTE: SESSÃO

O `AUTH` deve evitar qualquer cenário com múltiplas fontes de verdade.

Regras obrigatórias:
- `sessionManager` é o orquestrador oficial da sessão
- `sessionStorage` é a persistência oficial da sessão
- `useAuthStore` é reflexo do estado em memória
- screen não salva sessão
- hook não salva sessão
- service não grava token diretamente em storage
- interceptor não persiste token fora do fluxo oficial
- nenhum ponto fora da camada oficial deve reconstruir sessão manualmente

O projeto deve evitar:
- múltiplas fontes de verdade
- logout parcial
- sessão em memória diferente do storage
- UI autenticada com storage limpo
- UI desautenticada com storage ainda preenchido
- invalidação espalhada sem critério

---

# 9. REGRAS OFICIAIS DA SESSÃO

## 9.1 sessionManager
É o orquestrador oficial da sessão.

Responsabilidades:
- persistir
- restaurar
- limpar
- aplicar tokens renovados
- centralizar invalidação sempre que possível

Regra:
- nenhum outro ponto deve gravar token em storage diretamente

## 9.2 sessionStorage
É a abstração oficial de persistência física.

Regras:
- token deve ficar em storage seguro
- não usar `AsyncStorage` para token
- não carregar regra de negócio
- não depender de UI
- idealmente não depender de `SECURITY`

## 9.3 sessionHydrator
Reconstrói sessão a partir de tokens válidos.

Regras:
- deve usar rota oficial de hidratação
- deve manter coerência com `AuthSession`
- sessão restaurada e sessão criada no login devem ter o mesmo shape sempre que possível

## 9.4 sessionExpirationService
Valida expiração antes de reutilizar sessão.

Regras:
- deve ser usado antes do uso de token persistido
- deve impedir uso de sessão expirada
- expiração deve entrar no fluxo oficial de invalidação

---

# 10. REGRAS DE LEITURA DE TOKEN

Leitura de token só é aceitável em:
- `sessionManager`
- `sessionStorage`
- `authTokenProvider`
- futuro serviço real de refresh, se fizer parte do fluxo oficial

Leitura de token NÃO é aceitável em:
- screen
- hook
- componente visual
- navegação
- service comum de caso de uso sem responsabilidade de sessão

Se o agente encontrar leitura de token fora desses pontos, deve tratar como risco arquitetural.

---

# 11. BOOTSTRAP DE SESSÃO

Fluxo esperado na abertura do app:
1. inicializar infraestrutura HTTP
2. registrar provider de token
3. registrar interceptor 401
4. ler tokens persistidos
5. validar expiração
6. restaurar sessão
7. hidratar usuário
8. sincronizar store
9. decidir rota inicial

Regras obrigatórias:
- o bootstrap não pode deixar estado ambíguo
- sessão inválida deve sair pelo fluxo oficial de limpeza
- bootstrap concluído deve refletir claramente se o usuário está autenticado ou não

---

# 12. BOOTSTRAP DO HTTP CLIENT

O `httpClient` centralizado deve estar ativo em runtime.

Não basta o arquivo existir.
Não basta o provider estar implementado.
Não basta o interceptor estar criado.

O agente deve sempre verificar:
- se o bootstrap HTTP é chamado no ponto de entrada
- se o provider de token foi registrado
- se o interceptor 401 foi registrado
- se isso acontece antes do uso real do app

Sem bootstrap HTTP ativo, o `AUTH` NÃO está finalizado.

---

# 13. INTERCEPTOR 401

O interceptor 401 pertence à infraestrutura do `AUTH`.

Ele deve:
- detectar 401
- ignorar refresh endpoint quando necessário
- evitar loop de retry
- evitar múltiplos refresh simultâneos
- tentar refresh controlado
- repetir a request original em caso de sucesso
- invalidar sessão oficialmente em caso de falha

Ele NÃO deve:
- navegar
- conter lógica de tela
- persistir tokens renovados fora do fluxo oficial
- espalhar invalidação sem necessidade

Se o refresh falhar, a sessão deve ser invalidada com consistência entre:
- storage
- store
- UI

---

# 14. PROTEÇÃO DE ROTAS AUTENTICADAS

O bootstrap inicial não é suficiente.

O sistema também deve lidar com perda de autenticação durante o uso do app.

Regras obrigatórias:
- se a sessão cair em runtime, a UI deve refletir isso
- o usuário não deve permanecer em área protegida após invalidação
- deve existir mecanismo de proteção/redirecionamento para rotas autenticadas
- esse mecanismo pode estar em layout, guard, provider ou estrutura equivalente
- o agente deve tratar esse item como requisito arquitetural do `AUTH`

A aplicação não pode parecer logada quando a sessão já foi invalidada.

---

# 15. STORE DO AUTH

A store deve ser enxuta.

Ela deve:
- manter sessão em memória
- refletir autenticação
- refletir fim do bootstrap
- sincronizar com a camada oficial de sessão

Ela NÃO deve:
- virar fonte paralela de verdade
- reconstruir sessão por conta própria
- ler token diretamente
- manter `session` residual quando restore falhar
- mascarar inconsistência entre storage e memória

Se restore falhar, o estado em memória deve ficar inequivocamente coerente.

---

# 16. LOGIN

Fluxo esperado:

`screen → hook → service → datasource → api/mock → mapper → sessionManager.persist → store`

Regras:
- login deve persistir sessão apenas pelo fluxo oficial
- hook não salva token
- screen não depende de payload bruto
- erro deve passar por tipagem interna
- store deve refletir o resultado final de forma previsível

---

# 17. LOGOUT

Fluxo esperado:

`screen/hook → store/logout → sessionManager.clear`

Regras obrigatórias:
- logout deve passar pelo fluxo oficial
- storage, store e UI devem terminar sincronizados
- não pode existir logout parcial
- falha em limpeza de storage é risco arquitetural sério
- o agente deve tratar logout parcial como pendência relevante, não detalhe menor

Cenário proibido:
- UI acha que saiu
- store acha que saiu
- storage ainda contém token

---

# 18. REFRESH TOKEN

O suporte estrutural a refresh já pode existir mesmo sem backend real.

Regras:
- refresh pertence à infraestrutura oficial
- refresh não deve ser espalhado em hooks ou services de UI
- enquanto for stub, tratar como limitação conhecida
- quando o backend existir, integrar sem quebrar a arquitetura atual

---

# 19. DATASOURCES

Existe um contrato principal:

`AuthDataSource`

Implementações esperadas:
- `backendAuthDataSource`
- `mockAuthDataSource`

Regras:
- seleção por factory
- não acessar implementação concreta diretamente fora da factory
- mock e backend devem respeitar o mesmo contrato

---

# 20. MOCKS

Mocks são parte oficial do `AUTH`.

Regras obrigatórias:
- não quebrar cenários existentes
- respeitar contrato do datasource
- preservar arquitetura em camadas
- manter compatibilidade com backend real
- reaproveitar factories e mapeamentos existentes
- não simplificar mocks de forma que esconda risco arquitetural

Se houver mocks por documento ou cenários específicos já consolidados, eles devem ser preservados.

---

# 21. ERROS

O `AUTH` deve manter erro tipado e previsível.

Estruturas esperadas:
- `AuthErrorCode`
- `AuthError`
- `authErrorMapper`
- `authErrorFactory`
- catálogo de mensagens

Regras:
- UI não depende da resposta bruta
- backend e mock convergem para o mesmo modelo interno
- timeout, erro de rede, sessão expirada e credenciais inválidas devem continuar cobertos

---

# 22. OBSERVABILIDADE

O `AUTH` deve ter observabilidade mínima interna.

Pode logar:
- restore iniciado
- restore falhou
- clear iniciado
- clear falhou
- sessão expirada
- 401 interceptado
- refresh iniciado
- refresh falhou
- login falhou

Não pode logar:
- senha
- token
- documento completo
- dados sensíveis

---

# 23. MODO DE RESPOSTA DO AGENTE

Nesta fase do projeto, o agente deve operar assim:

## 23.1 Quando for analisar
Deve:
- analisar o estado real do código
- comparar com este documento
- dizer o que está sólido
- dizer o que ainda é risco real
- separar bloqueadores de melhorias opcionais
- focar em consistência de sessão
- avaliar prontidão do `AUTH` para servir de base ao `SECURITY`

Não deve:
- sair implementando sem pedido
- sugerir refactor grande cedo demais
- misturar muitos assuntos

## 23.2 Quando for implementar
Deve:
- propor passos pequenos
- fazer correções cirúrgicas
- explicar impacto arquitetural
- respeitar mocks
- respeitar arquitetura atual
- evitar mudanças amplas em um único prompt

Não deve:
- reestruturar o módulo inteiro
- criar abstrações desnecessárias
- trocar contratos sem necessidade real
- forçar refactor grande sem pedido explícito

---

# 24. CHECKLIST MENTAL OBRIGATÓRIO DO AGENTE

Antes de responder sobre `AUTH`, o agente deve verificar mentalmente:

- isso respeita o fluxo `screen → hook → service → datasource → api → httpClient`?
- isso cria nova fonte de verdade para sessão?
- isso espalha invalidação?
- isso lê token fora do fluxo oficial?
- isso pode causar logout parcial?
- isso quebra mocks?
- isso introduz acoplamento indevido?
- isso mantém store, storage e UI sincronizados?
- isso ajuda ou atrapalha o `AUTH` a virar base para `SECURITY`?

Se qualquer resposta for problemática, o agente deve sinalizar isso.

---

# 25. PROIBIÇÕES

O agente NÃO deve:
- colocar regra de negócio em screen
- chamar datasource da screen
- chamar api do hook
- salvar token em hook
- salvar token em screen
- ler token fora do fluxo oficial
- criar nova fonte de verdade para sessão
- espalhar invalidação de sessão
- aceitar logout parcial
- quebrar mocks
- introduzir `shared -> features`
- aceitar `AUTH -> SECURITY` como padrão saudável
- considerar o `AUTH` pronto só porque os arquivos já existem

---

# 26. CRITÉRIOS PARA CONSIDERAR O AUTH PRONTO PARA SER BASE DO SECURITY

O `AUTH` só pode ser considerado base para `SECURITY` quando, no mínimo:

- o fluxo arquitetural principal estiver respeitado
- o `httpClient` centralizado estiver ativo em runtime
- o provider de token estiver ativo
- o interceptor 401 estiver ativo
- o restore de sessão estiver coerente
- a invalidação de sessão estiver coerente
- store, storage e UI estiverem sincronizados
- não houver leitura indevida de token
- não houver risco relevante de logout parcial
- mocks estiverem preservados
- erros tipados estiverem preservados
- não houver ambiguidade importante entre `sessionManager`, store e interceptor

Pendências pequenas podem existir.
Pendências no núcleo de sessão não.

---

# 27. REGRA FINAL

Nesta fase, toda decisão deve favorecer:

- previsibilidade
- centralização
- consistência de sessão
- proteção contra regressão
- compatibilidade com a arquitetura atual
- fechamento real do `AUTH`

O objetivo agora não é expandir o projeto.
O objetivo agora é deixar o `AUTH` sólido o suficiente para suportar a próxima fase.