# SECURITY Business Rules

## 1. Objetivo

Definir as **regras de negócio oficiais** da feature `SECURITY` para o app bancário, com foco em **autenticação transacional local** por `PIN`, preparando a base para evolução futura para `biometria` e `OTP`.

Este documento serve como **fonte de verdade funcional** para implementação manual e para uso por agentes/assistentes de código.

---

## 2. Escopo funcional da v1

A v1 da feature `SECURITY` cobre:

- configuração de `PIN` transacional;
- confirmação de `PIN` no setup;
- validação de `PIN` para autorizar operações sensíveis;
- controle de tentativas inválidas;
- bloqueio temporário após excesso de falhas;
- challenge transacional reutilizável;
- integração inicial com `Pix`.

A v1 **não cobre**:

- biometria como método ativo;
- OTP como método ativo;
- reset de PIN por fluxo completo de produto;
- recuperação remota de credencial via backend;
- políticas de device binding avançadas;
- múltiplos PINs por conta no mesmo dispositivo.

A ausência desses itens na v1 **não autoriza** decisões que inviabilizem sua implementação futura.

---

## 3. Princípios de negócio

1. O usuário pode estar autenticado na sessão e ainda assim precisar de validação adicional para concluir uma operação sensível.
2. O `PIN` transacional é uma **credencial de autorização de operação**, não uma credencial de login.
3. Nenhuma operação sensível pode ser executada sem resultado explícito de challenge bem-sucedido.
4. O mecanismo de autorização não pertence ao `Pix`; pertence ao `SECURITY`.
5. Falha de PIN não pode vazar informação sensível.
6. Bloqueio temporário deve ser previsível, tipado e centralizado.
7. Toda regra deve ser implementada no domínio/serviço, nunca apenas na UI.

---

## 4. Definições oficiais

## 4.1 PIN transacional

`PIN` transacional é a credencial local usada para autorizar operações sensíveis depois que a sessão do usuário já existe.

## 4.2 Usuário com PIN configurado

Um usuário é considerado com `PIN` configurado apenas quando existir material seguro persistido e válido contendo, no mínimo:

- hash/derivação do PIN;
- salt;
- versão do algoritmo;
- metadados de segurança exigidos pela feature.

A presença de um booleano isolado em memória **não é suficiente** para concluir que há PIN configurado.

## 4.3 Challenge transacional

Challenge transacional é a solicitação temporária de autorização exigida antes de executar uma operação sensível.

## 4.4 Operação sensível

Operação sensível é toda ação que movimenta valor, altera estado financeiro relevante ou muda dado crítico do usuário.

Na v1, o primeiro caso obrigatório é:

- envio de `Pix`.

A arquitetura deve permitir expansão para:

- pagamento;
- transferência;
- alteração de dados críticos;
- ações sensíveis de cartão.

---

## 5. Regra oficial do PIN na v1

## 5.1 Formato do PIN

Regra oficial recomendada para a v1:

- PIN numérico;
- exatamente **6 dígitos**;
- apenas caracteres `0-9`;
- sem espaços;
- valor completo obrigatório para validar ou concluir setup.

## 5.2 Regras obrigatórias de consistência

- PIN com menos de 6 dígitos é inválido;
- PIN com mais de 6 dígitos é inválido;
- caracteres não numéricos tornam o PIN inválido;
- o sistema não deve persistir PIN parcial;
- o sistema não deve validar automaticamente PIN incompleto como tentativa errada.

## 5.3 Regra de exibição

A UI pode mascarar visualmente a entrada do PIN, mas a regra funcional pertence ao domínio, não ao componente visual.

---

## 6. Quando o app exige challenge de segurança

## 6.1 Regra principal

Toda operação sensível deve exigir challenge transacional antes da execução definitiva.

## 6.2 Regra obrigatória da v1

Na v1, **todo envio de Pix exige challenge**.

Não existe, na v1:

- janela de confiança temporária;
- reuso automático de validação anterior;
- dispensa de challenge por tempo recente;
- exceção por tela específica.

## 6.3 Proibição explícita

É proibido executar a operação sensível com base apenas em:

- navegação para uma tela de confirmação;
- clique em botão final;
- estado visual local da tela;
- memória temporária não validada pelo serviço de challenge.

---

## 7. Regra de criação de PIN

## 7.1 Quando o fluxo de setup deve aparecer

A v1 deve suportar o setup por qualquer um destes gatilhos de produto:

- primeiro acesso ao fluxo de segurança;
- primeira operação sensível sem PIN configurado;
- onboarding de segurança.

A regra do produto pode escolher qual gatilho usar primeiro, mas a implementação deve suportar o fluxo sem acoplamento ao Pix.

## 7.2 Fluxo obrigatório de setup

1. usuário informa o PIN;
2. usuário informa a confirmação do PIN;
3. sistema valida formato do PIN;
4. sistema valida igualdade entre PIN e confirmação;
5. sistema deriva o material seguro;
6. sistema persiste apenas o material permitido;
7. sistema marca o estado como `hasPin = true`.

## 7.3 Regras obrigatórias

- nada é persistido antes da confirmação bem-sucedida;
- confirmação divergente gera erro tipado;
- PIN bruto não vai para store global;
- PIN bruto não pode ser logado;
- o setup deve ser atômico do ponto de vista funcional: ou conclui com persistência válida, ou falha sem deixar estado inconsistente.

## 7.4 Resultado funcional do setup

Em sucesso, o sistema deve:

- considerar o usuário como `com PIN configurado`;
- limpar estados transitórios do fluxo de criação;
- deixar a feature apta a iniciar challenges futuros por PIN.

Em falha, o sistema deve:

- não persistir configuração parcial;
- retornar erro tipado;
- preservar consistência do estado local.

---

## 8. Regra de validação do PIN

## 8.1 Pré-condição

Só é possível validar um PIN se existir material seguro persistido correspondente.

Se não existir PIN configurado, a validação deve retornar:

- `not_configured`
- ou erro tipado equivalente de negócio.

## 8.2 Fluxo obrigatório de validação

1. usuário digita o PIN;
2. sistema verifica se existe bloqueio ativo;
3. sistema verifica se existe material persistido válido;
4. sistema recalcula a derivação/hash com o salt salvo;
5. sistema compara com o material persistido;
6. em sucesso, autoriza o challenge;
7. em falha, registra tentativa inválida;
8. ao atingir o limite, aplica bloqueio temporário.

## 8.3 Regras obrigatórias

- o PIN nunca é comparado com texto puro persistido;
- falha por storage inválido não pode ser tratada como `PIN inválido`;
- sucesso limpa o estado transitório de erro;
- a feature chamadora recebe apenas o resultado tipado da validação/challenge;
- a feature chamadora não manipula contador de tentativas diretamente.

---

## 9. Política de tentativas inválidas

## 9.1 Regra oficial da v1

Política recomendada e oficial para começar:

- **máximo de 3 tentativas inválidas consecutivas**;
- ao exceder o limite, aplicar **bloqueio temporário de 5 minutos**.

## 9.2 O que conta como tentativa inválida

Conta como tentativa inválida:

- PIN completo informado e rejeitado pela validação.

Não conta como tentativa inválida:

- digitação parcial;
- cancelamento voluntário do challenge;
- erro de storage;
- indisponibilidade técnica sem conclusão da validação;
- saída da tela antes de submissão.

## 9.3 Regra de incremento

O contador de tentativas deve ser incrementado apenas após uma validação concluída com resultado funcional de PIN incorreto.

---

## 10. Regra de bloqueio temporário

## 10.1 Quando bloquear

O bloqueio deve ser aplicado imediatamente após a tentativa inválida que ultrapassar o limite permitido.

## 10.2 Efeito do bloqueio

Enquanto houver bloqueio ativo:

- nenhum challenge por PIN pode ser autorizado;
- a tentativa de validar PIN deve retornar estado `blocked`;
- o sistema deve informar `blockUntil` ou equivalente tipado;
- o usuário não deve consumir novas tentativas durante o período de bloqueio.

## 10.3 Fim do bloqueio

Encerrado o prazo de bloqueio:

- o challenge por PIN pode voltar a ser tentado;
- o contador de tentativas deve ser reiniciado;
- o estado de bloqueio deve ser limpo.

## 10.4 Regra de fonte da verdade

O bloqueio deve ser derivado de estado persistido/centralizado, nunca de lógica espalhada em componentes de tela.

---

## 11. Regra de sucesso após validação correta

Quando o PIN for validado com sucesso, o sistema deve:

- autorizar o challenge atual;
- limpar o erro transitório da tentativa anterior;
- reiniciar o contador de tentativas inválidas;
- remover eventual bloqueio expirado residual;
- retornar resultado tipado para a operação chamadora.

A operação sensível só pode continuar após esse resultado explícito.

---

## 12. Regra de cancelamento do challenge

## 12.1 Cancelamento é resultado funcional

Cancelar o challenge não é erro técnico; é um resultado legítimo do fluxo.

## 12.2 Regra obrigatória

Em cancelamento:

- a operação sensível não executa;
- o sistema retorna `cancelled`;
- o contador de tentativas não é incrementado;
- o estado transitório do challenge deve ser limpo.

---

## 13. Contrato funcional do challenge

## 13.1 Regra principal

Features de negócio não pedem “validar PIN”; pedem “autorizar operação sensível”.

## 13.2 Resultado mínimo obrigatório

O resultado do challenge deve distinguir pelo menos:

- `authorized`
- `cancelled`
- `denied`
- `blocked`
- `not_configured`
- `error`

## 13.3 Semântica oficial

### `authorized`
A operação pode prosseguir.

### `cancelled`
O usuário desistiu ou fechou o fluxo. A operação não prossegue.

### `denied`
Houve tentativa inválida de credencial. A operação não prossegue.

### `blocked`
O usuário está temporariamente impedido de validar por excesso de falhas.

### `not_configured`
Não há credencial transacional configurada.

### `error`
Houve falha técnica ou estado inconsistente não classificado como erro de credencial.

---

## 14. Regra de integração com Pix

## 14.1 Fluxo obrigatório da v1

1. usuário revisa os dados do Pix;
2. o fluxo solicita challenge transacional ao `SECURITY`;
3. `SECURITY` executa o challenge;
4. somente em `authorized`, a transação Pix é enviada;
5. em qualquer outro resultado, a transação não é enviada.

## 14.2 Resultados que impedem execução do Pix

O Pix não pode ser executado em caso de:

- `cancelled`;
- `denied`;
- `blocked`;
- `not_configured`;
- `error`.

## 14.3 Proibição explícita

É proibido:

- o Pix validar PIN diretamente;
- a tela de Pix manipular tentativas inválidas por conta própria;
- a proteção existir só em nível visual;
- haver caminho alternativo que chame a operação final sem challenge.

---

## 15. Regra de persistência funcional

## 15.1 Material permitido

A feature só pode persistir:

- hash/derivação do PIN;
- salt;
- versão do algoritmo;
- metadados de segurança necessários;
- estado persistível de tentativas e bloqueio, se essa for a estratégia adotada.

## 15.2 Material proibido

A feature não pode persistir:

- PIN em texto puro;
- confirmação do PIN;
- cópia do PIN em store global;
- logs com valor digitado;
- payload sensível desnecessário.

## 15.3 Separação obrigatória

O storage do PIN deve ser logicamente separado do storage de sessão/autenticação.

---

## 16. Regra de estado da feature

## 16.1 Estado mínimo recomendado

A feature deve conseguir refletir pelo menos:

- `hasPin`
- `isPinValidated`
- `failedAttempts`
- `isBlocked`
- `blockUntil`
- `currentChallenge`
- `lastErrorCode`

## 16.2 Proibição explícita

A store nunca pode guardar:

- PIN bruto;
- confirmação do PIN;
- hash exposto para consumo arbitrário;
- salt exposto para UI.

---

## 17. Regras por evento de ciclo de vida

## 17.1 Logout

Regra recomendada da v1:

- `logout` limpa estado transitório da feature;
- `logout` **não apaga automaticamente** o material do PIN, salvo se o produto exigir essa política.

Essa decisão deve ser centralizada e documentada. Não pode ficar implícita.

## 17.2 Troca de conta

Regra obrigatória:

- ao trocar de conta no mesmo dispositivo, o material de segurança da conta anterior deve ser limpo;
- a nova conta não pode herdar estado de PIN, tentativas ou bloqueio da anterior.

## 17.3 Reinstalação

Regra esperada:

- a reinstalação é tratada como perda do estado local persistido do app;
- após reinstalação, o app não deve assumir que existe PIN configurado até verificar o storage real disponível.

## 17.4 Reset de PIN

Mesmo que o fluxo completo de reset não exista na v1, a regra futura deve ser:

- remover integralmente o material anterior;
- só considerar novo PIN válido após novo setup completo.

---

## 18. Regras de erro

## 18.1 Erros de negócio mínimos

Códigos mínimos recomendados:

- `PIN_NOT_CONFIGURED`
- `PIN_CONFIRMATION_MISMATCH`
- `PIN_INVALID_FORMAT`
- `PIN_INVALID`
- `PIN_BLOCKED`
- `SECURITY_STORAGE_ERROR`
- `SECURITY_VALIDATION_ERROR`
- `SECURITY_CHALLENGE_CANCELLED`
- `SECURITY_UNKNOWN_ERROR`

## 18.2 Regra de classificação

- erro de formato não é a mesma coisa que PIN incorreto;
- erro técnico não é a mesma coisa que credencial inválida;
- cancelamento não é a mesma coisa que erro;
- bloqueio é estado de negócio, não erro genérico.

---

## 19. Regras de observabilidade

Logs podem registrar:

- tipo da operação sensível;
- tipo do challenge;
- resultado do challenge;
- quantidade de tentativas sem valor digitado;
- ocorrência de bloqueio;
- falhas técnicas de storage/infra.

Logs não podem registrar:

- PIN digitado;
- confirmação do PIN;
- hash completo em texto de log;
- salt em texto de log;
- detalhes sensíveis desnecessários da transação.

---

## 20. Decisões futuras já previstas

A modelagem deve nascer preparada para suportar no futuro:

- `PIN`
- `BIOMETRY`
- `OTP`

### Regra obrigatória

A introdução futura desses métodos não pode exigir reescrever o contrato público do challenge.

O contrato pode crescer, mas não deve nascer acoplado exclusivamente ao `PIN`.

---

## 21. Anti-padrões proibidos

1. Considerar usuário com PIN apenas por flag em memória.
2. Salvar PIN bruto em qualquer camada persistente.
3. Incrementar tentativas em cancelamento.
4. Incrementar tentativas em erro técnico.
5. Aplicar bloqueio apenas em componente visual.
6. Permitir execução do Pix fora do fluxo de challenge.
7. Expor detalhes internos de hash/salt para a UI.
8. Misturar regra de sessão com regra de challenge transacional.
9. Tratar toda falha como `PIN inválido`.
10. Implementar challenge com resultado não tipado.

---

## 22. Critérios de aceite de negócio

As regras de negócio do `SECURITY` só serão consideradas atendidas quando:

- o usuário conseguir configurar PIN com confirmação válida;
- nada for persistido antes da confirmação;
- o app souber distinguir com segurança quem tem PIN configurado e quem não tem;
- a validação do PIN retornar resultado tipado e previsível;
- tentativas inválidas forem contadas corretamente;
- bloqueio temporário funcionar corretamente;
- cancelamento do challenge não executar a operação;
- Pix não executar sem challenge autorizado;
- nenhum dado sensível for persistido ou logado em texto puro;
- a modelagem permanecer pronta para biometria e OTP.

---

## 23. Resumo executivo

- O `PIN` transacional é credencial de autorização de operação, não de login.
- Na v1, o PIN é numérico e tem 6 dígitos.
- Todo envio de Pix exige challenge.
- Não existe janela de confiança na v1.
- O usuário com PIN configurado é definido por material seguro persistido válido.
- Após 3 falhas consecutivas, há bloqueio de 5 minutos.
- Cancelamento não conta como erro nem como tentativa inválida.
- Erro técnico não pode ser tratado como PIN incorreto.
- O Pix só executa em resultado `authorized`.
- A base já deve nascer preparada para `BIOMETRY` e `OTP`.
