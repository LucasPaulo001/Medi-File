//Importando módulos para a rota de dados do usuário
const express = require('express')
const perfilData = express.Router()
const user = require('../models/User')

//Rotas
    perfilData.get('/perfilUser', (req, res) => { 
        if (!req.user) {
            return res.redirect('/admin/login');  // Redireciona para o login se não estiver autenticado
        }
    
        // Acessando o nome do usuário
        const nomeUser = req.user.nomeuser || 'Usuário não encontrado';
        res.render('admin/perfilUser', { nomeUser: nomeUser })
    })
    
//Exportando a rota
module.exports = perfilData