const Router = require('express')
const router = new Router();
const userRouter = require('./userRouter')
const scoreRouter = require('./scoreRouter')
const energyRouter = require("./energyRouter");
const damageRouter = require("./damageRouter");
const referralsRouter = require("./referralsRouter");
const taskRouter = require("./taskRouter");

router.use('/user', userRouter);
router.use('/score', scoreRouter);
router.use('/energy', energyRouter);
router.use('/damage', damageRouter);
router.use('/referralUsers', referralsRouter);
router.use('/task', taskRouter);

module.exports = router;