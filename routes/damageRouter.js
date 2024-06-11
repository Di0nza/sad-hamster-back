const Router = require('express')
const router = new Router()
const damageController = require('../controllers/damageController');

router.patch("/:userId", damageController.updateDamage);

module.exports = router