//Importação de módulo express para fazer as rotas
const express = require('express')
const mongoose = require('mongoose')
const connectDB = require('../config/db')
const moment = require('moment')
const patientRoute = express.Router()
const Paciente = require('../models/Patient')
const {isAdmin} = require('../helpers/isAdmin')

//Conectando ao banco de dados
    connectDB()

//Rotas
    // patientRoute.get('/register-patient', (req, res) => {
    //     res.render('admin/home')
    // })
    patientRoute.post('/home', isAdmin, (req, res) => {
        //Pegando dados de paciente do forms
            const {nomePaciente, nomeSocial, dataNascimento, genero, cpf, phone, sus, rua, cidade, numlocal, estado, cep} = req.body

        //Criando novo paciente
            const formateddate = moment(dataNascimento).format('YYYY-MM-DD')
            
            new Paciente({
                nomePaciente: nomePaciente,
                nomeSocial: nomeSocial,
                dataNascimento: formateddate,
                genero: genero,
                cpf: cpf,
                phone: phone,
                sus: sus,
                rua: rua,
                cidade: cidade,
                numlocal: numlocal,
                estado: estado,
                cep: cep
            }).save().then(() => {
                req.flash('success_msg', 'Paciente cadastrado com sucesso!')
                res.redirect('/admin/home')
            }).catch((error) => {
                req.flash('error_msg', 'Houve um erro ao tentar cadastrar o paciente, tente novamente!')
                res.redirect('/admin/home')
            })
    })

//Exportando rota
module.exports = patientRoute

