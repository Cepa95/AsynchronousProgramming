const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SALT_ROUNDS = 10;
function hashPassword(pass) {
  return bcrypt.hash(pass, SALT_ROUNDS);
}

function checkPassword(hashPassword, plainPass) {
  return bcrypt.compare(plainPass, hashPassword);
}

async function create(body) {
  const existingUser = await db("users").where({ email: body.email }).first();
  if (existingUser) {
    throw new Error("User with this email already exists");
  }
  const createdUserId = (
    await db("users").insert({
      email: body.email,
      password: await hashPassword(body.password),
    })
  )?.[0];
  return getById(Number(createdUserId));
}

async function getById(userId) {
  const user = (await db("users").where({ id: userId }))?.[0];
  return user;
}

async function getByEmail(email) {
  const user = (await db("users").where({ email }))?.[0];
  return user;
}

function jwtUserId(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET);
}

async function deleteByEmail(email) {
  await db("users").where({ email }).del();
}

module.exports = {
  create,
  hashPassword,
  checkPassword,
  getByEmail,
  jwtUserId,
  deleteByEmail
};
