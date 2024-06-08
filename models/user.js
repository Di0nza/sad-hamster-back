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
        name: {type: String, require: false},
        description: {type: String, require: false},
        energyFullRecoveryDate: {type: Date,  default: new Date()},
        value: { type: Number, default: 500},
        images: [{type: String, required: false}],
        energyCapacity: [{type:Number, required:false}],
        energyRecovery: [{type:Number, required:false}],
        levels: [{type:Number, required:false}],
        price: [{type:Number, required:false}],
        currentLevel: {type:Number, required:false},
        lastEntrance: {type: Date, required:false},
    },
    damage: {
        name: {type:String, required:false},
        description: {type:String, required:false},
        strength: [{type:Number, required:false}],
        images: [{type: String, required: false}],
        income: [{type:Number, required:false}],
        level: [{type:Number, required:false}],
        price: [{type:Number, required:false}],
        currentLevel: {type:Number, required:false},
    },
    language:{type:String, default:'en'},
    level:{type:Number, default: 1},
    score: {type:Number, required:false, default:0},
    overallScore: {type:Number, required:false, default:0},
}, {toJSON: {virtuals: true}});

const User = mongoose.model("User", userSchema);

module.exports = {User};