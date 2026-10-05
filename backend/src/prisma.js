//para que reutilize a mesma conexão com o banco de dados
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;