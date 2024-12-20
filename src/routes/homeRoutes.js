//Importando módulos
const express = require('express')
const homeRout = express.Router()
const User = require('../models/User')
const Professional = require('../models/Professional')
const nodemailer = require('nodemailer')


//Criando rota de tela inicial (Home)
homeRout.get('/home', (req, res) => {
    //Pegando os valores de sessão no ato do login
    if (req.session.foundUser) {
        res.render('admin/home', { user: req.session.foundUser})
    }
    else {
        res.redirect('/admin/login')
    }
})

//Criando rota de faq
homeRout.get('/faq', (req, res) => {
    res.render('admin/faq')
})

//Criando rota de ajuda
homeRout.get('/help', (req, res) => {
    res.render('admin/help')
})

homeRout.post('/help', (req, res) => {
    const {nome, email, mensagem} = req.body

    let erros = []
    //validação de informações
    if(!nome || !email || !mensagem){
        erros.push({text: 'Campos não preenchidos!'})
    }
    console.log(`${nome}\n${email}\n${mensagem}`)
    //Se houver erros, emitir mensagem na tela
    if(erros.length > 0){
        res.render('admin/help', {erros})
    }
    //Configuração do transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'lp152659@gmail.com',
            pass: 'hrikzgmkkopojyos'
        }
    })
    //Configurando conteúdo do email
    const mailOption = {
        from: email,
        to: 'lp152659@gmail.com',
        subject: `Mensagem de ${nome}`,
        text: `Você recebeu uma mensagem de ${nome} (${email}\n\n${mensagem})`
    }
    //Configurando envio
    transporter.sendMail(mailOption)
    .then(() => {
        req.flash('success_msg', 'Mensagem enviada com sucesso!')
        return res.redirect('/admin/help')
    }).catch((error) => {
        req.flash(`error_msg', 'Houve um erro ao enviar mensagem ERRO: ${error}`)
        return res.redirect('/admin/help')
    })
})

//Exportando a rota
module.exports = homeRout
