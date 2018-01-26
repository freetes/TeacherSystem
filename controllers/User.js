const Models = require('../model/dataModel');

// 处理用户
const User = {
  // POST /changePasswd
  changePasswd: (req, res)=>{
    Models.UserModel.update({'id': req.session.userid}, {'password': req.body.newPasswd}, (err, result)=>{
      delete req.session.userid;
      res.json(true);
    })
  },

};

module.exports = User;