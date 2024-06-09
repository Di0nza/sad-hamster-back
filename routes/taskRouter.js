const Router = require('express')
const router = new Router()
const taskController = require('../controllers/taskController');

router.get("/:userId", taskController.getTasks);
router.post("/", taskController.createTask);
router.put("/:userId", taskController.completeTask);




module.exports = router