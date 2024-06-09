const userService = require("../services/userService/mongo.userService");

class UserController {
    async getUser(req, res, next) {
        try {
            const user = await userService.getUserByChatId(req.params.userId);
            if (!user) {
                return res.status(400).json({success: false, message: "User not found"});
            }
            return res.json({user});
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }
}

module.exports = new UserController();