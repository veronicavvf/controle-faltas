const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  // O token costuma ser enviado no cabeçalho de 'authorization' da requisição
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ erro: 'Token não fornecido.' })
  }

  const partes = authHeader.split(' ')
  
  if (partes.length !== 2) {
    return res.status(401).json({ erro: 'Erro de formatação do token.' })
  }

  const [esquema, token] = partes

  if (!/^Bearer$/i.test(esquema)) {
    return res.status(401).json({ erro: 'Token mal formatado.' })
  }

  try {
    // Verifica se o token foi assinado com a NOSSA chave secreta
    const payloadDecodificado = jwt.verify(token, process.env.JWT_SECRET)
    
    // Se deu certo, extraímos o ID do usuário de dentro do token e injetamos
    // no objeto 'req' para que o Controller da disciplina saiba de quem é o id
    req.usuarioId = payloadDecodificado.id

    // O next() avisa ao Express: "Pode deixar passar para o Controller!"
    return next()
  } catch (error) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' })
  }
}

module.exports = authMiddleware