const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");

// Create

// allow a random person to register on the api
const registerUser = async (username, password) => {
  try {
    const user = await prisma.user.create({
      data: {
        username,
        password,
      },
    });

    return user;
  } catch (err) {
    throw err;
  }
};

// create a random user and their posts for the seed
const createUser = async () => {
  try {
    const fakeUsername = faker.internet.userName();
    const plainTextPassword = faker.internet.password();
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);

    const user = await prisma.user.create({
      data: {
        username: fakeUsername,
        password: hashedPassword,
        post: {
          create: [
            { title: faker.color.human(), content: faker.lorem.lines(5) },
            { title: faker.color.human(), content: faker.lorem.lines(7) },
            { title: faker.color.human(), content: faker.lorem.lines(5) },
          ],
        },
      },
      include: {
        post: true,
      },
    });

    return user;
  } catch (err) {
    throw err;
  }
};

const createPost = async (title, content) => {
  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
      },
      include: {
        userId: true,
      },
    });

    return post;
  } catch (err) {
    throw err;
  }
};

// Read

const getAllPosts = async () => {
  try {
    const rows = await prisma.post.findMany();

    return rows;
  } catch (err) {
    throw err;
  }
};

const getPostById = async (id) => {
  try {
    const postById = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    return postById.post;
  } catch (err) {
    throw err;
  }
};

const getPostsByUser = async (userId) => {
  try {
    const postsByUser = await prisma.user.findUnique({
      where: {
        userId,
      },
      include: {
        post: true,
      },
    });

    return postsByUser.post;
  } catch (err) {
    throw err;
  }
};

const getAllUsers = async () => {
  try {
    const rows = await prisma.user.findMany();

    return rows;
  } catch (err) {
    throw err;
  }
};

const getUserById = async (id) => {
  try {
    const userById = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return userById.user;
  } catch (err) {
    throw err;
  }
};

const getUserByUsername = async (username) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    return user;
  } catch (err) {
    throw err;
  }
};

// Update

const updateUser = async (username, password) => {
  try {
    const plainTextPassword = password;
    const saltRounds = 32;
    const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);

    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        username,
        password: hashedPassword,
      },
    });

    return updatedUser;
  } catch (err) {
    throw err;
  }
};

// Delete

const deletePost = async (id) => {
  try {
    const post = await prisma.post.delete({
      where: {
        id: parseInt(id),
        userId: req.user.id,
      },
    });

    return post;
  } catch (err) {
    console.log("ERROR", err);
    throw err;
  }
};

module.exports = {
  registerUser,
  createUser,
  createPost,
  getAllPosts,
  getPostById,
  getPostsByUser,
  getAllUsers,
  getUserByUsername,
  updateUser,
  deletePost,
};
