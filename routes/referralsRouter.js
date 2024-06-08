const Router = require('express')
const router = new Router()
const referralsController = require('../controllers/referralsController');

router.put("/collectFromInvitees/:userId", referralsController.collectFromInvitees);
router.put("/replenishmentFromInvitees/:userId", referralsController.replenishmentFromInvitees);

module.exports = router