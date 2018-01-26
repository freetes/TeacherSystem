const Models = require('../model/dataModel');

const ctrlDB = {
  // 通过id获取所有课程信息
  getAllInfoByUserId: async (id, callback)=>{
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


};

module.exports = ctrlDB;
