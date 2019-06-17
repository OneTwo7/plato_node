const passport = require('passport');

exports.authenticate = function (req, res, next) {
    req.body.email = req.body.email.toLowerCase();

    const auth = passport.authenticate('local', function (err, user) {
        if (err) {
            return next(err);
        }

        if (!user) {
            res.send({ success: false });
        }

        req.logIn(user, function (err) {

            if (err) {
                return next(err);
            }

            const { _id, email, firstName, lastName, roles } = user;

            res.send({
                success: true,
                user: {
                    _id,
                    email,
                    firstName,
                    lastName,
                    roles,
                },
            });
        });
    });

    auth(req, res, next);
};

exports.requiresApiLogin = function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.status(403);
        res.send({ reason: 'You are not logged in!' });
    } else {
        next();
    }
};

exports.requiresRole = function (role) {
    return function (req, res, next) {
        const authenticated = req.isAuthenticated();

        if (!authenticated || !~req.user.roles.indexOf(role)) {
            res.status(403);

            if (!authenticated) {
                res.send({ reason: 'You are not logged in!' });
            } else {
                res.send({ reason: 'You don\'t have high enough clearance!' });
            }
        } else {
            next();
        }
    };
};
