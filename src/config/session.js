//Configurando o middlware de sessão
    //Importando módulo
        const session = require('express-session')

    //Exportando configuração no parâmetro do app
        module.exports = (app) => {
            app.use(session({
                secret: 'AquiT3m4lgo5ecreto',
                resave: false,
                saveUninitialized: false,
                cookie: {secure: false}
            }))
        }