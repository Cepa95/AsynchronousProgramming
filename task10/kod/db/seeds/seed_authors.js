/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function (knex) {
  return knex("authors")
    .del()
    .then(function () {
      return knex("authors").insert([
        { name: "Author 1" },
        { name: "Author 2" },
        { name: "Author 3" },
        { name: "Author 4" },
        { name: "Author 5" },
      ]);
    });
};
