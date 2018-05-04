const Models = require('../model/dataModel');
const CtrlDB = require('../model/ctrlDB');
const bcrypt = require('bcrypt');

// 处理AJAX
const Api = {
  // POST /changePasswd
  changePasswd: (req, res)=>{
    if(req.session.userid == undefined || req.session.userid == null)
      return res.json(false);
    bcrypt.genSalt(10, (err, salt)=>{
      bcrypt.hash(req.body.newPasswd, salt, function(err, hash) {
        Models.UserModel.update({'id': req.session.userid}, {'password': hash}, (err, result)=>{
          delete req.session.userid;
          return res.json(true);
        })
      })
    })
  },
  // POST /confirmPasswd
  confirmPasswd: (req, res)=>{
    if(req.session.userid == undefined || req.session.userid == null)
      return res.json(false);
    
    Models.UserModel.find({'id': req.session.userid}, (err, user)=>{
      bcrypt.compare(req.body.oldPasswd, user[0].password, (err, result)=>{
          return result ? res.json(true) : res.json(false);
        }
      );
    })
  },
  // POST /feedback
  feedback: (req, res)=>{
    if(req.session.userid == undefined || req.session.userid == null)
      return res.json(false);
    Models.UserModel.findOne({'id': req.session.userid}, (err, user)=>{
      Models.FeedbackModel({
        id: user.id,
        name: user.name,
        message: req.body.message,
        date: req.body.date,
        ip: getIP(req)
      }).save(err=>{
        if(err) return res.json(false)
        res.json(true)
      })
    })
  },
};

function isAjax(req) {
  if (req.headers['x-requested-with'] && req.headers['x-requested-with'].toLowerCase() == 'xmlhttprequest')
    return true
  else 
    return false
}

//获取url请求客户端ip
function getIP(req) {
  var ip = req.headers['x-forwarded-for'] ||
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress || '';
  if(ip.split(',').length>0){
      ip = ip.split(',')[0]
  }
  return ip;
};

module.exports = Api;
