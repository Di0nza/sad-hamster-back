const {User} = require("../../models/user");

class ReferralService {
    async collectFromInvitees(userId) {
        const user = await User.findOne({chatId: userId});
        if (!user) throw new Error("Invalid queryId");

        const referralUsers = user.referralUsers;
        if (!referralUsers || referralUsers.length === 0) {
            throw new Error("No invitees yet");
        }

        let totalScore = 0;
        referralUsers.forEach(referralUser => {
            totalScore += referralUser.score;
            referralUser.score = 0;
        });

        user.score += totalScore;
        user.overallScore += totalScore;
        user.referralStartTime = Date.now();
        user.referralCollectionTime = Date.now() + (2 * 60 * 1000);

        await user.save();

        return user;
    }

    async replenishmentFromInvitees(userId) {
        const user = await User.findOne({chatId: userId});
        if (!user) throw new Error("Invalid queryId");

        const referralUsers = user.referralUsers;
        if (!referralUsers || referralUsers.length === 0) {
            throw new Error("No invitees yet");
        }

        for (const referralUser of referralUsers) {
            const referredUser = await User.findOne({chatId: referralUser.chatId});
            if (referredUser) {
                const referredUserIndex = user.referralUsers.findIndex(user => user.chatId === referredUser.chatId);
                if (referredUserIndex !== -1) {
                    user.referralUsers[referredUserIndex].score += Math.round((referredUser.score - user.referralUsers[referredUserIndex].lastRefScore) * 0.08);
                    user.referralUsers[referredUserIndex].lastRefScore = referredUser.score;
                }
                referredUser.score = Math.round(referredUser.score);
                await referredUser.save();
            }
        }
        await user.save();

        return user;
    }
}

module.exports = new ReferralService();
