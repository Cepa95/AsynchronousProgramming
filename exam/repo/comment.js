const db = require("../db");

async function create(vinyl) {
  return db("comments").insert(vinyl).returning("*");
}

async function findByGroupId(group_id, sortOrder) {
  return db("comments").where({ group_id }).orderBy("created_at", sortOrder);
}

async function findByUserId(user_id) {
  return db("comments")
    .where({ sender_id: user_id })
}

module.exports = {
  create,
  findByGroupId,
  findByUserId,
};
