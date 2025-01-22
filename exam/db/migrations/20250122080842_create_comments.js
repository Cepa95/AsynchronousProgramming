/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("comments", function (table) {
    table.increments('id')
    table.string('message', 255).notNullable()
    table
      .integer("sender_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
      table
      .integer("receiver_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("group_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("groups")
      .onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = function (knex) {
  return knex.schema.dropTable("comments");
};
