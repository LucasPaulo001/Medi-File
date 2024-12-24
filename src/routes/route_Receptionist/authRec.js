const express = require('express')
const routeRec = express.Router()
const Paciente = require('../../models/Patient')

//Rota de renderização do menu principal
routeRec.get('/home', (req, res) => {
    res.render('rec/home')
})

//Rota de listagem de pacientes
routeRec.get('/patientList', (req, res) => {
    Paciente.find().lean().then((pacientes) => {
        res.render('rec/patientList', {pacientes})
    })
})

//Rota para editar dados dos pacientes
routeRec.get('/patientList/edit/:id', (req, res) => {
    Paciente.findOne({_id: req.params.id}).lean().then((dados) => {
        res.render('rec/editPatient', {dados: dados})

    }).catch(() => {
        req.flash('error_msg', 'O paciente não existe!')
        res.redirect('/rec/patientList')
    })
})

//Enviando os dados da edição para os dados do banco
routeRec.post('/patientList/edit', (req, res) => {
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
            res.redirect('/rec/patientList')
        }).catch(() => {
            req.flash('error_msg', 'Erro ao editar Dados')
            res.redirect('/rec/patientList')
        })
    }).catch(() => {
        req.flash('error_msg', 'Erro ao salvar dados')
        res.redirect('/rec/home')
    })
})

//Rota para deletar dados de pacientes
routeRec.post('/patientList' ,(req, res) => {
    //Filtrando a id do paciente no banco de dados
    Paciente.deleteOne({_id: req.body.id}).then(() => {
        req.flash('success_msg', 'Dados do paciente deletados com sucesso!')
        return res.redirect('/rec/patientList')

    }).catch((error) => {
        console.log(error)
        req.flash('error_msg', 'Houve um erro ao deltar dados do paciente!')
        res.redirect('/admin/patientList')
    })
})

module.exports = routeRec
