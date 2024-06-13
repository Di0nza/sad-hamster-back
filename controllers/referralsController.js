const referralService = require("../services/referralsService/mongo.referralsService");

class ReferralsController {
    async collectFromInvitees(req, res, next) {
        try {
            const user = await referralService.collectFromInvitees(req.params.userId);
            return res.json({ referralUsers: user.userReferrals, score: user.score, overallScore: user.score});
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: error.message });
        }
    }

    async replenishmentFromInvitees(req, res, next) {
        try {
            const referralUsers = await referralService.replenishmentFromInvitees(req.params.userId);
            return res.json({ referralUsers });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new ReferralsController();
