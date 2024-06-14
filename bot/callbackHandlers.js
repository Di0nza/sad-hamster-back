const {prismaDB} = require('../lib/prisma.postgreSQL.db');
const {User} = require("../models/user");
const {Energy} = require("../models/energy");
const {ReferralUsers} = require("../models/referralUsers");
const {Score} = require("../models/scores");
const {UserCompletedTask} = require("../models/userCompletedTask");
const mongoose = require('mongoose');

async function handleCallbacks(bot) {
    bot.onText(/\/start/, async (msg) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const chatId = msg.chat.id;
            console.log(msg);

            let user = await User.findOne({ chatId }).session(session); // юзер нажавший старт

            if (!user) {
                const childReferral = msg.text?.replace("/start ", ""); // Айди родителя

                const energy = new Energy({
                    parentChatId: chatId,
                    energy: {
                        value: 500,
                        energyFullRecoveryDate: new Date(),
                        lastEntrance: new Date(),
                        energyCapacityLevel: 1,
                        energyRecoveryLevel: 1
                    }
                });

                const score = new Score({
                    parentChatId: chatId,
                    score: 0,
                    overallScore: 0
                });

                const refUsers = new ReferralUsers({
                    parentChatId: chatId,
                    referralStartTime: 0,
                    referralCollectionTime: 0,
                    users: [],
                });

                const completedTasks = new UserCompletedTask({
                    parentChatId: chatId,
                    completedTasks: [],
                });

                await Promise.all([
                    Energy.collection.bulkWrite([
                        { insertOne: { document: energy.toObject() } }
                    ], { session }),
                    Score.collection.bulkWrite([
                        { insertOne: { document: score.toObject() } }
                    ], { session }),
                    ReferralUsers.collection.bulkWrite([
                        { insertOne: { document: refUsers.toObject() } }
                    ], { session }),
                    UserCompletedTask.collection.bulkWrite([
                        { insertOne: { document: completedTasks.toObject() } }
                    ], { session })
                ]);

                user = new User({
                    firstName: msg.from?.first_name ? msg.from.first_name : "",
                    lastName: msg.from?.last_name ? msg.from.last_name : "",
                    username: msg.from.username,
                    childReferral: childReferral,
                    chatId: chatId,
                    firstEntry: false,
                    userTopPlace: 0,
                    damageLevel: 1,
                    completedTasks: completedTasks._id,
                    referralUsers: refUsers._id,
                    energy: energy._id,
                    scores: score._id
                });

                await user.save({ session });

                if (childReferral) {
                    const maternalReferralUser = await ReferralUsers.findOne({ parentChatId: childReferral }).session(session);
                    if (maternalReferralUser) {
                        const pretendentIds = maternalReferralUser.users.map(user => user.chatId);
                        if (!pretendentIds.includes(chatId)) {
                            const newReferral = {
                                firstName: msg.from.first_name,
                                lastName: msg.from.last_name,
                                username: msg.from.username,
                                chatId: chatId,
                                score: 250,
                                collectionTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
                            };
                            maternalReferralUser.users.push(newReferral);
                            await maternalReferralUser.save({ session });
                        }
                    }
                }
            }

            await session.commitTransaction();

            await bot.sendMessage(chatId, 'Launch app', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Play', web_app: { url: `https://dragoneggs.net.pl/loadingScreen` } }]
                    ]
                }
            });

        } catch (e) {
            await session.abortTransaction();
            console.log(e.message);
        } finally {
            session.endSession();
        }
    });

    bot.onText(/\/info/, async (msg) => {
        try {
            const chatId = msg.chat.id;
            console.log(msg);
            await bot.sendMessage(chatId, '');
        } catch (e) {
            console.log(e.message);
        }
    });
}

module.exports = { handleCallbacks };
