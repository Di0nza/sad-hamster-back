const mongoose = require('mongoose');

const energySchema = new mongoose.Schema({
    parentChatId: { type: String, required: false, index: true},
    energy: {
        energyFullRecoveryDate: { type: Date, default: new Date() },
        value: { type: Number, default: 500 },
        energyCapacityLevel: { type: Number, required: false },
        energyRecoveryLevel: { type: Number, required: false },
        lastEntrance: { type: Date, required: false }
    },
});

const Energy = mongoose.model("Energy", energySchema);

module.exports = { Energy };