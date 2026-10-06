const { PrismaClient } = require('@prisma/client')
const prisma = require('../prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { sendMail } = require('../../config/mailer')

const criarUsuario = async ({ nome, email, senha }) => {

  if (!nome || !email || !senha) throw new Error('preencha os campos obrigatorios')

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
  if (!email || !senha) throw new Error('E-mail e senha são obrigatórios.')

  const usuario = await prisma.usuario.findUnique({ where: { email } })
  console.log("dados do usuario",usuario)
  if (!usuario) throw new Error('email não encontrado')

  const senhaValida = await bcrypt.compare(senha, usuario.senhaHash)
  if (!senhaValida) throw new Error('senha incorreta')

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

const requestReset = async ({email}) => { //para este service usaremos o nodemailer
  try {
    
    const user = await prisma.usuario.findUnique({where: {email}})
  
    if (!user) {
      return res.status(404).json({error: "Não foi encontrado uma conta com esse email"})
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
      <h2> Olá, ${user.name} </h2>
      <p> Você solicitou redefinição de senha. Clique no link abaixo para redefinir: </p>
      <a href= "http://localhost:${PORT}/api/auth/resetSenha/${token}">
       Redefinir senha </a>
       <p> Esse link expira em 15 minutos. </p>
      `
    )
  
    return res.json({message: "E-mail de redefinição enviado!"})
  } catch (error) {
    return res.status(500).json({error: "erro interno do servidor"})
  }

}

const recuperarSenha = async ({novaSenha, token}) => {
  const resetToken = await prisma.ResetSenha.findUnique({where: {token}})
  if (!resetToken || resetToken.horarioExpirado < new Date()) {
    throw new Error('token invalido ou expirado')
  }

  const hashedPassword = await bcrypt.hash(novaSenha, 10)

   await prisma.usuario.update({
    where: { id: resetToken.usuarioId },
    data: { senhaHash: hashedPassword },
  })

  const removeToken = await prisma.ResetSenha.delete({where: {id:resetToken.id}})

  return removeToken

}

module.exports = { criarUsuario, autenticarUsuario,requestReset,  recuperarSenha }

