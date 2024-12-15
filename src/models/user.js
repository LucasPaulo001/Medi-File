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
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'medico', 'enfermeiro', 'paciente'],
        default: 'paciente'
    }
})

//Exportando model
const user = mongoose.model('usuarios', userSchema)
module.exports = user