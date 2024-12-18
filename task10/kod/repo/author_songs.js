const db = require("../db");

async function create(authorId, songId) {
  return db("author_songs")
    .insert({ author_id: authorId, song_id: songId })
    .returning("*");
}

async function remove(authorId, songId) {
  return db("author_songs")
    .where({ author_id: authorId, song_id: songId })
    .del();
}

async function getSongsByAuthor(authorId) {
    return db('songs')
      .join('author_songs', 'songs.id', 'author_songs.song_id')
      .where('author_songs.author_id', authorId)
      .select('songs.*');
  }
  
  module.exports = {
    create,
    remove,
    getSongsByAuthor,
  };
