//Configurações de Middlewares de permissões
const session = require('express-session')

//Função de permição para a middleware de admin
function isAdmin(req, res, next){
    if(req.session.user && req.session.role === 'admin'){
        return next()
    }
    return res.status(403).send('Acesso negado. Você precisa ser Admin para acessar essa página.');
}

//Função de permissão para a middleware de medico
function isMedico(req, res, next){
    if(req.session.user && req.session.role === 'medico'){
        return next()
    }
    return res.status(403).send('Acesso negado. Você precisa ser Médico para acessar essa página.');
}

//Função de permissão para middleware de enfermeiro
function isEnfermeiro(req, res, next){
    if(req.session.user && req.session.role === 'enfermeiro'){
        return next()
    }
    return res.status(403).send('Acesso negado. Você precisa ser Enfermeiro para acessar essa página')
}

//Função de permissão para middleware de tec. de enfermagem
function isTecEnfermagem(req, res, next){
    if(req.session.user && req.session.role === 'tec. enfermagem'){
        return next()
    }
    return res.status(403).send('Acesso negado. Você precisa ser Técnico de enfermagem para acessar essa página')
}

//Exportando as middlewares
module.exports = {
    isAdmin,
    isMedico,
    isEnfermeiro,
    isTecEnfermagem
}
    
