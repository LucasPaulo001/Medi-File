const express = require('express')
const user = require('../../models/User')
const defaultRoute = express.Router()
const Patient = require('../../models/Patient')

//Rota de configurações comum para todos os usuários
defaultRoute.get('/settingAccount', (req, res) => {
    res.render('page/settingAccount')
})

//Rota de busca de usuários
defaultRoute.get('/searchPatients', (req, res) => {
    const query = req.query.q || ''

    const regex = new RegExp(query, 'i')

    Patient.find({nomePaciente: {$regex: regex}})
    .then(users => {
        //console.log('Resultado da busca:', users)
        console.log('query' + query)
        res.render('page/patientSerach', {users, query, hasResults: users.length > 0})
    }).catch((error) => {
        console.log(`Erro: ${error}`)
        req.flash('error_msg', 'Erro ao buscar paciente')
        return res.redirect(req.get('Referrer') || '/');
    })
    
})

module.exports = defaultRoute