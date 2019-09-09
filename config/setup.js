const db = require('./database');

const createDB = async () => {
  const usersExist = db.schema.hasTable('users');
  const listsExist = db.schema.hasTable('lists');
  const genresExist = db.schema.hasTable('genres');
  const seriesExist = db.schema.hasTable('series');
  const seriesListsExist = db.schema.hasTable('seriesLists');

  if (!await usersExist) {
    await db.schema.createTable('users', table => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable();
    });
  }

  if (!await listsExist) {
    await db.schema.createTable('lists', table => {
      table.increments('id').primary();
      table.integer('user_id').unique().references('id').inTable('users').onDelete('CASCADE');
    });
  }

  if (!await genresExist) {
    await db.schema.createTable('genres', table => {
      table.increments('id').primary();
      table.integer('name').notNullable();
    });
  }

  if (!await seriesExist) {
    await db.schema.createTable('series', table => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('poster').defaultTo('');
      table.string('background').defaultTo('');
      table.integer('genre_id').references('id').inTable('genres').onDelete('RESTRICT');
    });
  }

  if (!await seriesListsExist) {
    await db.schema.createTable('seriesLists', table => {
      table.integer('list_id').references('id').inTable('lists').onDelete('CASCADE');
      table.integer('serie_id').references('id').inTable('series').onDelete('CASCADE');
      table.enum('status', ['PENDING', 'WATCHED']).defaultTo('PENDING');
      table.string('comments').defaultTo('');
      table.primary(['list_id', 'serie_id']);
    });
  }
}

const initDB = async () => {
  const totalGenres = await db('genres').select(db.raw('COUNT(*) AS total')).first();

  if (totalGenres.total === 0) {
    await db.insert({
      name: 'Felipe Andrade',
      email: 'fasa.work@gmail.com'
    }).into('users');

    await db.insert({
      name: 'Mariana Dias',
      email: 'mariana.work@outlook.com'
    }).into('users');

    await db.insert({
      user_id: 1
    }).into('lists');

    await db.insert({
      user_id: 2
    }).into('lists');

    await db.insert({
      name: 'Ação'
    }).into('genres');

    await db.insert({
      name: 'Comédia'
    }).into('genres');

    await db.insert({
      name: 'La casa de papel',
      poster: '//image.tmdb.org/t/p/original/yVUAfbrP5HDJugXraB7KQS0yz6Z.jpg',
      background: '//image.tmdb.org/t/p/original/piuRhGiQBYWgW668eSNJ2ug5uAO.jpg',
      genre_id: 1
    }).into('series');

    await db.insert({
      name: 'Rick and Morty',
      poster: '//image.tmdb.org/t/p/original/yVUAfbrP5HDJugXraB7KQS0yz6Z.jpg',
      background: '//image.tmdb.org/t/p/original/piuRhGiQBYWgW668eSNJ2ug5uAO.jpg',
      genre_id: 2
    }).into('series');

    await db.insert({
      list_id: 1,
      serie_id: 1,
      status: 'WATCHED'
    }).into('seriesLists');

    await db.insert({
      list_id: 1,
      serie_id: 2
    }).into('seriesLists');

    await db.insert({
      list_id: 2,
      serie_id: 2
    }).into('seriesLists');
  }
}

(async () => {
  await createDB();
  await initDB();
})();
