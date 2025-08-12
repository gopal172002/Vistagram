const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  location: {
    name: {
      type: String,
      maxlength: 200
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: false
      }
    }
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  shares: {
    count: {
      type: Number,
      default: 0
    },
    sharedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  saves: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  },
  engagement: {
    impressions: { type: Number, default: 0 },
    reach: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes for better performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ likes: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ 'location.coordinates': '2dsphere' });

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Virtual for save count
postSchema.virtual('saveCount').get(function() {
  return this.saves.length;
});

// Virtual for share count
postSchema.virtual('shareCount').get(function() {
  return this.shares.count;
});

// Virtual for formatted timestamp
postSchema.virtual('formattedTimestamp').get(function() {
  const now = new Date();
  const diffInSeconds = Math.floor((now - this.createdAt) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
});

// Method to toggle like
postSchema.methods.toggleLike = function(userId) {
  const likeIndex = this.likes.indexOf(userId);
  if (likeIndex > -1) {
    this.likes.splice(likeIndex, 1);
  } else {
    this.likes.push(userId);
  }
  return this.save();
};

// Method to check if user liked
postSchema.methods.isLikedBy = function(userId) {
  return this.likes.includes(userId);
};

// Method to increment shares
postSchema.methods.incrementShares = function(userId) {
  this.shares.count += 1;
  if (!this.shares.sharedBy.includes(userId)) {
    this.shares.sharedBy.push(userId);
  }
  return this.save();
};

// Method to toggle save
postSchema.methods.toggleSave = function(userId) {
  const saveIndex = this.saves.indexOf(userId);
  if (saveIndex > -1) {
    this.saves.splice(saveIndex, 1);
  } else {
    this.saves.push(userId);
  }
  return this.save();
};

// Method to check if user saved
postSchema.methods.isSavedBy = function(userId) {
  return this.saves.includes(userId);
};

// Method to increment view count
postSchema.methods.incrementView = function() {
  this.viewCount += 1;
  this.engagement.impressions += 1;
  return this.save();
};

// Method to add comment
postSchema.methods.addComment = function(commentId) {
  this.comments.push(commentId);
  return this.save();
};

// Method to remove comment
postSchema.methods.removeComment = function(commentId) {
  this.comments = this.comments.filter(id => !id.equals(commentId));
  return this.save();
};

// Method to get public post data (without sensitive info)
postSchema.methods.getPublicData = function() {
  return {
    _id: this._id,
    author: this.author,
    image: this.image,
    caption: this.caption,
    location: this.location,
    tags: this.tags,
    likeCount: this.likeCount,
    commentCount: this.commentCount,
    saveCount: this.saveCount,
    shareCount: this.shareCount,
    viewCount: this.viewCount,
    formattedTimestamp: this.formattedTimestamp,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.model('Post', postSchema);
