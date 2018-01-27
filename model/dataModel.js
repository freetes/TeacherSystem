const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 用户数据模式
const UserSchema = new Schema({
  id: String,
  name: String,
  password: String,
  level: Number
});

// 薪酬数据模式
const PaySchema = new Schema({
  id: String,
  pay: Number,
  isChecked: Number,
  // 0 to No submit&check
  // 1 to Submited but no check
  // 2 to Submited&checked
  applySemester: String,
  applyDate: String
})

// 普通课程模式
const NormalClassSchema = new Schema({
  id: String,               // 工号
  semester: String,         // 学期
  name: String,             // 课程名
  faculty: String,          // 专业
  class: String,            // 班级
  studentAmount: Number,    // 人数
  standardHours: Number,    // 标准学时
  theoryHours: Number,      // 理论学时
  experimentHours: Number,  // 实验学时
  finalHours: Number,       // 实际学时
  data: String,             // 添加/修改日期
  point: Number,            // 课程权重
  isChecked: Boolean        // 是否审核
});
// 课程设计模式
const DesignClassSchema = new Schema({
  id: String,               // 工号
  semester: String,         // 学期
  name: String,             // 课程名：课程设计
  faculty: String,
  class: String,
  studentAmount: Number,
  week: Number,             // 周数
  experimentHours: Number,  // 实验学时
  finalHours: Number,        // 实际学时
  data: String,             // 添加/修改日期
  point: Number,            // 课程权重
  isChecked: Boolean        // 是否审核
});
// 科研训练模式
const TrainClassSchema = new Schema({
  id: String,
  semester: String, 
  name: String,
  faculty: String,
  class: String,
  studentAmount: Number,
  unitHours: Number,        // 单位学时
  finalHours: Number,       // 实际学时
  data: String,             // 添加/修改日期
  point: Number,            // 课程权重
  isChecked: Boolean        // 是否审核
});
// 生产实习模式
const ProduceClassSchema = new Schema({
  id: String,
  semester: String, 
  name: String,
  faculty: String,
  class: String,
  studentAmount: Number,
  week: Number,             // 周数
  unitHours: Number,        // 单位学时
  finalHours: Number,       // 实际学时
  data: String,             // 添加/修改日期
  point: Number,            // 课程权重
  isChecked: Boolean        // 是否审核
});
// 毕业实习模式
const GraduateClassSchema = new Schema({
  id: String,
  semester: String, 
  name: String,
  faculty: String,
  class: String,
  studentAmount: Number,
  week: Number,
  unitHours: Number,
  finalHours: Number,
  data: String,             // 添加/修改日期
  point: Number,            // 课程权重
  isChecked: Boolean        // 是否审核
});

//数据模型
const Models = {
  UserModel: mongoose.model('User', UserSchema),
  PayModel: mongoose.model('Pay', PaySchema),
  NormalClassModel: mongoose.model('NormalClass', NormalClassSchema),
  DesignClassSchema: mongoose.model('DesignClass', DesignClassSchema),
  TrainClassSchema: mongoose.model('TrainClass', TrainClassSchema),
  ProduceClassSchema: mongoose.model('ProduceClass', ProduceClassSchema),
  GraduateClassSchema: mongoose.model('GraduateClass', GraduateClassSchema)
};

module.exports = Models;
