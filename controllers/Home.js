const Models = require('../model/dataModel');
const CtrlDB = require('../model/ctrlDB');

Models.UserModel.find((err, res)=>{
  if(res.length == 0){
    Models.UserModel({
      id: 'admin',
      name: 'freetes',
      password: '1',
      level: 2,
      isWorking: true
    }).save()
  }
})

// 处理主页的请求
const Home = {
  // GET /
  index: (req, res)=>{
    if(req.session.userid == undefined || req.session.userid == null)
      return res.redirect(303, '/signin');
    Models.UserModel.findOne({'id': req.session.userid}, (err, user)=>{
      // normal user
      if(user.level == 0){
        CtrlDB.getAllInfoForUser(req.session.userid).then(info=>{
          return res.render('index',{
            title: '教学工作量管理系统',
            user: user,
            classes: info.class,
            pay: info.pay,
            message: info.message
          });
        });
      }
      // secretary
      else if(user.level == 1){
        CtrlDB.getAllInfoForSecretary(req.session.userid).then(info=>{
          return res.render('index',{
            title: '教学工作量管理系统',
            user: user,
            users: info.users,
            pays: info.pays,
            message: info.message,
            classes: info.class
          });
        });
      }
      // admin
      else{
        CtrlDB.getAllInfoForAdmin(req.session.userid).then(info=>{
          return res.render('index',{
            title: '系统管理员主页',
            user: user,
            users: info.users,
            class: info.class,
            pays: info.pays,
            message: info.message,
            feedback: info.feedback,
            signinLog: info.signinLog
          });
        });
      }
    })
  },

  // GET /signin
  signinGet: (req, res)=>{
    req.session.userid = null;
    buildVerifyCode(req)
    res.render('signin', {
      title: '教师工作量管理系统',
      verifyCodeExpression: req.session.verifyExpression
    });
  },

  // POST /signin
  signinPost: (req, res)=>{
    if(req.body.verifyCode != req.session.verifyResult){
      buildVerifyCode(req)
      return res.render('signin',{
        title: '教师工作量管理系统',
        verifyCodeExpression: req.session.verifyExpression,
        message: '验证码错误，请重新输入！'
      });
    }
    Models.UserModel.find({'id': req.body.id}, (err, user)=>{
      if(user.length == 0){
        Models.SigninLogModel({
          id: req.body.id,
          name: '',
          ip: getIP(req),
          date: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
          result: '登录失败，账号不存在！'
        }).save()
        return res.render('signin',{
          title: '教师工作量管理系统',
          verifyCodeExpression: req.session.verifyExpression,
          message: '账号不存在，请重新输入！'
        });
      }
      if(!user[0].isWorking){
        Models.SigninLogModel({
          id: user[0].id,
          name: user[0].name,
          ip: getIP(req),
          date: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
          result: '登录失败，账号被注销！'
        }).save()
        return res.render('signin',{
          title: '教师工作量管理系统',
          verifyCodeExpression: req.session.verifyExpression,
          message: '账号已被注销！'
        });
      }
      if(user[0].password !== req.body.password){
        Models.SigninLogModel({
          id: user[0].id,
          name: user[0].name,
          ip: getIP(req),
          date: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
          result: '登录失败，密码错误！'
        }).save()
        return res.render('signin',{
          title: '教师工作量管理系统',
          verifyCodeExpression: req.session.verifyExpression,
          message: '密码错误，请重新输入！'
        });
      }

      Models.SigninLogModel({
        id: user[0].id,
        name: user[0].name,
        ip: getIP(req),
        date: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
        result: '登录成功！'
      }).save()
      req.session.userid = user[0].id;
      delete req.session.verifyExpression
      delete req.session.verifyResult
      return res.redirect(303, '/');
    });
  },

  // GET /exportdoc
  exportDoc: (req, res)=>{
    if(req.session.userid == undefined || req.session.userid == null)
      return res.redirect(303, '/signin');
    Models.UserModel.findOne({'id': req.session.userid}, (err, user)=>{
      // normal user
      if(user.level == 0){
        return res.redirect(303, '/signin');
      }
      CtrlDB.getInfo2Export(req.session.userid, req.query.y + '-' + req.query.m).then(info=>{
        return res.render('exportdoc',{
          title: 'Excel导出页面',
          users: info.users,
          pays: info.pays,
          year: req.query.y,
          month: req.query.m
        })
      })
    })
  },
};

// 生成验证码
function buildVerifyCode(req){
  const chineseNums = ['零','壹','贰','叁','肆','伍','陆','柒','捌','玖'],
        chineseSymbol = ['加','减','乘'],
        x = parseInt(Math.random()*10),
        y = parseInt(Math.random()*10),
        z = parseInt(Math.random()*3)

  req.session.verifyExpression = `(${chineseNums[x]} ${chineseSymbol[z]} ${chineseNums[y]})`
  req.session.verifyResult =  z==0?x+y:z==1?x-y:x*y
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

module.exports = Home;
