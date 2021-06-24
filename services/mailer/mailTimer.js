const mailer = require('./mailer.js');
const TIME_INTERVAL = 15000; // 15s

const start = () => 
    setInterval(()=> {
        mailer.sendMessage()
    }, TIME_INTERVAL);


module.exports = {start};