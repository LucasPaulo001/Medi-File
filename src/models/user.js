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
        enum: ['admin', 'medico', 'enfermeiro', 'tecEnfermagem', 'paciente'],
        default: 'paciente'
    },
    crm: {
        type: String,
        required: function(){
            return this.role === "medico"
        },
        validade: {
            validator: function(value){
                return /^[0-9]{5,10}$/.test(value)
            },
            message: "CRM inválido!"
        }
    },
    // corem: {
    //     type: String,
    //     required: function(){
    //         return this.role === "enfermeiro" || this.role === "tecEnfermagem"
    //     },
    //     validate: {
    //         validator: function(value){
    //             return /^[0-9]{5,10}$/.test(value)
    //         },
    //         message: "COREM Inválido!"
    //     }
    // },
    datacadastro: {
        type: Date,
        default: Date.now
    }
})

//Exportando model
const user = mongoose.model('usuarios', userSchema)
module.exports = user