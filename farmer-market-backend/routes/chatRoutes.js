const express = require('express');
const router = express.Router();
const { askChatbot, getChatHistory } = require('../controllers/chatController');

router.post('/', askChatbot);
router.post('/ask', askChatbot);
router.get('/history', getChatHistory);

module.exports = router;
