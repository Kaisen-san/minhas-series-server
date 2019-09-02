const router = require('express').Router();
const db = require('../config/database');
const controller = require('../controllers/genres');

const dependencies = { db };

router.get('/', controller.get(dependencies));
router.get('/:id', controller.getOne(dependencies));
router.post('/', controller.create(dependencies));
router.put('/:id', controller.update(dependencies));
router.delete('/:id', controller.remove(dependencies));

module.exports = router;
