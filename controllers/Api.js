const Models = require('../model/dataModel');
const CtrlDB = require('../model/ctrlDB');

// 处理AJAX
const Api = {
  // POST /changePasswd
  changePasswd: (req, res)=>{
    if(req.session.userid == undefined || req.session.userid == null)
      return res.json(false);
    Models.UserModel.update({'id': req.session.userid}, {'password': req.body.newPasswd}, (err, result)=>{
      delete req.session.userid;
      return res.json(true);
    })
  },
  // POST /confirmPasswd
  confirmPasswd: (req, res)=>{
    if(req.session.userid == undefined || req.session.userid == null)
      return res.json(false);
    Models.UserModel.find({'id': req.session.userid, 'password': req.body.oldPasswd}, (err, users)=>{
      return users.length==0?res.json(false):res.json(true);
    })
  },
  // 教学秘书API
  Secretary: {
    // POST /secretary/getAllInfo
    getAllInfo: (req, res)=>{
      if(req.session.userid == undefined || req.session.userid == null)
        return res.json(false);
      CtrlDB.getAllInfoForSecretary(req.session.userid).then(info=>{
        return res.json(info)
      })
    },
  }
};

module.exports = Api;
