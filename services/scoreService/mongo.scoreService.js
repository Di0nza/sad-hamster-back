const {Score} = require("../../models/scores");

class ScoreService{
    async updateScore(body) {
        const chatId = body.userId;
        let userScores = await Score.findOne({parentChatId: chatId});
        userScores.score = body.score;
        userScores.overallScore = body.overallScore;
        const savedUser = await userScores.save();
        console.log(savedUser);
        return userScores;
    }


    async miniGame(chatId, reward) {
        const userScores = await Score.findOne({parentChatId: chatId });
        userScores.score += parseInt(reward.toString());
        userScores.overallScore += parseInt(reward.toString());
        await userScores.save();
        return userScores;
    }
}

module.exports = new ScoreService();