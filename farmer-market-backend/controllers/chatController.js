const { generateFarmerAIResponse } = require('../services/geminiService');
const ChatHistory = require('../models/ChatHistory');

exports.askChatbot = async (req, res, next) => {
  try {
    const { question, prompt, language = 'gu', state = 'Maharashtra' } = req.body;
    const userQuery = question || prompt;

    if (!userQuery || !userQuery.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Question or prompt text is required',
        error: 'Bad Request'
      });
    }

    const aiResult = await generateFarmerAIResponse({
      prompt: userQuery,
      language,
      state
    });

    // Optionally save to ChatHistory model if MongoDB is connected
    ChatHistory.create({
      user: req.user ? req.user._id : null,
      question: userQuery,
      answer: aiResult.answer,
      language: aiResult.language || language,
      timestamp: new Date()
    }).catch(err => console.warn('[ChatHistory Log Warn]:', err.message));

    res.status(200).json({
      success: true,
      message: 'AI Farmer Assistant response generated successfully',
      question: userQuery,
      answer: aiResult.answer,
      language: aiResult.language,
      source: aiResult.source
    });
  } catch (error) {
    next(error);
  }
};

exports.getChatHistory = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    let query = {};
    if (userId) query.user = userId;

    const history = await ChatHistory.find(query).sort({ createdAt: -1 }).limit(20);

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    next(error);
  }
};
