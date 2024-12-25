const express = require('express')
const defaultRoute = express.Router()

defaultRoute.get('/settingAccount', (req, res) => {
    res.render('page/settingAccount')
})

module.exports = defaultRoute