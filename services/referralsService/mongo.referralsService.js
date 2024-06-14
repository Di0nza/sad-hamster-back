const { User } = require("../../models/user");
const { Score } = require("../../models/scores");
const { ReferralUsers } = require("../../models/referralUsers");

class ReferralService {
    async collectFromInvitees(userId) {
        const userReferrals = await ReferralUsers.findOne({ parentChatId: userId });
        if (!userReferrals) {
            throw new Error("Invalid queryId");
        }

        const referralUsers = userReferrals.users;
        if (!referralUsers || referralUsers.length === 0) {
            throw new Error("No invitees yet");
        }

        let totalScore = 0;
        referralUsers.forEach(referralUser => {
            totalScore += referralUser.score;
            referralUser.score = 0;
        });

        const userScores = await Score.findOne({ parentChatId: userId });
        if (!userScores) {
            throw new Error("User scores not found");
        }

        userScores.score += totalScore;
        userScores.overallScore += totalScore;
        userReferrals.referralStartTime = Date.now();
        userReferrals.referralCollectionTime = Date.now() + (2 * 60 * 1000);

        await Promise.all([
            userReferrals.save(),
            userScores.save()
        ]);

        return {
            userReferrals,
            score: userScores.score,
            overallScore: userScores.overallScore
        };
    }

    async replenishmentFromInvitees(userId) {
        const userReferrals = await ReferralUsers.findOne({ parentChatId: userId });
        if (!userReferrals) {
            throw new Error("Invalid queryId");
        }

        const referralUsers = userReferrals.users;
        if (!referralUsers || referralUsers.length === 0) {
            throw new Error("No invitees yet");
        }
        console.log(referralUsers)
        // Создаем массив промисов для всех асинхронных операций
        const updatePromises = referralUsers.map(async referralUser => {
            const referredUserScores = await Score.findOne({ parentChatId: referralUser.chatId });
            if (referredUserScores) {
                const referredUserIndex = referralUsers.findIndex(user => user.chatId === referredUserScores.parentChatId);
                if (referredUserIndex !== -1) {
                    referralUsers[referredUserIndex].score += Math.round((referredUserScores.score - referralUsers[referredUserIndex].lastRefScore) * 0.08);
                    referralUsers[referredUserIndex].lastRefScore = referredUserScores.score;
                }
                referredUserScores.score = Math.round(referredUserScores.score);
                await referredUserScores.save();
            }
        });

        userReferrals.users = referralUsers;

        await Promise.all(updatePromises);

        // Сохраняем обновленные данные userReferrals в базе данных
        await userReferrals.save();

        return userReferrals;
    }
}

module.exports = new ReferralService();
