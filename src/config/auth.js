//const localStrategy = require('passport-local').Strategy
const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

//Model do usuário
const user = require('../models/User')

//Configuração do passport
module.exports = (passport) => {
    passport.use(new localStrategy({usernameField: 'email'}, (email, password, done) => {
        user.findOne({email: email}).lean().then((usuario) => {
            if(!usuario){
                return done(null, false, {message: 'Esta conta não existe'})
            }
            bcrypt.compare(password, usuario.password, (error, isMatch) => {
                if(isMatch){
                    return done(null, usuario)
                }
                else{
                    return done(null, false, {message: "Senha incorreta"})
                }
            })
        })
    }))

    passport.serializeUser((usuario, done) => {
        done(null, usuario._id)
    })

    passport.deserializeUser((id, done) =>{
        user.findById(id).then(usuario => {
            if (!usuario) {
                return done(null, false);
            }
            done(null, usuario); 
        }).catch(err => {
            console.error("Erro ao deserializar usuário:", err);
            done(err, null); 
        });
    })
}