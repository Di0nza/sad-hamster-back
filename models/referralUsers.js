const mongoose = require('mongoose');

const referralUsersSchema = new mongoose.Schema({
    parentChatId: { type: String, required: false },
    referralStartTime: { type: Date, required: false },
    referralCollectionTime: { type: Date, required: false },
    users: [{
        firstName: { type: String, required: false },
        lastName: { type: String, required: false },
        username: { type: String, required: false },
        chatId: { type: String, required: false },
        score: { type: Number, required: false },
        collectionTime: { type: Date, required: false },
        lastRefScore: { type: Number, required: false, default: 0 }
    }],
});

const ReferralUsers = mongoose.model("ReferralUsers", referralUsersSchema);

module.exports = { ReferralUsers };