const Router = require('express')
const router = new Router()
const energyController = require('../controllers/energyController');

router.patch('/:userId', energyController.update);
router.patch('/updateCapacity/:userId', energyController.updateCapacity);

module.exports = router