const db = require("../db");

async function getSubjects() {
  return db("subjects").select("*");
}
async function deleteSubject(id) {
  return db("subjects").where({ id }).del();
}

const updateSubject = async (id, subject) => {
  return db("subjects").where({ id }).update(subject);
};

const getSubjectById = async (id) => {
  return db("subjects").where({ id }).first();
};

const createSubject = async (subject) => {
  return db("subjects").insert(subject).returning("*");
};

module.exports = {
  getSubjects,
  deleteSubject,
  updateSubject,
  getSubjectById,
  createSubject,
};
