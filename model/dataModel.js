const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 用户数据模式
const UserSchema = new Schema({
  id: String,
  name: String,
  password: String,
  level: Number,
  department: {       // 所属教研室
    name: String,
    number: Number
  },
  isWorking: Boolean  // is working?
});

// 薪酬数据模式
const PaySchema = new Schema({
  id: String,
  pay: {
    last: Number,
    change: Number,
    final: Number
  },
  reward: {
    last: Number,
    change: Number,
    final: Number
  },
  isChecked: Number,
  // 1 to no check
  // 2 to checked
  applyMonth: String,
  applyDate: String
});

// 反馈消息模式
const FeedbackSchema = new Schema({
  id: String,
  name: String,
  date: String,
  message: String,
  ip: String
});

// 登录日志模式
const SigninLogSchema = new Schema({
  date: String,
  ip: String,
  id: String,
  name: String,
  result: String
})

// 公告数据模式
const NoticeSchema = new Schema({
  senderId: String,
  senderName: String,
  receiver: String,
  message: String,
  date: String,
  level: String
  //  default
  //  primary
  //  warning
  //  danger
});

// 课程模式
const CourseSchema = new Schema({
  id: String,   // 课程号
  name: String, // 课程名称
  time: String, // 上课时间
  place: String,// 上课地点
  number: Number, // 班级人数
  kind: String, // 课程种类
  dateInfo: {
    year: String,     // 学年
    semester: Number, // 学期
    dayOfWeek: Number,// 星期几
    beginWeek: String,// 起始周
    classTime: String // 上课节次
  },
  teacherInfo: {      // 教师信息
    id: String,
    name: String,
    telephone: String,
    department: String,
    gender: String,
    education: String,
    department: String
  },
  classroomInfo: {    // 教室信息
    id: String,       // 场地编号
    name: String,     // 场地名称
    kind: String,     // 教学楼
    seats: Number, // 总座位数
    beginWeek: String,// 起始周
    classTime: String, // 上课节次
    classComposition: String, // 教学班组成
    campus: String     // 校区
  },
  chooseInfo: {       // 选课信息
    id: String,
    department: String,
    credit: Number,
    hour: Number,
    number: Number,
  }
})

/*
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
    date: String,             // 添加/修改日期
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
    date: String,             // 添加/修改日期
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
    date: String,             // 添加/修改日期
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
    date: String,             // 添加/修改日期
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
    date: String,             // 添加/修改日期
    point: Number,            // 课程权重
    isChecked: Boolean        // 是否审核
  });
*/

//数据模型
const Models = {
  UserModel: mongoose.model('User', UserSchema),
  PayModel: mongoose.model('Pay', PaySchema),
  FeedbackModel: mongoose.model('Feedback', FeedbackSchema),
  SigninLogModel: mongoose.model('SigninLog', SigninLogSchema),
  NoticeModel: mongoose.model('Notice', NoticeSchema),
  CourseModel: mongoose.model('Course', CourseSchema)
};

module.exports = Models;
