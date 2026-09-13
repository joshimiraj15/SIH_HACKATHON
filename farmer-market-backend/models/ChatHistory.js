const mongoose = require('mongoose');

const ChatHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    question: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true
    },
    answer: {
      type: String,
      required: [true, 'Answer text is required'],
      trim: true
    },
    language: {
      type: String,
      enum: ['gu', 'hi', 'en'],
      default: 'gu'
    },
    contextData: {
      type: mongoose.Schema.Types.Mixed,
      required: false
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ChatHistory', ChatHistorySchema);
