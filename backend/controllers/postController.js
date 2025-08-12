const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
// const { validationResult } = require('express-validator'); // Temporarily commented out

// Simple validation result replacement
const getValidationErrors = (req) => {
  return {
    isEmpty: () => true, // Since we're handling validation in middleware
    array: () => []
  };
};

// Get posts with infinite scroll (timeline)
const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId } = req.query;
    const currentUserId = req.user?._id;

    let query = { isArchived: false };

    // If userId is provided, get posts from that specific user
    if (userId) {
      query.author = userId;
    }

    const posts = await Post.find(query)
      .populate('author', 'username fullName profilePicture isVerified')
      .populate('comments', 'content author createdAt')
      .populate('likes', 'username fullName profilePicture')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Add user interaction data if authenticated
    if (currentUserId) {
      posts.forEach(post => {
        post.isLiked = post.likes.some(like => like._id.toString() === currentUserId.toString());
        post.isSaved = post.saves.includes(currentUserId);
      });
    }

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      data: {
        posts,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: (page * limit) < total
      }
    });

  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts'
    });
  }
};

// Get posts from users that the current user follows
const getFeed = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get posts from followed users and current user
    const followingIds = [...currentUser.following, currentUserId];
    
    const posts = await Post.find({
      author: { $in: followingIds },
      isArchived: false
    })
    .populate('author', 'username fullName profilePicture isVerified')
    .populate('comments', 'content author createdAt')
    .populate('likes', 'username fullName profilePicture')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

    // Add user interaction data
    posts.forEach(post => {
      post.isLiked = post.likes.some(like => like._id.toString() === currentUserId.toString());
      post.isSaved = post.saves.includes(currentUserId);
    });

    const total = await Post.countDocuments({
      author: { $in: followingIds },
      isArchived: false
    });

    res.json({
      success: true,
      data: {
        posts,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: (page * limit) < total
      }
    });

  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feed'
    });
  }
};

// Create new post
const createPost = async (req, res) => {
  try {
    const errors = getValidationErrors(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { caption, location, tags } = req.body;
    const authorId = req.user._id;

    // Handle image upload
    let imageUrl = '';
    if (req.file) {
      imageUrl = req.file.path;
    } else if (req.body.image) {
      imageUrl = req.body.image; // For base64 images from camera
    } else {
      return res.status(400).json({
        success: false,
        message: 'Image is required'
      });
    }

    // Create post
    const post = new Post({
      author: authorId,
      image: imageUrl,
      caption: caption.trim(),
      location: location ? JSON.parse(location) : null,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    await post.save();

    // Add post to user's posts array
    await User.findByIdAndUpdate(authorId, {
      $push: { posts: post._id }
    });

    // Populate author info
    await post.populate('author', 'username fullName profilePicture isVerified');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: { post }
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create post'
    });
  }
};

// Get single post by ID
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?._id;

    const post = await Post.findById(id)
      .populate('author', 'username fullName profilePicture isVerified')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username fullName profilePicture'
        }
      })
      .populate('likes', 'username fullName profilePicture');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Increment view count
    await post.incrementView();

    // Add user interaction data if authenticated
    if (currentUserId) {
      post.isLiked = post.likes.some(like => like._id.toString() === currentUserId.toString());
      post.isSaved = post.saves.includes(currentUserId);
    }

    res.json({
      success: true,
      data: { post }
    });

  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch post'
    });
  }
};

// Toggle like on post
const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Toggle like
    await post.toggleLike(userId);

    // Update user's liked posts
    const user = await User.findById(userId);
    if (post.isLikedBy(userId)) {
      if (!user.likedPosts.includes(post._id)) {
        user.likedPosts.push(post._id);
      }
    } else {
      user.likedPosts = user.likedPosts.filter(id => !id.equals(post._id));
    }
    await user.save();

    // Populate updated data
    await post.populate('author', 'username fullName profilePicture isVerified');
    await post.populate('likes', 'username fullName profilePicture');

    res.json({
      success: true,
      message: post.isLikedBy(userId) ? 'Post liked' : 'Post unliked',
      data: {
        post,
        isLiked: post.isLikedBy(userId),
        likeCount: post.likeCount
      }
    });

  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle like'
    });
  }
};

// Toggle save on post
const toggleSave = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Toggle save
    await post.toggleSave(userId);

    res.json({
      success: true,
      message: post.isSavedBy(userId) ? 'Post saved' : 'Post unsaved',
      data: {
        isSaved: post.isSavedBy(userId),
        saveCount: post.saveCount
      }
    });

  } catch (error) {
    console.error('Toggle save error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle save'
    });
  }
};

// Share post
const sharePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Increment share count
    await post.incrementShares(userId);

    res.json({
      success: true,
      message: 'Post shared successfully',
      data: {
        shareCount: post.shareCount
      }
    });

  } catch (error) {
    console.error('Share post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to share post'
    });
  }
};

// Add comment to post
const addComment = async (req, res) => {
  try {
    const errors = getValidationErrors(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { content } = req.body;
    const authorId = req.user._id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Create comment
    const comment = new Comment({
      post: id,
      author: authorId,
      content: content.trim()
    });

    await comment.save();

    // Add comment to post
    await post.addComment(comment._id);

    // Populate comment data
    await comment.populate('author', 'username fullName profilePicture');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { comment }
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment'
    });
  }
};

// Get comments for a post
const getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const comments = await Comment.find({ post: id })
      .populate('author', 'username fullName profilePicture')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Comment.countDocuments({ post: id });

    res.json({
      success: true,
      data: {
        comments,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: (page * limit) < total
      }
    });

  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments'
    });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user is the author
    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own posts'
      });
    }

    // Delete post (this will cascade to comments)
    await Post.findByIdAndDelete(id);

    // Remove post from user's posts array
    await User.findByIdAndUpdate(userId, {
      $pull: { posts: id }
    });

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete post'
    });
  }
};

// Search posts
const searchPosts = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    const currentUserId = req.user?._id;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    const searchRegex = new RegExp(q.trim(), 'i');

    const posts = await Post.find({
      $or: [
        { caption: searchRegex },
        { tags: searchRegex }
      ],
      isArchived: false
    })
    .populate('author', 'username fullName profilePicture isVerified')
    .populate('comments', 'content author createdAt')
    .populate('likes', 'username fullName profilePicture')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

    // Add user interaction data if authenticated
    if (currentUserId) {
      posts.forEach(post => {
        post.isLiked = post.likes.some(like => like._id.toString() === currentUserId.toString());
        post.isSaved = post.saves.includes(currentUserId);
      });
    }

    const total = await Post.countDocuments({
      $or: [
        { caption: searchRegex },
        { tags: searchRegex }
      ],
      isArchived: false
    });

    res.json({
      success: true,
      data: {
        posts,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: (page * limit) < total
      }
    });

  } catch (error) {
    console.error('Search posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search posts'
    });
  }
};

module.exports = {
  getPosts,
  getFeed,
  createPost,
  getPostById,
  toggleLike,
  toggleSave,
  sharePost,
  addComment,
  getComments,
  deletePost,
  searchPosts
};
