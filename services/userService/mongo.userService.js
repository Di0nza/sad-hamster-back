const { User } = require("../../models/user");

class UserService {
    async getUserByChatId(chatId) {
        return await User.findOne({ chatId });
    }
}

module.exports = new UserService();