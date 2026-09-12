const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get all conversations for logged-in user
// @route   GET /api/chat/conversations
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all distinct users communicated with
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate('sender', 'name businessName role avatar location')
      .populate('receiver', 'name businessName role avatar location')
      .populate('crop', 'cropName category pricePerUnit')
      .sort({ createdAt: -1 });

    const contactMap = new Map();
    messages.forEach((msg) => {
      const isSender = msg.sender._id.toString() === userId.toString();
      const otherUser = isSender ? msg.receiver : msg.sender;
      if (otherUser && !contactMap.has(otherUser._id.toString())) {
        contactMap.set(otherUser._id.toString(), {
          user: otherUser,
          lastMessage: msg.text,
          lastMessageDate: msg.createdAt,
          crop: msg.crop,
          unreadCount: !msg.isRead && !isSender ? 1 : 0,
        });
      }
    });

    const conversations = Array.from(contactMap.values());

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get message history between current user and target user
// @route   GET /api/chat/messages/:targetUserId
// @access  Private
exports.getMessagesWithUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const targetUserId = req.params.targetUserId;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: targetUserId },
        { sender: targetUserId, receiver: userId },
      ],
    })
      .populate('crop', 'cropName pricePerUnit')
      .sort({ createdAt: 1 });

    // Mark received messages as read
    await Message.updateMany(
      { sender: targetUserId, receiver: userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send a message to another user
// @route   POST /api/chat/send
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text, cropId, offerId } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({
        success: false,
        message: 'Please provide receiver and message text',
      });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      crop: cropId || null,
      offer: offerId || null,
      text,
    });

    const populatedMsg = await Message.findById(message._id)
      .populate('sender', 'name businessName avatar')
      .populate('receiver', 'name businessName avatar');

    res.status(201).json({
      success: true,
      data: populatedMsg,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    AI Kisan Mitra Agricultural Assistant
// @route   POST /api/chat/ai-assistant
// @access  Public
exports.askAiAssistant = async (req, res) => {
  try {
    const { query, language = 'en' } = req.body;
    const q = (query || '').toLowerCase();

    let reply = '';
    let suggestions = [];

    if (q.includes('wheat') || q.includes('ghau') || q.includes('gehu')) {
      reply =
        language === 'gu'
          ? 'ગોંડલ મંડીમાં ઘઉંનો આજનો સરેરાશ ભાવ ₹૨,૪૫૦/ક્વિન્ટલ છે, જે રાજકોટ કરતાં ₹૩૦ વધુ છે. પીળો ગેરુ રોગ અટકાવવા ખાટી છાસ અને હિંગનું મિશ્રણ છાંટો.'
          : language === 'hi'
          ? 'गोंडल मंडी में गेहूं का आज का मॉडल भाव ₹2,450/क्विंटल है। सरकार ने 2024-25 के लिए गेहूं का MSP ₹2,425 तय किया है। बेचने का सबसे अच्छा समय अभी है।'
          : 'Wheat prices are currently bullish at ₹2,450/quintal in Gondal Mandi (+1.8% this week). Govt MSP is ₹2,425. For optimal net profit, selling in Gondal yields ₹35/qtl higher returns after transport.';
      suggestions = ['Check Gondal Mandi Prices', 'Where Should I Sell Wheat?', 'Wheat Disease Advisory'];
    } else if (q.includes('price') || q.includes('mandi') || q.includes('bhav') || q.includes('rate')) {
      reply =
        language === 'gu'
          ? 'આજે કપાસના ભાવ ₹૭,૫૮૦, મગફળી ₹૬,૪૯૦ અને જીરું ₹૨૭,૫૦૦ ઊંઝા માર્કેટમાં ટ્રેડ થઈ રહ્યા છે.'
          : language === 'hi'
          ? 'आज प्रमुख मंडियों में कपास ₹7,520, मूंगफली ₹6,490 और प्याज ₹2,650/क्विंटल पर व्यापार कर रहे हैं।'
          : 'Today cotton is trading at ₹7,520/qtl in Rajkot, groundnut at ₹6,490 in Gondal, and Cumin (Jeera) at ₹27,500 in Unjha.';
      suggestions = ['Open Price Radar', 'Calculate Net Transport Profit', 'Set Price Alert'];
    } else if (q.includes('scheme') || q.includes('yojana') || q.includes('subsidy') || q.includes('pm-kisan')) {
      reply =
        language === 'gu'
          ? 'પીએમ-કિસાન યોજના હેઠળ વાર્ષિક ₹૬,૦૦૦ ડીબીટી દ્વારા મળે છે. પીએમ કુસુમ યોજનામાં સોલાર પંપ પર ૬૦% સુધીની સબસિડી ઉપલબ્ધ છે.'
          : language === 'hi'
          ? 'पीएम-किसान योजना में सालाना ₹6,000 और पीएम-कुसुम में सोलर वाटर पंप पर 60% तक सरकारी सब्सिडी मिल रही है।'
          : 'Under PM-KISAN, farmers receive ₹6,000/yr via direct DBT. The PM-KUSUM scheme offers up to 60% subsidy on solar agriculture pumps.';
      suggestions = ['View Government Schemes', 'Check PM-KISAN Eligibility', 'MSP Comparison Table'];
    } else if (q.includes('pest') || q.includes('disease') || q.includes('fungus') || q.includes('kitak')) {
      reply =
        language === 'gu'
          ? 'કીટ નિયંત્રણ માટે નીમ તેલ (Neem Oil 1500 PPM) ૧ લિટરમાં ૫ મિલી મિક્સ કરીને છંટકાવ કરવો સૌથી ઉત્તમ છે.'
          : language === 'hi'
          ? 'कीट नियंत्रण के लिए नीम का तेल 1500 PPM @ 5ml प्रति लीटर पानी में मिलाकर स्प्रे करें या फेरोमोन ट्रैप लगाएं।'
          : 'For organic pest control, spray Neem Oil (1500 PPM) at 5ml/liter of water or install Pheromone traps (5 per acre). For fungal blight, use Mancozeb 75% WP @ 2.5g/L.';
      suggestions = ['Crop Disease Advisory', 'Organic Sprays Guide', 'Fertilizer Calculator'];
    } else {
      reply =
        language === 'gu'
          ? 'નમસ્તે! હું કિસાન સેતુ AI મિત્ર છું. તમે મને મંડી ભાવ, શ્રેષ્ઠ બજાર, સરકારી યોજનાઓ અથવા પાક રોગ વિશે પૂછી શકો છો.'
          : language === 'hi'
          ? 'नमस्ते! मैं किसान सेतु AI मित्र हूँ। आप मुझसे मंडी भाव, कहाँ बेचना सही रहेगा, सरकारी योजनाएँ या फसल रोग की सलाह ले सकते हैं।'
          : "Namaste! I am your KisanSetu AI Agriculture Assistant. Ask me about live Mandi rates, 'Where Should I Sell' profit calculations, PM-KISAN schemes, or crop pest control.";
      suggestions = ['Best Mandi for Wheat', 'Government Schemes & MSP', 'Tomato Market Price'];
    }

    res.status(200).json({
      success: true,
      query,
      reply,
      suggestions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
