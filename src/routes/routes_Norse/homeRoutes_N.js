const express = require('express')
const routerHomeN = express.Router()
const user = require('../../models/User')
const {isNorse} = require('../../helpers/isNorse')
const Pacientes = require('../../models/Patient')

//Rota de home para o enfermeiro
routerHomeN.get('/home', isNorse, (req, res) => {
    const { role } = req.user;
    user.findOne({ role: role }).then((enfermeiro) => {
        if (!enfermeiro) {
            req.flash('error_msg', 'Acesso negado!');
            return res.redirect('/admin/login');
        }
        // Passando req.user para o template
        res.render('enf/home_Nurse');
    })
})
//Rota de listagem de pacientes cadastrados no sistema
routerHomeN.get('/patientList', (req, res) => {
    Pacientes.find().lean().then((pacientes) => {
        res.render('enf/patientList', {pacientes})
    }).catch((error) => {
        req.flash('error_msg', 'Erro ao listar pacientes cadastrados')
        res.render('/enf/home')
    })
})

//Rota de faq para o enfermeiro
routerHomeN.get('/faq', (req, res) => {
    res.render('enf/faqEnf')
})


module.exports = routerHomeN
