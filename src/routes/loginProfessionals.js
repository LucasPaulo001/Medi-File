const express = require('express')
const professionals = express.Router()
const Professional = require('../models/Professional')
const User = require('../models/User')
const bcrypt = require('bcrypt')

//________________________________________________________________________

    //Rota de login do profissional
    const erros = []
    professionals.get('/professional/login', (req, res) => {
        res.render('professionals/profissionaisLogin')
    })

    professionals.post('/professional/login', (req, res) => {
        //Pegando dados do form de login
        const {email, password} = req.body

        new User({
            email: email,
            password: password
        }).save().then(() => {
            console.log('Profissional com credênciais cadastrada em usuários')
        }).catch((error) => {
            console.log('erro')
        })

        //Validando
        if(!email || typeof email == undefined || typeof email == null){
            erros.push({text: 'E-mail icorreto!'})
        }

        if(!password || typeof password == undefined || typeof password == null){
            erros.push({text: 'Senha incorreta!'})
        }
        if(erros.length > 0){
            res.render('admin/professional/login', {erros})
        }

        //Autenticando
        Professional.findOne({email: email}).then(foundUser => {

            //Verificando se o usuário consta no banco de dados
            if(!foundUser){
                req.flash('error_msg', 'O Usuário não existe')
                return res.redirect('/admin/professional/login')
            }

            //Comparando senha
            bcrypt.compare(password, foundUser.password, (error, isMatch) => {
                if(error){
                    throw error
                }
                //Validando se a senha for correta e armazenando dados na sessão do profissional
                if(isMatch){
                    req.session.foundUser ={
                        nome: foundUser.nome,
                        nomeuser: foundUser.nomeuser,
                        role: foundUser.role,
                        email: foundUser.email
                    }
                    //Caso comparassão bem sucedida
                    req.flash('success_msg', 'Login feito com sucesso!')
                    console.log('login feito com sucesso')
                    return res.redirect('/admin/home')
                }
                else{
                    //Caso a senha esteja errada
                    req.flash('error_msg', 'Senha incorreta! tente novamente')
                    return res.redirect('/admin/professional/login')
                }
            })
        })
    })
//________________________________________________________________________


module.exports = professionals