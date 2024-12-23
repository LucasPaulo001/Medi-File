//Configurando model de usuário

//Importando o mongoose para fazer a conexão com o banco de dados
const mongoose = require('mongoose')
const isAdmin = require('../helpers/isAdmin')
const Schema = mongoose.Schema

//Criando model
const userSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    nomeuser: {
        type: String,
        required: true,
        unique: true
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
    isAdmin: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        enum: ['admin', 'medico', 'enfermeiro', 'recepcionista'],
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    }
})

//Exportando model
const user = mongoose.model('usuarios', userSchema)
module.exports = user
