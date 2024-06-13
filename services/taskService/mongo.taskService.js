const { User } = require("../../models/user");
const { Task } = require("../../models/task");
const {Score} = require("../../models/scores");
const {UserCompletedTask} = require("../../models/userCompletedTask");


class TaskService {
    async getTasks(chatId) {
        const userCompletedTasks = await UserCompletedTask.findOne({ parentChatId: chatId });
        console.log(userCompletedTasks);
        const allTasks = await Task.find();

        const tasksWithStatus = allTasks.map(task => {
            const done = userCompletedTasks.completedTasks.some(completedTask => completedTask.toString() === task._id.toString())

            return { ...task.toObject(), done };
        });

        return tasksWithStatus;
    }

    async createTask(taskData){
        const {title, description, reward, link} = taskData;
        const task = new Task({title, description, reward, link});
        await task.save();
        return task;
    }

    async completeTask(chatId, taskId) {
        const userCompletedTasks = await UserCompletedTask.findOne({ parentChatId: chatId });
        const scores = await Score.findOne({ parentChatId: chatId });
        if (!scores) {
            throw new Error("User not found");
        }
        const task = await Task.findById(taskId);
        if (!task) {
            throw new Error("Task not found");
        }

        if (userCompletedTasks.completedTasks.includes(taskId)) {
            throw new Error("Task already completed");
        }

        scores.score += task.reward;
        scores.overallScore += task.reward;
        userCompletedTasks.completedTasks.push(taskId);

        await userCompletedTasks.save();
        await scores.save();

        const res = {
            score: scores.score,
            overallScore: scores.overallScore,
            completedTaskId: taskId
        }
        return res;
    }

}

module.exports = new TaskService();