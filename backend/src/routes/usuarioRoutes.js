const { Router } = require('express')
const usuarioController = require('../controllers/UsuarioController')

const router = Router() //usado para separar as rotas e organizadas por funções 

router.post('/login',
    usuarioController.login
)

router.post('/cadastrar',
    usuarioController.cadastrar
)

router.post('/esqueceuSenha',
    usuarioController.requestReset
)

router.post('/resetarSenha/:token',
    usuarioController.recuperarSenha

)

router.put('/logout',
    usuarioController.login
)

module.exports = router