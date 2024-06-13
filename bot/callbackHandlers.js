const {prismaDB} = require('../lib/prisma.postgreSQL.db');
const {User} = require("../models/user");
const {Energy} = require("../models/energy");
const {ReferralUsers} = require("../models/referralUsers");
const {Score} = require("../models/scores");
const {UserCompletedTask} = require("../models/userCompletedTask");
const startCallbackPrisma = async (msg, bot) => {
    const chatId = msg.chat.id.toString();
    console.log(msg);
    let user = await prismaDB.user.findUnique({where: {chatId: chatId}});

    if (!user) {
        const childReferral = parseInt(msg.text?.replace("/start", "")).toString();

        user = await prismaDB.user.create({
            data: {
                chatId: chatId,
                username: msg.from?.username,
                firstName: msg.from?.first_name || "",
                lastName: msg.from?.last_name || "",
                userTopPlace: null,
                firstEntry: null,
                damageLevel: 1,
                score: 0,
                overallScore: 0,
            }
        });

        await prismaDB.usersEnergy.create({
            data: {
                value: 500,
                energyFullRecoveryDate: new Date(),
                levelOfCapacity: 1,
                levelOfCharging: 1,
                user: {
                    connect: {chatId: user.chatId}
                }
            }
        });

        if (childReferral) {
            let maternalReferralUser = await prismaDB.user.findUnique({where: {chatId: childReferral}});

            if (maternalReferralUser) {
                // Создаем запись в таблице UserReferrals
                await prismaDB.userReferrals.create({
                    data: {
                        parentChatId: maternalReferralUser.chatId.toString(), // Родительский чат
                        childChatId: chatId, // Дочерний чат (текущий пользователь)
                        score: 250,
                        collectionTime: new Date(Date.now() + 24 * 60 * 1000),
                        lastRefScore: 0
                    }
                });
            }
        }
    }

    await bot.sendMessage(chatId, 'Click me', {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Play', web_app: {url: `https://dragoneggs.net.pl/loadingScreen`}}]
            ]
        }
    });
}

function handleCallbacks(bot) {

    bot.onText(/\/start/, async (msg) => {
        try {
            const chatId = msg.chat.id;
            console.log(msg);

            let user = await User.findOne({chatId: chatId}); // юзер нажавший старт

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
                    },
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
                })

                const completedTasks = new UserCompletedTask({
                    parentChatId: chatId,
                    completedTasks: [],
                })

                await energy.save();
                await score.save();
                await refUsers.save();
                await completedTasks.save();

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

                await user.save();

                if (childReferral) {
                    let maternalReferralUser = await ReferralUsers.findOne({parentChatId: childReferral });
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
                            await maternalReferralUser.save();
                        }
                    }
                }
            }

            await bot.sendMessage(chatId, 'Launch app', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Play', web_app: { url: `https://dragoneggs.net.pl/loadingScreen` } }]
                    ]
                }
            });

        } catch (e) {
            console.log(e.message);
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

module.exports = {handleCallbacks};