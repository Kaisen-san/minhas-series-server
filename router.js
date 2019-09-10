const router = require('express').Router();
const series = require('./routes/series');
const genres = require('./routes/genres');
const users = require('./routes/users');
const seriesLists = require('./routes/seriesLists');

router.get('/', (req, res) =>
  res.send({ info: 'Minhas Séries Server', datetime: new Date() })
);

router.use(users);
router.use('/series', series);
router.use('/genres', genres);
router.use('/serieslists', seriesLists);

module.exports = router;
