const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: false },
    lastName:{type:String, required:false },
    username:{type:String, required:false},
    chatId: {type: String, required: false},
    childReferral: {type: String, required: false},
    referralStartTime: {type: Date, required:false},
    referralCollectionTime: {type: Date, required:false},
    userTopPlace: {type:Number, required:false, default:0},
    firstEntry: {type: Boolean, default: false},
    completedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    referralUsers:  [{
        firstName: { type: String, required: false },
        lastName:{type:String, required:false },
        username:{type:String, required:false},
        chatId: {type: String, required: false},
        score: {type:Number, required:false},
        collectionTime: {type: Date, required:false},
        lastRefScore: {type:Number, required:false, default:0},
    }],
    energy: {
        energyFullRecoveryDate: {type: Date,  default: new Date()},
        value: { type: Number, default: 500},
        energyCapacityLevel: [{type:Number, required:false}],
        energyRecoveryLevel: [{type:Number, required:false}],
        lastEntrance: {type: Date, required:false},
    },
    damageLevel: {type:Number, required:false},
    language:{type:String, default:'en'},
    score: {type:Number, required:false, default:0},
    overallScore: {type:Number, required:false, default:0},
}, {toJSON: {virtuals: true}});

const User = mongoose.model("User", userSchema);

module.exports = {User};