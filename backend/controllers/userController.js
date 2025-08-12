const User = require('../models/User');
const Post = require('../models/Post');

// Get user profile by username
const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const currentUserId = req.user?._id;

    const user = await User.findOne({ username })
      .populate('posts', 'image caption createdAt likeCount commentCount')
      .populate('followers', 'username fullName profilePicture')
      .populate('following', 'username fullName profilePicture');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if current user is following this user
    let isFollowing = false;
    if (currentUserId) {
      const currentUser = await User.findById(currentUserId);
      isFollowing = currentUser.isFollowing(user._id);
    }

    const userData = user.getPublicProfile();

    res.json({
      success: true,
      data: {
        user: userData,
        posts: user.posts,
        followers: user.followers,
        following: user.following,
        isFollowing
      }
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    });
  }
};

// Follow user
const followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (currentUserId.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      });
    }

    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const currentUser = await User.findById(currentUserId);

    // Check if already following
    if (currentUser.isFollowing(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Already following this user'
      });
    }

    // Follow the user
    await currentUser.follow(userId);
    await userToFollow.addFollower(currentUserId);

    res.json({
      success: true,
      message: 'User followed successfully'
    });

  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to follow user'
    });
  }
};

// Unfollow user
const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const userToUnfollow = await User.findById(userId);
    if (!userToUnfollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const currentUser = await User.findById(currentUserId);

    // Check if not following
    if (!currentUser.isFollowing(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Not following this user'
      });
    }

    // Unfollow the user
    await currentUser.unfollow(userId);
    await userToUnfollow.removeFollower(currentUserId);

    res.json({
      success: true,
      message: 'User unfollowed successfully'
    });

  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unfollow user'
    });
  }
};

// Get followers list
const getFollowers = async (req, res) => {
  try {
    const { username } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const followers = await User.findById(user._id)
      .populate({
        path: 'followers',
        select: 'username fullName profilePicture bio isVerified',
        options: {
          skip: (page - 1) * limit,
          limit: parseInt(limit)
        }
      });

    res.json({
      success: true,
      data: {
        followers: followers.followers,
        total: user.followerCount,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get followers'
    });
  }
};

// Get following list
const getFollowing = async (req, res) => {
  try {
    const { username } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const following = await User.findById(user._id)
      .populate({
        path: 'following',
        select: 'username fullName profilePicture bio isVerified',
        options: {
          skip: (page - 1) * limit,
          limit: parseInt(limit)
        }
      });

    res.json({
      success: true,
      data: {
        following: following.following,
        total: user.followingCount,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get following'
    });
  }
};

// Search users
const searchUsers = async (req, res) => {
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
    
    const users = await User.find({
      $or: [
        { username: searchRegex },
        { fullName: searchRegex }
      ]
    })
    .select('username fullName profilePicture bio isVerified followerCount')
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort({ followerCount: -1, username: 1 });

    // Add isFollowing field if user is authenticated
    if (currentUserId) {
      const currentUser = await User.findById(currentUserId);
      users.forEach(user => {
        user.isFollowing = currentUser.isFollowing(user._id);
      });
    }

    const total = await User.countDocuments({
      $or: [
        { username: searchRegex },
        { fullName: searchRegex }
      ]
    });

    res.json({
      success: true,
      data: {
        users,
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search users'
    });
  }
};

// Get suggested users to follow
const getSuggestedUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { limit = 10 } = req.query;

    const currentUser = await User.findById(currentUserId);
    
    // Get users that the current user is not following
    const suggestedUsers = await User.find({
      _id: { 
        $nin: [...currentUser.following, currentUserId] 
      }
    })
    .select('username fullName profilePicture bio isVerified followerCount')
    .sort({ followerCount: -1, createdAt: -1 })
    .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        users: suggestedUsers
      }
    });

  } catch (error) {
    console.error('Get suggested users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get suggested users'
    });
  }
};

// Get user's saved posts
const getSavedPosts = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findById(currentUserId)
      .populate({
        path: 'likedPosts',
        select: 'image caption createdAt likeCount commentCount author',
        populate: {
          path: 'author',
          select: 'username fullName profilePicture'
        },
        options: {
          skip: (page - 1) * limit,
          limit: parseInt(limit),
          sort: { createdAt: -1 }
        }
      });

    res.json({
      success: true,
      data: {
        posts: user.likedPosts,
        total: user.likedPosts.length,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get saved posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get saved posts'
    });
  }
};

// Get user's posts with pagination
const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const posts = await Post.find({ 
      author: user._id,
      isArchived: false 
    })
    .populate('author', 'username fullName profilePicture')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

    const total = await Post.countDocuments({ 
      author: user._id,
      isArchived: false 
    });

    res.json({
      success: true,
      data: {
        posts,
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user posts'
    });
  }
};

module.exports = {
  getUserProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  searchUsers,
  getSuggestedUsers,
  getSavedPosts,
  getUserPosts
};

