const Post = require("../models/Post");
const mongoose = require("mongoose");

// Create a new post
const createPost = async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content required" });
  }

  try {
    const post = await Post.create({
      title,
      content,
      category,
      author: req.user._id,
    });

    res.status(201).json(post);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ message: "Failed to create post" });
  }
};

// Get all posts with optional category filtering & pagination
const getPosts = async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;

  const query = {};

  if (category) {
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    query.category = category; // let mongoose handle the casting
  }

  const pageLimit = Number(limit);
  const skip = (Number(page) - 1) * pageLimit;

  try {
    const posts = await Post.find(query)
      .skip(skip)
      .limit(pageLimit)
      .populate("author", "username");

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};

// Get single post by ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "username");

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(500).json({ message: "Error fetching post" });
  }
};

// Update a post
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: Missing user authentication context." });
    }

    // Ensure user is the author using Mongoose's .equals()
    if (!post.author.equals(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content; 
    
    if (req.body.category) {
      if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
        return res.status(400).json({ message: "Invalid category ID format" });
    }
  post.category = req.body.category; // let mongoose cast automatically
 }

    const updated = await post.save();
    res.json(updated);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: "Post not found" });
    }
    // Handle validation errors during save (e.g., empty title/content after update)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(400).json({ message: "Update failed: Invalid data" });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!req.user || !req.user._id) {
        return res.status(401).json({ message: "Unauthorized: Missing user authentication context." });
    }

    if (!post.author.equals(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await post.remove();
    res.json({ message: "Post deleted" });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(500).json({ message: "Deletion failed" });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};