const { User } = require("../../models/user");
const { Task } = require("../../models/task");

class TaskService {
    async getTasks(chatId) {
        const user = await User.findOne({ chatId });
        console.log(user.completedTasks);
        const allTasks = await Task.find();

        const tasksWithStatus = allTasks.map(task => {
            const done = user.completedTasks.some(completedTask => completedTask._id.equals(task._id));
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
        const user = await User.findOne({ chatId });
        if (!user) {
            throw new Error("User not found");
        }
        const task = await Task.findById(taskId);
        if (!task) {
            throw new Error("Task not found");
        }

        if (user.completedTasks.includes(taskId)) {
            throw new Error("Task already completed");
        }

        user.score += task.reward
        user.completedTasks.push(taskId);

        await user.save();
        return user;
    }

}

module.exports = new TaskService();