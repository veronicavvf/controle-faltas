const prisma = require('../prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { sendMail } = require('../../config/mailer')
const port = process.env.PORT || 3001

const criarUsuario = async ({ nome, email, senha }) => {

  if (!nome || !email || !senha){
    const error = new Error('preencha os campos obrigatorios')
    error.statusCode = 400
    throw error
  }

  const usuarioExiste = await prisma.usuario.findUnique({ where: { email } })
  if (usuarioExiste) throw new Error('E-mail já cadastrado.')

  const senhaHash = await bcrypt.hash(senha, 8) //aqui não foi realizado uma validação para senha forte, uma melhoria a se fazer

  return await prisma.usuario.create({
    data: { nome, email, senhaHash },
    select: { id: true, nome: true, email: true },
  })
}

const autenticarUsuario = async ({ email, senha }) => {
  console.log(email, senha)
  if (!email || !senha){
    const error = new Error('E-mail e senha são obrigatórios.')
    error.statusCode = 400
    throw error
  }

  const usuario = await prisma.usuario.findUnique({ where: { email } })
  if (!usuario) {
    const error = new Error('E-mail não encontrado')
    error.statusCode = 400
    throw error
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senhaHash)
  if (!senhaValida){
    const error = new Error('Senha incorreta')
    error.statusCode = 401
    throw error
  }

  const token = jwt.sign(
    { id: usuario.id, nome: usuario.nome }, //payload
    process.env.JWT_SECRET, //assinatura
    { expiresIn: '1h' } //duração do token
  )

  return {
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    token
  }
}

const requestReset = async ({ email }) => { //para este service usaremos o nodemailer
  if (!email) {
    const error = new Error('E-mail é obrigatório.')
    error.statusCode = 400
    throw error
  }

  const user = await prisma.usuario.findUnique({ where: { email } })

  if (!user) {
    const error = new Error('Usuario não encontrado')
    error.statusCode = 400
    throw error
  }

  const token = crypto.randomBytes(32).toString("hex")


  const horarioExpirado = new Date(Date.now() + 1000 * 60 * 15)



  await prisma.ResetSenha.create({
    data: {
      token: token,
      usuarioId: user.id,
      horarioExpirado
    }
  })


  await sendMail(
    user.email,
    "Redefinição de Senha",
    `
    <h2> Olá, ${user.nome} </h2>
    <p> Você solicitou a redefinição de senha. Clique no link abaixo para redefinir: </p>
    <a href="http://localhost:${port}/api/auth/resetSenha/${token}">
     Redefinir senha </a>
     <p> Esse link expira em 15 minutos. </p>
    `
  )

  return { message: "E-mail de redefinição enviado com sucesso!" }

}

const recuperarSenha = async ({ novaSenha, token }) => {
  const resetToken = await prisma.ResetSenha.findUnique({ where: { token } })
  if (!resetToken || resetToken.horarioExpirado < new Date()) {
    const error = new Error('token invalido ou expirado')
    error.statusCode = 401
    throw error
  }

  const hashedPassword = await bcrypt.hash(novaSenha, 10)

  await prisma.usuario.update({
    where: { id: resetToken.usuarioId },
    data: { senhaHash: hashedPassword },
  })

  const removeToken = await prisma.ResetSenha.delete({ where: { id: resetToken.id } })

  return removeToken

}

module.exports = { criarUsuario, autenticarUsuario, requestReset, recuperarSenha }

