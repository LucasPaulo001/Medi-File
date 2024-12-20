const express = require('express')
const routePro = express.Router()
const proData = require('../models/Professional')
const { isAdmin } = require('../config/permissions')


routePro.get('/listPro', isAdmin, (req, res) => {
    let erros = []
    proData.find().lean()
    .then((profissional) => {
        res.render('admin/listPro', {profissional})
    }).catch((error) => {
        erros.push({text: 'Erro ao listar proficionais!'})
        res.render('admin/home' , {erros})
    })
})


//Exportando rota
module.exports = routePro