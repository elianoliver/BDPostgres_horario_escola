# BDPostgres_horario_escola
Criação de um banco de dados postgres, com a linguagem de programação javascript de forma dinâmica a partir de um arquivo json

# Documentação do Código em JavaScript

Neste documento, apresentaremos uma documentação em Markdown para o código JavaScript fornecido. O código realiza operações de leitura de um arquivo JSON, criação de tabelas em um banco de dados PostgreSQL e inserção de dados nessas tabelas com base nos dados do arquivo JSON.

## Pré-requisitos

Antes de executar este código, é necessário ter as seguintes dependências instaladas:

- Node.js: [https://nodejs.org/](https://nodejs.org/)
- PostgreSQL: [https://www.postgresql.org/](https://www.postgresql.org/)

Certifique-se de que o PostgreSQL esteja em execução e que você tenha configurado as credenciais de acesso corretamente no código.

## Configuração do Banco de Dados

O código inicia configurando uma conexão com o banco de dados PostgreSQL. Para configurar a conexão, você deve editar as informações de conexão no seguinte trecho de código:

```javascript
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'db_horario_escolar2',
    password: '12345',
    port: 5433,
});
```

Certifique-se de que as informações (usuário, host, banco de dados, senha e porta) estejam corretas de acordo com a sua instalação do PostgreSQL.

## Leitura do Arquivo JSON

O código lê um arquivo JSON chamado 'BD.json' usando o módulo 'fs' do Node.js. O caminho do arquivo pode ser especificado como o primeiro argumento na função `fs.readFile`. O código verifica se a leitura do arquivo foi bem-sucedida e, em seguida, faz o parse do conteúdo JSON.

```javascript
fs.readFile('BD.json', 'utf8', (err, data) => {
    // ...
});
```

Certifique-se de que o arquivo 'BD.json' exista no mesmo diretório do código ou ajuste o caminho conforme necessário.

## Operações no Banco de Dados

O código realiza várias operações no banco de dados:

1. Exclui tabelas existentes, se houver, usando queries SQL DROP TABLE.

2. Cria tabelas no banco de dados usando queries SQL CREATE TABLE.

3. Cria uma tabela principal chamada 'tabela_main' com colunas que fazem referência a outras tabelas criadas anteriormente.

4. Insere dados nas tabelas do banco de dados com base nos dados do arquivo JSON.

5. Mantém dicionários temporários para rastrear valores únicos ao inserir dados nas tabelas.

O código utiliza consultas SQL parametrizadas para inserir dados nas tabelas.

## Estrutura das Tabelas

O código cria as seguintes tabelas no banco de dados:

- `turma`: Armazena informações sobre turmas.
- `horario`: Armazena informações sobre horários.
- `disciplina`: Armazena informações sobre disciplinas.
- `professores`: Armazena informações sobre professores.
- `salas`: Armazena informações sobre salas (opcional).
- `dia`: Armazena informações sobre dias da semana.
- `tabela_main`: Tabela principal que relaciona informações de turma, horário, disciplina, professor, sala (se aplicável) e dia.

As tabelas são relacionadas por chaves estrangeiras para manter a integridade referencial.

## Inserção de Dados

O código lê os dados do arquivo JSON e os insere nas tabelas do banco de dados, garantindo que valores únicos sejam mantidos nos dicionários temporários para evitar duplicatas. Os dados são inseridos na tabela principal 'tabela_main', referenciando as chaves primárias das tabelas relacionadas.

## Execução

Para executar o código, certifique-se de ter atendido aos pré-requisitos e edite as configurações de conexão com o banco de dados, se necessário. Em seguida, execute o código JavaScript.

Após a execução bem-sucedida, os dados do arquivo JSON serão inseridos nas tabelas do banco de dados PostgreSQL.

Este documento fornece uma visão geral da funcionalidade do código JavaScript. Certifique-se de compreender os detalhes específicos do seu ambiente e requisitos antes de executá-lo.
