module.exports = {
    isNorse: (req, res, next) => {
        if(req.isAuthenticated() && req.user.role === 'enfermeiro'){
            return next()
        }
        req.flash('error_msg', 'O acesso de Enfermeiro foi encerrado inesperadamente, por favor acesse novamente com suas credênciais')
        res.redirect('/admin/login')
    }
}