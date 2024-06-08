const {User} = require("../models/user");

class DamageController {

    async updateDamage(req, res, next){
        try {
            const user = await User.findOne({ chatId: req.params.userId});
            if (!user) return res.status(400).send({ message: "Invalid queryId" });
            const damage = user.damage;
            const currentLevel = damage.currentLevel;
            const price = damage.price[currentLevel - 1];
            if (user.score < price) return res.status(400).send({ message: "not enough money" });
            if (currentLevel < 8) {
                damage.currentLevel++;
                user.score -= price;
            } else {
                return res.status(400).send({ message: "Maximum level reached" });
            }
            await user.save();
            return res.json({user})
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    }

}

module.exports = new DamageController();