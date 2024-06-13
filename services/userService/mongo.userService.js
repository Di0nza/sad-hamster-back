const { User } = require("../../models/user");

class UserService {
    async getUserByChatId(chatId) {
        return await User.findOne({ chatId });
    }

    async getFullUserDataByChatId(chatId) {
        return await User.findOne({ chatId })
            .populate('referralUsers')
            .populate('energy')
            .populate('scores')
            .exec();
    }


    async getAllUsers(chatId) {
        const allUsers = await User.find()
            .populate('scores')
            .sort({ 'scores.overallScore': -1 }) // Сортировка по вложенному полю
            .exec();
        const userTopPlace = allUsers.findIndex(user => user.chatId === chatId) + 1;
        const res = {
            allUsers,
            userTopPlace
        }
        return res;
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