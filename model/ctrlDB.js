const Models = require('../model/dataModel');

const ctrlDB = {
  // 通过id获取信息
  getAllInfoForUser: async id=>{
    let info = {
      pay: await Models.PayModel.find({'id': id}),
      class: {
        normalClass: await Models.NormalClassModel.find({'id': id}),
        designClass: await Models.DesignClassSchema.find({'id': id}),
        trainClass: await Models.TrainClassSchema.find({'id': id}),
        produceClass: await Models.ProduceClassSchema.find({'id': id}),
        graduateClass: await Models.GraduateClassSchema.find({'id': id})
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
      message: await Models.NoticeModel.find({'receiver': 'all'})
    }
    return info
  },
  // 教学秘书专用
  getAllInfoForAdmin: async id=>{
    let info = {
      users: await Models.UserModel.find({$or: [{'level': 0}, {'receiver': 1}]}),
      class: {
        normalClass: await Models.NormalClassModel.find({'id': id}),
        designClass: await Models.DesignClassSchema.find({'id': id}),
        trainClass: await Models.TrainClassSchema.find({'id': id}),
        produceClass: await Models.ProduceClassSchema.find({'id': id}),
        graduateClass: await Models.GraduateClassSchema.find({'id': id})
      },
      pays: await Models.PayModel.find(),
      message: await Models.NoticeModel.find()
    }
    return info
  },
};

module.exports = ctrlDB;
