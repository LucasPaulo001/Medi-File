//Importação de módulo express para fazer as rotas
const express = require('express')
const mongoose = require('mongoose')
const connectDB = require('../config/db')
const moment = require('moment')
const patientRoute = express.Router()
const Paciente = require('../models/Patient')

//Conectando ao banco de dados
    connectDB()

//Rotas
    // patientRoute.get('/register-patient', (req, res) => {
    //     res.render('admin/home')
    // })
    patientRoute.post('/home', (req, res) => {
        //Pegando dados de paciente do forms
            const {nomePaciente, dataNascimento, genero, cpf, phone, alergias} = req.body

        //Criando novo paciente
            const formateddate = moment(dataNascimento).format('YYYY-MM-DD')
            
            new Paciente({
                nomePaciente: nomePaciente,
                dataNascimento: formateddate,
                genero: genero,
                cpf: cpf,
                phone: phone,
                alergias: alergias
            }).save().then(() => {
                console.log('Paciente cadastrado com sucesso!')
                res.redirect('/admin/home')
            }).catch((error) => {
                console.log(`Houve um erro ao cadastrar paciente ERRO: ${error}`)
            })
    })

//Exportando rota
module.exports = patientRoute

