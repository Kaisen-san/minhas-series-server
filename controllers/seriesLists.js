const get = ({ db }) => async (req, res) => {
  const { listid : listId } = req.headers;

  const seriesList = await db
    .select({
      list_id: 'lists.id',
      serie_id: 'series.id',
      name: 'series.name',
      genre: 'genres.name',
      status: 'userList.status',
      poster: 'series.poster',
      background: 'series.background'
    })
    .from(function() {
      this.select('*').from('seriesLists').where('list_id', listId).as('userList');
    })
    .leftJoin('lists', 'lists.id', 'userList.list_id')
    .leftJoin('series', 'series.id', 'userList.serie_id')
    .leftJoin('genres', 'genres.id', 'series.genre_id');

  res.send({ data: seriesList });
}

const getOne = ({ db }) => async (req, res) => {
  const { listid : listId } = req.headers;
  const { serieId } = req.params;

  const listSerie = await db
    .select({
      id: 'series.id',
      name: 'series.name',
      genre_id: 'genres.id',
      genre: 'genres.name',
      status: 'userList.status',
      comments: 'userList.comments',
      poster: 'series.poster',
      background: 'series.background'
    })
    .from(function() {
      this.select().from('seriesLists').where('list_id', listId).as('userList');
    })
    .where('series.id', serieId)
    .leftJoin('lists', 'lists.id', 'userList.list_id')
    .leftJoin('series', 'series.id', 'userList.serie_id')
    .leftJoin('genres', 'genres.id', 'series.genre_id')
    .first();

  res.send(listSerie);
}

const create = ({ db }) => async (req, res) => {
  const { listid : listId } = req.headers;
  const { serieId } = req.params;
  const { status, comments } = req.body;

  const list = db('lists').select().where('id', listId).first();
  const serie = db('series').select().where('id', serieId).first();
  const listSerieExists = db('seriesLists').select().where({list_id: listId, serie_id: serieId}).first();

  if (await list === undefined || await serie === undefined) {
    return res.status(404).send({ error: true });
  }

  if (await listSerieExists !== undefined) {
    return res.status(400).send({ error: true });
  }

  const listSerieToInsert = {
    list_id: listId,
    serie_id: serieId,
    status: status || 'PENDING',
    comments: comments || ''
  };

  await db.insert(listSerieToInsert).into('seriesLists');
  res.send(listSerieToInsert);
}

const update = ({ db }) => async (req, res) => {
  const { listid : listId } = req.headers;
  const { serieId } = req.params;
  const { status, comments } = req.body;

  const listSerie = await db('seriesLists').select().where({list_id: listId, serie_id: serieId}).first();

  if (listSerie === undefined) {
    return res.status(404).send({ error: true });
  }

  const serieToUpdate = {
    status: status || 'PENDING',
    comments: comments || ''
  };

  await db('seriesLists').where({list_id: listId, serie_id: serieId}).update(serieToUpdate);
  res.send({
    list_id: listId,
    serie_id: serieId,
    ...serieToUpdate
  });
}

const remove = ({ db }) => async (req, res) => {
  const { listid : listId } = req.headers;
  const { serieId } = req.params;

  const listSerie = await db('seriesLists').select().where({list_id: listId, serie_id: serieId}).first();

  if (listSerie === undefined) {
    return res.status(404).send({ error: true });
  }

  await db('seriesLists').select().where({list_id: listId, serie_id: serieId}).del();
  res.send({ success: true });
}

module.exports = { get, getOne, create, update, remove };
