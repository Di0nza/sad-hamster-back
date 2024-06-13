const {User} = require("../../models/user");
const balance = require("../../data/balanceData.json");
const {Score} = require("../../models/scores");

class DamageService {
    async updateDamage(userId) {
        const user = await User.findOne({chatId: userId});
        const userScores = await Score.findOne({parentChatId: userId});

        if (!user) {
            throw new Error("User not found");
        }
        const damage = balance.damage;
        const currentLevel = user.damageLevel;
        const price = damage.price[currentLevel - 1];
        if (userScores.score < price) throw new Error("Not enough money");
        if (currentLevel < 7) {
            user.damageLevel++;
            userScores.score -= price;
        } else {
            throw new Error("Maximum level reached");
        }
        const updScores = await userScores.save();
        await user.save();
        const res = {
            damageLevel: user.damageLevel,
            score: updScores.score,
            overallScore: updScores.overallScore
        }
        return res;
    }
}

module.exports = new DamageService();