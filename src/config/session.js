//Configurando o middlware de sessão
    //Importando módulo
        const session = require('express-session')
        require("dotenv").config()

    //Exportando configuração no parâmetro do app
        module.exports = (app) => {
            app.use(session({
                secret: process.env.SECRET_SESSION,
                resave: false,
                saveUninitialized: false,
                cookie: {secure: false}
            }))
        }