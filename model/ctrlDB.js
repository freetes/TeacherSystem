const Models = require('../model/dataModel');

const ctrlDB = {
  // 通过id获取信息
  getAllInfoForUser: async id=>{
    return {
      pay: await Models.PayModel.find({'id': id}),
      courses: await Models.CourseModel.find({'teacherInfo.id': id}),
      message: await Models.NoticeModel.find({$or: [{'receiver': id}, {'receiver': 'all'}] })
    };
  },
  // 教学秘书专用
  getAllInfoForSecretary: async id=>{
    const year = new Date().getFullYear(),
      month = new Date().getMonth() + 1
    return {
      users: await Models.UserModel.find({'level': 0}),
      pays: await Models.PayModel.find({$or: [{'applyMonth': `${year}-${month}`}, {'': `${month==1?year-1:year}-${month==1?12:month}`}]}),
      message: await Models.NoticeModel.find({'receiver': 'all'}),
      courses: await Models.CourseModel.find()
    }
  },
  // 管理员专用
  getAllInfoForAdmin: async id=>{
    return {
      users: await Models.UserModel.find(),
      courses: await Models.CourseModel.find(),
      pays: await Models.PayModel.find(),
      message: await Models.NoticeModel.find(),
      feedback: await Models.FeedbackModel.find(),
      signinLog: await Models.SigninLogModel.find()
    }
  },
  // 导出excel专用
  getInfo2Export: async (id, date)=>{
    return {
      users: await Models.UserModel.find({'level': 0}),
      pays: await Models.PayModel.find({'applyMonth': date}),
    }
  }
};

module.exports = ctrlDB;
