const prisma = require('../prisma')

const criarDisciplinas = async ({ nomeDisciplina, totalAulas, percentualMinimo }, usuarioId) => {
    //validar se temos todos os dados de entrada
    console.log('usuaio', nomeDisciplina, totalAulas, percentualMinimo)
    if (!nomeDisciplina || !totalAulas || !percentualMinimo || !usuarioId) {
        throw new Error("preencha os campos!")
    }
    
    const limiteFaltas = Math.floor((totalAulas * percentualMinimo) / 100)
    console.log('limite', limiteFaltas)

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


const apagarDisciplina = async ({disciplinaId}, usuarioId) => {
    console.log("disciplinaId:", disciplinaId);
    console.log("usuarioId:", usuarioId);
    const disciplina = await prisma.disciplina.findUnique({
        where: {
            id: disciplinaId
        }
    })

    if (!disciplina || disciplina.usuarioId !== usuarioId) {
        throw new Error('Disciplina não encontrada ou você não tem permissão para deletá-la.');
    }

     await prisma.disciplina.delete({
        where: {
            id: disciplinaId
        }
    })
    return { message: 'Disciplina deletada com sucesso.'}
}

module.exports = { criarDisciplinas, list, apagarDisciplina }