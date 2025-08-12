const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_]+$/
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  profilePicture: {
    type: String,
    default: ''
  },
  coverPhoto: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    maxlength: 100,
    default: ''
  },
  website: {
    type: String,
    maxlength: 200,
    default: ''
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  likedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'dark'
    },
    notifications: {
      likes: { type: Boolean, default: true },
      comments: { type: Boolean, default: true },
      follows: { type: Boolean, default: true },
      mentions: { type: Boolean, default: true }
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for follower count
userSchema.virtual('followerCount').get(function() {
  return this.followers.length;
});

// Virtual for following count
userSchema.virtual('followingCount').get(function() {
  return this.following.length;
});

// Virtual for post count
userSchema.virtual('postCount').get(function() {
  return this.posts.length;
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  return {
    _id: this._id,
    username: this.username,
    fullName: this.fullName,
    bio: this.bio,
    profilePicture: this.profilePicture,
    coverPhoto: this.coverPhoto,
    location: this.location,
    website: this.website,
    followerCount: this.followerCount,
    followingCount: this.followingCount,
    postCount: this.postCount,
    isVerified: this.isVerified,
    isPrivate: this.isPrivate,
    createdAt: this.createdAt,
    lastActive: this.lastActive
  };
};

// Method to check if user is following another user
userSchema.methods.isFollowing = function(userId) {
  return this.following.includes(userId);
};

// Method to follow a user
userSchema.methods.follow = function(userId) {
  if (!this.following.includes(userId)) {
    this.following.push(userId);
  }
  return this.save();
};

// Method to unfollow a user
userSchema.methods.unfollow = function(userId) {
  this.following = this.following.filter(id => !id.equals(userId));
  return this.save();
};

// Method to add follower
userSchema.methods.addFollower = function(userId) {
  if (!this.followers.includes(userId)) {
    this.followers.push(userId);
  }
  return this.save();
};

// Method to remove follower
userSchema.methods.removeFollower = function(userId) {
  this.followers = this.followers.filter(id => !id.equals(userId));
  return this.save();
};

module.exports = mongoose.model('User', userSchema);

