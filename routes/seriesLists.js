const router = require('express').Router();
const db = require('../config/database');
const controller = require('../controllers/seriesLists');

const dependencies = { db };

router.get('/', controller.get(dependencies));
router.get('/:serieId', controller.getOne(dependencies));
router.post('/:serieId', controller.create(dependencies));
router.put('/:serieId', controller.update(dependencies));
router.delete('/:serieId', controller.remove(dependencies));

module.exports = router;
