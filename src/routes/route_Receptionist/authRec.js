const express = require('express')
const routeRec = express.Router()
const Pacientes = require('../../models/Patient')

routeRec.get('/home', (req, res) => {
    res.render('rec/home')
})

routeRec.get('/patientList', (req, res) => {
    Pacientes.find().lean().then((pacientes) => {
        res.render('rec/patientList', {pacientes})
    })
})

module.exports = routeRec
