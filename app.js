//Inportação de módulos
const express = require('express')
const handlebars = require('express-handlebars')
const session = require('express-session')
const mongoose = require('mongoose')
const path = require('path')
const flash = require('connect-flash')

//Inportando rotas
const routerAuth = require('./src/routes/authRoutes')
const homeRoutes = require('./src/routes/homeRoutes')
const registerPatientRoutes = require('./src/routes/registerPatient')
const patientList = require('./src/routes/patientList')
const perfilUser = require('./src/routes/perfilUser')
const proRegister = require('./src/routes/authProfessionals')
const proLogin = require('./src/routes/loginProfessionals')
const proList = require('./src/routes/manageProfessionals')

const connectDB = require('./src/config/db')
const sessionConfig = require('./src/config/session')
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
    
    //Config. do session
        sessionConfig(app)

    //Config. do flash
        app.use(flash())
    
    //Config. de Middlware de mensagens 
        app.use((req, res, next) =>{
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')

            next()
        })
    
    //Config. do path para pastas estáticas
        app.use(express.static(path.join(__dirname, 'public')));

    //Configuração da condição do Middlware de template navbar
        //O header só aparecerá na página home
        app.use((req, res, next) => {
            if(req.path === '/admin/login' || req.path === '/admin/register' || req.path === '/admin/professional/login'){
                res.locals.showHeader = false
            }
            else{
                res.locals.showHeader = true
            }
            next()
        })

    //Config. da rota das rotas
        //Rota de login e cadastro
        app.use('/admin', routerAuth)

        //Rota de tela principal (Home)
        app.use('/admin', homeRoutes)

        //Rota de cadastro de pacientes
        app.use('/admin', registerPatientRoutes)

        //Rota de listagem de pacientes cadastrados
        app.use('/admin', patientList)

        //Rota de listagem de dados do usuário
        app.use('/admin', perfilUser)

        //Rota de cadastro de profissionais feitas pelo adm
        app.use('/admin', proRegister)

        //Rota de login de profissionais
        app.use('/admin', proLogin)

        //Rota de gerenciamento de profissionais
        app.use('/admin', proList)

//Configuração de conexão ao servidor
const PORT = 8081
app.listen(PORT, () => {
    console.log(`Conexão ao servidor feita com sucesso, PORTA: ${PORT}`)
})
    
    