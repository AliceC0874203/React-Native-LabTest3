// app.js
const express = require('express');
const bodyParser = require('body-parser');
const UserService = require('./routes/UserServices');
const app = express();
const port = 3013;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const userService = new UserService();

app.use(userService.router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});