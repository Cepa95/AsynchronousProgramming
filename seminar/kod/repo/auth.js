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

//ne dajen pravo da se postavlja rola, defaultna je uvijek student
//bar ne pri registraciji, admin ce moci na drugin rutama to prominit
async function registerUser(body) {
  const existingUser = await db("users").where({ email: body.email }).first();
  if (existingUser) {
    throw new Error("User with this email already exists");
  }
  const createdUserId = (
    await db("users").insert({
      name: body.name,
      email: body.email,
      password: await hashPassword(body.password),
    })
  )?.[0];
  return getById(Number(createdUserId));
}

//50 dana cisto za potrebe seminara, da mogu stalno jedan token u postmanu ili swaggeru
//vrtit, postavljan u payload ono sta zelin rolu, email i id
async function loginUser(email, password) {
  const user = await db("users").where({ email }).first();
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await checkPassword(user.password, password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "50d" }
  );
  return { user, token };
}

async function getById(userId) {
  const user = (await db("users").where({ id: userId }))?.[0];
  return user;
}

module.exports = {
  registerUser,
  loginUser,
};
