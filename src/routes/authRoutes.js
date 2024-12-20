//Inportação do express e atribuição da função Router
const express = require('express')
const routerAuth = express.Router()
const connectDB = require('../config/db')
const mongoose = require('mongoose')
const user = require('../models/User')
const Professional = require('../models/Professional')
const session = require('express-session')
const bcrypt = require('bcrypt')
const professionals = require('./authProfessionals')

//Função de conexão ao mongoose
connectDB()

//Rota de login renderização de página
routerAuth.get('/login', (req, res) => {
    res.render('admin/login')
})

//Rota de login autenticação de dados para login
routerAuth.post('/login', (req, res) => {

    //Pegando dados do formulário
    const {email, password} = req.body
    let erros = []

    //Configuração de middlware para informar os erros
    if(!email && typeof email == undefined || email == null){
        erros.push({text: 'E-mail inválido!'})
    }

    if(!password && typeof password == undefined || password == null){
        erros.push({text: 'Senha inválida!'})
    }
    if(erros.length > 0){
        res.render('admin/login', {erros})
    }
    console.log(erros)
    //Buscando dados do email para a autenticação
    user.findOne({email:email}).then(foundUser => {

        //Verificando se o usuário está no banco de dados
        if (!foundUser) {
            req.flash('error_msg', 'Usuário não encontrado')
            return res.redirect('/admin/login')
        }
        
        //Comparando a senha hash com a senha no hash
        bcrypt.compare(password, foundUser.password, (error, isMatch) => {

            if(error) throw error
        
            //verifica a comparação
            if(isMatch){
                req.session.foundUser ={
                    nome: foundUser.nome,
                    nomeuser: foundUser.nomeuser,
                    role: foundUser.role,
                    email: foundUser.email
                }
                //Se a comparação for bem sucedida redireciona para a tela inicial
                req.flash('success_msg', 'Login feito com sucesso')
                return res.redirect('/admin/home')
            }
            else {
                // Senha incorreta
                req.flash('error_msg', 'Senha incorreta!')
                return res.redirect('/admin/login')
            }
        })
        
    }).catch(error => {
       req.flash('error_msg', 'Erro ao tentar fazer login')
       return res.redirect('/admin/login')
    })
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
