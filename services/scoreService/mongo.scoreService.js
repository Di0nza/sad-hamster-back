const { Score } = require("../../models/scores");

class ScoreService {
    async updateScore(body) {
        const { userId, score, overallScore } = body;

        try {
            const updatedUserScores = await Score.findOneAndUpdate(
                { parentChatId: userId },
                { score, overallScore },
                { new: true, runValidators: true }
            );

            if (!updatedUserScores) {
                throw new Error("User scores not found");
            }

            console.log("Updated user scores:", updatedUserScores);
            return updatedUserScores;
        } catch (error) {
            throw error;
        }
    }

    async miniGame(chatId, reward) {
        try {
            const rewardInt = parseInt(reward.toString());

            const updatedUserScores = await Score.findOneAndUpdate(
                { parentChatId: chatId },
                {
                    $inc: {
                        score: rewardInt,
                        overallScore: rewardInt
                    }
                },
                { new: true, runValidators: true }
            );

            if (!updatedUserScores) {
                throw new Error("User scores not found");
            }

            return updatedUserScores;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ScoreService();
