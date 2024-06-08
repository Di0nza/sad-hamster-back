const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");

router.get('/:userId', userController.getUser);

module.exports = router