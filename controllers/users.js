const login = ({ db }) => async (req, res) => {
  const { email } = req.body;

  const userExists = await db('users').select().where('email', email).first();

  if (userExists === undefined) {
    return res.status(400).send({ error: true });
  }

  const userList = await db('lists').select().where('user_id', userExists.id).first();

  const userToReturn = {
    id: userExists.id,
    name: userExists.name,
    list_id: userList.id
  };

  res.send(userToReturn);
}

const signup = ({ db }) => async (req, res) => {
  const { name, email } = req.body;

  const userExists = await db('users').select().where('email', email).first();

  if (userExists !== undefined) {
    return res.status(400).send({ error: true });
  }

  const userToInsert = {
    name: name || null,
    email: email || null
  };

  let result = {};

  try {
    const [insertedUserId] = await db.insert(userToInsert).into('users');
    userToInsert.id = insertedUserId;

    const [insertedListId] = await db.insert({ user_id: insertedUserId }).into('lists');
    userToInsert.list_id = insertedListId;

    result = { status: 201, response: userToInsert };
  } catch (ex) {
    result = { status: 400, response: { error: true } };
  } finally {
    res.status(result.status).send(result.response);
  }
}

module.exports = { login, signup };
