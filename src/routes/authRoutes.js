//Inportação do express e atribuição da função Router
const express = require('express')
const routerAuth = express.Router()
const connectDB = require('../config/db')
const mongoose = require('mongoose')
const user = require('../models/user')
const bcrypt = require('bcrypt')

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

    //Buscando dados do email para a autenticação
    user.findOne({email:email}).then(foundUser => {
        if (!foundUser) {
            return res.status(400).send('Usuário não encontrado');
        }
        //Comparando a senha hash com a senha no hash
        bcrypt.compare(password, foundUser.password, (error, isMatch) => {
            if(error) throw error

            //verifica a comparação
            if(isMatch){
                //Se a comparação for bem sucedida redireciona para a tela inicial
                res.redirect('/admin/home')
            }
            else {
                // Senha incorreta
                res.status(400).send('Senha incorreta');
            }
        })
    }).catch(error => {
        res.status(500).send('Erro no servidor');
    })
})

//Rota de registro
routerAuth.get('/register', (req, res) => {
    res.render('admin/register')
})

//Rota de registro autenticação de dados para registro
routerAuth.post('/register', (req, res) => {
    //Pegando dados do formulário
    const {nome, email, password, role} = req.body

    //Validando formulário
    if(!nome || !email  || !password || !role){
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
            email: email,
            password: hashedPassword,
            role
        }).save().then(() => {
            console.log('Usuário cadastrado com sucesso!')
        }).catch((error) => {
            console.log(`Erro ao cadastrar usuario ERRO: ${error}`)
        })
        res.render('admin/register')
    })
})

module.exports = routerAuth
