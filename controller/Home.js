const Models = require('../model/dataModel');
const CtrlDB = require('../model/ctrlDB');

// 处理主页的请求
const Home = {
  // GET /
  index: (req, res)=>{
    try{
      if(!req.session.user)
        return res.redirect('/signin')

      // 这里获取数据
      CtrlDB.getAllInfoInIndexPage(email=JSON.parse(req.session.user).email).then(data=>{
        return res.render('contents/hello', {
          title: '首页',
          user: data.user,
        });
      })
    } catch(err){
      next(err)
    }
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
          month: req.query.m,
        })
      })
    })
  },

  // GET /course


  // GET /affair
  affair: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.redirect('/signin')

      Models.Affair.find({}, (err, affairs)=>{
        return res.render('contents/affair',{
          title: '事务管理',
          user: JSON.parse(req.session.user),
          affairs
        })
      })
    } catch(err){
      next(err)
    }
  },
  // GET /affair/:id
  affairInfo: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.redirect('/signin')
      Models.Affair.find({}, (err, affairs)=>{
        let affair
        for(let item of affairs)
          if(item._id == req.params.id)
            affair = item
        
        if(typeof affair == 'undefined')
          return res.redirect('/signin')
        else{
          return res.render('contents/affairInfo',{
            title: affair.name,
            user: JSON.parse(req.session.user),
            affair,
            affairs
          })
        }
      })
    } catch(err){
      next(err)
    }
  },
  // POST /affair/:id
  createList: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.redirect('/signin')

      Models.Affair.findById(req.params.id, (err, affair)=>{
        affair.lists.push({
          name: req.body.name,
          date: Date.now(),
          items: []
        })
        Models.Affair.findByIdAndUpdate(req.params.id, affair, (err)=>{
          return res.redirect('/affair/'+req.params.id)
        })
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
