const db = require("../db");

async function create(author) {
  return db("authors").insert(author).returning("*");
}

async function getAll() {
  return db("authors").select("*");
}

async function getById(id) {
  return db("authors").where({ id }).first();
}

async function remove(id) {
  return db("authors").where({ id }).del();
}

async function update(id, author) {
  return db("authors").where({ id }).update(author).returning("*");
}
module.exports = {
  create,
  getAll,
  getById,
  remove,
  update,
};
