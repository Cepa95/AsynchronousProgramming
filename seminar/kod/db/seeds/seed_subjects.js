/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("subjects").del();
  await knex("subjects").insert([
    { name: "Asinkrono web programiranje", ects: 6 },
    { name: "Napredno web programiranje", ects: 6 },
    { name: "Sustavi za skladistenje podataka", ects: 6 },
    { name: "Graf algoritmi", ects: 6 },
    { name: "Napredno prospajanje u racunalnim mrezama", ects: 4 },
  ]);
};
