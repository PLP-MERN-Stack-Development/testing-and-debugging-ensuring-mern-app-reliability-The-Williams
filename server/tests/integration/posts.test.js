// posts.test.js - Fully isolated integration tests for posts API endpoints
require("dotenv").config({ path: ".env.test" });
const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const app = require('../../src/app');
const Post = require('../../src/models/Post');
const User = require('../../src/models/User');

let token;
let userId;

beforeAll(async () => {
  const user = await User.create({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
  });
  userId = user._id;

  // Generate JWT token using the test secret
  token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
});

afterEach(async () => {
  await Post.deleteMany({});
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});

// ---------------- POST /api/posts ----------------
describe('POST /api/posts', () => {
  it('should create a new post when authenticated', async () => {
    const newPost = {
      title: 'New Test Post',
      content: 'This is a new test post content',
      category: new mongoose.Types.ObjectId(),
    };

    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(newPost);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.author).toBe(userId.toString());
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({ title: 'No Auth', content: 'Test', category: new mongoose.Types.ObjectId() });

    expect(res.status).toBe(401);
  });

  it('should return 400 if validation fails', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Missing title', category: new mongoose.Types.ObjectId() });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

// ---------------- GET /api/posts ----------------
describe('GET /api/posts', () => {
  it('should return all posts', async () => {
    await Post.create({
      title: 'Sample Post',
      content: 'Content',
      author: userId,
      category: new mongoose.Types.ObjectId(),
      slug: 'sample-post',
    });

    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should filter posts by category', async () => {
    const categoryId = new mongoose.Types.ObjectId(); // Keep as ObjectId

    await Post.create({
      title: 'Filtered Post',
      content: 'Content',
      author: userId,
      category: categoryId, // Must be ObjectId
      slug: 'filtered-post',
    });

    const res = await request(app).get(`/api/posts?category=${categoryId.toString()}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].category.toString()).toBe(categoryId.toString());
  });

  it('should paginate results', async () => {
    const posts = [];
    for (let i = 0; i < 15; i++) {
      posts.push({
        title: `Pagination Post ${i}`,
        content: `Content ${i}`,
        author: userId,
        category: new mongoose.Types.ObjectId(),
        slug: `pagination-post-${i}`,
      });
    }
    await Post.insertMany(posts);

    const page1 = await request(app).get('/api/posts?page=1&limit=10');
    const page2 = await request(app).get('/api/posts?page=2&limit=10');

    expect(page1.body.length).toBe(10);
    expect(page2.body.length).toBeGreaterThan(0);
  });
});

// ---------------- PUT /api/posts/:id ----------------
describe('PUT /api/posts/:id', () => {
  it('should update a post when authenticated as author', async () => {
    const post = await Post.create({
      title: 'Old Title',
      content: 'Old Content',
      author: userId,
      category: new mongoose.Types.ObjectId(),
      slug: 'update-test',
    });

    const updates = { title: 'New Title', content: 'New Content' };

    const res = await request(app)
      .put(`/api/posts/${post._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updates);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe(updates.title);
  });

  it('should return 401 if not authenticated', async () => {
    const post = await Post.create({
      title: 'Auth Test',
      content: 'Content',
      author: userId,
      category: new mongoose.Types.ObjectId(),
      slug: 'auth-test',
    });

    const res = await request(app).put(`/api/posts/${post._id}`).send({ title: 'No Auth' });
    expect(res.status).toBe(401);
  });

  it('should return 403 if not the author', async () => {
    const anotherUser = await User.create({
      username: 'anotheruser',
      email: 'another@example.com',
      password: 'password123',
    });

    const anotherToken = jwt.sign({ id: anotherUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const post = await Post.create({
      title: 'Forbidden',
      content: 'Content',
      author: userId,
      category: new mongoose.Types.ObjectId(),
      slug: 'forbidden-test',
    });

    const res = await request(app)
      .put(`/api/posts/${post._id}`)
      .set('Authorization', `Bearer ${anotherToken}`)
      .send({ title: 'Try Update' });

    expect(res.status).toBe(403);
  });
});

// ---------------- DELETE /api/posts/:id ----------------
describe('DELETE /api/posts/:id', () => {
  it('should delete a post when authenticated as author', async () => {
    const post = await Post.create({
      title: 'Delete Me',
      content: 'Content',
      author: userId,
      category: new mongoose.Types.ObjectId(),
      slug: 'delete-me',
    });

    const res = await request(app)
      .delete(`/api/posts/${post._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const deletedPost = await Post.findById(post._id);
    expect(deletedPost).toBeNull();
  });

  it('should return 401 if not authenticated', async () => {
    const post = await Post.create({
      title: 'Delete Auth Test',
      content: 'Content',
      author: userId,
      category: new mongoose.Types.ObjectId(),
      slug: 'delete-auth-test',
    });

    const res = await request(app).delete(`/api/posts/${post._id}`);
    expect(res.status).toBe(401);
  });
});
