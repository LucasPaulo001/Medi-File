//Importação do mongoose
const mongoose = require('mongoose')
require("dotenv").config()

//Configuração do mongoose
mongoose.Promise = global.Promise
    const connectDB = () => { mongoose.connect(process.env.DB_URI).then(() => {
        console.log('Conexão ao mongoose feita com sucesso!')
    }).catch((error) => {
        console.log(`Erro ao se conectar com o mongoose ERRO: ${error}`)
    })
}
module.exports = connectDB

