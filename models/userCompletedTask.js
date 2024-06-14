const mongoose = require('mongoose');

const userCompletedTaskSchema = new mongoose.Schema({
    parentChatId: { type: String, required: false, index: true },
    completedTasks: [{type: String, required: false}],
}, {toJSON: {virtuals: true}});

const UserCompletedTask = mongoose.model("UserCompletedTask", userCompletedTaskSchema);

module.exports = {UserCompletedTask};