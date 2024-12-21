/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users_subjects").del();
  await knex("users_subjects").insert([
    { user_id: 1, subject_id: 1 },
    { user_id: 1, subject_id: 2 },
    { user_id: 1, subject_id: 3 },
    { user_id: 1, subject_id: 4 },
    { user_id: 2, subject_id: 1 },
    { user_id: 2, subject_id: 2 },
    { user_id: 2, subject_id: 3 },
    { user_id: 2, subject_id: 4 },
    { user_id: 3, subject_id: 1 },
    { user_id: 3, subject_id: 2 },
    { user_id: 3, subject_id: 3 },
    { user_id: 4, subject_id: 4 },
    { user_id: 4, subject_id: 1 },
    { user_id: 4, subject_id: 2 },
    { user_id: 4, subject_id: 3 },
    { user_id: 4, subject_id: 4 },
  ]);
};
