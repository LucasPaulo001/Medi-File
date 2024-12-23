//Inportação de módulos
const express = require('express')
const handlebars = require('express-handlebars')
const hbs = require('handlebars')
const session = require('express-session')
const mongoose = require('mongoose')
const path = require('path')
const flash = require('connect-flash')
const passport = require('passport')
require('./src/config/auth.js')(passport)

//Inportando rotas
    //Rotas de Admin
        const routerAuth = require('./src/routes/routes_Admin/authRoutes.js')
        const homeRoutes = require('./src/routes/routes_Admin/homeRoutes.js')
        const registerPatientRoutes = require('./src/routes/routes_Admin/registerPatient.js')
        const patientList = require('./src/routes/routes_Admin/patientList.js')
        const perfilUser = require('./src/routes/routes_Admin/perfilUser.js')
        const proRegister = require('./src/routes/routes_Admin/authProfessionals.js')
        const proLogin = require('./src/routes/routes_Admin/loginProfessionals.js')
        const proList = require('./src/routes/routes_Admin/manageProfessionals.js')

    //Rotas de Enfermeiro
        const routerHomeN = require('./src/routes/routes_Norse/homeRoutes_N.js')

    //Rotas de Médicos

    //Rotas de recepcionistas
        const routerRec = require('./src/routes/route_Receptionist/authRec.js')

    //Importação de configurações
        const connectDB = require('./src/config/db')
        const sessionConfig = require('./src/config/session')
    
    //Função express para configurações de servidor
        const app = express()

//Configurações
    //Parser de json e de dados de formulários
        app.use(express.json())
        app.use(express.urlencoded({extended: true}))

    //helper de condições complexas para o handlebars
    hbs.registerHelper("eq", function (a, b) {
        return a === b;
      });

    //Config. do handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main',
            runtimeOptions: {
                allowProtoPropertiesByDefault: true,
                allowProtoMethodsByDefault: true,
            }
        }))
        app.set('view engine', 'handlebars')
        app.set('views', __dirname + '/src/views')

    //Config. do mongoose
        connectDB()
    
    //Config. do session
        sessionConfig(app)

    //Config. do Passport
        app.use(passport.initialize())
        app.use(passport.session())

    //Config. do flash
        app.use(flash())
    
    //Config. de Middlware de mensagens 
        app.use((req, res, next) =>{
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            res.locals.error = req.flash('error')
            res.locals.user = req.user || null
            next()
        })
    
    //Config. do path para pastas estáticas
        app.use(express.static(path.join(__dirname, 'public')));

    //Configuração da condição do Middlware de template navbar
        //O header só aparecerá na página home
        app.use((req, res, next) => {
            if(req.path === '/admin/login' || req.path === '/admin/register' || req.path === '/admin/professional/login' || req.path === '/admin/sendAttPass' || req.path === '/admin/attPassword'){
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


        //ROTAS DE ENFERMEIROS
        app.use('/enf', routerHomeN)

        //ROTAS DE MÉDICOS

        //ROTAS DE RECEPCIONISTAS
        app.use('/rec', routerRec)

//Configuração de conexão ao servidor
const PORT = 8081
app.listen(PORT, () => {
    console.log(`Conexão ao servidor feita com sucesso, PORTA: ${PORT}`)
})
    
    