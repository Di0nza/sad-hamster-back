const {User} = require("../../models/user");
const {Energy} = require("../../models/energy");
const balance = require("../../data/balanceData.json");
const {Score} = require("../../models/scores");

class EnergyService {
    async updateEnergy(userId, energyRestoreTime, value) {
        console.log(userId, energyRestoreTime, value)
        const usersEnergy = await Energy.findOne({parentChatId: userId});
        if (!usersEnergy) {
            throw new Error("User not found");
        }

        // Обновляем данные по энергии пользователя
        usersEnergy.energy.energyFullRecoveryDate = energyRestoreTime;
        usersEnergy.energy.value = value;

        await usersEnergy.save();

        return usersEnergy;
    }

    async updateCapacity(userId) {
        const userEnergyDB = await Energy.findOne({parentChatId: userId});
        const userScores = await Score.findOne({parentChatId: userId});

        if (!userEnergyDB) {
            throw new Error("User not found");
        }

        const userEnergy = userEnergyDB.energy;
        const energyCapacityData = balance.energy.energyCapacity;
        const energyRecoveryData = balance.energy.energyRecovery;
        let currentCapacityLevel = userEnergy.energyCapacityLevel;
        let currentRecoveryLevel = userEnergy.energyRecoveryLevel;

        userEnergy.lastEntrance = new Date();
        const price = energyCapacityData.price[currentCapacityLevel - 1];
        if (userScores.score < price) {
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

        if (currentCapacityLevel < 5) {
            userEnergy.energyCapacityLevel++;
            currentCapacityLevel++;
            userScores.score -= price;
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

        userEnergyDB.energy = userEnergy;

        await userEnergyDB.save();
        await userScores.save();
        const res = {
            score: userScores.score,
            energy: userEnergy
        }
        return res;
    }

    async updateRecovery(userId) {
        const userEnergyDB = await Energy.findOne({parentChatId: userId});
        const userScores = await Score.findOne({parentChatId: userId});

        if (!userEnergyDB) {
            throw new Error("User not found");
        }

        const userEnergy = userEnergyDB.energy;
        const energyCapacityData = balance.energy.energyCapacity;
        const energyRecoveryData = balance.energy.energyRecovery;
        let currentCapacityLevel = userEnergy.energyCapacityLevel;
        let currentRecoveryLevel = userEnergy.energyRecoveryLevel;

        userEnergy.lastEntrance = new Date();
        const price = energyRecoveryData.price[currentRecoveryLevel - 1];
        if (userScores.score < price) {
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

        if (currentRecoveryLevel < 5) {
            userEnergy.energyRecoveryLevel++;
            currentRecoveryLevel++;
            userScores.score -= price;
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

        userEnergyDB.energy = userEnergy;

        await userEnergyDB.save();
        await userScores.save();
        const res = {
            score: userScores.score,
            energy: userEnergy
        }
        return res;
    }
}

module.exports = new EnergyService();
