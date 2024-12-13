//Inportação de módulos
const express = require('express')
const handlebars = require('express-handlebars')
const mongoose = require('mongoose')
const path = require('path')
const routerAuth = require('./src/routes/authRoutes')
const homeRoutes = require('./src/routes/homeRoutes')
const connectDB = require('./src/config/db')
const app = express()

//Configurações
    //Parser de json e de dados de formulários
        app.use(express.json())
        app.use(express.urlencoded({extended: true}))
    
    //Config. do handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
        app.set('views', __dirname + '/src/views')

    //Config. do mongoose
        connectDB()
    
    //Config. do path para pastas estáticas
        app.use(express.static(path.join(__dirname + 'public')))

    //Config. da rota das rotas
        //Rota de login e cadastro
        app.use('/admin', routerAuth)

        //Rota de tela principal (Home)
        app.use('/admin', homeRoutes)

//Configuração de conexão ao servidor
const PORT = 8081
app.listen(PORT, () => {
    console.log(`Conexão ao servidor feita com sucesso, PORTA: ${PORT}`)
})
    
    