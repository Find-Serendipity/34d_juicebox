const postsRouter = require("express").Router();
const { requireUser } = require("./utils");

const {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByUser,
} = require("../db");

// Create/Login

// create new post content - PATH: /api/posts/createpost

postsRouter.post("/createpost", requireUser, async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = await createPost({
      title,
      content,
    });

    res.send(newPost);
  } catch (err) {
    res.sendStatus(500);
  }
});

// Read

// Get all posts - PATH: /api/posts/
postsRouter.get("/", async (req, res) => {
  try {
    //get all the posts
    const posts = await getAllPosts();

    res.send(posts);
  } catch (err) {
    res.sendStatus(500);
  }
});

// Get all a single user's posts - PATH: /api/posts/:userid/:id
postsRouter.get("/:userid/:id", requireUser, async (req, res) => {
  try {
    const userid = req.user.id;
    const posts = await getPostsByUser(userid);

    res.send(posts);
  } catch (err) {
    res.sendStatus(500);
  }
});

// Get all a single post by post ID - PATH: /api/posts/:id
postsRouter.get("/:id", requireUser, async (req, res) => {
  try {
    const posts = await getPostById(req.params.id);

    res.send(posts);
  } catch (err) {
    res.sendStatus(500);
  }
});

// Delete

// Delete a single user's single post - PATH: /api/posts/:id
postsRouter.delete("/:id", requireUser, async (req, res) => {
  try {
    const userid = req.user.id;
    const postId = req.params.id;

    // if the user sending the request is NOT the logged in user
    // send an error message
    if (!userid) {
      res.sendStatus(401);
    }
    // else, delete the post
    else {
      const result = await deletePost(postId);
      res.send(result);
    }
  } catch (err) {
    res.sendStatus(500);
  }
});

module.exports = postsRouter;
