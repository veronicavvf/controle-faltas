const prisma = require('../prisma');

const registrarFalta = async ({ disciplinaId, quantidade, usuarioId }) => {
  if (!disciplinaId || !quantidade) {
    throw new Error('ID da disciplina e quantidade de faltas são obrigatórios.');
  }

  const disciplina = await prisma.disciplina.findUnique({
    where: { id: disciplinaId }
  });

  if (!disciplina || disciplina.usuarioId !== usuarioId) {
    throw new Error('Disciplina não encontrada ou não pertence a você.');
  }

  const novaFalta = await prisma.falta.create({
    data: {
      disciplinaId,
      quantidade,
    }
  });

  const agregacao = await prisma.falta.aggregate({
    where: { disciplinaId },
    _sum: { quantidade: true }
  });

  const totalFaltas = agregacao._sum.quantidade || 0;
  const faltasRestantes = disciplina.limiteFaltas - totalFaltas;

  let status = 'Seguro';
  if (totalFaltas > disciplina.limiteFaltas) {
    status = 'Reprovado por falta';
  } else if (faltasRestantes <= 4) {
    status = 'Alerta: Muito próximo do limite!';
  }

  // Devolve a falta registrada junto com o painel atualizado da matéria
  return {
    faltaRegistrada: novaFalta,
    resumo: {
      faltasAcumuladas: totalFaltas,
      faltasRestantes,
      status
    }
  };
};

module.exports = { registrarFalta };