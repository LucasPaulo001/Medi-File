//Importação de módulos
const express = require('express')
const professionals = express.Router()
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const Professional = require('../../models/Professional')
const User = require('../../models/User')
const {isAdmin} = require('../../helpers/isAdmin')
const { ModifiedPathsSnapshot } = require('mongoose')
const user = require('../../models/User')
//Criação de rota
    professionals.get('/registerPro', isAdmin, (req, res) => {
        res.render('admin/proRegistration')
    })
    const erros = []
    professionals.post('/registerPro', (req, res) => {
        // Pegando dados do formulário
        const {
            nome, nomeuser, cpfDoProfissional, dataNascimentoProfissional, generoProfissional, outroGenero, rua, numero, complemento, bairro, cidade, estado, cep, telefone, celular, email, emailVerificado, role, crm, corem, especialidadeMedica, nomeDeUsuario, password,  passwordConfirm, emailAdmin
        } = req.body;
    
        // Comparando senhas
        if (password !== passwordConfirm) {
            erros.push({text: 'As senhas não coincidem'})
            return res.redirect('/admin/registerPro')
        }
    
        // Gerando token de verificação para o profissional
        const token = crypto.randomBytes(32).toString('hex');
    
        // Criptografando a senha e salvando profissional
        const saltRounds = 10;

        bcrypt.hash(password, saltRounds).then((hashedPassword) => {
            
            //Criando acesso do profissional no sistema
            const newUser = new User({
                nome: nome,
                nomeuser: nomeuser,
                email: email,
                password: hashedPassword,
                role: role
            })
            newUser.save()

            // Criando collection no banco de dados
            .then((savedUser) => {
                const newProfessional = new Professional({
                    nome: nome,
                    nomeuser: nomeuser,
                    cpfDoProfissional: cpfDoProfissional,
                    dataNascimentoProfissional: dataNascimentoProfissional,
                    generoProfissional: generoProfissional,
                    outroGenero: outroGenero,
                    rua: rua,
                    numero: numero,
                    complemento: complemento,
                    bairro: bairro,
                    cidade: cidade,
                    estado: estado,
                    cep: cep,
                    telefone: telefone,
                    celular: celular,
                    email: email,
                    emailVerificado: emailVerificado,
                    role: role,
                    crm: crm.trim() || "",
                    corem: corem,
                    especialidadeMedica: especialidadeMedica,
                    nomeDeUsuario: nomeDeUsuario,
                    password: hashedPassword,
                    passwordConfirm: passwordConfirm,
                    emailAdmin: emailAdmin,
                    tokenVerificacao: token,
                    userId: newUser._id
                });
        
                return newProfessional.save();
            })
            .then((savedProfessional) => {
                
                // Configurando o transporter para a validação
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: emailAdmin,
                        pass: 'lchaxpxppitkjrvs'
                    }
                });
        
                // Gerando link de verificação
                const link = `http://localhost:8081/admin/verifyEmail/${token}`;
        
                // Configuração do conteúdo de E-mail
                const mailOption = {
                    from: emailAdmin,
                    to: savedProfessional.email,
                    subject: 'Confirmação de E-mail',
                    text: `Olá ${savedProfessional.nome}, parece que você é o(a) nosso(a) novo(a) ${savedProfessional.role}!\n\nSeus Dados - E-mail: ${savedProfessional.email}\nSenha: ${savedProfessional.passwordConfirm}\n\nClique no link abaixo para validar seu e-mail:\n\n${link}\n\nApós validar você já pode fazer seu login e acessar a plataforma no seguinte link: http://localhost:8081/admin/login`
                };
        
                // Enviando o E-mail
                return transporter.sendMail(mailOption)
                })
                .then(() => {
                    // Responder ao cliente após salvar tudo
                    req.flash('success_msg', 'Profissional cadastrado com sucesso e E-mail de validação enviado!')
                    res.redirect('/admin/registerPro')
                })
                .catch((error) => {
                    console.error(`Erro ao registrar profissional ERRO: ${error}`);
                    req.flash(`error_msg', 'Erro ao cadastrar profissional! ERRO: ${error}`)
                    res.redirect('/admin/registerPro')
                })
        }).catch((error) => {
            console.error(`Erro ao criptografar senha: ${error}`);
            req.flash('error_msg', `Erro ao criptografar senha: ${error}`);
            res.redirect('/admin/registerPro');
        })
    })
    //Rota para validar e-mail
    professionals.get('/verifyEmail/:token', (req, res) => {
        const {token} = req.params

        Professional.findOne({tokenVerificacao: token}).
        then((profissional) => {
            if(!profissional){
                return res.status(400).send('Link de validação inválido ou expirado!')
            }
            profissional.emailVerificado = true
            profissional.tokenVerificacao = null

            return profissional.save()
        })
        .then(() => {
            res.send('email validado com sucesso!')
        }).catch((error) => {
            res.status(500).send(`Erro ao validar e-mail ERRO: ${error}`)
        })
    })

//Exportação de rota
module.exports = professionals