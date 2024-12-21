const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    {
      name: "Bruno",
      email: "bruno@gmail.com",
      password: await bcrypt.hash("123", SALT_ROUNDS),
      role: "student",
    },
    {
      name: "Josip",
      email: "josip@gmail.com",
      password: await bcrypt.hash("123", SALT_ROUNDS),
      role: "student",
    },
    {
      name: "Ivan",
      email: "ivan@gmail.com",
      password: await bcrypt.hash("123", SALT_ROUNDS),
      role: "student",
    },
    {
      name: "Ante",
      email: "ante@gmail.com",
      password: await bcrypt.hash("123", SALT_ROUNDS),
      role: "student",
    },
    {
      name: "Admin",
      email: "admin@gmail.com",
      password: await bcrypt.hash("123", SALT_ROUNDS),
      role: "admin",
    },
  ]);
};
