const {User} = require("../../models/user");
const balance = require("../../data/balanceData.json");

class DamageService {
    async updateDamage(userId) {
        const user = await User.findOne({chatId: userId});
        if (!user) {
            throw new Error("User not found");
        }
        const damage = balance.damage;
        const currentLevel = user.damageLevel;
        const price = damage.price[currentLevel - 1];
        if (user.score < price) throw new Error("Not enough money");
        if (currentLevel < 6) {
            user.damageLevel++;
            user.score -= price;
        } else {
           throw new Error("Maximum level reached");
        }
        await user.save();
        return user;
    }
}

module.exports = new DamageService();