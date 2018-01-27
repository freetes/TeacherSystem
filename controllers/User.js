const Models = require('../model/dataModel');

// 处理用户
const User = {
  // POST /changePasswd
  changePasswd: (req, res)=>{
    Models.UserModel.update({'id': req.session.userid}, (err, result)=>{
      delete req.session.userid;
      res.json(true);
    })
  },

  // POST /newPay
  newPay: (req, res)=>{
    Models.PayModel({
      id: req.session.userid,
      pay: req.body.newPay,
      isChecked: 0,
      applySemester: req.body.applySemester,
      applyDate: req.body.applyDate
    }).save((err, result)=>{
      res.json(true);
    })
  },

  // POST /changePay
  changePay: (req, res)=>{
    Models.PayModel.update({'id': req.session.userid}, {'pay': req.body.newPay, 'applyDate': req.body.applyDate}, (err, result)=>{
      res.json(true);
    })
  },
  
  // POST /checkPay
  checkPay: (req, res)=>{
    Models.PayModel.update({'id': req.session.userid}, {'isChecked': 1}, (err, result)=>{
      res.json(true);
    })
  },
};

module.exports = User;