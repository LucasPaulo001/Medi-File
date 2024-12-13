//Importação do mongoose
const mongoose = require('mongoose')

//Configuração do mongoose
mongoose.Promise = global.Promise
    const connectDB = () => { mongoose.connect('mongodb://127.0.0.1:27017/appmedifile').then(() => {
        console.log('Conexão ao mongoose feita com sucesso!')
    }).catch((error) => {
        console.log(`Erro ao se conectar com o mongoose ERRO: ${error}`)
    })
}
module.exports = connectDB

