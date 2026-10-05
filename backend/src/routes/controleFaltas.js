const { Router } = require('express')
const falta = require('../controllers/controleFaltasController')
const authMiddleware = require('../middlewares/authMiddleware')


const router = Router()

router.post('/',
    authMiddleware,
    falta.registrar
)

module.exports = router