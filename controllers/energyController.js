const energyService = require("../services/energyService/mongo.energyService");

class EnergyController {
    async update(req, res, next) {
        try {
            const { userId, energyRestoreTime, value } = req.body;
            const updatedEnergy = await energyService.updateEnergy(userId, energyRestoreTime, value);
            return res.status(201).json({ success: true, message: "Дата восстановления энергии обновлена успешно", energy: updatedEnergy });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async updateCapacity(req, res, next) {
        try {
            const { userId } = req.params;
            const updatedEnergy = await energyService.updateCapacity(userId);
            return res.json({ success: true, user: updatedEnergy });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async updateRecovery(req, res, next) {
        try {
            const { userId } = req.params;
            const updatedEnergy = await energyService.updateRecovery(userId);
            return res.json({ success: true, user: updatedEnergy });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new EnergyController();
