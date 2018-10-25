const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 课程模式
const CourseSchema = new Schema({
  id: String, // 课程号
  name: String, // 课程名称
  place: String, // 上课地点
  number: Number, // 人数
  kind: String, // 课程种类
  dateInfo: {
    year: String, // 学年
    semester: Number, // 学期
    dayOfWeek: Number, // 星期几
    beginWeek: String, // 起始周
    classTime: String, // 上课节次
    time: String, // 上课时间
  },
  teacherInfo: { // 教师信息
    id: String, // 教工号
    name: String, // 姓名
    telephone: String, // 教师联系电话
    department: String, // 教师所属学院
    gender: String, // 性别
    education: String, // 最高学历
    alias: String, // 职称名称
  },
  classroomInfo: { // 教室信息
    id: String, // 场地编号
    name: String, // 场地名称
    building: String, // 教学楼
    kind: String, // 场地类别名称
    seats: Number, // 座位数
    beginWeek: String, // 场地上课起始周
    classTime: String, // 场地上课节次
    classComposition: String, // 教学班组成
    campus: String // 校区
  },
  chooseInfo: { // 选课信息
    id: String, // 选课课号
    department: String, // 开课学院
    credit: Number, // 学分
    hour: Number, // 总学时
    number: Number, // 选课人数
    weekHour: String // 周学时
  }
})

//数据模型
const Course = mongoose.model('Course', CourseSchema)

module.exports = Course;