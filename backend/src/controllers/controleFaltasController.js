const faltaService = require('../services/controleFaltasService');

const registrar = async (req, res) => {
  try {
    // Recebe apenas qual é a matéria e quantas aulas faltou
    const { disciplinaId, quantidade } = req.body;
    const usuarioId = req.usuarioId;

    const resultado = await faltaService.registrarFalta({
      disciplinaId,
      quantidade,
      usuarioId
    });

    console.log('teste', resultado)

    return res.status(201).json(resultado);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};

module.exports = { registrar };