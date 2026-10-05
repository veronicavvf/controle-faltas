require('dotenv').config()

const express = require('express')
const path = require('path')
const cors = require('cors')

const usuarioRoutes = require('./routes/usuarioRoutes')
const disciplinaRoutes = require('./routes/disciplinasRoutes')
const controleFalta = require('./routes/controleFaltas')

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/usuarios', usuarioRoutes)
app.use('/api/disciplinas', disciplinaRoutes)
app.use('/api/faltas', controleFalta)

const distPath = path.join(__dirname, '../../frontend/dist')

console.log('DIST:', distPath)

app.use(express.static(distPath))

app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})

