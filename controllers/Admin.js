const Models = require('../model/dataModel');

// 管理员专用
const Admin = {
  // POST /addUser
  addUser: (req, res)=>{
    Models.UserModel({
      id: req.body.id,
      name: req.body.name,
      password: req.body.password,
      level: req.body.level,
      isWorking: true
    }).save((err, result)=>{
      if(err) return res.json(false);
      return res.json(true);
    })
  },
};

module.exports = Admin;
