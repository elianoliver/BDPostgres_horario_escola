const { Pool } = require('pg'); // Importa o módulo pg
const fs = require('fs'); // Importa o módulo fs para leitura de arquivos


// ======================= CONFIGURAÇÃO BD ================
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'db_horario_escolar2',
    password: '12345',
    port: 5433,
});

// ======================= LENDO JSON =====================

// Lendo o arquivo JSON
fs.readFile('BD.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Erro ao ler o arquivo JSON:', err);
        return;
    }

    // Parseando o conteúdo do arquivo JSON
    try {
        const json = JSON.parse(data);

        inserirDados(json);

    } catch (error) {
        console.error('Erro ao fazer o parse do JSON:', error);
    }
});

// ======================= CÓDIGO =========================

async function inserirDados(jsonData) {
    let result // função de execução de tarefas

    // ---------- EXCLUINDO TABELAS ---------------------
    const deleteQueries = [
        'DROP TABLE IF EXISTS tabela_main CASCADE',
        'DROP TABLE IF EXISTS turma',
        'DROP TABLE IF EXISTS horario',
        'DROP TABLE IF EXISTS disciplina',
        'DROP TABLE IF EXISTS professores',
        'DROP TABLE IF EXISTS salas',
        'DROP TABLE IF EXISTS dia',
    ];

    for (const query of deleteQueries) {
        result = await pool.query(query);
        console.log(`Tabelas excluídas com sucesso: ${query}`);
    }

    // ----------- CRIANDO TABELAS ------------------------
    const createTable = [
        'CREATE TABLE IF NOT EXISTS turma (id SERIAL PRIMARY KEY, turma TEXT)',
        'CREATE TABLE IF NOT EXISTS horario (id SERIAL PRIMARY KEY, horaInicio TEXT, horaFim TEXT)',
        'CREATE TABLE IF NOT EXISTS disciplina (id SERIAL PRIMARY KEY, disciplina TEXT)',
        'CREATE TABLE IF NOT EXISTS professores (id SERIAL PRIMARY KEY, professor TEXT)',
        'CREATE TABLE IF NOT EXISTS salas (id SERIAL PRIMARY KEY, sala TEXT)',
        'CREATE TABLE IF NOT EXISTS dia (id SERIAL PRIMARY KEY, dia TEXT)',
    ];

    for (const query of createTable) {
        result = await pool.query(query);
        console.log(`Tabelas criadas com sucesso: ${query}`);
    }

    // ----------- CRIANDO TABELA PRINCIPAL ------------------------
    const createMainTable = `
        CREATE TABLE IF NOT EXISTS tabela_main (
            id SERIAL PRIMARY KEY,
            turma_id int,
            horario_id int,
            disciplina_id int,
            professor_id int,
            sala_id int,
            dia_id int,

            FOREIGN KEY (turma_id) REFERENCES turma(id),
            FOREIGN KEY (horario_id) REFERENCES horario(id),
            FOREIGN KEY (disciplina_id) REFERENCES disciplina(id),
            FOREIGN KEY (professor_id) REFERENCES professores(id),
            FOREIGN KEY (sala_id) REFERENCES salas(id),
            FOREIGN KEY (dia_id) REFERENCES dia(id)
        )`;
    await pool.query(createMainTable);
    console.log(`Tabela principal criada com sucesso: ${createMainTable}`);

    // ----------- INSERINDO TABELA ------------------------
    // Dicionários temporários para rastrear valores únicos
    const uniqueTurmas = {};
    const uniqueHorarios = {};
    const uniqueDisciplinas = {};
    const uniqueProfessores = {};
    const uniqueSalas = {};
    const uniqueDias = {};

    let contTurma = 1;
    let contHorario = 1;
    let contDisciplina = 1;
    let contProfessor = 1;
    let contSala = 1;
    let contDia = 1;

    // Inserir dados
    for (const item of jsonData) {
        const turma = item["turma"];
        const horario = item["horario"];
        const disciplina = item["disciplina"];
        const professor = item["professores"];
        const sala = item["salas"] !== undefined ? item["salas"] : null;
        const dia = item["dia"];

        // Verificar se a turma já foi inserida
        if (!uniqueTurmas[turma]) {
            const turmaQuery = 'INSERT INTO turma (turma) VALUES ($1)';
            await pool.query(turmaQuery, [turma]);
            uniqueTurmas[turma] = contTurma++;
        }

        // Verificar se o horário já foi inserido
        if (!uniqueHorarios[horario]) {
            let horarioParts = item.horario.split(','); // Divide o valor pelo separador (vírgula)

            if (horarioParts.length === 2) {
                // Certificar-se de que existem duas partes após a divisão
                let horarioInicio = horarioParts[0].trim(); // Remove espaços em branco
                let horarioFim = horarioParts[1].trim();

                // Inserir horarioInicio e horarioFim nas colunas apropriadas
                const horarioQuery = 'INSERT INTO horario (horaInicio, horaFim) VALUES ($1, $2)';
                await pool.query(horarioQuery, [horarioInicio, horarioFim]);
                uniqueHorarios[horario] = contHorario++;
            }
        }

        // Verificar se a disciplina já foi inserida
        if (!uniqueDisciplinas[disciplina]) {
            const disciplinaQuery = 'INSERT INTO disciplina (disciplina) VALUES ($1)';
            await pool.query(disciplinaQuery, [disciplina]);
            uniqueDisciplinas[disciplina] = contDisciplina++;
        }

        // Verificar se o professor já foi inserido
        if (!uniqueProfessores[professor]) {

            const professorQuery = 'INSERT INTO professores (professor) VALUES ($1)';
            await pool.query(professorQuery, [professor]);
            uniqueProfessores[professor] = contProfessor++;
        }

        // Verificar se a sala já foi inserida
        if (sala !== null && !uniqueSalas[sala]) {
            const salaQuery = 'INSERT INTO salas (sala) VALUES ($1)';
            await pool.query(salaQuery, [sala]);
            uniqueSalas[sala] = contSala++;
        }

        // Verificar se o dia já foi inserido
        if (!uniqueDias[dia]) {
            const diaQuery = 'INSERT INTO dia (dia) VALUES ($1)';
            await pool.query(diaQuery, [dia]);
            uniqueDias[dia] = contDia++;
        }

        const tabela_main = {
            turma: uniqueTurmas[turma],
            horario: uniqueHorarios[horario],
            disciplina: uniqueDisciplinas[disciplina],
            professor: uniqueProfessores[professor],
            sala: sala !== null ? uniqueSalas[sala] : null,
            dia: uniqueDias[dia]
        };

        const insertMainQuery = 'INSERT INTO tabela_main (turma_id, horario_id, disciplina_id, professor_id, sala_id, dia_id) VALUES ($1, $2, $3, $4, $5, $6)';
        await pool.query(insertMainQuery, Object.values(tabela_main));

    }

    console.log(uniqueTurmas);
    console.log(uniqueHorarios);
    console.log(uniqueDisciplinas);
    console.log(uniqueProfessores);
    console.log(uniqueSalas);
    console.log(uniqueDias);

    console.log('Dados inseridos com sucesso.');
}
