const db = require("../db");

async function create(song) {
  return db("songs").insert(song).returning("*");
}

async function getAll() {
  return db("songs").select("*");
}

async function getById(id) {
  return db("songs").where({ id }).first();
}

async function remove(id) {
  return db("songs").where({ id }).del();
}

async function update(id, song) {
  return db("songs").where({ id }).update(song).returning("*");
}

module.exports = {
  create,
  getAll,
  getById,
  remove,
  update,
};
