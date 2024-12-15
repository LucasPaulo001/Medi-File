//Importando módulos para a rota de dados do usuário
const express = require('express')
const perfilData = express.Router()
const User = require('../models/User')

//Rotas
    perfilData.get('/perfilUser', (req, res) => {
        if(req.session.foundUser){
            res.render('admin/perfilUser', {data: req.session.foundUser})
        }
        else{
            res.send('Erro ao requisitar dados')
        }
    })
    
//Exportando a rota
module.exports = perfilData