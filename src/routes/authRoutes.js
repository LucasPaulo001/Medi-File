//Inportação do express e atribuição da função Router
const express = require('express')
const routerAuth = express.Router()

routerAuth.get('/login', (req, res) => {
    res.render('admin/login')
})

routerAuth.get('/register', (req, res) => {
    res.render('admin/register')
})

module.exports = routerAuth
