const Models = require('../model/dataModel');

// 处理用户
const User = {
  // POST /newPay
  newPay: (req, res)=>{
    Models.PayModel({
      id: req.session.userid,
      pay: req.body.newPay,
      isChecked: 0,
      applySemester: req.body.applySemester,
      applyDate: req.body.applyDate
    }).save((err, result)=>{
      return res.json(true);
    })
  },

  // POST /changePay
  changePay: (req, res)=>{
    Models.PayModel.update({'id': req.session.userid}, {'pay': req.body.newPay, 'applyDate': req.body.applyDate}, (err, result)=>{
      return res.json(true);
    })
  },
  
  // POST /checkPay
  checkPay: (req, res)=>{
    Models.PayModel.update({'id': req.session.userid}, {'isChecked': 1}, (err, result)=>{
      return res.json(true);
    })
  },
};

module.exports = User;