const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    parentChatId: { type: String, required: false },
    score: { type: Number, required: false, default: 0 },
    overallScore: { type: Number, required: false, default: 0 }
});

const Score = mongoose.model("Score", scoreSchema);

module.exports = { Score };