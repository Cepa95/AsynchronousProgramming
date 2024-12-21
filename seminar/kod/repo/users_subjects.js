const db = require("../db");

async function getUsersBySubjectId(subjectId) {
  return db("users_subjects")
    .join("users", "users_subjects.user_id", "users.id")
    .where("users_subjects.subject_id", subjectId)
    .select("users.name", "users.email");
}

async function getSubjectsByUserId(userId) {
  return db("users_subjects")
    .join("subjects", "users_subjects.subject_id", "subjects.id")
    .where("users_subjects.user_id", userId)
    .select("subjects.name", "subjects.ects");
}

async function addUserToSubject(userId, subjectId) {
  const existingEntry = await db("users_subjects")
    .where({ user_id: userId, subject_id: subjectId })
    .first();

  if (existingEntry) {
    throw new Error("User is already added to this subject");
  }

  return db("users_subjects").insert({
    user_id: userId,
    subject_id: subjectId,
  });
}

async function removeUserFromSubject(userId, subjectId) {
  const existingEntry = await db("users_subjects")
    .where({ user_id: userId, subject_id: subjectId })
    .first();

  if (!existingEntry) {
    throw new Error("User is not added to this subject");
  }

  return db("users_subjects")
    .where({ user_id: userId, subject_id: subjectId })
    .del();
}

module.exports = {
  getUsersBySubjectId,
  getSubjectsByUserId,
  addUserToSubject,
  removeUserFromSubject,
};
