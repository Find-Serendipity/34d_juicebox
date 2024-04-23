const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { createUser, createRobot, getAllBots } = require("./index");

const createRobots = async () => {
  await prisma.robot.deleteMany({});
  const amountOfRobots = 15;
  const robots = [];

  for (let i = 0; i < amountOfRobots; i++) {
    const robot = createRobot();

    robots.push(robot);
  }

  await prisma.student.createMany({ data: students, skipDuplicates: true });
};

const createUsers = async () => {
  await prisma.user.deleteMany({});
  const amountOfUsers = 3;
  const users = [];

  const robotChoices = getAllBots;

  for (let i = 0; i < amountOfUsers; i++) {
    const user = createUser();

    users.push(user);
  }
  await prisma.instructor.createMany({
    data: users,
    skipDuplicates: true,
  });
};

const main = async () => {
  await createRobots();
  await createUsers();
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
