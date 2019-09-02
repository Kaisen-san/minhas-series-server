const router = require('express').Router();
const series = require('./routes/series');
const genres = require('./routes/genres');

router.get('/', (req, res) =>
  res.send({ info: 'Minhas Séries Server', datetime: new Date() })
);

router.use('/series', series);
router.use('/genres', genres);

module.exports = router;
