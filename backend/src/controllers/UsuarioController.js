const usuarioService = require('../services/UsuarioService')

const cadastrar = async (req, res) => {
  try {
    const { nome, email, senha } = req.body
    const usuario = await usuarioService.criarUsuario({nome, email, senha})
    console.log(usuario)
    return res.status(200).json(usuario)
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno' })
  }
}

const login = async (req, res) => {
  try {
    const { email, senha } = req.body

    const dadosAutentificados = await usuarioService.autenticarUsuario({email, senha})

    res.status(200).json(dadosAutentificados)

  } catch (error) {

    res.status(500).json({ erro: 'erro interno'})

  }
}

const recuperarSenha = async (req, res) => {
  try {
    const {email} = req.body
    const recuperar = await usuarioService.recuperarSenha({email})
      res.status(200).json(recuperar)
  } catch (error) {
    res.status(500).json({ erro: 'erro interno'})
  }
}

module.exports = { cadastrar, login, recuperarSenha }