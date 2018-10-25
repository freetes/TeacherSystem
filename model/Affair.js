const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 事务表
const AffairSchema = new Schema({
  lists: [
    {
      name: String,
      date: Date,
      items: [{
        name: String,
        user: String,
        description: String,
        remarks: [{
          user: String,
          date: Date,
          words: String
        }],
        date: Date
      }]
    }
  ],
  name: String,
  user: String,
  date: Date
});

//数据模型
const Affair = mongoose.model('Affair', AffairSchema)

module.exports = Affair;
