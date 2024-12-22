//Importação do mongoose
const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Criando collection
const ProfissionalSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    nomeuser: {
        type: String,
        required: true
    },
    cpfDoProfissional: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value);
            },
            message: "CPF inválido!"
        }
    },
    dataNascimentoProfissional: {
        type: Date,
        required: true
    },
    generoProfissional: {
        type: String,
        enum: ['masculino', 'feminino', 'outro'],
        default: ''
    },
    outroGenero: {
        type: String,
        required: function() {
            return this.generoProfissional === 'outro';
        }
    },
    rua: {
        type: String,
        required: true
    },
    numero: {
        type: String,
        required: false
    },
    complemento: {
        type: String,
        required: false
    },
    bairro: {
        type: String,
        required: true
    },
    cidade: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        required: true
    },
    cep: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^\d{5}-\d{3}$/.test(value); 
            },
            message: "CEP inválido!"
        }
    },
    telefone: {
        type: String,
        default: "", 
        validate: {
            validator: function(value) {
                return value === "" || /^\(\d{2}\) \d{4,5}-\d{4}$/.test(value);
            },
            message: "Telefone inválido!"
        }
    },
    celular: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^\(\d{2}\) \d{5}-\d{4}$/.test(value);
            },
            message: "Celular inválido!" //(83) 99931-8447
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: "E-mail inválido!"
        }
    },
    emailVerificado: {
        type: Boolean,
        default: false
    },
    tokenVerificado: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'medico', 'enfermeiro', 'profissional'],
        default: 'profissional'
    },
    crm: {
        type: String,
    },
    corem: {
        type: String,
        required: false
    },
    especialidadeMedica: {
        type: String,
        required: false
    },
    nomeDeUsuario: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    passwordConfirm: {
        type: String,
        required: true
    },
    emailAdmin: {
        type: String,
        required: true
    },
    tokenVerificacao: {
        type: String
    },
    userId: {
        type: String
    }
});

module.exports = mongoose.model('Profissional', ProfissionalSchema);