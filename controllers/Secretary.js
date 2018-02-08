const Models = require('../model/dataModel');
const CtrlDB = require('../model/ctrlDB');

// 秘书专用
const Secretary = {
  // POST /secretary/getAllInfo
  getAllInfo: (req, res)=>{
    if(req.session.userid == undefined || req.session.userid == null)
      return res.json(false);
    Models.UserModel.find({'id': req.session.userid}, (err, user)=>{
      if(user[0].level == 0) return res.json(false);
      else
        CtrlDB.getAllInfoForSecretary(req.session.userid).then(info=>{
          return res.json(info)
        })
    })
  },
  // POST /secretary/passRequest
  passRequest: (req, res)=>{
    if(req.session.userid == undefined || req.session.userid == null)
      return res.json(false);
    Models.UserModel.find({'id': req.session.userid}, (err, user)=>{
      if(user[0].level == 0) return res.json(false);
      else
        Models.PayModel.findByIdAndUpdate({_id: req.body.id}, {'isChecked': 2}, (err, result)=>{
          return res.json(true)
        })
    })
  },
  // POST /secretary/refuseRequest
  refuseRequest: (req, res)=>{
    if(req.session.userid == undefined || req.session.userid == null)
      return res.json(false);
    Models.UserModel.find({'id': req.session.userid}, (err, user)=>{
      if(user[0].level == 0) return res.json(false);
      else
        Models.PayModel.findByIdAndUpdate({_id: req.body.id}, {'isChecked': 0}, {new: true}, (err, result)=>{
          Models.NoticeModel({
            sender: req.session.userid,
            receiver: result.id,
            message: req.body.message,
            date: req.body.date,
            level: 'warning'
          }).save((err, resul)=>{
            if(err) return res.json(false)
            return res.json(true)
          })
        })
    })
  }
};

module.exports = Secretary;
