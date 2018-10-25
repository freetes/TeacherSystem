const Employee = require('./Employee'),
      User = require('./User'),
      Affair = require('./Affair')

const Models = {
  User,
  Affair
}

// Create user to test 

// Models.User({
//   email: 'lishuang@rulertech.com',
//   name: '李爽',
//   password: '1',
//   level: 1
// }).save()

module.exports = Models;
