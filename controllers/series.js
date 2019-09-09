const getSeriePosterAndBackground = require('../utils/themoviedb');

const get = ({ db }) => async (req, res) => {
  const series = await db
    .select({
      id: 'series.id',
      name: 'series.name',
      genre: 'genres.name',
      poster: 'series.poster',
      background: 'series.background'
    })
    .from('series')
    .leftJoin('genres', 'genres.id', 'series.genre_id');

  res.send({ data: series });
}

const getOne = ({ db }) => async (req, res) => {
  const { id } = req.params;

  const serie = await db('series')
    .select({
      id: 'series.id',
      name: 'series.name',
      genre_id: 'genres.id',
      genre: 'genres.name',
      poster: 'series.poster',
      background: 'series.background'
    })
    .where('series.id', id)
    .leftJoin('genres', 'genres.id', 'series.genre_id')
    .first();

  res.send(serie);
}

const create = ({ db }) => async (req, res) => {
  const { name, genre_id } = req.body;

  const genre = db('genres').select().where('id', genre_id).first();
  const serie = db('series').select().where('name', name).first();

  if (await genre === undefined) {
    return res.status(404).send({ error: true });
  }

  if (await serie !== undefined) {
    return res.status(400).send({ error: true });
  }

  const images = await getSeriePosterAndBackground(name);

  const serieToInsert = {
    name: name,
    genre_id: genre_id,
    poster: images.poster,
    background: images.background
  };

  const [insertedId] = await db.insert(serieToInsert).into('series');
  serieToInsert.id = insertedId;

  res.send(serieToInsert);
}

const update = ({ db }) => async (req, res) => {
  const { id } = req.params;
  const { name, genre_id } = req.body;

  const serie = await db('series').select().where('id', id).first();

  if (serie === undefined) {
    return res.status(404).send({ error: true });
  }

  const images = await getSeriePosterAndBackground(name);

  const serieToUpdate = {
    name: name,
    genre_id: genre_id,
    poster: images.poster,
    background: images.background
  };

  await db('series').where('id', id).update(serieToUpdate);
  res.send(serieToUpdate);
}

const remove = ({ db }) => async (req, res) => {
  const { id } = req.params;

  const serie = await db('series').select().where('id', id).first();

  if (serie === undefined) {
    return res.status(404).send({ error: true });
  }

  await db('series').select().where('id', id).del();
  res.send({ success: true });
}

module.exports = { get, getOne, create, update, remove };
