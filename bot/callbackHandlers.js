const {User} = require("../models/user");


function handleCallbacks(bot) {

    bot.onText(/\/start/, async (msg) => {
        try {
            const chatId = msg.chat.id;
            console.log(msg);
            let user = await User.findOne({chatId: chatId}); // юзер нажавший старт

            if (!user) {
                const childReferral = msg.text?.replace("/start ", ""); //айди родителя

                user = await new User({
                    firstName: msg.from?.first_name ? msg.from.first_name : "",
                    lastName: msg.from?.last_name ? msg.from.last_name : "",
                    username: msg.from.username,
                    childReferral: childReferral,
                    referralStartTime: 0,
                    referralCollectionTime: 0,
                    referralUsers: [],
                    chatId: chatId,
                    firstEntry: false,
                    userTopPlace:0,
                    lastRefScore: 0,
                    damage: {
                        name: 'Damage',
                        description: 'INCREASES DAMAGE',
                        images: [
                            "https://res.cloudinary.com/dfl7i5tm2/image/upload/v1714839295/hummers/hummer-1-lvl_himidf.png",
                            "https://res.cloudinary.com/dfl7i5tm2/image/upload/v1714839296/hummers/hummer-2-lvl_lqpu85.png",
                            "https://res.cloudinary.com/dfl7i5tm2/image/upload/v1714839298/hummers/hummer-3-lvl_otnkt3.png",
                            "https://res.cloudinary.com/dfl7i5tm2/image/upload/v1714839299/hummers/hummer-4-lvl_ox9fn6.png",
                            "https://res.cloudinary.com/dfl7i5tm2/image/upload/v1714839301/hummers/hummer-5-lvl_hulvbx.png",
                            "https://res.cloudinary.com/dfl7i5tm2/image/upload/v1714839303/hummers/hummer-6-lvl_ntu8es.png",
                            "https://res.cloudinary.com/dfl7i5tm2/image/upload/v1714839304/hummers/hummer-7-lvl_ba4tkc.png",
                            "https://res.cloudinary.com/dfl7i5tm2/image/upload/v1714839306/hummers/hummer-8-lvl_wifwcu.png",
                        ],
                        strength: [1, 2, 3, 4, 5, 6, 7, 8],
                        income: [1, 2, 3, 4, 5, 6, 7, 8],
                        levels: [1, 2, 3, 4, 5, 6, 7, 8],
                        currentLevel: 1,
                        price: [10, 15, 22, 30, 40, 55, 70, 100],
                    },
                    energy: {
                        name: "Energy",
                        description: "INCREASES CAPACITY AND RATE OF ENERGY RECOVERY",
                        images: [
                            "https://res.cloudinary.com/dfl7i5tm2/image/upload/v1716397066/bottle-1-lvl_xe60ur.png",
                            "https://res.cloudinary.com/dfl7i5tm2/image/upload/v1716397066/bottle-2-lvl_gh8qbm.png",
                            "https://res.cloudinary.com/dfl7i5tm2/image/upload/v1716397066/bottle-3-lvl_dfnhgz.png",
                            "https://res.cloudinary.com/dfl7i5tm2/image/upload/v1716397066/bottle-4-lvl_oynhnu.png",
                            "https://res.cloudinary.com/dfl7i5tm2/image/upload/v1716397066/bottle-5-lvl_hun0ii.png",
                            "https://res.cloudinary.com/dfl7i5tm2/image/upload/v1716397067/bottle-6-lvl_u9vun8.png",
                            "https://res.cloudinary.com/dfl7i5tm2/image/upload/v1716397066/bottle-7-lvl_geyhit.png",
                            "https://res.cloudinary.com/dfl7i5tm2/image/upload/v1716397067/bottle-8-lvl_f6uecl.png"
                        ],
                        value: 500,
                        energyFullRecoveryDate: new Date(),
                        energyCapacity: [500, 1000, 1500, 2000, 2500, 3000, 4000, 4500],
                        energyRecovery: [1, 2, 3, 4, 5, 6, 7, 8],
                        lastEntrance: 0,
                        levels: [1, 2, 3, 4, 5, 6, 7, 8],
                        currentLevel: 1,
                        price: [100, 150, 220, 300, 400, 550, 700, 1000]
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
            await bot.sendMessage(chatId, 'Click me', {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Play', web_app: {url: `https://dragoneggs.net.pl/loadingScreen`}}]
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