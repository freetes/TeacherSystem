const Models = require('../model/dataModel');
const CtrlDB = require('../model/ctrlDB');
const multiparty = require('multiparty');
const fs = require("fs");

// 处理主页的请求
const Employee = {
  // GET /employee
  index: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.redirect('/signin')

      CtrlDB.getAllChangeInfo().then(workerData=>{
        Models.Employee.find({}, (err, data)=>{
          Models.Organization.findOne({}, (err, organization)=>{
            if(err) return res.end(err)
            return res.render('contents/employee',{
              title: '员工信息-' + JSON.parse(req.session.company).name,
              company: organization,
              user: JSON.parse(req.session.user),
              data,
              workerData
            })
          })
        })
      })
    } catch(err){
      next(err)
    }
  },

  // GET /employee/:id
  getEmployeeInfo: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.redirect('/signin')
      if(req.params.id == 'new'){
        Models.Organization.findOne({}, (err, company)=>{
          if(err) return res.end(err)
          return res.render('contents/employeeInfo', {
            title: '新增员工-' + JSON.parse(req.session.company).name,
            company,
            user: JSON.parse(req.session.user),
          })
        })
      }
      else{
        Models.Employee.findOne({'companyInfo.employeeID': req.params.id}, (err, employee)=>{
          if(err) return res.end(err)
          if(!employee)
            return res.render('404')
          Models.Organization.findOne({}, (err, company)=>{
            if(err) return res.end(err)
            return res.render('contents/employeeInfo', {
              title: '员工信息',
              company,
              user: JSON.parse(req.session.user),
              employee
            })
          })
        })
      }
    } catch(err){
      next(err)
    }
  },

  // POST /employee/:id
  postEmployeeInfo: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.redirect('/signin')

      // 创建新员工
      if(req.params.id == 'new'){
        // 工号查重
        Models.Employee.find({'companyInfo.employeeID': req.body.data['companyInfo.employeeID']}, (err, result)=>{
          if(err){
            return res.json({
              result: false,
              message: err
            })
          }
          if(result.length > 0){
            return res.json({
              result: false,
              message: '员工工号重复了'
            })
          }
          else{
            Models.Employee(req.body.data).save((err, data)=>{
              if(err){
                return res.json({
                  result: false,
                  message: '失败了，可能是某个数据类型错误'
                })
              }
              Models.Entry(req.body.entryData).save((err, entryData)=>{
                if(err)
                  return res.json({
                    result: false,
                    message: '入职数据错误!'
                  })
                return res.json({
                  result: true,
                  message: '入职成功!'
                })
              })
            })
          }
        })
      }
      else{
        Models.Employee.findOneAndUpdate({'companyInfo.employeeID': req.params.id}, req.body.data, (err, employee)=>{
          if(err) return res.json({
            result: false,
            message: '出错了，请检查数据是否输入正确'
          })
          return res.json({
            result: true,
            message: '员工数据更新完成!'
          })
        })
      }
    } catch(err){
      next(err)
    }
  },

  // GET /employee/hire/:id
  getHire: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.redirect('/signin')
      
      Models.Employee.findOne({'companyInfo.employeeID': req.params.id}, (err, employee)=>{
        if(err) return res.end(err)
        if(!employee)
          return res.render('404')
        Models.Organization.findOne({}, (err, company)=>{
          if(err) return res.end(err)
          return res.render('contents/aboutEmployee/hire', {
            title: '录用-' + JSON.parse(req.session.company).name,
            company,
            user: JSON.parse(req.session.user),
            employee
          })
        })
      })
    } catch(err){
      next(err)
    }
  },

  // POST /employee/hire/:id
  postHire: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.redirect('/signin')
      
      Models.Employee.findOne({'companyInfo.employeeID': req.params.id}, (err, employee)=>{
        if(err) return res.json(err)

        Models.Entry({
          name: req.body.name,
          employeeID: req.body.employeeID,
          department: req.body.department,
          job: req.body.job,
          entryTime: req.body.date,
          employeeType: req.body.employeeType,
          hasTryTime: req.body.hasTryTime != 0,
          tryTime: req.body.hasTryTime,
          turnTime: req.body.turnTime
        }).save((err, result)=>{
          if(err) return res.json(err)
          else{
            employee.companyInfo.employeeType = '全职'
            employee.companyInfo.employeeID = req.body.employeeID
            if(req.body.hasTryTime == 0)
              employee.companyInfo.status = '正式'
            else
              employee.companyInfo.status = '试用'

            employee.contract.begin = new Date(req.body["contract.begin"])
            employee.contract.end = new Date(req.body["contract.end"])

            Models.Employee.findOneAndUpdate({'companyInfo.employeeID': req.params.id}, employee, (err, eResult)=>{
              if(err) return res.json(err)
              return res.redirect('/employee/' + req.body.employeeID)
            })
          }
        })
      })
    } catch(err){
      next(err)
    }
  },

  // GET /employee/resignation/:id
  getResignation: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.redirect('/signin')
      
      Models.Employee.findOne({'companyInfo.employeeID': req.params.id}, (err, employee)=>{
        if(err) return res.end(err)
        if(!employee)
          return res.render('404')
        Models.Organization.findOne({}, (err, company)=>{
          if(err) return res.end(err)
          return res.render('contents/aboutEmployee/resignation', {
            title: '离职-' + JSON.parse(req.session.company).name,
            company,
            user: JSON.parse(req.session.user),
            employee
          })
        })
      })
    } catch(err){
      next(err)
    }
  },

  // POST /employee/resignation/:id
  postResignation: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.redirect('/signin')
      
      Models.Employee.findOne({'companyInfo.employeeID': req.params.id}, (err, employee)=>{
        if(err) return res.json(err)
        Models.Resignation({
          name: req.body.name,
          employeeID: req.params.id,
          lastDepartment: employee.companyInfo.department,
          lastJob: employee.companyInfo.job,
          employeeType: employee.companyInfo.employeeType,
          employeeStatus: employee.companyInfo.status,
          date: req.body.date,
          assess: req.body.assess,
          kind: req.body.kind,
          reason: req.body.reason,
          where: req.body.where,
          words: req.body.words
        }).save((err, result)=>{
          if(err) return res.json(err)
          else{
            employee.companyInfo.status = '离职'
            employee.statusChange.resignation.kind = req.body.kind
            employee.statusChange.resignation.date = req.body.date
            
            Models.Employee.findOneAndUpdate({'companyInfo.employeeID': req.params.id}, employee, (err, eResult)=>{
              if(err) return res.json(err)
              return res.redirect('/employee')
            })
          }
        })
      })
    } catch(err){
      next(err)
    }
  },

  // GET /employee/turnPositive/:id
  getTurnPositive: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.redirect('/signin')
      
      Models.Employee.findOne({'companyInfo.employeeID': req.params.id}, (err, employee)=>{
        if(err) return res.end(err)
        if(!employee)
          return res.render('404')
        return res.render('contents/aboutEmployee/turnPositive', {
          title: '转正-' + JSON.parse(req.session.company).name,
          company: JSON.parse(req.session.company),
          user: JSON.parse(req.session.user),
          employee
        })
      })
    } catch(err){
      next(err)
    }
  },

  // POST /employee/TurnPositive/:id
  postTurnPositive: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.redirect('/signin')
      Models.Entry.findOne({'employeeID': req.params.id}, (err, entry)=>{

        if(new Date(entry.turnTime) > new Date(req.body.date))
          kind = '提前转正'
        else if(new Date(entry.turnTime) < new Date(req.body.date))
          kind = '延期转正'
        else
          kind = '按期转正'

        Models.Employee.findOne({'companyInfo.employeeID': req.params.id}, (err, employee)=>{
          if(err) return res.json(err)
          
          Models.TurnPositive({
            name: req.body.name,
            employeeID: req.params.id,
            department: employee.companyInfo.department,
            job: employee.companyInfo.job,
            date: req.body.date,
            assess: req.body.assess,
            kind
          }).save((err, result)=>{
            if(err) return res.json(err)
            else{
              employee.companyInfo.employeeType = '全职'
              employee.companyInfo.status = '正式'
              employee.statusChange.turnPositive.kind = kind
              employee.statusChange.turnPositive.date = req.body.date
    
              Models.Employee.findOneAndUpdate({'companyInfo.employeeID': req.params.id}, employee, (err, eResult)=>{
                if(err) return res.json(err)
                return res.redirect('/employee/' + req.body.id)
              })
            }
          })
          
        })
      })
    } catch(err){
      next(err)
    }
  },

  // GET /employee/change/:id
  getChange: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.redirect('/signin')
      
      Models.Employee.findOne({'companyInfo.employeeID': req.params.id}, (err, employee)=>{
        if(err) return res.end(err)
        if(!employee)
          return res.render('404')
        Models.Organization.findOne({}, (err, company)=>{
          if(err) return res.end(err)
          return res.render('contents/aboutEmployee/change', {
            title: '调动-' + JSON.parse(req.session.company).name,
            company,
            user: JSON.parse(req.session.user),
            employee
          })
        })
      })
    } catch(err){
      next(err)
    }
  },

  // POST /employee/Change/:id
  postChange: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.redirect('/signin')

      Models.Employee.findOne({'companyInfo.employeeID': req.params.id}, (err, employee)=>{
        if(err) return res.json(err)
        Models.Change({
          name: req.body.name,
          employeeID: req.params.id,
          employeeStatus: employee.companyInfo.status,
          employeeType: employee.companyInfo.employeeType,
          lastDepartment: req.body.lastDepartment,
          lastJob: req.body.lastJob,
          nowDepartment: req.body.nowDepartment,
          nowJob: req.body.nowJob,
          date: req.body.date,
          kind: req.body.kind,
          reason: req.body.reason
        }).save((err, result)=>{
          if(err) return res.json(err)
          else{
            // 更新花名册
            employee.companyInfo.department = req.body.nowDepartment
            employee.companyInfo.job = req.body.nowJob
            if(!employee.statusChange.change)
              employee.statusChange.change = []
            employee.statusChange.change.push({
              date: req.body.date,
              kind: req.body.kind,
              lastDepartment: req.body.lastDepartment,
              lastJob: req.body.lastJob,
              nowDepartment: req.body.nowDepartment,
              nowJob: req.body.nowJob,
            })
            Models.Employee.findOneAndUpdate({'companyInfo.employeeID': req.params.id}, employee, (err, eResult)=>{
              if(err) return res.json(err)
              return res.redirect('/employee/' + req.params.id)
            })
          }
        })
      })
    } catch(err){
      next(err)
    }
  },

  // POST /employee/addResume
  addResume: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.redirect('/signin')

      let options = {
        uploadDir: './public/file/update',
        encoding: 'utf8'
      }
      let form = new multiparty.Form(options);
    
      form.parse(req, function(err, fields, files) {
        const id = fields.id[0]
        let file = files.file[0]

        Models.Employee.findOne({'companyInfo.employeeID': id}, (err, employee)=>{
          const companyDirectory = './public/file/' + JSON.parse(req.session.company)._id + '/pdf/'
          if(!fs.existsSync('./public/file/' + JSON.parse(req.session.company)._id))
            fs.mkdirSync('./public/file/' + JSON.parse(req.session.company)._id);
          if(!fs.existsSync(companyDirectory))
            fs.mkdirSync(companyDirectory);
          
          // 删除原文件
          if(typeof employee.personalInfo.resume.path != 'undefined'){
            if(fs.existsSync('./public' + employee.personalInfo.resume.path))
              fs.unlinkSync('./public' + employee.personalInfo.resume.path);
          }
          
          var dstPath = companyDirectory + 'CV-' + (JSON.parse(req.session.user)).name + '-' + Date.now() + '.pdf';
          //重命名为真实文件名
          fs.rename(file.path, dstPath, err=>{
            employee.personalInfo.resume = {
              name: file.originalFilename,
              path: dstPath.slice(8)
            }
            Models.Employee.findOneAndUpdate({'companyInfo.employeeID': req.params.id}, employee, (err)=>{
              return res.redirect('/employee/' + id)
            })
          })
        });
      })
    } catch(err){
      next(err)
    }
  },

  // POST /employee/deleteResume/:id
  deleteResume: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.redirect('/signin')

      Models.Employee.findOne({'companyInfo.employeeID': req.params.id}, (err, employee)=>{
        // 删除原文件
        if(typeof employee.personalInfo.resume.path != 'undefined'){
          if(fs.existsSync('./public' + employee.personalInfo.resume.path))
            fs.unlinkSync('./public' + employee.personalInfo.resume.path);
        }
        employee.personalInfo.resume = {}

        Models.Employee.findOneAndUpdate({'companyInfo.employeeID': req.params.id}, employee, (err)=>{
          return res.json(true)
        })
      })
    } catch(err){
      next(err)
    }
  },
};

// 判断是否登录
function isLogin(req, res){
  if(!req.session.user)
    return res.redirect('/signin')
}

module.exports = Employee;
