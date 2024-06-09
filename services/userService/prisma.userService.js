const {prismaDB} = require('../../lib/prisma.postgreSQL.db');

class UserService {
    async getUserByChatId(chatId) {
        return await prismaDB.user.findUnique({
            where: { chatId }
        });
    }
}

module.exports = new UserService();