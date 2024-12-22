//Importando módulos para a rota de dados do usuário
const express = require('express')
const perfilData = express.Router()
const user = require('../models/User')

//Rotas
    perfilData.get('/perfilUser', (req, res) => { 
        if (!req.user) {
            return res.redirect('/admin/login');
        }
       //Acessando dados do usuário
        const {nome, nomeuser, email, role} = req.user
        res.render('admin/perfilUser', {
            nome: nome,
            nomeuser: nomeuser,
            email: email,
            role: role,
        })
    })
    
//Exportando a rota
module.exports = perfilData