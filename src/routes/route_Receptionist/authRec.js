const express = require('express')
const routeRec= express.Router()

routeRec.get('/home', (req, res) => {
    res.render('rec/home')
})

module.express = routeRec
