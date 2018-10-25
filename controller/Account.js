const Models = require('../model/dataModel');
const CtrlDB = require('../model/ctrlDB');

// 处理主页的请求
const Account = {
  // get /signin
  index: (req, res, next)=>{
    try{
      const message = req.session.message
      delete req.session.message
      delete req.session.user

      Models.User.findOne({email: req.query.email, password: req.query.password}, (err, user)=>{
        if(user){
          req.session.user = JSON.stringify(user)
          return res.redirect('/')
        }
        res.render('signin', {
          title: '登录-武汉轻工大学',
          message
        })
      })
    } catch(err){
      next(err)
    }
  },
  // post /signin
  signinPost: (req, res, next)=>{
    try{
      // 数据库验证
      Models.User.findOne({email: req.body.email}, (err, user)=>{
        if(err) return res.end(err)
        if(!user){
          req.session.message = '账号不存在，请检查后再登陆'
        }
        else if(req.body.password != user.password){
          req.session.message = '账号密码不匹配，请检查后再登陆'
        }
        else{
          req.session.user = JSON.stringify(user);
          return res.redirect('/')
        }
        return res.redirect('/signin')
      })
    } catch(err){
      next(err)
    }
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
  let ip = req.headers['x-forwarded-for'] ||
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress || '';
  if(ip.split(',').length>0){
      ip = ip.split(',')[0]
  }
  return ip;
};

module.exports = Account;
