import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: [true, 'El mensaje es requerido'],
    trim: true,
    maxlength: [500, 'El mensaje no puede exceder 500 caracteres']
  },
  category: {
    type: String,
    enum: ['salud', 'planeta', 'general', 'consejos', 'logros'],
    default: 'general'
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  replies: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: [300, 'La respuesta no puede exceder 300 caracteres']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  isPinned: {
    type: Boolean,
    default: false
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Índices para mejorar rendimiento
communitySchema.index({ category: 1, createdAt: -1 });
communitySchema.index({ user: 1, createdAt: -1 });
communitySchema.index({ tags: 1 });
communitySchema.index({ 'likes.user': 1 });

// Método para agregar like
communitySchema.methods.addLike = function(userId) {
  const existingLike = this.likes.find(like => like.user.toString() === userId.toString());
  
  if (!existingLike) {
    this.likes.push({ user: userId });
    return true;
  }
  
  return false;
};

// Método para remover like
communitySchema.methods.removeLike = function(userId) {
  const likeIndex = this.likes.findIndex(like => like.user.toString() === userId.toString());
  
  if (likeIndex !== -1) {
    this.likes.splice(likeIndex, 1);
    return true;
  }
  
  return false;
};

// Método para agregar respuesta
communitySchema.methods.addReply = function(userId, username, message) {
  this.replies.push({
    user: userId,
    username,
    message
  });
};

// Método para incrementar vistas
communitySchema.methods.incrementViews = function() {
  this.viewCount += 1;
};

// Virtual para contar likes
communitySchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual para contar respuestas
communitySchema.virtual('replyCount').get(function() {
  return this.replies.length;
});

export default mongoose.model('Community', communitySchema); 