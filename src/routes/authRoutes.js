//Inportação do express e atribuição da função Router
const express = require('express')
const routerAuth = express.Router()
const connectDB = require('../config/db')
const mongoose = require('mongoose')
const User = require('../models/User')
const Professional = require('../models/Professional')
const session = require('express-session')
const bcrypt = require('bcrypt')
const professionals = require('./authProfessionals')
const passport = require('passport')
const user = require('../models/User')

//Função de conexão ao mongoose
connectDB()

//Rota de login renderização de página
routerAuth.get('/login', (req, res) => {
    res.render('admin/login')
})

//Rota de login autenticação de dados para login
routerAuth.post('/login', (req, res, next) => {

    passport.authenticate('local', {
        successRedirect: "/admin/home",
        failureRedirect: "/admin/login",
        failureFlash: true
    })(req, res, next);
})

//Rota de registro
routerAuth.get('/register', (req, res) => {
    res.render('admin/register')
})

//Rota de registro autenticação de dados para registro
routerAuth.post('/register', (req, res) => {
    //Pegando dados do formulário
    const {nome, nomeuser, email, password, role} = req.body

    //Validando formulário
    if(!nome || !nomeuser || !email  || !password || !role){
        return res.status(400).send('Por favor, preencha todos os campos.');
    }
    //Criando user no banco de dados e fazendo a cryptografia de senha
    const saltRounds = 10
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        //Caso aconteça erro ao tentar fazer o hash
        if(err){
            console.log(`Erro ao gerar hash de senha: ${err}`);
            return res.status(500).send('Erro ao cadastrar usuário');
        }

        //Criando o usuário no banco de dados
        new user({
            nome: nome,
            nomeuser: nomeuser,
            email: email,
            password: hashedPassword,
            role: role
        }).save().then(() => {
            req.flash('success_msg', 'Usuário cadastrodo com sucesso!')
        }).catch((error) => {
            req.flash('error_msg', 'Erro ao cadastrar usuário!')
        })
        res.redirect('/admin/login')
    })
})

module.exports = routerAuth
