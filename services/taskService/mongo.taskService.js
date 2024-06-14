const { User } = require("../../models/user");
const { Task } = require("../../models/task");
const { Score } = require("../../models/scores");
const { UserCompletedTask } = require("../../models/userCompletedTask");
const mongoose = require('mongoose');

class TaskService {
    async getTasks(chatId) {
        const userCompletedTasks = await UserCompletedTask.findOne({ parentChatId: chatId });
        const allTasks = await Task.find();

        const tasksWithStatus = allTasks.map(task => {
            const done = userCompletedTasks.completedTasks.some(completedTask => completedTask.toString() === task._id.toString());
            return { ...task.toObject(), done };
        });

        return tasksWithStatus;
    }

    async createTask(taskData) {
        const { title, description, reward, link } = taskData;
        const task = new Task({ title, description, reward, link });
        await task.save();
        return task;
    }

    async completeTask(chatId, taskId) {
        // Проверяем наличие пользователя
        const userCompletedTasks = await UserCompletedTask.findOne({ parentChatId: chatId });
        if (!userCompletedTasks) {
            throw new Error("User not found");
        }

        // Получаем задачу и проверяем её наличие
        const task = await Task.findById(taskId);
        if (!task) {
            throw new Error("Task not found");
        }

        // Проверяем, выполнена ли задача
        if (userCompletedTasks.completedTasks.includes(taskId)) {
            throw new Error("Task already completed");
        }

        // Обновляем очки пользователя атомарно
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const opts = { session };

            // Находим и обновляем очки пользователя
            let scores = await Score.findOneAndUpdate(
                { parentChatId: chatId },
                { $inc: { score: task.reward, overallScore: task.reward } },
                { new: true, ...opts }
            );

            // Если очки пользователя не найдены, бросаем ошибку
            if (!scores) {
                throw new Error("User scores not found");
            }

            // Добавляем выполненную задачу в список выполненных
            userCompletedTasks.completedTasks.push(taskId);
            await userCompletedTasks.save(opts);

            // Коммитим транзакцию и возвращаем результат
            await session.commitTransaction();
            session.endSession();

            const res = {
                score: scores.score,
                overallScore: scores.overallScore,
                completedTaskId: taskId
            };

            return res;
        } catch (error) {
            // Откатываем транзакцию при ошибке
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }
}

module.exports = new TaskService();
