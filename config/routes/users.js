var auth   = require('../auth');
var users  = require('../../app/controllers/users');
var router = require('express').Router();

router.get('/', auth.requiresRole('admin'), users.getUsers);

router.post('/', users.createUser);

router.put('/', users.updateUser);

module.exports = router;
