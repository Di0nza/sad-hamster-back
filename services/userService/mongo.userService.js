const { User } = require("../../models/user");

class UserService {
    async getUserByChatId(chatId) {
        return User.findOne({ chatId });
    }

    async getFullUserDataByChatId(chatId) {
        return User.findOne({ chatId })
            .populate('referralUsers')
            .populate('energy')
            .populate('scores')
            .exec();
    }

    async getAllUsers(chatId) {
        const allUsers = await User.find()
            .populate('scores')
            .sort({ 'scores.overallScore': -1 })
            .exec();

        const userTopPlace = allUsers.findIndex(user => user.chatId === chatId) + 1;

        return {
            allUsers,
            userTopPlace
        };
    }

    async getUserTopPlace(chatId) {
        const user = await User.findOne({ chatId }).sort({ 'scores.overallScore': -1 });

        if (!user) {
            throw new Error("User not found");
        }

        const allUsers = await User.find().sort({ 'scores.overallScore': -1 });
        const userTopPlace = allUsers.findIndex(u => u.chatId === chatId) + 1;

        user.userTopPlace = userTopPlace;
        await user.save();

        return user;
    }
}

module.exports = new UserService();