const {User} = require("../models/user");

class UserController {
    async getUser(req, res, next) {
        try {
            console.log(req.body);
            let user = await User.findOne({chatId: req.params.userId});
            if(!user){
                return res.status(400).user({success: false, message: "User not found"});
            }
            return res.json({user});
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }
}

module.exports = new UserController();