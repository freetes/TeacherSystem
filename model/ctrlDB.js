const Models = require('../model/dataModel');

const ctrlDB = {
  // 通过id获取信息
  getAllInfoForUser: async id=>{
    let info = {
      pay: await Models.PayModel.find({'id': id}),
      class: {
      //   normalClass: await Models.NormalClassModel.find({'id': id}),
      //   designClass: await Models.DesignClassSchema.find({'id': id}),
      //   trainClass: await Models.TrainClassSchema.find({'id': id}),
      //   produceClass: await Models.ProduceClassSchema.find({'id': id}),
      //   graduateClass: await Models.GraduateClassSchema.find({'id': id})
      },
      message: await Models.NoticeModel.find({$or: [{'receiver': id}, {'receiver': 'all'}] })
    };
    return info;
  },
  // 教学秘书专用
  getAllInfoForSecretary: async id=>{
    let info = {
      users: await Models.UserModel.find({'level': 0}),
      pays: await Models.PayModel.find(),
      message: await Models.NoticeModel.find({'receiver': 'all'}),
      class: {
        // normalClass: await Models.NormalClassModel.find(),
        // designClass: await Models.DesignClassSchema.find(),
        // trainClass: await Models.TrainClassSchema.find(),
        // produceClass: await Models.ProduceClassSchema.find(),
        // graduateClass: await Models.GraduateClassSchema.find()
      }
    }
    return info
  },
  // 管理员专用
  getAllInfoForAdmin: async id=>{
    let info = {
      users: await Models.UserModel.find(),
      class: {
        normalClass: await Models.NormalClassModel.find(),
        designClass: await Models.DesignClassSchema.find(),
        trainClass: await Models.TrainClassSchema.find(),
        produceClass: await Models.ProduceClassSchema.find(),
        graduateClass: await Models.GraduateClassSchema.find()
      },
      pays: await Models.PayModel.find(),
      message: await Models.NoticeModel.find(),
      feedback: await Models.FeedbackModel.find(),
      signinLog: await Models.SigninLogModel.find()
    }
    return info
  },
  // 导出excel专用
  getInfo2Export: async (id, date)=>{
    let info = {
      users: await Models.UserModel.find({'level': 0}),
      pays: await Models.PayModel.find({'applyMonth': date}),
    }
    return info
  }
};

module.exports = ctrlDB;
