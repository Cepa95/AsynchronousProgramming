/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("author_songs", function (table) {
    table
      .integer("author_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("authors")
      .onDelete("CASCADE");
    table
      .integer("song_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("songs")
      .onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.primary(["author_id", "song_id"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = function (knex) {
  return knex.schema.dropTable("author_songs");
};
