//Configurando model de usuário

//Importando o mongoose para fazer a conexão com o banco de dados
const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Criando model
const userSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

//Exportando model
const user = mongoose.model('usuarios', userSchema)
module.exports = user