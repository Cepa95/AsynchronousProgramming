// filepath: /c:/Users/Josip Čeprnić/Desktop/2024_Cepa95_Cr4zyCRO/kod/swagger.js
const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Koa API",
    description: "A simple API documentation",
  },
  host: "localhost:4000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = [
  "./route/users.js",
  "./route/auth.js",
  "./route/subjects.js",
  "./users_subjects.js"
];

swaggerAutogen(outputFile, endpointsFiles, doc);
