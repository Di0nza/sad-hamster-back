const Router = require("express");
const router = new Router();
const scoreController = require("../controllers/scoreController");

router.patch('/', scoreController.updateScore);
router.post('/miniGame/:userId', scoreController.miniGame);

module.exports = router