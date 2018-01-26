const Models = require('../model/dataModel');

const ctrlDB = {
  // 通过id获取所有课程信息
  getAllInfoByUserId: async (id, callback)=>{
    const info = {};
    info.normalClass = await Models.NormalClassModel.find({'id': id});
    info.designClass = await Models.DesignClassSchema.find({'id': id});
    info.trainClass = await Models.TrainClassSchema.find({'id': id});
    info.produceClass = await Models.ProduceClassSchema.find({'id': id});
    info.graduateClass = await Models.GraduateClassSchema.find({'id': id});
    return info;
  },


};

module.exports = ctrlDB;
