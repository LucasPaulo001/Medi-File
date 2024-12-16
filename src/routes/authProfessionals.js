//Importação de módulos
const express = require('express')
const professionals = express.Router()
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const Professional = require('../models/Professional')
const User = require('../models/User')
const { isAdmin, isEnfermeiro, isMedico } = require('../config/permissions')
const { ModifiedPathsSnapshot } = require('mongoose')
//Criação de rota
    professionals.get('/registerPro', isAdmin, (req, res) => {
        res.render('admin/proRegistration')
    })
    
    professionals.post('/registerPro', (req, res) => {
        // Pegando dados do formulário
        const {
            nome, nomeuser, cpfDoProfissional, dataNascimentoProfissional, generoProfissional, outroGenero, rua, numero, complemento, bairro, cidade, estado, cep, telefone, celular, email, emailVerificado, cargo, crm, corem, especialidadeMedica, nomeDeUsuario, password, passwordConfirm, emailAdmin
        } = req.body;
    
        // Comparando senhas
        if (password !== passwordConfirm) {
            return res.status(400).send('As senhas não coincidem');
        }
    
        // Gerando token de verificação para o profissional
        const token = crypto.randomBytes(32).toString('hex');
    
        // Criptografando a senha e salvando profissional
        const saltRounds = 10;
        let savedProfessionalData
        bcrypt.hash(password, saltRounds).then((hashedPassword) => {
            // Criando collection no banco de dados
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
                cargo: cargo,
                crm: crm,
                corem: corem,
                especialidadeMedica: especialidadeMedica,
                nomeDeUsuario: nomeDeUsuario,
                password: hashedPassword,
                passwordConfirm: passwordConfirm,
                emailAdmin: emailAdmin,
                tokenVerificacao: token
            });
    
            return newProfessional.save();
        })
        .then((savedProfessional) => {
            savedProfessionalData = savedProfessional
            // Verificar se o profissional foi salvo corretamente
            if (!savedProfessional) {
                throw new Error('Falha ao salvar o profissional no banco de dados');
            }
    
            // Verificar se a propriedade nomeDoProfissional existe
            if (!savedProfessional.nome) {
                throw new Error('Nome do profissional não encontrado');
            }
    
            // Configurando o transporter para a validação
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: emailAdmin,
                    pass: 'ndxdijflzwjhdfdw' // Substitua com uma forma mais segura de gerenciar credenciais
                }
            });
    
            // Gerando link de verificação
            const link = `http://localhost:8081/admin/verifyEmail/${token}`;
    
            // Configuração do conteúdo de E-mail
            const mailOption = {
                from: emailAdmin,
                to: savedProfessional.email,
                subject: 'Confirmação de E-mail',
                text: `Olá ${savedProfessional.nome}, parece que você é o nosso novo(a) ${savedProfessional.cargo}!\n\nSeus Dados - E-mail: ${savedProfessional.email}\nSenha: ${savedProfessional.passwordConfirm}\n\nClique no link abaixo para validar seu e-mail:\n\n${link}\n\nApós validar você já pode fazer seu login e acessar a plataforma no seguinte link: http://localhost:8081/admin/professional/login`
            };
    
            // Enviando o E-mail
            return transporter.sendMail(mailOption);
        })
            .then(() => {
                // Responder ao cliente após salvar tudo
                res.status(201).send('Cadastro realizado e e-mail enviado para validação.');
            })
            .catch((error) => {
                console.error(`Erro ao registrar profissional ERRO: ${error}`);
                res.status(500).send(`Erro ao registrar profissional ERRO: ${error}`);
            });
        });
    
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
            res.render('admin/verifyEmail')
        }).catch((error) => {
            res.status(500).send(`Erro ao validar e-mail ERRO: ${error}`)
        })
    })

    professionals.get('/professional/login', (req, res) => {
        res.render('admin/profissionaisLogin')
        
    })
    
    

//Exportação de rota
module.exports = professionals