const get = ({ db }) => async (req, res) => {
  const genres = await db
    .select({
      id: 'genres.id',
      name: 'genres.name'
    })
    .from('genres');

  res.send({ data: genres });
}

const getOne = ({ db }) => async (req, res) => {
  const { id } = req.params;

  const genre = await db('genres').select().where('id', id).first();

  res.send(genre);
}

const create = ({ db }) => async (req, res) => {
  const { name } = req.body;
  const genreToInsert = {
    name
  };

  const [insertedId] = await db.insert(genreToInsert).into('genres');
  genreToInsert.id = insertedId;

  res.send(genreToInsert);
}

const update = ({ db }) => async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const genre = await db('genres').select().where('id', id).first();

  if (genre === undefined) {
    return res.status(404).send({ error: true });
  }

  const genreToUpdate = {
    name
  };

  await db('genres').where('id', id).update(genreToUpdate);
  res.send(genreToUpdate);
}

const remove = ({ db }) => async (req, res) => {
  const { id } = req.params;
  const genre = await db('genres').select().where('id', id).first();

  if (genre === undefined) {
    return res.status(404).send({ error: true });
  }

  await db('genres').select().where('id', id).del();
  res.send({ success: true });
}

module.exports = { get, getOne, create, update, remove };
