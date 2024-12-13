//Importando módulos
const express = require('express')
const homeRout = express.Router()

//Criando rota de tela inicial (Home)
homeRout.get('/home', (req, res) => {
    res.render('admin/home')
})

module.exports = homeRout
