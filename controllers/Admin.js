const Models = require('../model/dataModel');

// 管理员专用
const Admin = {
  // POST /addUser
  addUser: (req, res)=>{
    Models.UserModel({
      id: req.body.id,
      name: req.body.name,
      password: req.body.password,
      level: req.body.level
    }).save((err, result)=>{
      if(err) return res.json(false);
      return res.json(true);
    })
  },

  // // POST /changePay
  // changePay: (req, res)=>{
  //   Models.PayModel.findByIdAndUpdate({_id: req.body.id}, {'pay': req.body.newPay, 'applyDate': req.body.applyDate}, (err, result)=>{
  //     if(err) return res.json(false);
  //     return res.json(true);
  //   })
  // },
  
  // // POST /checkPay
  // checkPay: (req, res)=>{
  //   Models.PayModel.findByIdAndUpdate({_id: req.body.id}, {'isChecked': 1}, (err, result)=>{
  //     if(err) return res.json(false);
  //     return res.json(true);
  //   })
  // },
};

module.exports = Admin;
