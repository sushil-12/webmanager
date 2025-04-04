const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  level: {
    type: Number,
    default: 1
  },
  points: {
    type: Number,
    default: 0
  },
  contentCreation: {
    type: Number,
    default: 0
  },
  teamCollaboration: {
    type: Number,
    default: 0
  },
  apiUsage: {
    type: Number,
    default: 0
  },
  achievements: [{
    type: String
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserProgress', UserProgressSchema); 