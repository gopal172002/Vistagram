const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Post = require('../models/Post');

describe('Post API Tests', () => {
  let testPostId;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/vistagram_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Clean up and disconnect
    await Post.deleteMany({});
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Clear posts before each test
    await Post.deleteMany({});
  });

  describe('GET /api/posts', () => {
    it('should return empty array when no posts exist', async () => {
      const response = await request(app)
        .get('/api/posts')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.pagination).toBeDefined();
    });

    it('should return posts in reverse chronological order', async () => {
      // Create test posts
      const post1 = await Post.create({
        username: 'testuser1',
        image: 'https://example.com/image1.jpg',
        caption: 'First post',
        timestamp: new Date('2023-01-01')
      });

      const post2 = await Post.create({
        username: 'testuser2',
        image: 'https://example.com/image2.jpg',
        caption: 'Second post',
        timestamp: new Date('2023-01-02')
      });

      const response = await request(app)
        .get('/api/posts')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]._id).toBe(post2._id.toString());
      expect(response.body.data[1]._id).toBe(post1._id.toString());
    });

    it('should support pagination', async () => {
      // Create multiple posts
      const posts = [];
      for (let i = 0; i < 15; i++) {
        posts.push({
          username: `user${i}`,
          image: `https://example.com/image${i}.jpg`,
          caption: `Post ${i}`,
          timestamp: new Date()
        });
      }
      await Post.insertMany(posts);

      const response = await request(app)
        .get('/api/posts?page=1&limit=10')
        .expect(200);

      expect(response.body.data).toHaveLength(10);
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.hasNextPage).toBe(true);
    });
  });

  describe('POST /api/posts', () => {
    it('should create a new post successfully', async () => {
      const postData = {
        username: 'testuser',
        image: 'https://example.com/image.jpg',
        caption: 'Test caption'
      };

      const response = await request(app)
        .post('/api/posts')
        .send(postData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.username).toBe(postData.username);
      expect(response.body.data.image).toBe(postData.image);
      expect(response.body.data.caption).toBe(postData.caption);
      expect(response.body.data.likes).toBe(0);
      expect(response.body.data.shares).toBe(0);
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/posts')
        .send({ username: 'testuser' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });

    it('should return 400 for caption exceeding 500 characters', async () => {
      const longCaption = 'a'.repeat(501);
      const postData = {
        username: 'testuser',
        image: 'https://example.com/image.jpg',
        caption: longCaption
      };

      const response = await request(app)
        .post('/api/posts')
        .send(postData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('500 characters');
    });
  });

  describe('PUT /api/posts/:id/like', () => {
    beforeEach(async () => {
      const post = await Post.create({
        username: 'testuser',
        image: 'https://example.com/image.jpg',
        caption: 'Test post'
      });
      testPostId = post._id.toString();
    });

    it('should like a post successfully', async () => {
      const response = await request(app)
        .put(`/api/posts/${testPostId}/like`)
        .send({ username: 'liker' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.liked).toBe(true);
      expect(response.body.data.likes).toBe(1);
    });

    it('should unlike a post when already liked', async () => {
      // First like the post
      await request(app)
        .put(`/api/posts/${testPostId}/like`)
        .send({ username: 'liker' });

      // Then unlike it
      const response = await request(app)
        .put(`/api/posts/${testPostId}/like`)
        .send({ username: 'liker' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.liked).toBe(false);
      expect(response.body.data.likes).toBe(0);
    });

    it('should return 400 for missing username', async () => {
      const response = await request(app)
        .put(`/api/posts/${testPostId}/like`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Username is required');
    });

    it('should return 404 for non-existent post', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .put(`/api/posts/${fakeId}/like`)
        .send({ username: 'liker' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Post not found');
    });
  });

  describe('PUT /api/posts/:id/share', () => {
    beforeEach(async () => {
      const post = await Post.create({
        username: 'testuser',
        image: 'https://example.com/image.jpg',
        caption: 'Test post',
        shares: 5
      });
      testPostId = post._id.toString();
    });

    it('should increment share count successfully', async () => {
      const response = await request(app)
        .put(`/api/posts/${testPostId}/share`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.shares).toBe(6);
    });

    it('should return 404 for non-existent post', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .put(`/api/posts/${fakeId}/share`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Post not found');
    });
  });

  describe('GET /api/posts/:id', () => {
    beforeEach(async () => {
      const post = await Post.create({
        username: 'testuser',
        image: 'https://example.com/image.jpg',
        caption: 'Test post'
      });
      testPostId = post._id.toString();
    });

    it('should return a single post by ID', async () => {
      const response = await request(app)
        .get(`/api/posts/${testPostId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testPostId);
      expect(response.body.data.username).toBe('testuser');
    });

    it('should return 404 for non-existent post', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .get(`/api/posts/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Post not found');
    });
  });

  describe('DELETE /api/posts/:id', () => {
    beforeEach(async () => {
      const post = await Post.create({
        username: 'testuser',
        image: 'https://example.com/image.jpg',
        caption: 'Test post'
      });
      testPostId = post._id.toString();
    });

    it('should delete a post successfully', async () => {
      const response = await request(app)
        .delete(`/api/posts/${testPostId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted successfully');

      // Verify post is actually deleted
      const deletedPost = await Post.findById(testPostId);
      expect(deletedPost).toBeNull();
    });

    it('should return 404 for non-existent post', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .delete(`/api/posts/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Post not found');
    });
  });
});
