const {User} = require("../../models/user");
const balance = require("../../data/balanceData.json");
const {Score} = require("../../models/scores");

class DamageService {
    async updateDamage(userId) {
        try {
            // Параллельный запрос к базе данных
            const [user, userScores] = await Promise.all([
                User.findOne({ chatId: userId }),
                Score.findOne({ parentChatId: userId })
            ]);

            if (!user) {
                throw new Error("User not found");
            }

            if (!userScores) {
                throw new Error("User not found");
            }

            const damage = balance.damage;
            const currentLevel = user.damageLevel;
            const price = damage.price[currentLevel - 1];

            if (userScores.score < price) {
                throw new Error("Not enough money");
            }

            if (currentLevel >= 7) {
                throw new Error("Maximum level reached");
            }

            // Обновляем данные
            user.damageLevel++;
            userScores.score -= price;

            // Сохраняем изменения в базе данных параллельно
            const [updUser, updScores] = await Promise.all([
                user.save(),
                userScores.save(),
            ]);

            // Возвращаем обновленные данные
            return {
                damageLevel: updUser.damageLevel,
                score: updScores.score,
                overallScore: updScores.overallScore
            };
        } catch (error) {
            throw error;
        }
    }}

module.exports = new DamageService();