const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 用户数据模式
const UserSchema = new Schema({
  id: String,
  name: String,
  password: String,
  pay: Number
});

// 普通课程
const NormalClassSchema = new Schema({
  id: String,   // 工号
  name: String, // 课程名
  faculty: String,
  class: String,
  studentAmount: Number,
  standardHours: Number,
  theoryHours: Number,
  experimentHours: Number,
  finalHours: Number
});
// 课程设计
const DesignClassSchema = new Schema({
  id: String,   // 工号
  name: String, // 课程名：课程设计
  faculty: String,
  class: String,
  studentAmount: Number,
  week: Number,
  experimentHours: Number,
  finalHours: Number
});
// 科研训练
const TrainClassSchema = new Schema({
  id: String,   // 工号
  name: String, // 课程名：科研训练
  faculty: String,
  class: String,
  studentAmount: Number,
  unitHours: Number,
  finalHours: Number
});
// 生产实习
const ProduceClassSchema = new Schema({
  id: String,   // 工号
  name: String, // 课程名：生产实习
  faculty: String,
  class: String,
  studentAmount: Number,
  week: Number,
  unitHours: Number,
  finalHours: Number
});
// 毕业实习
const GraduateClassSchema = new Schema({
  id: String,   // 工号
  name: String, // 课程名：毕业实习
  faculty: String,
  class: String,
  studentAmount: Number,
  week: Number,
  unitHours: Number,
  finalHours: Number
});

//数据模型
const Models = {
  UserModel: mongoose.model('User', UserSchema),
  NormalClassModel: mongoose.model('NormalClass', NormalClassSchema),
  DesignClassModel: mongoose.model('DesignClass', DesignClassSchema),
  TrainClassModel: mongoose.model('TrainClass', TrainClassSchema),
  ProduceClassModel: mongoose.model('ProduceClass', ProduceClassSchema),
  GraduateClassModel: mongoose.model('GraduateClass', GraduateClassSchema)
};

module.exports = Models;
