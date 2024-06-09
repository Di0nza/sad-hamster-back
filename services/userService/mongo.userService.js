const { User } = require("../../models/user");

class UserService {
    async getUserByChatId(chatId) {
        return await User.findOne({ chatId });
    }

    async miniGame(chatId, reward) {
        const user = await User.findOne({ chatId });
        user.score += parseInt(reward.toString());
        await user.save();
        return user;
    }
}

module.exports = new UserService();