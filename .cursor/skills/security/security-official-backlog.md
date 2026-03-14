# Backlog Oficial — SECURITY Transacional

## Regras Transversais Obrigatórias

Estas regras valem para **todas** as tasks abaixo e não podem ser quebradas durante a implementação.

### Fronteiras de responsabilidade

- **AUTH** é responsável por:
  - login
  - logout
  - refresh de sessão
  - recuperação de sessão
  - identidade autenticada do usuário

- **SECURITY** é responsável por:
  - credencial transacional
  - PIN transacional
  - validação de challenge
  - tentativas inválidas
  - bloqueio temporário
  - autorização de operação sensível

- **PIX** é responsável por:
  - fluxo de envio Pix
  - consumo de resultado de autorização transacional
  - não pode validar PIN diretamente

- **shared** é responsável apenas por:
  - utilitários genéricos
  - abstrações reutilizáveis
  - tipos neutros
  - infraestrutura compartilhável
  - nunca pode depender de feature

### Regras de dependência

- `SECURITY` **pode** depender de `AUTH`
- `AUTH` **não pode** depender de `SECURITY`
- `PIX` **não pode** depender diretamente de PIN
- `PIX` deve depender apenas de um contrato de autorização/challenge
- `shared` **não pode** depender de `AUTH`, `SECURITY`, `PIX` ou qualquer outra feature

### Regras de segurança obrigatórias

- O PIN **nunca** pode ser persistido em texto puro
- O PIN **nunca** pode ser salvo em store de UI
- O PIN **nunca** pode ser logado
- O PIN **nunca** pode trafegar entre camadas além do estritamente necessário para validação local
- Proteção de operação sensível **não pode existir apenas na UI**
- A exigência de challenge deve existir na **camada de orquestração/use case**, não apenas em tela

### Decisões fechadas da v1

- A credencial transacional da v1 será **PIN numérico de 6 dígitos**
- O app exigirá challenge transacional para **Pix em 100% dos casos**
- A v1 **não terá janela de confiança**
- A v1 terá **3 tentativas inválidas**
- Após 3 tentativas inválidas, haverá **bloqueio temporário de 5 minutos**
- A v1 **não implementará reset de PIN**, apenas deixará a arquitetura preparada
- A arquitetura deve nascer preparada para crescimento futuro para:
  - biometria
  - OTP

---

# TASK 1 — Fundação da Feature SECURITY

## Objetivo
Transformar `SECURITY` em uma feature real, separada corretamente de `AUTH`, com escopo claro, dependências corretas e base pronta para challenge transacional.

## Subtasks

- Definir o escopo oficial do módulo `SECURITY`
- Separar claramente responsabilidades entre `AUTH` e `SECURITY`
- Garantir a direção correta de dependência:
  - `SECURITY` pode depender de `AUTH`
  - `AUTH` não pode depender de `SECURITY`
- Garantir que `shared` não dependa de features
- Organizar a estrutura mínima da feature:
  - `types`
  - `constants`
  - `services`
  - `hooks`
  - `store`
  - `infra`
  - `presentation`
- Definir a API pública da feature `SECURITY`
- Garantir que integrações externas usem apenas a API pública
- Remover do módulo `SECURITY` qualquer responsabilidade de storage de sessão/token do `AUTH`
- Reposicionar o storage de sessão/token para:
  - `AUTH`, se for responsabilidade específica de sessão
  - ou uma abstração neutra em `shared`, se for infraestrutura genérica

## Critério de conclusão

- `SECURITY` virou uma feature real
- responsabilidades entre `AUTH` e `SECURITY` ficaram explícitas
- nenhuma dependência indevida foi criada
- `AUTH` não depende de `SECURITY`
- `shared` não depende de features
- a base ficou preparada para challenge transacional reutilizável

---

# TASK 2 — Modelo de Domínio de Segurança

## Objetivo
Definir a regra de negócio da autenticação transacional de forma fechada para a v1.

## Subtasks

- Definir o conceito de **credencial transacional**
- Definir o que significa **usuário com PIN configurado**
- Definir o que significa **usuário sem PIN configurado**
- Definir quando o app exige challenge de segurança
- Definir o fluxo de validação do PIN
- Definir regra de tentativas inválidas
- Definir regra de bloqueio temporário
- Registrar explicitamente a decisão de **não implementar reset de PIN na v1**
- Preparar o modelo para crescimento futuro para:
  - `PIN`
  - `biometria`
  - `OTP`
- Fechar os estados de resultado da autorização transacional:
  - `authorized`
  - `denied`
  - `blocked`
  - `not_configured`
  - `cancelled`
  - `unavailable`

## Critério de conclusão

- regras do PIN ficaram definidas
- tentativas e bloqueio ficaram definidos
- os estados de autorização ficaram definidos
- o domínio ficou preparado para crescimento futuro
- não existem ambiguidades de regra na v1

---

# TASK 3 — Persistência Segura do PIN

## Objetivo
Garantir armazenamento seguro, isolado e vinculado corretamente ao usuário/conta.

## Subtasks

- Definir storage próprio para o PIN
- Garantir que o PIN nunca seja salvo em texto puro
- Definir estratégia de hash/derivação
- Persistir apenas:
  - `hash`
  - `salt`
  - metadados de segurança
- Separar storage do PIN do storage de token/auth
- Centralizar leitura e escrita em uma única camada da feature
- Definir escopo por usuário/conta
- Garantir que troca de conta não reaproveite material de segurança de outra conta
- Definir limpeza correta desses dados em:
  - `logout`
  - troca de conta
  - reinstalação do app
  - futuro reset de PIN
- Garantir que falha técnica de storage não seja tratada como PIN inválido

## Critério de conclusão

- PIN nunca é armazenado em texto puro
- persistência do PIN ficou isolada
- leitura e escrita ficaram centralizadas
- material de segurança ficou corretamente vinculado à conta
- limpeza funciona corretamente nos cenários definidos

---

# TASK 4 — Store da Feature SECURITY

## Objetivo
Criar estado previsível para a UI sem transformar a store em dona do segredo.

## Subtasks

- Criar store da feature `SECURITY`
- Definir o estado mínimo:
  - `hasPin`
  - `isPinValidated`
  - `failedAttempts`
  - `isBlocked`
  - `blockUntil`
  - `currentChallenge`
- Garantir que a store nunca salve PIN bruto
- Garantir que a store nunca salve hash ou salt desnecessariamente
- Garantir limpeza correta do estado local
- Garantir erros tipados
- Garantir que a store reflita estado operacional e de UI, mas não seja a fonte da verdade do segredo
- Garantir sincronização correta entre estado persistido e estado exibido para a UI

## Critério de conclusão

- estado da feature está previsível
- store não guarda segredo bruto
- store não é dona do segredo
- UI recebe estado correto de tentativas, bloqueio e challenge
- erros são consumíveis de forma tipada

---

# TASK 5 — Fluxo de Criação de PIN

## Objetivo
Permitir configuração da credencial transacional de forma segura e consistente.

## Subtasks

- Criar fluxo de criação de PIN
- Criar fluxo de confirmação de PIN
- Validar consistência entre PIN e confirmação
- Persistir apenas após confirmação
- Marcar o usuário como PIN configurado
- Garantir que nada seja salvo antes da confirmação final
- Definir quando esse fluxo pode aparecer:
  - primeiro login
  - primeira operação sensível
  - onboarding de segurança
- Garantir resultado tipado para sucesso e falha
- Garantir limpeza de estado temporário após conclusão ou cancelamento

## Critério de conclusão

- usuário consegue criar PIN
- nada é persistido antes da confirmação
- o app sabe distinguir quem tem ou não PIN configurado
- o fluxo não vaza segredo
- o resultado do setup é previsível

---

# TASK 6 — Fluxo de Validação de PIN

## Objetivo
Implementar autenticação transacional funcional e previsível.

## Subtasks

- Criar componente/tela de digitação de PIN
- Criar serviço/use case de validação
- Validar PIN contra material seguro persistido
- Incrementar tentativas em caso de falha
- Bloquear temporariamente após o limite
- Limpar erro após sucesso
- Limpar estado transitório após cancelamento
- Retornar resultado tipado para quem chama
- Garantir que falha técnica não seja tratada como erro de credencial
- Garantir que sucesso atualize o estado transacional necessário sem persistir segredo

## Critério de conclusão

- validação funciona
- tentativas falhas são controladas
- bloqueio temporário funciona
- cancelamento é tratado separadamente
- resultado é previsível e reutilizável

---

# TASK 7 — Challenge Transacional Reutilizável

## Objetivo
Criar um mecanismo reutilizável para autorizar operações sensíveis sem acoplar features ao PIN.

## Subtasks

- Criar o conceito de **challenge transacional**
- Criar contrato para **autorizar operação sensível**
- Encapsular o fluxo em hook/service reutilizável
- Garantir que outras features possam usar o mesmo challenge
- Garantir que o contrato exponha autorização, e não detalhes do PIN
- Preparar a arquitetura para aceitar futuramente:
  - biometria
  - OTP
- Garantir que `PIX` consuma apenas o resultado do challenge
- Garantir que o challenge possa carregar contexto da operação sensível

## Critério de conclusão

- `PIX` não depende diretamente do PIN
- `SECURITY` pode ser reutilizado em outras features
- challenge nasceu extensível
- contrato público ficou estável e claro

---

# TASK 8 — Integração com Pix

## Objetivo
Aplicar `SECURITY` no primeiro caso real sem permitir bypass.

## Subtasks

- Inserir challenge antes do `sendPixUseCase`
- Garantir execução apenas após validação autorizada
- Impedir execução em caso de PIN inválido
- Impedir execução em caso de bloqueio
- Impedir execução em caso de cancelamento
- Impedir execução em caso de `not_configured`
- Revisar loading, mensagens e fluxo visual
- Garantir que a proteção exista no use case/orquestração, e não apenas na tela
- Garantir que nenhum outro ponto do Pix execute envio sem challenge

## Critério de conclusão

- Pix exige autenticação transacional
- não há execução sem validação/autorização
- não há bypass por outro ponto do fluxo
- o fluxo fica consistente com app bancário real

---

# TASK 9 — Erros e Observabilidade

## Objetivo
Criar tratamento robusto de erro sem expor dados sensíveis.

## Subtasks

- Definir códigos de erro do `SECURITY`
- Criar mapper/factory de erro
- Diferenciar claramente os cenários:
  - `PIN inválido`
  - `PIN bloqueado`
  - `PIN não configurado`
  - erro de storage
  - erro de validação
  - challenge cancelado
  - indisponibilidade do mecanismo de segurança
- Garantir que erros de domínio e erros técnicos sejam separados
- Criar logs sem vazar PIN ou dado sensível
- Definir mensagens de UI claras e consistentes
- Garantir que logs sirvam para observabilidade sem comprometer segurança

## Critério de conclusão

- erros ficaram tipados
- logs não vazam segredos
- UI recebe estados claros
- falhas técnicas não são mascaradas como falhas de credencial

---

# TASK 10 — Testes de Fechamento do SECURITY

## Objetivo
Garantir estabilidade funcional e integridade arquitetural da feature.

## Subtasks

- Testar criação de PIN
- Testar confirmação divergente
- Testar persistência segura
- Testar validação correta
- Testar tentativas inválidas
- Testar bloqueio temporário
- Testar cancelamento do challenge
- Testar integração com Pix
- Garantir que `AUTH` continua íntegro
- Garantir que `AUTH` não passou a depender de `SECURITY`
- Garantir que `PIX` não depende diretamente de PIN
- Garantir que nenhum dado sensível vaza em logs, store ou persistência indevida

## Critério de conclusão

- fluxos críticos estão cobertos
- integração com Pix está coberta
- `AUTH` não quebra
- fronteiras arquiteturais continuam íntegras
- nenhum dado sensível vaza

---

# Ordem Obrigatória de Execução

A execução deve seguir esta ordem:

1. **Task 1 — Fundação da Feature SECURITY**
2. **Task 2 — Modelo de Domínio de Segurança**
3. **Task 3 — Persistência Segura do PIN**
4. **Task 4 — Store da Feature SECURITY**
5. **Task 5 — Fluxo de Criação de PIN**
6. **Task 6 — Fluxo de Validação de PIN**
7. **Task 7 — Challenge Transacional Reutilizável**
8. **Task 8 — Integração com Pix**
9. **Task 9 — Erros e Observabilidade**
10. **Task 10 — Testes de Fechamento do SECURITY**

Nenhuma task posterior pode ser considerada concluída se violar regras definidas nas tasks anteriores.

---

# Definition of Done Global

O módulo `SECURITY` só será considerado concluído quando:

- existir como feature real
- tiver fronteiras claras
- tiver dependências corretas
- tiver domínio transacional definido
- persistir PIN com segurança
- não armazenar segredo bruto
- oferecer challenge reutilizável
- proteger Pix sem bypass
- expor erros tipados
- não vazar dados sensíveis
- estiver coberto por testes críticos
- não quebrar a integridade do `AUTH`
