# BP Finance

Aplicativo mobile oficial do **BP Finance**, solução financeira da **Best Play Music**.

Este repositório concentra a aplicação mobile em desenvolvimento, construída com **Expo**, **React Native**, **Expo Router** e **TypeScript**, com foco na evolução da experiência financeira do ecossistema da empresa.

## Sobre o projeto

O **BP Finance** é um produto real da **Best Play Music** e está em fase de construção contínua.

O projeto reúne a base mobile da plataforma, incluindo fluxos de autenticação, onboarding, segurança transacional, transações e módulos financeiros em evolução.

> **Importante**
>
> - O fluxo de **QR Code** presente no projeto é **experimental**, utilizado apenas para testes neste momento.
> - O fluxo de **Pix** está em **reformulação** e pode sofrer mudanças estruturais, visuais e funcionais ao longo do desenvolvimento.

## Status atual

O projeto está em **fase de construção** e pode conter:

- integrações parciais
- fluxos ainda em validação interna
- comportamentos temporários para homologação e testes
- módulos em refatoração ou evolução arquitetural

Por isso, mudanças de estrutura, navegação, contratos de API e regras de negócio podem acontecer com frequência.

## Tecnologias utilizadas

- **Expo**
- **React Native**
- **Expo Router**
- **TypeScript**
- **Zustand**
- **Jest**
- **Expo Secure Store**
- **Expo Camera**
- **Lottie React Native**

## Pré-requisitos

Antes de iniciar, garanta que você tenha instalado:

- **Node.js 18+**
- **npm**
- **Expo Go** no dispositivo móvel
- **Android Studio** (opcional, para emulador Android)
- **EAS CLI** (opcional, para build e distribuição)

## Instalação

Clone o repositório e instale as dependências:

```bash
npm install
```

## Variáveis de ambiente

O projeto utiliza configuração por variável de ambiente para o endpoint base da API.

Crie um arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

Ajuste o valor conforme o ambiente utilizado pelo time.

> Quando fluxos com mock estiverem ativos, parte da navegação pode funcionar sem backend real.

## Como executar o projeto

### Ambiente de desenvolvimento

```bash
npx expo start
```

Após iniciar o servidor do Expo:

- pressione `a` para abrir no emulador Android
- pressione `w` para abrir no navegador
- escaneie o QR Code com o **Expo Go** para abrir no dispositivo físico

### Rodando diretamente no Android

```bash
npm run android
```

### Rodando no iOS

```bash
npm run ios
```

### Rodando na Web

```bash
npm run web
```

## Uso com Expo Go

O fluxo principal de desenvolvimento pode ser feito com **Expo Go**, principalmente para validação rápida de interface, navegação e comportamento de telas.

Passos recomendados:

1. Instale as dependências com `npm install`
2. Inicie o projeto com `npx expo start`
3. Abra o **Expo Go** no celular
4. Escaneie o QR Code exibido no terminal ou no navegador

> Dependendo do estágio de evolução de determinados módulos, alguns comportamentos podem ser específicos para ambiente local, mock ou build interna.

## Scripts disponíveis

| Script                  | Descrição                                    |
| ----------------------- | -------------------------------------------- |
| `npm run start`         | inicia o servidor de desenvolvimento do Expo |
| `npm run android`       | executa o app no Android                     |
| `npm run ios`           | executa o app no iOS                         |
| `npm run web`           | executa o projeto na web                     |
| `npm run lint`          | executa a análise de lint do projeto         |
| `npm run test`          | executa a suíte de testes com Jest           |
| `npm run test:watch`    | executa os testes em modo observação         |
| `npm run reset-project` | reseta a estrutura base do template Expo     |

> O script `reset-project` é herdado do template inicial e só deve ser utilizado com critério.

## Estrutura do projeto

A aplicação utiliza **Expo Router**, com navegação baseada em arquivos dentro da pasta `app/`, e organização complementar por features dentro de `src/`.

### Estrutura principal

```text
app/
├── (tabs)/
├── auth/
├── pix/
├── qr/
├── security/
├── transactions/
└── ...

src/
├── bootstrap/
├── components/
├── features/
│   ├── account/
│   ├── auth/
│   ├── pix/
│   ├── security/
│   └── transactions/
├── shared/
└── theme/
```

### Organização por responsabilidade

- `app/`: rotas e telas baseadas em arquivo
- `src/features/`: regras, serviços, stores, hooks e camadas por domínio funcional
- `src/shared/`: recursos compartilhados entre módulos
- `src/theme/`: tokens visuais e padrões de interface
- `services/`: serviços específicos isolados
- `components/`: componentes reutilizáveis fora das features

## Principais módulos em desenvolvimento

## Fluxo atual de autenticação

Atualmente, a autenticação está configurada para usar **mocks**.

Arquivo de referência:

```ts
src / features / auth / constants / auth - mock.constants.ts;
```

Valor atual:

```ts
export const USE_AUTH_MOCKS = true;
```

### Credenciais mock para testes

Senha padrão:

```txt
123456
```

Documentos disponíveis para simular cenários:

- `11111111111` → aprovado
- `22222222222` → pendente
- `33333333333` → em análise
- `44444444444` → documentos pendentes
- `55555555555` → rejeitado
- `00000000000` → credenciais inválidas
- `77777777777` → sessão expirada
- `99999999999` → erro de rede
- `88888888888` → timeout
- `11111111000195` → CNPJ para testes PJ

### Autenticação

O projeto possui fluxo de autenticação com suporte a:

- login
- recuperação de senha
- cadastro PF
- cadastro PJ
- roteamento por status de onboarding
- bootstrap de sessão

Atualmente, o módulo também possui suporte a **mocks de autenticação** para acelerar testes e evolução de fluxos internos.

### Onboarding

O app já contempla estados de onboarding como:

- aprovado
- pendente
- em análise
- documentos pendentes
- rejeitado

### Segurança

Existe um módulo dedicado a segurança, incluindo estrutura para:

- configuração de PIN
- validação de PIN
- desafio transacional
- armazenamento seguro
- limpeza de estado sensível

### Pix

O módulo Pix existe no projeto, mas está em **reformulação**.

Neste momento, ele deve ser tratado como uma frente em evolução, sujeita a mudanças de fluxo, arquitetura e integração.

### QR Code

O fluxo de leitura/uso de **QR Code** está presente apenas para **testes** e **não representa ainda um fluxo oficial do produto**.

## Mocks e ambiente de desenvolvimento

O projeto possui suporte a ambiente mockado para autenticação.

Atualmente existe uma chave de controle no módulo de auth:

```ts
USE_AUTH_MOCKS = true;
```

Isso permite evoluir telas, estados e regras de navegação mesmo sem backend completo.

### Cenários mockados

Existem cenários internos vinculados a documentos de teste e status de onboarding. Esses cenários ficam centralizados no módulo de autenticação.

Em ambiente local, isso facilita:

- validação de telas
- navegação por status
- testes de fluxo
- desacoplamento temporário do backend

> Como se trata de um produto real em construção, a estratégia de mock deve ser entendida como apoio ao desenvolvimento, e não como comportamento definitivo do sistema.

## Testes

O projeto possui suíte de testes com **Jest**.

Para executar:

```bash
npm run test
```

Modo observação:

```bash
npm run test:watch
```

## Qualidade de código

Para rodar a verificação de lint:

```bash
npm run lint
```

## Build e distribuição

O projeto possui configuração de **EAS Build**.

Perfis disponíveis:

- `development`
- `preview`
- `production`

Exemplo de build:

```bash
eas build --platform android --profile development
```

Para produção:

```bash
eas build --platform android --profile production
```

## Boas práticas para o repositório

Como este é um produto real da empresa, recomenda-se:

- não subir credenciais reais
- não versionar arquivos sensíveis de ambiente
- revisar cuidadosamente alterações em fluxos financeiros e de segurança
- documentar mudanças relevantes de arquitetura e integração
- manter o README atualizado conforme os módulos forem evoluindo

## Uso interno

Este repositório é destinado ao desenvolvimento interno do **BP Finance** pela equipe responsável da **Best Play Music**.

## Observações finais

Este README descreve o estado atual do projeto de forma objetiva, mas o produto está em evolução. Sempre que houver alterações relevantes em fluxo, arquitetura, integrações ou processo de build, este documento deve ser revisado.
