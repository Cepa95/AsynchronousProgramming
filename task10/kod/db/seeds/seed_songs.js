/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function (knex) {
  return knex("songs")
    .del()
    .then(function () {
      return knex("songs").insert([
        { name: "Song 1" },
        { name: "Song 2" },
        { name: "Song 3" },
        { name: "Song 4" },
        { name: "Song 5" },
      ]);
    });
};
