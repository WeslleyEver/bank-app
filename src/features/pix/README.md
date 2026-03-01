1. Visão Geral

O Módulo Pix é responsável por gerenciar o fluxo de transferências instantâneas dentro da aplicação bancária.

Este módulo foi estruturado seguindo princípios inspirados em Clean Architecture, com foco em:

Separação de responsabilidades

Escalabilidade

Testabilidade

Independência de infraestrutura

Organização por feature

2. Estrutura Arquitetural

O módulo está organizado em três camadas principais:

pix/
├── domain
├── infra
├── presentation
└── README.md

Cada camada possui responsabilidades bem definidas.

3. Camada Domain

A camada domain contém regras de negócio puras e não deve depender de:

React

React Native

Expo

APIs externas

Componentes de interface

Ela define:

Entidades

Casos de uso

Contratos de repositório

Regras de validação

3.1 Casos de Uso
CreatePixTransfer

Responsabilidade:

Validar dados da transferência

Garantir integridade do valor

Aplicar regras de negócio

Gerar estrutura inicial da transação

Definir status inicial (pending)

Regras de negócio aplicadas:

Valor deve ser maior que zero

Chave Pix é obrigatória

ID da transação deve ser gerado

Data de criação deve ser definida

Nenhuma transferência inválida deve sair da camada de domínio.

3.2 Contrato de Repositório
IPixRepository

Define o contrato de persistência da transferência:

interface IPixRepository {
createTransfer(data: PixTransfer): Promise<PixTransfer>;
}

Objetivos:

Desacoplar domínio da infraestrutura

Permitir substituição de backend

Facilitar testes unitários

Garantir inversão de dependência

O domínio depende apenas da interface, nunca da implementação concreta.

3.3 Entidade (Evolução Planejada)
PixTransfer

Representa formalmente uma transferência no sistema.

Propriedades previstas:

id

key

keyType

amount

description

status (pending | completed | failed)

createdAt

A entidade centraliza a estrutura oficial da transação dentro do sistema.

4. Camada Infra

A camada infra é responsável pela comunicação com sistemas externos.

Ela implementa os contratos definidos no domínio.

4.1 PixRepository (Implementação Atual)

Implementação atual:

Simulação de backend

Delay artificial de processamento

Retorno automático com status completed

Evoluções previstas:

Integração com API real

Tratamento de erros de rede

Padronização de erros do backend

Estratégia de retry

Log de transações

Essa camada pode ser substituída sem impacto na UI ou na regra de negócio.

5. Camada Presentation

Responsável por:

Telas

Navegação

Hooks

Gerenciamento de estado

Orquestração da interação do usuário

5.1 Fluxo Atual
AreaPixScreen
↓
PixAmountScreen
5.2 Fluxo Recomendado (Padrão Bancário)

1. Inserção da chave Pix
2. Inserção do valor
3. Confirmação dos dados
4. Autenticação transacional (PIN)
5. Processamento
6. Tela de sucesso ou erro

Esse fluxo segue padrões reais de bancos digitais.

5.3 Hook usePixTransfer

Responsável por:

Executar o caso de uso

Chamar o repositório

Controlar estado de loading

Controlar estado de erro

Objetivo:

Evitar regra de negócio nas telas

Centralizar a orquestração da transferência

Manter separação de responsabilidades

Telas não devem instanciar repositórios diretamente.

6. Roadmap de Segurança

Para simular padrões reais de banco digital:

6.1 PIN Transacional

Tela dedicada para autenticação

Obrigatória antes da confirmação

Validação local ou via backend

6.2 Limite Diário de Transferência

Validações previstas no domínio:

Limite por transação

Limite diário acumulado

Bloqueio por status de conta

6.3 Validação de Saldo

Verificação de saldo suficiente

Bloqueio em caso de insuficiência

Impedir estado de saldo negativo

7. Estratégia de Tratamento de Erros

Padronização futura de erros:

INSUFFICIENT_FUNDS

DAILY_LIMIT_EXCEEDED

INVALID_PIX_KEY

NETWORK_ERROR

TIMEOUT

Essa padronização permitirá feedback consistente na interface.

8. Estratégia de Integração com Backend

Substituição futura do repositório mock por:

Cliente HTTP (REST)

Autenticação baseada em token

Interceptadores de requisição

Normalização de erros

Sem necessidade de refatoração na camada de domínio.

9. Princípios Aplicados

Arquitetura orientada a feature

Separação clara de responsabilidades

Inversão de dependência

Domínio isolado da UI

Infraestrutura substituível

Estrutura preparada para testes

10. Status Atual

✔ Estrutura modular implementada
✔ Caso de uso definido
✔ Contrato de repositório criado
✔ Implementação mock funcional
✔ Separação de rotas
✔ Validação de CPF, e-mail e celular

11. Próximos Marcos Técnicos

Implementação de PixConfirmScreen

Implementação de PIN transacional

Validação de saldo no domínio

Implementação de limite diário

Padronização formal de erros

Testes unitários dos casos de uso
