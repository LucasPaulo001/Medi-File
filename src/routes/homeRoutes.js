//Importando módulos
const express = require('express')
const homeRout = express.Router()
const User = require('../models/User')

//Criando rota de tela inicial (Home)
homeRout.get('/home', (req, res) => {
    //Pegando os valores de sessão no ato do login
    if (req.session.foundUser) {
        res.render('admin/home', { user: req.session.foundUser});
    } else {
        res.redirect('/admin/login')
    }
})

//Exportando a rota
module.exports = homeRout
