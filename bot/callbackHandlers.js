const {prismaDB} = require('../lib/prisma.postgreSQL.db');
const {User} = require("../models/user");
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

                    const childReferral = msg.text?.replace("/start ", ""); //айди родителя
                    await new User({
                        firstName: msg.from?.first_name ? msg.from.first_name : "",
                        lastName: msg.from?.last_name ? msg.from.last_name : "",
                        username: msg.from.username,
                        childReferral: childReferral,
                        referralStartTime: 0,
                        referralCollectionTime: 0,
                        referralUsers: [],
                        chatId: chatId,
                        firstEntry: false,
                        userTopPlace: 0,
                        lastRefScore: 0,
                        damageLevel: 1,
                        completedTasks: [],
                        energy: {
                            value: 500,
                            energyFullRecoveryDate: new Date(),
                            lastEntrance: 0,
                            energyCapacityLevel: 1,
                            energyRecoveryLevel: 1,
                        },
                    }).save();

                    if (childReferral) {
                        let maternalReferralUser = await User.findOne({chatId: childReferral}); // юзер родитель
                        if (maternalReferralUser) {
                            const pretendentIds = maternalReferralUser.referralUsers.map(user => user.chatId);
                            if (!pretendentIds.includes(chatId)) {
                                const newReferral = {
                                    firstName: msg.from.first_name,
                                    lastName: msg.from.last_name,
                                    username: msg.from.username,
                                    chatId: chatId,
                                    score: 250,
                                    collectionTime: new Date(Date.now() + 24 * 60 * 1000)
                                };
                                maternalReferralUser.referralUsers.push(newReferral);
                                await maternalReferralUser.save();
                            }
                        }
                    }
                }

                await bot.sendMessage(chatId, 'Launch app', {
                    reply_markup: {
                        inline_keyboard: [
                            [{text: 'Play', web_app: {url: `https://dragoneggs.net.pl/loadingScreen`}}]
                        ]
                    }
                });

            } catch (e) {
                console.log(e.message);
            }
        }
    );

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