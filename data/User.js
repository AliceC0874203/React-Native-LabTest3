const sqlite3 = require('sqlite3').verbose();
const db1 = new sqlite3.Database('../database.sqlite');

const path = require('path');
const dbFilePath = path.resolve(__dirname, '../database.sqlite');
console.log('Database file path:', dbFilePath);
const db = new sqlite3.Database(dbFilePath);

class User {
  constructor(id, name, height, weight, timestamp , bmi , status, message) {
    this.id = id,
    this.name = name;
    this.height = height;
    this.weight = weight;
    this.timestamp = timestamp;
    this.bmi = bmi;
    this.status = status;
    this.message = message;

  }

  saveToDatabase() {
    db.run(
      'INSERT INTO users (name, height, weight, timestamp , bmi , status, message) VALUES (?, ?, ?, ? ,? ,?,?)',
      [this.name, this.height, this.weight, this.timestamp , this.bmi , this.status , this.message],
      function (err) {
        if (err) {
          return console.error(err.message);
        }
        console.log(`A row has been inserted with id ${this.lastID}`);
      }
    );
  }

  static getAllFromDatabase(callback) {
    db.all('SELECT * FROM users', [], (err, rows) => {
      if (err) {
        console.error(err);
        throw err;

      }
      console.log(rows);
      const Users = rows.map(row => new User(row.id , row.name, row.height, row.weight, new Date(row.timestamp), row.bmi , row.status, row.message ));
      callback(Users);
    });
  }
}

module.exports = User;