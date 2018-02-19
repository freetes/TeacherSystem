const Models = require('../model/dataModel');
const CtrlDB = require('../model/ctrlDB');

// 秘书专用
const Secretary = {
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
    Models.UserModel.findOne({'id': req.session.userid}, (err, user)=>{
      if(user.level == 0) return res.json(false);
      else
        Models.PayModel.findByIdAndUpdate({_id: req.body.id}, {'isChecked': 0}, {new: true}, (err, result)=>{
          Models.NoticeModel({
            senderId: req.session.userid,
            senderName: user.name,
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
  },
  // POST /secretary/sendMessage
  sendMessage: (req, res)=>{
    if(req.session.userid == undefined || req.session.userid == null)
      return res.json(false);
    Models.UserModel.findOne({'id': req.session.userid}, (err, user)=>{
        if(user.level == 0) return res.json(false);
        else
          Models.NoticeModel({
            senderId: req.session.userid,
            senderName: user.name,
            receiver: req.body.receiver,
            message: req.body.message,
            date: req.body.date,
            level: req.body.level
          }).save((err, result)=>{
            if(err) return res.json(false)
            return res.json(true)
          })
      })
    
  },
  // POST /secretary/addNewUser
  addNewUser: (req, res)=>{
    if(req.session.userid == undefined || req.session.userid == null)
      return res.json(false);
    Models.UserModel({
      id: req.body.id,
      name: req.body.name,
      password: req.body.password,
      level: 0
    }).save(result=>{
      return res.json(true)
    })
  },
  // POST /secretary/changeUser
  changeUser: (req,res)=>{
    Models.UserModel.findByIdAndUpdate(
      {_id: req.body._id},
      {
        id: req.body.id,
        name: req.body.name,
        password: req.body.password
      },
      (err, result)=>{
        if(err) return res.json(false)
        return res.json(true)
      }
    )
  },
  // POST /secretary/deleteUser
  deleteUser: (req,res)=>{
    Models.UserModel.findByIdAndRemove(
      {_id: req.body._id},
      (err, result)=>{
        if(err) return res.json(false)
        
        return res.json(true)
      }
    )
  },
};

module.exports = Secretary;
