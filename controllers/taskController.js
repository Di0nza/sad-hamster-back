const taskService = require("../services/taskService/mongo.taskService");

class TaskController {
    async getTasks(req, res, next) {
        try {
            const tasks = await taskService.getTasks(req.params.userId);
            return res.json({tasks});
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }

    async createTask(req, res, next) {
        try {
            const task = await taskService.createTask(req.body);
            return res.json({message: `Task "${task.title}" created successfully`});
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }

    async completeTask(req, res, next) {
        try {
            const user = await taskService.completeTask(req.params.userId, req.body.taskId);
            return res.json({message: `Task completed successfully`, ...user});
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Внутренняя ошибка сервера"});
        }
    }

}

module.exports = new TaskController();