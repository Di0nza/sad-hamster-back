const damageService = require("../services/damageService/mongo.damageService");

class DamageController {

    async updateDamage(req, res, next) {
        try {
            const userId = req.params.userId;
            const updatedUser = await damageService.updateDamage(userId);
            return res.json({ success: true, user: updatedUser });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new DamageController();