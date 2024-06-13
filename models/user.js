const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    username: { type: String, required: false },
    chatId: { type: String, required: false },
    childReferral: { type: String, required: false },
    userTopPlace: { type: Number, required: false, default: 0 },
    firstEntry: { type: Boolean, default: false },
    completedTasks: { type: mongoose.Schema.Types.ObjectId, ref: 'UserCompletedTask'},
    referralUsers: { type: mongoose.Schema.Types.ObjectId, ref: 'ReferralUsers' },
    energy: { type: mongoose.Schema.Types.ObjectId, ref: 'Energy' },
    scores: { type: mongoose.Schema.Types.ObjectId, ref: 'Score' },
    damageLevel: { type: Number, required: false },
    language: { type: String, default: 'en' }
}, { toJSON: { virtuals: true } });

const User = mongoose.model("User", userSchema);

module.exports = { User };
