const prisma = require('../prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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

const recuperarSenha = async ({email}) => { //para este service usaremos o nodemailer

}

module.exports = { criarUsuario, autenticarUsuario, recuperarSenha }

