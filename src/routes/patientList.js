//Inportando express
const express = require('express')
const patientList = express.Router()
const mongoose = require('mongoose')
const Paciente = require('../models/Patient')
//const isAdmin = require('../helpers/isAdmin')
const {isAdmin} = require('../helpers/isAdmin')

//Configuração de rota para listar pacientes
    //Autorização para administradores terem acesso à página
    patientList.get('/patientList', isAdmin, (req, res) => {
    //Pegando dados dos pacientes no banco
        Paciente.find().lean()
        .then((pacientes) => {
            res.render('admin/patientList', {pacientes})
        }).catch((error) => {
            res.status(500).send(`Erro ao listar pacientes ERRO: ${error}`)
        })
    })

    //Autorização para médicos terem acesso à rota
    // patientList.get('/medic/patientList', isMedico, (req, res) => {
    //     Paciente.find().lean()
    //     .then((pacientes) => {
    //         res.render('admin/patientList', {pacientes})
    //     }).catch((error) => {
    //         res.status(500).send(`Erro ao listar pacientes ERRO: ${error}`)
    //     })
    // })

    // //Autorização para enfermeiros terem acesso à rota
    // patientList.get('/enf/patientList', isEnfermeiro, (req, res) => {
    //     Paciente.find().lean()
    //     .then((pacientes) => {
    //         res.render('admin/patientList', {pacientes})
    //     }).catch((error) => {
    //         res.status(500).send(`Erro ao listar pacientes ERRO: ${error}`)
    //     })
    // })

    //Rota para editar dados dos pacientes
    patientList.get('/patientList/edit/:id', (req, res) => {
        Paciente.findOne({_id: req.params.id}).lean().then((dados) => {
            res.render('admin/editPatient', {dados: dados})
        }).catch(() => {
            req.flash('error_msg', 'O paciente não existe!')
            res.redirect('/admin/patientList')
        })
    })

    //Enviando os dados da edição para os dados do banco
    patientList.post('/patientList/edit', isAdmin, (req, res) => {
        Paciente.findOne({_id: req.body.id}).then((dados) => {
            dados.nomePaciente = req.body.nomePaciente
            dados.nomeSocial = req.body.nomeSocial
            dados.dataNascimento = req.body.dataNascimento
            dados.genero = req.body.genero
            dados.cpf = req.body.cpf
            dados.phone = req.body.phone
            dados.sus = req.body.sus
            dados.rua = req.body.rua
            dados.cidade = req.body.cidade
            dados.numlocal = req.body.numlocal
            dados.estado = req.body.estado
            cep = req.body.cep

            dados.save().then(() => {
                req.flash('success_msg', 'Dados do paciente editados com sucesso!')
                res.redirect('/admin/patientList')
            }).catch(() => {
                req.flash('error_msg', 'Erro ao editar Dados')
                res.redirect('/admin/patientList')
            })
        }).catch(() => {
            
        })
    })

    //Rota para deletar dados de pacientes
    patientList.post('/patientList' ,(req, res) => {
        //Filtrando a id do paciente no banco de dados
        Paciente.deleteOne({_id: req.body.id}).then(() => {
            req.flash('success_msg', 'Dados do paciente deletados com sucesso!')
            res.redirect('/admin/patientList')
        }).catch((error) => {
            req.flash('error_msg', 'Houve um erro ao deltar dados do paciente!')
            res.redirect('/admin/patientList')
        })
    })

    //Rota geral que abrange todas, para a implementação no forms
    // patientList.get('/redirectPatientList', (req, res) => {
    //     if(req.session.role === 'admin'){
    //         return res.render('/adm/patientList')
    //     }
    //     if(req.session.role === 'medico'){
    //         return res.render('/medic/patientList')
    //     }
    //     if(req.session.role === 'enfermeiro'){
    //         return res.render('/enf/patientList')
    //     }
    //     return res.status(403).send('Acesso negado. Você não tem permissão para acessar essa página.')
    // })

//Exportando rota
module.exports = patientList
