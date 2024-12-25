const express = require('express')
const routePro = express.Router()
const proData = require('../../models/Professional')
const User = require('../../models/User')
const {isAdmin} = require('../../helpers/isAdmin')

//Criando rota de listagem de profissionais
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

//Criando rota de remoção de profissional
routePro.post('/listPro', (req, res) => {
    proData.deleteOne({_id: req.body.id}).lean().then(() => {
        User.deleteOne({_id: req.body.userId}).lean().then(() => {
            req.flash('success_msg', 'Profissional deletado e acesso removido com sucesso!')
            return res.redirect('/admin/home')
        })
    }).catch(() => {
        req.flash('error_msg', 'Erro ao deletar profissional, por favor tente novamente!')
    })

    //Deletando o acesso ao sistema do profissional
    User.deleteOne({_id: req.body.userId}).lean().then(() => {
        req.flash('success_msg', 'Profissional com acesso removido do sistema!')
        res.redirect('/admin/home')
    }).catch(() => {
        req.flash('error_msg', 'Erro ao deletar profissional, por favor tente novamente!')
        res.redirect('/admin/home')
    })
})


//Exportando rota
module.exports = routePro