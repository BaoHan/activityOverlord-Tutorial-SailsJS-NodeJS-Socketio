module.exports = function (req, res, next) {
    if (req.session.User && req.session.User.admin) {
        return next();
    } else {
        var requireAdminError = [{name: 'requireAdmin', message: 'You must be an admin'}]
        req.session.flash = {
            err: requireAdminError
        }
        res.redirect('/session/new');
        return;
    }
}