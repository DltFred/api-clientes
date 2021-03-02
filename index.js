const express = require('express')
const app = express()
const cors = require('cors')
const db = require('./mysqlConexion')

app.use(cors())
app.use(express.json())

const edad = (fecha) => {
  return Math.round((Date.now() - new Date(fecha).getTime()) / (1000 * 60 * 60 * 24 * 365))
}

const promedio = (clientes) => {
  let total = 0
  clientes.forEach(cliente => {
    total += edad(cliente.fechaNacim)
  })
  const promedio = (total / clientes.length).toFixed(2)
  return promedio
}

const varianza = (clientes) => {
  const prom = promedio(clientes)
  let total = 0
  clientes.forEach(cliente => {
    const eda = edad(cliente.fechaNacim)
    total += Math.pow(eda - prom, 2)
  })
  const varianza = total / clientes.length
  return varianza
}

const desviacionEstandar = (clientes) => {
  return Math.sqrt(varianza(clientes))
}

app.get('/listclientes', async (req, res) => {
  res.json(await db.query('select * from tb_clientes'))
})

app.get('/kpideclientes', async (req, res) => {
  const clientes = await db.query('select * from tb_clientes')
  const prom = promedio(clientes)
  const desv = desviacionEstandar(clientes)
  const kpi = { prom, desv }
  res.json(kpi)
})

app.post('/creacliente', async (req, res) => {
  const { nombre, apellido, fechaNacim } = req.body
  const newCliente = {
    nombre,
    apellido,
    fechaNacim
  }
  if (!newCliente || !newCliente.fechaNacim) {
    return res.status(400).json({
      error: 'cliente is missing'
    })
  }
  await db.query('insert into tb_clientes set ?', [newCliente])
  res.status(201).send('recived')
})

app.use((req, res) => {
  res.status(404).json({
    error: 'Not-found'
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
