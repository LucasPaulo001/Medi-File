//Importação de módulo express para fazer as rotas
const express = require('express')
const mongoose = require('mongoose')
const connectDB = require('../../config/db')
const dayjs = require('dayjs')
const patientRoute = express.Router()
const Paciente = require('../../models/Patient')
const {isAdmin} = require('../../helpers/isAdmin')
const User = require('../../models/User')
const user = require('../../models/User')

//Conectando ao banco de dados
    connectDB()

//Rotas
    // patientRoute.get('/register-patient', (req, res) => {
    //     res.render('admin/home')
    // })
    patientRoute.post('/home', (req, res) => {
        //Pegando dados de paciente do forms
            const {nomePaciente, nomeSocial, dataNascimento, genero, cpf, phone, sus, rua, cidade, numlocal, estado, cep} = req.body

        //Criando novo paciente
            const formatedDate = dayjs(dataNascimento).format('YYYY-MM-DD')
            
            new Paciente({
                nomePaciente: nomePaciente,
                nomeSocial: nomeSocial,
                dataNascimento: formatedDate,
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
                const {role} = req.user

                const redirectRole = {
                    admin: '/admin/home',
                    enfermeiro: '/enf/home_Nurse',
                    recepcionista: '/rec/home'
                }
                req.flash('success_msg', 'Paciente cadastrado com sucesso!');
                return res.redirect(redirectRole[role] || '/');

            }).catch((error) => {
                req.flash('error_msg', 'Houve um erro ao tentar cadastrar o paciente, tente novamente!')
                res.redirect('back')
            })
    })

//Exportando rota
module.exports = patientRoute

