//Inportando express
const express = require('express')
const patientList = express.Router()
const mongoose = require('mongoose')
const Paciente = require('../models/Patient')
const { isAdmin, isEnfermeiro, isMedico } = require('../config/permissions')

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
    patientList.get('/medic/patientList', isMedico, (req, res) => {
        Paciente.find().lean()
        .then((pacientes) => {
            res.render('admin/patientList', {pacientes})
        }).catch((error) => {
            res.status(500).send(`Erro ao listar pacientes ERRO: ${error}`)
        })
    })

    //Autorização para enfermeiros terem acesso à rota
    patientList.get('/enf/patientList', isEnfermeiro, (req, res) => {
        Paciente.find().lean()
        .then((pacientes) => {
            res.render('admin/patientList', {pacientes})
        }).catch((error) => {
            res.status(500).send(`Erro ao listar pacientes ERRO: ${error}`)
        })
    })

    //Rota geral que abrange todas, para a implementação no forms
    patientList.get('/redirectPatientList', (req, res) => {
        if(req.session.role === 'admin'){
            return res.render('/adm/patientList')
        }
        if(req.session.role === 'medico'){
            return res.render('/medic/patientList')
        }
        if(req.session.role === 'enfermeiro'){
            return res.render('/enf/patientList')
        }
        return res.status(403).send('Acesso negado. Você não tem permissão para acessar essa página.')
    })

//Exportando rota
module.exports = patientList
