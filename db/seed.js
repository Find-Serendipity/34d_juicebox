const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { createUser } = require("./index");

const createUsers = async () => {
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});
  const amountOfUsers = 3;
  const users = [];

  for (let i = 0; i < amountOfUsers; i++) {
    const user = await createUser();
    console.log(user);

    users.push(user);
  }
};

async function main() {
  await createUsers();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
