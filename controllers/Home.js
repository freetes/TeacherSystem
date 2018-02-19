const Models = require('../model/dataModel');
const CtrlDB = require('../model/ctrlDB');

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
            title: '主页',
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
            title: '主页',
            user: user,
            users: info.users,
            pays: info.pays,
            message: info.message
          });
        });
      }
      // admin
      else{
        CtrlDB.getAllInfoForAdmin(req.session.userid).then(info=>{
          return res.render('index',{
            title: '主页',
            user: user,
            users: info.users,
            class: info.class,
            pays: info.pays,
            message: info.message
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
      if(user.length != 0){
        if(user[0].password == req.body.password){
          req.session.userid = user[0].id;
          delete req.session.verifyExpression
          delete req.session.verifyResult
          return res.redirect(303, '/');
        }
        else{
          return res.render('signin',{
            title: '教师工作量管理系统',
            verifyCodeExpression: req.session.verifyExpression,
            message: '密码错误，请重新输入！'
          });
        }
      }
      else{
        return res.render('signin',{
          title: '教师工作量管理系统',
          verifyCodeExpression: req.session.verifyExpression,
          message: '账号不存在，请重新输入！'
        });
      }
    });
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

module.exports = Home;
