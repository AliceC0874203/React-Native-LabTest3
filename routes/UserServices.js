
const express = require('express');
const User = require('../data/User');

const sqlite3 = require('sqlite3').verbose();

const path = require('path');
const dbFilePath = path.resolve(__dirname, '../database.sqlite');
console.log('Database file path:', dbFilePath);
const db = new sqlite3.Database(dbFilePath);

class UserService {
  constructor() {   
    this.Users = [];
    this.router = express.Router();


    // Define routes
    this.router.get('/', this.getAllUsers.bind(this));
    this.router.post('/add', this.addUser.bind(this));
    this.router.get('/delete/:id', this.deleteUser.bind(this));
    this.router.get('/edit/:id', this.editUserPage.bind(this));
    this.router.post('/edit/:id', this.editUser.bind(this));
  }

  getAllUsers(req, res) {
    User.getAllFromDatabase((Users) => {
      res.render('index', { Users });
    });
  }

  addUser(req, res) {
    const { name, height, weight  } = req.body;
    var timestamp = new Date();

  // Calculate BMI
  const bmi = weight / (height * height);

  // Determine weight status and message
  let status, message;
  if (bmi < 18.5) {
    status = 'Underweight';
    message = 'You should eat a little bit more';
  } else if (bmi <= 24.9) {
    status = 'Normal';
    message = 'Keep doing what you are doing';
  } else if (bmi <= 29.9) {
    status = 'Overweight';
    message = 'You should cut down on your food a little bit';
  } else {
    status = 'Obese';
    message = 'You should really do something about your appetite ASAP';
  }


    const newUser = new User(0,name, parseFloat(height), parseFloat(weight), timestamp , bmi , status , message);

    newUser.saveToDatabase();

    res.redirect('/');
  }

  deleteUser(req, res) {
    const UserId = parseInt(req.params.id);
    db.run('DELETE FROM users WHERE id = ?', [UserId], (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Row(s) deleted: ${this.changes}`);
      res.redirect('/');
    });
  }

  editUserPage(req, res) {
    const UserId = parseInt(req.params.id);
    console.log(req.params);
    db.get('SELECT * FROM users WHERE id = ?', [UserId], (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      
      if (!row) {
        // Handle case where no User is found for the given id
        console.log(UserId);
        return res.status(404).send('User not found');
      }
  
      const user = new User(row.id , row.name, row.height, row.weight, row.timestamp , row.bmi , row.status, row.message);
      res.render('edit', { user });
    });
  }

  editUser(req, res) {
    const UserId = parseInt(req.params.id);
    const { name, height, weight  } = req.body;
    var timestamp = new Date();

  // Calculate BMI
  const bmi = weight / (height * height);

  // Determine weight status and message
  let status, message;
  if (bmi < 18.5) {
    status = 'Underweight';
    message = 'You should eat a little bit more';
  } else if (bmi <= 24.9) {
    status = 'Normal';
    message = 'Keep doing what you are doing';
  } else if (bmi <= 29.9) {
    status = 'Overweight';
    message = 'You should cut down on your food a little bit';
  } else {
    status = 'Obese';
    message = 'You should really do something about your appetite ASAP';
  }

    db.run(
      'UPDATE users SET name = ?, height = ?, weight = ?, timestamp = ? , bmi = ?, status = ?, message = ? WHERE id = ?',
      [name, parseFloat(height), parseFloat(weight), timestamp , parseFloat(bmi) , status , message, UserId],
      (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log(`Row(s) updated: ${this.changes}`);
        res.redirect('/');
      }
    );
  }

}

module.exports = UserService;
