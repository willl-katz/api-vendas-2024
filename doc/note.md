# Development Project Guide

## Create Migrations in Typeorm commands

```shell
  npm run typeorm migration:create src/common/infrastructure/typeorm/migrations/
```

## Run migrations on the database

```shell
  npm run typeorm -- -d ./src/common/infrastructure/typeorm/index.ts migration:run
```

## Interface para Repositórios

Um Repositório terá como responsabilidade salvar, buscar, atualizar e excluir os dados em uma estrutura de dados, podendo ser um SGBD, arquivo, memória, etc.

> IMPORTANTE: um repositório NÃO deve conter regras de negócio. As regras de negócios devem ficar nas entidades e/ou nos casos de usos.

Outro ponto importante para ressaltar é que um Repositório terá que acessar recursos externos, que estarão nas camadas mais externas, para acessar a estrutura de dados.

Por conta disso, precisaremos criar "contratos" através de interfaces para isolar esses recursos externos da camada de domínio da aplicacao.

Ou seja, na camada de domínio ficarão as interfaces que definem tudo que precisaremos manipular através de um repositório.

Criaremos a abstração com as definições dos contratos a serem seguidos por cada implementação de repositórios em nossa api.

É importante lembrar que essa interface deve representar qualquer tipo de model a ser manipulado.

## Utilização do JEST para aplicar testes unitários

- Instalação do JEST com typescript.

```shell
  npm i -D jest ts-jest @types/jest
```

- Aplicar as configurções necessárias no arquivo jest.config.

### Definição de SUT

SUT é a sigla para System Under Test (Sistema em Teste). É um termo usado em testes de software para se referir ao sistema ou componente específico que está sendo testado.

Quando você está escrevendo testes automatizados, o SUT é o código que você está verificando para garantir que ele se comporta conforme esperado. Isso pode incluir uma função, um módulo, uma classe ou até mesmo um sistema completo.

## Interface ProductsRepository

Abstração específica para repositórios de produtos, que funciona como um contrato adicional para as implementações de reepositórios que manipulam produtos

Os métodos adicionais que criados para repositórios de produtos são `findByName`, `findAllByIds` e `conflictingName`.

## Dados massivos fakes para testes

Para isso utilizei as biblioteca fakerJs para gera grandes quantidades de dados falsos (mas realistas) para teste.

```shell
  npm install @faker-js/faker --save-dev
```
