const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");

router.get('/:userId', userController.getUser);
router.post('/miniGame/:userId', userController.miniGame);
router.get('/all', userController.getAllUsers);
router.get('/topPlace/:userId', userController.getUserTopPlace);

module.exports = router