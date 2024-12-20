//Importando mongoose para se conectar com o banco
const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Criando modelo de paciente para o banco de dados
const patientSchema = new Schema({
    nomePaciente: {
        type: String,
        required: true
    },
    nomeSocial: {
        type: String,
        required: true
    },
    dataNascimento: {
        type: Date,
        required: true
    },
    genero: {
        type: String,
        enum: ['masculino', 'feminino', 'outro'], 
        required: true
    },
    cpf: {
        type: String, 
        required: true, 
        unique: true, 
        validate: {
            validator: function(value) {
                return /\d{3}\.\d{3}\.\d{3}-\d{2}/.test(value);
            },
            message: "CPF inválido!"
        }
    },
    phone: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true
    },
    rua: {
        type: String,
    },
    cidade: {
        type: String
    },
    numlocal: {
        type: String
    }
})

//Exportando modelo
const Paciente = mongoose.model('pacientes', patientSchema)
module.exports = Paciente