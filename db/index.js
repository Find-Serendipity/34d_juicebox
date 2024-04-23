const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { faker } = require("@faker-js/faker");
const { bcrypt } = require("bcrypt");

// Create

const registerUser = async (username, password) => {
  try {
    const plainTextPassword = password;
    const saltRounds = 32;
    const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);

    const user = await prisma.user.create({
      data: {
        username,
        hashedPassword,
      },
    });

    return user;
  } catch (err) {
    throw err;
  }
};

const createUser = async () => {
  try {
    const username = faker.internet.userName();
    const plainTextPassword = faker.internet.password();
    const saltRounds = 32;
    const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);

    const user = await prisma.user.create({
      data: {
        username,
        hashedPassword,
      },
    });

    return user;
  } catch (err) {
    throw err;
  }
};

const createPost = async () => {
  try {
    const name = faker.person.firstName();
    const title = faker.color.cmyk();
    const content = faker.lorem.lines(2);

    const post = await prisma.post.create({
      data: {
        name,
        title,
        content,
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

// Update

const updateUser = async (username, password, post) => {
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

const addPoststoUser = async (user, post) => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        post: { connect: post },
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
  getAllUsers,
  getUserById,
  updateUser,
  addPoststoUser,
  deletePost,
};
