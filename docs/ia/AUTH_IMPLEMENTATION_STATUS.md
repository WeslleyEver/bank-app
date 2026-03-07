
# AUTH_IMPLEMENTATION_STATUS.md

## Contexto do Projeto

Aplicativo mobile bancário desenvolvido com:

- Expo
- React Native
- TypeScript
- Expo Router

Arquitetura baseada em **feature modules**.

Estrutura geral das features:

screens → hooks → services → data source → api/mock → mappers → store → constants

Exemplo:

src/features/auth
src/features/security
src/features/pix (futuro)

Cada feature possui:

- presentation (screens/components)
- hooks
- services
- data / api
- mappers
- types
- store
- constants
- utils

---

# ETAPAS JÁ CONCLUÍDAS

## 1. Módulo Auth completo

Fluxos implementados:

- Cadastro PF
- Cadastro PJ
- Login
- Forgot password
- Logout
- Bootstrap de sessão
- Hidratação via /auth/me
- Navegação baseada em onboardingStatus

Status suportados:

pendente
em_analise
aprovado
rejeitado
documentos_pendentes

Fluxo de inicialização do app:

app inicia
→ bootstrap de sessão
→ verifica tokens
→ chama /auth/me
→ resolveAuthRoute
→ redireciona usuário

---

# 2. Arquitetura de DataSource

Implementado padrão:

AuthDataSource (interface)

Implementações:

backendAuthDataSource
mockAuthDataSource

Factory:

authDataSourceFactory()

Controle por flag:

USE_AUTH_MOCKS

Fluxo:

screen
→ hook
→ service
→ dataSourceFactory
→ backend ou mock

---

# 3. Sistema de Mocks para Auth

Criado mock completo para testes manuais sem backend.

Cenários controlados por documento:

11111111111 → aprovado
22222222222 → pendente
33333333333 → em_analise
44444444444 → documentos_pendentes
55555555555 → rejeitado
00000000000 → erro de login

Senha padrão dos mocks:

123456

Formato de tokens mock:

accessToken:
mock-access-{documento}

refreshToken:
mock-refresh-{documento}

Delay simulado:

300ms

---

# 4. Cadastro PF e PJ com mocks

Cadastro PF:

→ retorna userId
→ onboardingStatus
→ nextStep

Cadastro PJ:

cenário definido por:

representanteLegal.cpf

fallback:

cnpj

Fluxo:

cadastro
→ tela "cadastro recebido"
→ login manual
→ onboarding definido pelo mock

---

# 5. Máscaras e validações de segurança

Implementado:

Máscara CPF
Máscara CNPJ
Máscara telefone

Validações reais:

isValidCPF
isValidCNPJ
isValidPhone

Sanitização antes do envio:

sanitizeDocumento
sanitizePhone

Arquivos criados:

auth/utils/formatters
auth/utils/validators

Formatters:

document.formatter.ts
phone.formatter.ts

Validators:

document.validator.ts
phone.validator.ts

---

# 6. Login com máscara dinâmica

Campo:

CPF ou CNPJ

Comportamento:

≤ 11 dígitos → máscara CPF
> 11 dígitos → máscara CNPJ

Validação:

isValidDocumentoLogin

Compatível com documentos mock.

---

# 7. Organização final da feature auth

src/features/auth

constants
data
mappers
services
types
utils
presentation

utils:

formatters
validators

---

# 8. Testes realizados

Login aprovado
11111111111 / 123456
→ entra no app

Login pendente
22222222222 / 123456
→ onboarding pendente

Login em análise
33333333333 / 123456
→ onboarding em análise

Login documentos pendentes
44444444444 / 123456
→ onboarding documentos pendentes

Login rejeitado
55555555555 / 123456
→ onboarding rejeitado

Login erro
00000000000 / 123456
→ erro de autenticação

---

# ESTADO ATUAL DO PROJETO

Módulo Auth considerado **estável**.

Backend não é necessário para desenvolvimento.

Mocks permitem testar:

- login
- cadastro PF
- cadastro PJ
- onboarding
- bootstrap
- navegação

---

# PRÓXIMA ETAPA DO PRODUTO

Implementar módulo:

security

Objetivo:

PIN transacional

Fluxo:

primeiro acesso
→ criar PIN
→ confirmar PIN
→ salvar PIN

Operações futuras:

Pix
Transferências
Pagamentos

Fluxo de segurança:

ação sensível
→ pedir PIN
→ validar PIN
→ solicitar OTP
→ executar operação
