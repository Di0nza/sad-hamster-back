const Router = require('express')
const router = new Router();
const userRouter = require('./userRouter')
const energyRouter = require("./energyRouter");
const damageRouter = require("./damageRouter");
const referralsRouter = require("./referralsRouter");

router.use('/user', userRouter);
router.use('/energy', energyRouter);
router.use('/damage', damageRouter);
router.use('/referralUsers', referralsRouter);

module.exports = router;