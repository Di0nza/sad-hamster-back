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

    async getAllUsers() {
        return await User.find().sort({ overallScore: -1 });
    }

    async getUserTopPlace(chatId) {
        const allUsers = await User.find().sort({ overallScore: -1 });
        const userTopPlace = allUsers.findIndex((user) => user.chatId === chatId);
        if (userTopPlace === -1) {
            throw new Error("User not found" );
        }
        const user = allUsers[userTopPlace];
        user.userTopPlace = userTopPlace + 1;
        await user.save();

        return user;
    }
}

module.exports = new UserService();