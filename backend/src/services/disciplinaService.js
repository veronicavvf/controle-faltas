const prisma = require('../prisma')

const criarDisciplinas = async ({ nomeDisciplina, totalAulas, percentualMinimo }, usuarioId) => {
    //validar se temos todos os dados de entrada
    if (!nomeDisciplina || !totalAulas || !percentualMinimo || !usuarioId) {
        const error = new Error('Preencha todos os campos!')
        error.statusCode = 400
        throw error
    }

    const limiteFaltas = Math.floor((totalAulas * percentualMinimo) / 100)

    const disciplina = await prisma.disciplina.create({
        data: {
            nomeDisciplina,
            totalAulas,
            limiteFaltas,
            usuarioId
        },
    })
    return disciplina

}

const list = async (usuarioId) => {
    const disciplinas = await prisma.disciplina.findMany({
        where: {
            usuarioId: usuarioId
        },
        select: {
            id: true,
            nomeDisciplina: true,
            totalAulas: true,
            limiteFaltas: true,
            faltas: true
        }
    })

    return disciplinas
}


const apagarDisciplina = async ({ disciplinaId }, usuarioId) => {
    const disciplina = await prisma.disciplina.findUnique({
        where: {
            id: disciplinaId
        }
    })

    if (!disciplina || disciplina.usuarioId !== usuarioId) {
        const error = new Error('Disciplina não encontrada ou você não tem autorização para apagar')
        error.statusCode = 400
        throw error
    }

    await prisma.disciplina.delete({
        where: {
            id: disciplinaId
        }
    })
    return { message: 'Disciplina deletada com sucesso.' }
}

module.exports = { criarDisciplinas, list, apagarDisciplina }