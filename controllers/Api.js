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
  // GET /getMessage
  getMessage: (req, res)=>{
    if(!isAjax(req)) return res.json('Do not do it!')
    if(req.session.userid == undefined || req.session.userid == null)
      return res.json(false);
    Models.NoticeModel.find({$or: [{'receiver': req.session.userid}, {'receiver': 'all'}] }, (err, messages)=>{
      return res.json(messages);
    })
  },
  // POST /getName
  getName: (req, res)=>{
    Models.UserModel.findOne({'id': req.body.id}, (err, user)=>{
      return res.json(user.name);
    })
  },
  
};

function isAjax(req) {
  if (req.headers['x-requested-with'] && req.headers['x-requested-with'].toLowerCase() == 'xmlhttprequest')
    return true
  else 
    return false
}

module.exports = Api;
