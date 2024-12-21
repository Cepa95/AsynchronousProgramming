const db = require("../db");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

function hashPassword(pass) {
  return bcrypt.hash(pass, SALT_ROUNDS);
}

async function getUsers() {
  return db("users").select("*");
}

const deleteUser = async (id) => {
  return db("users").where({ id }).del();
};

const updateUser = async (id, user) => {
  return db("users").where({ id }).update(user);
};

const getUserById = async (id) => {
  return db("users").where({ id }).first();
};

async function getById(userId) {
  const user = (await db("users").where({ id: userId }))?.[0];
  return user;
}

async function createUser(body) {
  const existingUser = await db("users").where({ email: body.email }).first();
  if (existingUser) {
    throw new Error("User with this email already exists");
  }
  const createdUserId = (
    await db("users").insert({
      name: body.name,
      email: body.email,
      password: await hashPassword(body.password),
      role: body.role,
    })
  )?.[0];
  return getById(Number(createdUserId));
}

module.exports = {
  getUsers,
  deleteUser,
  updateUser,
  getUserById,
  createUser,
};
