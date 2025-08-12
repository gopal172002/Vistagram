const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better performance
commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ author: 1 });

// Virtual for like count
commentSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for reply count
commentSchema.virtual('replyCount').get(function() {
  return this.replies.length;
});

// Method to add like
commentSchema.methods.addLike = function(userId) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
  }
  return this.save();
};

// Method to remove like
commentSchema.methods.removeLike = function(userId) {
  this.likes = this.likes.filter(id => !id.equals(userId));
  return this.save();
};

// Method to check if user liked
commentSchema.methods.isLikedBy = function(userId) {
  return this.likes.includes(userId);
};

// Method to add reply
commentSchema.methods.addReply = function(authorId, content) {
  this.replies.push({
    author: authorId,
    content: content
  });
  return this.save();
};

// Method to remove reply
commentSchema.methods.removeReply = function(replyId) {
  this.replies = this.replies.filter(reply => !reply._id.equals(replyId));
  return this.save();
};

module.exports = mongoose.model('Comment', commentSchema);

