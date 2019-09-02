const db = require('./database');

const createDB = async () => {
  const seriesExist = await db.schema.hasTable('series');

  if (!seriesExist) {
    await db.schema.createTable('series', table => {
      table.increments('id').primary();
      table.string('name');
      table.string('status');
      table.integer('genre_id');
      table.string('comments');
      table.string('poster');
      table.string('background');
    });
  }

  const genresExist = await db.schema.hasTable('genres');

  if (!genresExist) {
    await db.schema.createTable('genres', table => {
      table.increments('id').primary();
      table.integer('name');
    });
  }
}

const initDB = async () => {
  const totalGenres = await db('genres').select(db.raw('COUNT(*) AS total'));

  if (totalGenres[0].total === 0) {
    await db.insert({
      name: 'Ação'
    }).into('genres');

    await db.insert({
      name: 'Comédia'
    }).into('genres');

    await db.insert({
      name: 'La casa de papel',
      status: 'WATCHED',
      genre_id: 1,
      comments: '',
      poster: '//image.tmdb.org/t/p/original/yVUAfbrP5HDJugXraB7KQS0yz6Z.jpg',
      background: '//image.tmdb.org/t/p/original/piuRhGiQBYWgW668eSNJ2ug5uAO.jpg'
    }).into('series');
  }
}

createDB();
initDB();
