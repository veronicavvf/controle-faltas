const disciplinaService = require('../services/disciplinaService')

const criarDisciplina = async (req, res) => {
  try {
    console.log("Body recebido do frontend:", req.body)
    const { nomeDisciplina, totalAulas, percentualMinimo } = req.body
    const usuarioId = req.usuarioId

    console.log('hi')
    const disciplinaCriada = await disciplinaService.criarDisciplinas(
      {
        nomeDisciplina,
        totalAulas,
        percentualMinimo},
        usuarioId
    )
    return res.status(200).json(disciplinaCriada)

  } catch (error) {
    console.log('hello')
    return res.status(500).json({ erro: error.message })
  }
}

const listagemDisciplinas = async (req, res) => {
  try {
    const usuarioId = req.usuarioId

    const list = await disciplinaService.list(usuarioId)

    return res.status(200).json(list)

  } catch (error) {
    return res.status(500).json({ erro: error.message })
  }
}

const apagarDisciplina = async (req, res) => {
  try {
    console.log('teste apagar',req.params)
    const {disciplinaId} = req.params
    const usuarioId = req.usuarioId

    const resultado = await disciplinaService.apagarDisciplina({disciplinaId}, usuarioId)

    return res.status(200).json(resultado)
  } catch (error) {
    return res.status(500).json({ erro: error.message })
  }
}

module.exports = { criarDisciplina, listagemDisciplinas, apagarDisciplina }