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

    async miniGame(req, res, next) {
        try {
            const user = await userService.miniGame(req.params.userId, req.body.reward);
            if (!user) {
                return res.status(400).json({success: false, message: "User not found"});
            }
            return res.json({user});
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }

    async getAllUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            return res.json({users});
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }

    async getUserTopPlace(req, res, next) {
        try {
            const user = await userService.getUserTopPlace(req.params.userId);
            if (!user) {
                return res.status(400).json({success: false, message: "User not found"});
            }
            return res.json({user});
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }

    async updateScore(req, res, next) {
        try {
            await userService.updateScore(req.body);
            return res.status(201).send({message: "Счет обновлен успешно"});
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }


}

module.exports = new UserController();