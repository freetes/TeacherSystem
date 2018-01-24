const Models = require('../model/dataModel');

const ctrlDB = {
  // 通过id获取所有课程信息
  getAllInfoByUserId: id=>{
    const info = {};
    Models.NormalClassModel.find({'id': id}, (err, classes)=>{
      if(classes.length != 0) info.normalClass = classes;
      Models.DesignClassSchema.find({'id': id}, (err, classes)=>{
        if(classes.length != 0) info.designClass = classes;
        Models.TrainClassSchema.find({'id': id}, (err, classes)=>{
          if(classes.length != 0) info.trainClass = classes;
          Models.ProduceClassSchema.find({'id': id}, (err, classes)=>{
            if(classes.length != 0) info.produceClass = classes;
            Models.GraduateClassSchema.find({'id': id}, (err, classes)=>{
              if(classes.length != 0) info.graduateClass = classes;
              return info;
            });
          });
        });
      });
    });
  },


};

module.exports = ctrlDB;
