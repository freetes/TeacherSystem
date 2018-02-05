const Models = require('../model/dataModel');

const ctrlDB = {
  // 通过id获取信息
  getAllInfoByUserId: async id=>{
    let info = {
      pay: await Models.PayModel.find({'id': id}),
      class: {
        normalClass: await Models.NormalClassModel.find({'id': id}),
        designClass: await Models.DesignClassSchema.find({'id': id}),
        trainClass: await Models.TrainClassSchema.find({'id': id}),
        produceClass: await Models.ProduceClassSchema.find({'id': id}),
        graduateClass: await Models.GraduateClassSchema.find({'id': id})
      }
    };
    return info;
  },
  // 教学秘书专用
  getAllInfoForSecretary: async id=>{
    let info = {
      user: await Models.UserModel.find({'level': 0}),
      pay: await Models.PayModel.find(),
    }
    return info
  }
};

module.exports = ctrlDB;
