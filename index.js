const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const {handleCallbacks} = require('./bot/callbackHandlers');
const router = require('./routes/index');
require('dotenv').config();

const app = express();
const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});

const connection = require("./db");

connection();

async function startBot() {
    handleCallbacks(bot);
}

app.use(express.json());
app.use(cors());
app.use('/api', router);

app.listen(process.env.PORT, () => console.log('server started on PORT ' + process.env.PORT))

startBot().catch(e => {
    console.log(e.message);
});