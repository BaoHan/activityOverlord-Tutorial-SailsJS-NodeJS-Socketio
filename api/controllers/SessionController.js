/**
 * SessionController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

 var bcrypt = require('bcrypt');

module.exports = {

    'new': function (req, res) {

        res.view('session/new');
    },

    create: function (req, res, next) {
        if (!req.param('email') || !req.param('password')) {
            var usernamePasswordRequiredError = [{name: 'usernamePasswordRequired', message: 'You must enter both a username and password'}];
            req.session.flash = {
                err: usernamePasswordRequiredError
            };

            res.redirect('/session/new');
            return;
        };

        User.findOneByEmail(req.param('email'), function foundUser (err, user) {
            if (err) return next(err);

            if (!user) {
                var noAccountError = [{name : 'noAccounr', message: 'The email adress ' + req.param('email') + ' was not found'}];
                req.session.flash = {
                    err: noAccountError
                }
                res.redirect('session/new');
                return;
            };

            bcrypt.compare(req.param('password'), user.encryptedPassword, function (err, valid) {
                if (err) return next(err);
                if (!valid) {
                    var usernamePasswordMismatchError = [{name: 'usernamePasswordMismatch', message: 'Invalid username and password combination'}];
                    req.session.flash = {
                        err: usernamePasswordMismatchError
                    }
                    return
                };
                req.session.authenticated = true;
                req.session.User = user;
                res.redirect('user/show/'+user.id);
            })


        })
    },

    destroy: function (req, res, next) {
        req.session.destroy();

        res.redirect('session/new');
    }

};
