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

  const genre = db('genres').select().where('name', name).first();

  if (await genre !== undefined) {
    return res.status(400).send({ error: true });
  }

  const genreToInsert = {
    name: name || null
  };

  let result = {};

  try {
    const [insertedId] = await db.insert(genreToInsert).into('genres');
    genreToInsert.id = insertedId;
    result = { status: 201, response: genreToInsert };
  } catch (ex) {
    result = { status: 400, response: { error: true } };
  } finally {
    res.status(result.status).send(result.response);
  }
}

const update = ({ db }) => async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const genre = await db('genres').select().where('id', id).first();

  if (genre === undefined) {
    return res.status(404).send({ error: true });
  }

  const genreToUpdate = {
    name: name || null
  };

  let result = {};

  try {
    await db('genres').where('id', id).update(genreToUpdate);
    result = { status: 200, response: genreToUpdate };
  } catch (ex) {
    result = { status: 400, response: { error: true } };
  } finally {
    res.status(result.status).send(result.response);
  }
}

const remove = ({ db }) => async (req, res) => {
  const { id } = req.params;
  const genre = await db('genres').select().where('id', id).first();

  if (genre === undefined) {
    return res.status(404).send({ error: true });
  }

  let result = {};

  try {
    await db('genres').select().where('id', id).del();
    result = { status: 200, response: { success: true } };
  } catch (ex) {
    result = { status: 400, response: { error: true } };
  } finally {
    res.status(result.status).send(result.response);
  }
}

module.exports = { get, getOne, create, update, remove };
