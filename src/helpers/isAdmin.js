module.exports = {
    isAdmin: (req, res, next) => {
        if(req.isAuthenticated() && req.user.role == 'admin'){
            return next()
        }
        req.flash('error_msg', 'Para acessar esta página precisa ser admin')
        res.redirect('/admin/home')
    }
}