//Inportação do express e atribuição da função Router
const express = require('express')
const routerAuth = express.Router()
const connectDB = require('../../config/db')
const mongoose = require('mongoose')
const User = require('../../models/User')
const Professional = require('../../models/Professional')
const session = require('express-session')
const bcrypt = require('bcrypt')
const professionals = require('./authProfessionals')
const passport = require('passport')
const user = require('../../models/User')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const { isNorse } = require('../../helpers/isNorse')
const routerHomeN = require('../routes_Norse/homeRoutes_N')

const isAdmin = require('../../helpers/isAdmin')
const { nextTick } = require('process')

//Função de conexão ao mongoose
connectDB()

//Rota de login renderização de página
routerAuth.get('/login', (req, res) => {
    res.render('admin/login')
    
})

// routerHomeN.get('/home', (req, res) => {
//     res.render('')
// })

//Rota de login autenticação de dados para login
routerAuth.post('/login', (req, res, next) => {
    const {email} = req.body
    user.findOne({email: email}).then((usuario) => {
        if(!usuario){
            req.flash('error_msg', 'O usuário não existe!')
            res.redirect('/admin/login')
        }
        if(usuario.role === 'enfermeiro'){
            console.log(usuario.role)
            passport.authenticate('local', {
                successRedirect: "/enf/home",
                failureRedirect: "/admin/login",
                failureFlash: true
            })(req, res, next)
        }
        else if(usuario.role === 'admin'){
            passport.authenticate('local', {
                successRedirect: "/admin/home",
                failureRedirect: "/admin/login",
                failureFlash: true
            })(req, res, next);
        }
        else if(usuario.role === 'recepcionista'){
            passport.authenticate('local', {
                successRedirect: "/rec/home",
                failureRedirect: "/admin/login",
                failureFlash: true
            })(req, res, next)
        }
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

//Rota para logout do sistema
routerAuth.get('/logout', (req, res, next) => {
    req.logout((error) => {
        if(error){
            return next(error)
        }
        req.flash('success_msg', 'Deslogado com sucesso!')
        res.redirect('/admin/login')
    })
})

routerAuth.get('/sendAttPass', (req, res) => {
    res.render('admin/sendAttPass')
})

routerAuth.post('/sendAttPass', (req, res) => {
    const {email} = req.body
    user.findOne({email: email}).then((usuario) => {
        if(!usuario){
            req.flash('error_msg', 'Usuário não Cadastrado no sistema')
            return res.redirect('/admin/login')
        }

        //Gerando token de verificação e tempo de validade
        const token = crypto.randomBytes(32).toString('hex')
        const expire = Date.now() + 3600000

        //Atribuindo o token e o tempo de validade ao banco de dados do usuario
        usuario.resetPasswordToken = token
        usuario.resetPasswordExpires = expire

        //Salvando dados de mudança no bd
        usuario.save().then(() => {
            //Configurando o nodemailer para o envio do email
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'lp152659@gmail.com',
                    pass: 'lchaxpxppitkjrvs'
                }
            })
            //Criando conteúdo do email
            const mailOption = {
                to: usuario.email,
                from: 'lp152659@gmail.com',
                subject: 'Redefinição de senha',
                text: `Você está recebendo isso porque solicitou a mudança de senha no sistema (Medi-File).\n\nClique no link abaixo para redefinir sua senha\n\n
                http://localhost:8081/admin/attPassword?token=${token}
                `
            }
            //Enviando o email
            transporter.sendMail(mailOption, (error) => {
                if(error){
                    console.log(`Erro ao enviar email erro> ${error}`)
                    req.flash('error_msg', 'Erro ao enviar E-mail')
                    res.redirect('/admin/sendAttPass')
                }

                req.flash('success_msg', 'E-mail enviado com sucesso!')
                res.redirect('/admin/login')
            })
        })
    }).catch((error) => {
        console.log(`Erro ao enviar email para o cliente erro: ${error}`)
        req.flash('error_msg', 'Erro na sua solicitação')
        res.redirect('/admin/sendAttPass')
    })
})

//Carregando rota de mudança de senha e mudando a senha do usuário
routerAuth.get('/attPassword', (req, res) => {
    const {token} = req.query

    user.findOne({resetPasswordToken: token}).then((usuario) => {
        if(!usuario){
            req.flash('error_msg', 'Token inválido ou expirado')
            return res.redirect('/admin/senAttPass')
        }

        console.log('token:' + token)
        console.log('expire: ' + usuario.resetPasswordExpires)

        if(usuario.resetPasswordExpires < Date.now()){
            req.flash('error_msg', 'Token expirado')
            return res.redirect('/admin/senAttPass')
        }

        res.render('admin/attPassword', {token})
    }).catch((error) => {
        console.log(`Erro ao validar o Token ERRO: ${error}`)
        req.flash('error_msg', 'Erro ao validar token')
        res.redirect('/admin/sendAttPass')
    })
})

//Rota para salvar a nova senha
routerAuth.post('/attPassword', (req, res) => {
    const {token, password} = req.body

    //Salvando nova senha no bd
    user.findOne({resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()}}).then((usuario) => {
        if(!usuario){
            req.flash('error_msg', 'Token inválido ou expirado')
            return res.redirect('/admin/sendAttPass')
        }

        //Criptografando a senha
        const hashSalts = 10
        usuario.password = bcrypt.hashSync(password, hashSalts)
        usuario.resetPasswordToken = undefined
        usuario.resetPasswordExpires = undefined
        
        //Salvando a senha criptografada
        return usuario.save().then(() => {
            req.flash('success_msg', 'Senha alterada com sucesso!')
            res.redirect('/admin/login')
        }).catch((error) => {
            console.log(`erro: ${error}`)
            req.flash('error_msg', 'Erro ao alterar senha, por favor tente novamente!')
            res.redirect('/admin/attPassword')
        })
    })
})
 
module.exports = routerAuth
