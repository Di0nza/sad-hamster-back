const {User} = require("../../models/user");
const balance = require("../../data/balanceData.json");

class EnergyService {
    async updateEnergy(userId, energyRestoreTime, value) {
        const user = await User.findOne({chatId: userId});
        if (!user) {
            throw new Error("User not found");
        }

        // Обновляем данные по энергии пользователя
        user.energy.energyFullRecoveryDate = energyRestoreTime;
        user.energy.value = value;

        await user.save();

        return user;
    }

    async updateCapacity(userId) {
        const user = await User.findOne({chatId: userId});
        if (!user) {
            throw new Error("User not found");
        }

        const userEnergy = user.energy;
        const energyCapacityData = balance.energy.energyCapacity;
        const energyRecoveryData = balance.energy.energyRecovery;
        let currentCapacityLevel = userEnergy.energyCapacityLevel;
        let currentRecoveryLevel = userEnergy.energyRecoveryLevel;

        userEnergy.lastEntrance = new Date();
        const price = energyCapacityData.price[currentCapacityLevel - 1];
        if (user.score < price) {
            throw new Error("Not enough money");
        }

        const fullEnergyTimeOld = new Date(userEnergy.energyFullRecoveryDate);
        const now = new Date();
        const diffTime = now.getTime() - fullEnergyTimeOld.getTime();

        let energyValue;
        if (diffTime >= 0) {
            energyValue = energyCapacityData.capacity[currentCapacityLevel - 1];
        } else {
            const energyRestoredPerSecond = energyRecoveryData.recovery[currentRecoveryLevel - 1];
            const timeSinceLastUpdate = Math.abs(diffTime);
            const secondsSinceLastUpdate = Math.floor(timeSinceLastUpdate / 1000); // количество секунд с последнего обновления
            const energyNotRestored = secondsSinceLastUpdate * energyRestoredPerSecond; // всего восстановленной энергии
            energyValue = energyCapacityData.capacity[currentCapacityLevel - 1] - energyNotRestored;
        }
        userEnergy.value = energyValue;

        if (currentCapacityLevel < 6) {
            userEnergy.energyCapacityLevel++;
            currentCapacityLevel++;
            user.score -= price;
        } else {
            throw new Error("Maximum level reached");
        }
        const timeToRestoreEnergy = 1000; // восстановления энергии в сек
        const energyToRestore = energyCapacityData.capacity[currentCapacityLevel - 1] - userEnergy.value; // сколько не хватает энергии
        const energyRestoredPerSecond = energyRecoveryData.recovery[currentRecoveryLevel - 1];
        const totalTimeToRestore = timeToRestoreEnergy * (energyToRestore / energyRestoredPerSecond)//делим на уровень восстановления энергии;

        const currentTime = new Date();

        const energyRestoreTime = new Date(currentTime.getTime() + totalTimeToRestore);

        userEnergy.energyFullRecoveryDate = energyRestoreTime;

        user.energy = userEnergy;

        await user.save();
        return user;
    }

    async updateRecovery(userId) {
        const user = await User.findOne({chatId: userId});
        if (!user) {
            throw new Error("User not found");
        }

        const userEnergy = user.energy;
        const energyCapacityData = balance.energy.energyCapacity;
        const energyRecoveryData = balance.energy.energyRecovery;
        let currentCapacityLevel = userEnergy.energyCapacityLevel;
        let currentRecoveryLevel = userEnergy.energyRecoveryLevel;

        userEnergy.lastEntrance = new Date();
        const price = energyRecoveryData.price[currentRecoveryLevel - 1];
        if (user.score < price) {
            throw new Error("Not enough money");
        }

        const fullEnergyTimeOld = new Date(userEnergy.energyFullRecoveryDate);
        const now = new Date();
        const diffTime = now.getTime() - fullEnergyTimeOld.getTime();

        let energyValue;
        if (diffTime >= 0) {
            energyValue = energyCapacityData.capacity[currentCapacityLevel - 1];
        } else {
            const energyRestoredPerSecond = energyRecoveryData.recovery[currentRecoveryLevel - 1];
            const timeSinceLastUpdate = Math.abs(diffTime);
            const secondsSinceLastUpdate = Math.floor(timeSinceLastUpdate / 1000); // количество секунд с последнего обновления
            const energyNotRestored = secondsSinceLastUpdate * energyRestoredPerSecond; // всего восстановленной энергии
            energyValue = energyCapacityData.capacity[currentCapacityLevel - 1] - energyNotRestored;
        }
        userEnergy.value = energyValue;

        if (currentRecoveryLevel < 6) {
            userEnergy.energyRecoveryLevel++;
            currentRecoveryLevel++;
            user.score -= price;
        } else {
            throw new Error("Maximum level reached");
        }

        const timeToRestoreEnergy = 1000; // восстановления энергии в сек
        const energyToRestore = energyCapacityData.capacity[currentCapacityLevel - 1] - userEnergy.value; // сколько не хватает энергии
        const energyRestoredPerSecond = energyRecoveryData.recovery[currentRecoveryLevel - 1];
        const totalTimeToRestore = timeToRestoreEnergy * (energyToRestore / energyRestoredPerSecond)//делим на уровень восстановления энергии;

        const currentTime = new Date();

        const energyRestoreTime = new Date(currentTime.getTime() + totalTimeToRestore);

        userEnergy.energyFullRecoveryDate = energyRestoreTime;

        user.energy = userEnergy;

        await user.save();
        return user;
    }
}

module.exports = new EnergyService();
