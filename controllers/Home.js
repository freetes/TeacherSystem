const Models = require('../model/dataModel');
const CtrlDB = require('../model/ctrlDB');

// Models.NormalClassModel({
//   id: 1001,               // 工号
//   semester: '2017-2018-2',         // 学期
//   name: '大学物理2',             // 课程名
//   faculty: '数计',          // 专业
//   class: '大类1601-2',            // 班级
//   studentAmount: 65,    // 人数
//   standardHours: 10,    // 标准学时
//   theoryHours: 5,      // 理论学时
//   experimentHours: 5,  // 实验学时
//   finalHours: 20,       // 实际学时
//   data: '2018-1-25 17:25',             // 添加/修改日期
//   point: 1.0,            // 课程权重
//   isChecked: false        // 是否审核
// }).save();

// Models.UserModel({
//   id: 1001,
//   name: '张一',
//   password: 1,
//   level: 0
// }).save();

// Models.PayModel({
//   id: 1001,
//   pay: 3000,
//   isChecked: false
// }).save();

// 处理主页的请求
const Home = {
  // GET /
  index: (req, res)=>{
    if(req.session.userid == undefined || req.session.userid == null)
      return res.redirect(303, '/signin');
    Models.UserModel.find({'id': req.session.userid}, (err, user)=>{
      CtrlDB.getAllInfoByUserId(req.session.userid).then(info=>{
        return res.render('index',{
          title: '主页',
          user: user[0],
          classes: info.class,
          pay: info.pay[0]
        });
      });
    })
  },

  // GET /signin
  signinGet: (req, res)=>{
    req.session.userid = null;

    res.render('signin', {
      title: '教师工作量管理系统'
    });
  },

  // POST /signin
  signinPost: (req, res)=>{
    Models.UserModel.find({'id': req.body.id}, (err, user)=>{
      if(user.length != 0){
        if(user[0].password == req.body.password){
          req.session.userid = user[0].id;
          return res.redirect(303, '/');
        }
        else{
          return res.render('signin',{
            title: '教师工作量管理系统',
            message: '密码错误，请重新输入！'
          });
        }
      }
      else{
        return res.render('signin',{
          title: '教师工作量管理系统',
          message: '账号不存在，请重新输入！'
        });
      }
    });
  },

};

module.exports = Home;
