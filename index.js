const express = require('express');
const mailTimer = require('./src/services/mailer/mailTimer.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// Static files
app.use(express.static('public'));
app.use('/css', express.static(`${__dirname}public/css`));
app.use('/img', express.static(`${__dirname}public/img`));
app.use('/js', express.static(`${__dirname}public/js`));

// Set Template Engine
app.set('views', './src/views');
app.set('view engine', 'ejs');

// Set the Routes folder
const santaRouter = require('./src/routes/santa')
app.use('/', santaRouter);

// Listen to port
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    mailTimer.start();
});