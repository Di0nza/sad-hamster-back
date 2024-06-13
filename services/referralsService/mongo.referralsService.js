const {User} = require("../../models/user");
const {Score} = require("../../models/scores");
const {ReferralUsers} = require("../../models/referralUsers");

class ReferralService {
    async collectFromInvitees(userId) {
        const userReferrals = await ReferralUsers.findOne({parentChatId: userId});
        let userScores = await Score.findOne({parentChatId: userId});
        console.log(userReferrals)
        if (!userReferrals) throw new Error("Invalid queryId");

        const referralUsers = userReferrals.users;
        if (!referralUsers || referralUsers.length === 0) {
            throw new Error("No invitees yet");
        }

        let totalScore = 0;
        referralUsers.forEach(referralUser => {
            totalScore += referralUser.score;
            referralUser.score = 0;
        });

        userScores.score += totalScore;
        userScores.overallScore += totalScore;
        userReferrals.referralStartTime = Date.now();
        userReferrals.referralCollectionTime = Date.now() + (2 * 60 * 1000);

        await userReferrals.save();
        await userScores.save();

        const res = {
            userReferrals: userReferrals,
            score: userScores.score,
            overallScore: userScores.overallScore
        }

        return res;
    }

    async replenishmentFromInvitees(userId) {
        const userReferrals = await ReferralUsers.findOne({parentChatId: userId});

        if (!userReferrals) throw new Error("Invalid queryId");

        const referralUsers = userReferrals.users;
        if (!referralUsers|| referralUsers.length === 0) {
            throw new Error("No invitees yet");
        }

        for (const referralUser of referralUsers) {
            let referredUserScores = await Score.findOne({parentChatId: referralUser.chatId});
            if (referredUserScores) {
                const referredUserIndex = userReferrals.referralUsers.findIndex(user => user.chatId === referredUserScores.parentChatId);
                if (referredUserIndex !== -1) {
                    userReferrals.referralUsers[referredUserIndex].score += Math.round((referredUserScores.score - userReferrals.referralUsers[referredUserIndex].lastRefScore) * 0.08);
                    userReferrals.referralUsers[referredUserIndex].lastRefScore = referredUserScores.score;
                }
                referredUserScores.score = Math.round(referredUserScores.score);
                await referredUserScores.save();
            }
        }
        await userReferrals.save();

        return userReferrals;
    }
}

module.exports = new ReferralService();
