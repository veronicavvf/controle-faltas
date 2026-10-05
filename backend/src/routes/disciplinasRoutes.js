const { Router } = require('express')
const disciplinas = require('../controllers/disciplinasController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = Router()

router.post('/criar', 
    authMiddleware,
    disciplinas.criarDisciplina
)

router.get('/list',
    authMiddleware,
    disciplinas.listagemDisciplinas
)

router.delete('/apagarDisciplina/:disciplinaId', 
    authMiddleware,
    disciplinas.apagarDisciplina
)

module.exports = router