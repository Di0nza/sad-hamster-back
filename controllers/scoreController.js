const scoreService = require("../services/scoreService/mongo.scoreService");
const userService = require("../services/userService/mongo.userService");

class ScoreController {
    async updateScore(req, res, next) {
        try {
            await scoreService.updateScore(req.body);
            return res.status(201).send({message: "Счет обновлен успешно"});
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }

    async miniGame(req, res, next) {
        try {
            const scores = await scoreService.miniGame(req.params.userId, req.body.reward);
            if (!scores) {
                return res.status(400).json({success: false, message: "User not found"});
            }
            return res.json({scores});
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }
}

module.exports = new ScoreController();
