const router = require('express').Router();
const db = require('../config/database');
const controller = require('../controllers/users');

const dependencies = { db };

router.post('/login', controller.login(dependencies));
router.post('/signup', controller.signup(dependencies));
router.put('/:id', controller.update(dependencies));
router.delete('/:id', controller.remove(dependencies));

module.exports = router;