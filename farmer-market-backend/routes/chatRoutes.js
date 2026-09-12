const express = require('express');
const router = express.Router();
const {
  getConversations,
  getMessagesWithUser,
  sendMessage,
  askAiAssistant,
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/conversations', protect, getConversations);
router.get('/messages/:targetUserId', protect, getMessagesWithUser);
router.post('/send', protect, sendMessage);
router.post('/ai-assistant', askAiAssistant);

module.exports = router;
