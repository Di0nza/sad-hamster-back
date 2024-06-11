const energyService = require("../services/energyService/mongo.energyService");

class EnergyController {
    async update(req, res, next) {
        try {
            const { userId } = req.body.userId;
            const { energyRestoreTime, value } = req.body;
            const updatedUser = await energyService.updateEnergy(userId, energyRestoreTime, value);
            return res.status(201).json({ success: true, message: "Дата восстановления энергии обновлена успешно", user: updatedUser });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async updateCapacity(req, res, next) {
        try {
            const { userId } = req.params;
            const updatedUser = await energyService.updateCapacity(userId);
            return res.json({ success: true, user: updatedUser });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async updateRecovery(req, res, next) {
        try {
            const { userId } = req.params;
            const updatedUser = await energyService.updateRecovery(userId);
            return res.json({ success: true, user: updatedUser });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new EnergyController();
