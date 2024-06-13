const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");

router.post('/all', userController.getAllUsers);
router.get('/fullUserData/:userId', userController.getFullUserData);
router.get('/topPlace/:userId', userController.getUserTopPlace);
// router.get('/:userId', userController.getUser);


module.exports = router