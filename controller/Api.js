const Models = require('../model/dataModel');
const CtrlDB = require('../model/ctrlDB');
const multiparty = require('multiparty');
const fs = require("fs");
var path = require('path')
const publicPath = path.join(__dirname, '../public'),
      updatePath = path.join(publicPath, '/file/update')

var nodemailer = require('nodemailer')

var mailTransport = nodemailer.createTransport({
  host: 'smtp.exmail.qq.com',
  secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
  auth: {
    user: 'rd@rulertech.com',
    pass: 'Ruler2018'
  },
});

// 处理主页的请求
const Api = {
  // post /api/getEmployeesByDepartmentName
  getEmployeesByDepartmentName: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      Models.Employee.find({'companyInfo.department': req.body.department}, (err, employees)=>{
        if(err) return res.json(err)
        res.json(employees)
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/getEmployeesByFilter
  getEmployeesByFilter: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      if(!req.body.data){
        Models.Employee.find({}, (err, employees)=>{
          return res.json(employees)
        })
      }
      else{
        Models.Employee.find({$or: req.body.data, }, (err, employees)=>{
          return res.json(employees)
        })
      }
    } catch(err){
      next(err)
    }
  },
  // post /api/changeDepartmentName
  changeDepartmentName: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      
      if(req.body.nowName.indexOf('-') != -1){
        return res.json({
          result: false,
          message: "部门名不应该含有'-'字符，请修改"
        })
      }
      
      Models.Organization.findOne({}, (err, organization)=>{
        const name = req.body.lastName.split('-')

        // 修改根目录部门
        if(name.length == 1){
          for(let item of organization.department){
            if(item.name == req.body.lastName){
              item.name = req.body.nowName
              break
            }
          }
        }
        // 修改子部门
        else{
          for(let item of organization.department){
            if(item.subDepartment.length!=0){
              for(let subItem of item.subDepartment){
                if(subItem.name == name[1]){
                  subItem.name = req.body.nowName
                  break
                }
              }
            }
          }
        }
        Models.Organization.findOneAndUpdate({}, organization, (err, data)=>{
          if(err) return res.json({
            result: false,
            message: "系统错误"
          })
          Models.Employee.find({'companyInfo.department': req.body.lastName}, (err, employees)=>{
            if(err) return res.json({
              result: false,
              message: "系统错误"
            })
            if(employees.length == 0)
              return res.json({
                result: true,
                message: "修改成功！"
              })
              
            for(let i=0; i<employees.length; i++){
              Models.Employee.findOneAndUpdate({'companyInfo.employeeID': employees[i].companyInfo.employeeID}, {'companyInfo.department': req.body.nowName}, (err)=>{
                if(err) return res.json(err)
                if(i == employees.length-1)
                  return res.json({
                    result: true,
                    message: "修改成功！"
                  })
              })
            }
          })
        })
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/addSubDepartment
  addSubDepartment: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      
      if(req.body.subName.indexOf('-') != -1){
        return res.json({
          result: false,
          message: "部门名不应该含有'-'字符，请修改"
        })
      }
      Models.Organization.findOne({}, (err, organization)=>{
        if(!req.body.name){
          organization.department.push({
            name: req.body.subName,
            subDepartment: []
          })
        }
        else
          for(let item of organization.department){
            if(item.name == req.body.name){
              item.subDepartment.push({name: req.body.subName})
              break
            }
          }
        Models.Organization.findOneAndUpdate({}, organization, (err, data)=>{
          if(err) return res.json({
            result: false,
            message: "系统错误"
          })
          return res.json({
            result: true,
            message: "新增成功"
          })
        })
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/deleteDepartment
  deleteDepartment: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      if(req.body.name.split('-').length>1)
        req.body.name = req.body.name.split('-')[1]

      let found = 0
      Models.Organization.findOne({}, (err, organization)=>{
        for(let i=0; i<organization.department.length; i++){
          if(found != 0)
            break
          // 是否有子部门
          if(organization.department[i].subDepartment.length != 0){
            for(let j=0; j<organization.department[i].subDepartment.length; j++){
              if(organization.department[i].subDepartment[j].name == req.body.name){
                organization.department[i].subDepartment.splice(j, 1)
                found = 1
                break
              }
            }
          }
          else{
            if(organization.department[i].name == req.body.name){
              organization.department.splice(i, 1)
              break
            }
          }
        }
        Models.Organization.findOneAndUpdate({}, organization, (err, data)=>{
          if(err) return res.json(false)
          return res.json(true)
        })
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/deleteEmployee
  deleteEmployee: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      Models.Employee.findOneAndRemove({'companyInfo.employeeID': req.body.id}, (err, emp)=>{
        CtrlDB.deleteUser(req.body.id).then(()=>{
          Models.DeleteLog({
            employee: [emp],
            date: Date.now(),
            operator: JSON.parse(req.session.user).email
          }).save((err, data)=>{
            if(err) {
              return res.json(false)
            }
            return res.json(true)
          })
        })
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/addUser
  addUser: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      Models.User.find({'email': req.body.email}, (err, users)=>{
        if(users.length > 0)
          return res.json({result: false, message: '邮箱已被用,请换一个再试试'})
        Models.User({
          email: req.body.email,
          name: req.body.name,
          password: req.body.password,
          level: req.body.level
        }).save(err=>{
          const options = {
            from: '"RulerTech" <rd@rulertech.com>',
            to: `"${req.body.name}" <${req.body.email}>`,
            subject: `【平台账号开通】${JSON.parse(req.session.company).name}`,
            html: `
              <h1></h1>
              <h1>Hi，亲爱的${req.body.name}</h1>
              <p>${JSON.parse(req.session.company).name}的平台已开通，网址为 ${req.headers.origin}</p>
              <p>你的账号：${req.body.email}</p>
              <p>你的密码：${req.body.password}</p>
              <br>
              <h1>如果使用中有任何问题请和诗琴沟通:)</h1>
              `
          };

          mailTransport.sendMail(options, function(err, msg){
            if(err){
              return res.json({result: false, message: err})
            }
            else {
              return res.json({result: true, message: '新增用户成功!'})
            }
          });
        })
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/resetPasswd
  resetPasswd: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      Models.User.findOneAndUpdate({'email': req.body.email}, {'password': '123456'}, (err, user)=>{
        if(!user > 0)
          return res.json({result: false, message: '修改失败'})
        return res.json({result: true, message: '修改密码成功,初始密码为:123456'})
      })
    } catch(err){
      next(err)
    }
  },
  // get /api/getAllInfo
  getAllInfo: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      Models.Employee.find({}, (err, employees)=>{
        if(err) return res.json(err)
        CtrlDB.getAllChangeInfo().then(data=>{
          return res.json({
            employees,
            data
          })
        })
      })
    } catch(err){
      next(err)
    }
  },
  // get /api/getSuggestInfo
  getSuggestInfo: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      Models.Suggest.findById(req.body.id, (err, data)=>{
        if(err)
          return res.json(false)
        return res.json(data)
      })
    } catch(err){
      next(err)
    }
  },
  // get /api/getCompanyInfo
  getCompanyInfo: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      Models.Organization.findOne({}, (err, organization)=>{
        if(err)
          return res.json(false)
        return res.json(organization)
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/deleteUser
  deleteUser: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      Models.User.findOneAndRemove({email: req.body.email}, (err, user)=>{
        if(err){
          return res.json(false)
        }
        return res.json(true)
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/createNews
  createNews: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      if(req.body.tag != ''){
        req.body.tag = req.body.tag.split(' ')
        for(let i=0; i<req.body.tag.length; i++){
          req.body.tag[i] = {
            name: req.body.tag[i],
            count: 1
          }
        }
      }
      else
        req.body.tag = []

      req.body.operator = JSON.parse(req.session.user).name
      Models.CompanyNews(req.body).save(err=>{
        if(err) return res.end(err)
        return res.redirect('/company')
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/countAddOne
  countAddOne: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      Models.CompanyNews.findById(req.body.id, (err, news)=>{
        for(let item of news.tag){
          if(item.name == req.body.name){
            item.count++
            break
          }
        }
        Models.CompanyNews.findByIdAndUpdate(req.body.id, news, (err, updateNew)=>{
          if(err) return res.json({result: false, message: '更新失败'})
          return res.json({result: true, message: '成功 +1'})
        })
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/addTags
  addTags: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      Models.CompanyNews.findById(req.body.id, (err, news)=>{
        req.body.tag = req.body.tag.split(' ')
        for(let i=0; i<req.body.tag.length; i++){
          req.body.tag[i] = {
            name: req.body.tag[i],
            count: 1
          }
        }

        if(news.tag == undefined || news.tag == [] || news.tag == ''){
          if(req.body.tag != ''){
            news.tag = req.body.tag
          }
          else{
            news.tag = []
          }
        }
        // 查重
        else{
          for(let tag of req.body.tag){
            let isSame = false
            for(let item of news.tag){
              if(item.name == tag.name){
                isSame = true
                break
              }
            }
            if(!isSame)
              news.tag.push(tag)
          }
        }

        Models.CompanyNews.findByIdAndUpdate(req.body.id, news, (err, updateNew)=>{
          if(err) return res.redirect('/company')
          return res.redirect('/company')
        })
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/createAffair
  createAffair: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      
      Models.Affair({
        lists: [],
        name: req.body.name,
        user: JSON.parse(req.session.user).name,
        date: Date.now()
      }).save(err=>{
        return res.redirect('/affair')
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/createAffairItem/:id
  createAffairItem: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      
      Models.Affair.findById(req.body.id, (err, affair)=>{
        for(let item of affair.lists){
          if(item._id == req.params.id){
            item.items.push({
              name: req.body.name,
              user: JSON.parse(req.session.user).name,
              date: Date.now(),
              description: req.body.description,
              remarks: []
            })
            break
          }
        }

        Models.Affair.findByIdAndUpdate(req.body.id, affair, (err)=>{
          return res.redirect('/affair/' + req.body.id)
        })
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/getItemInfo
  getItemInfo: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      
      Models.Affair.findById(req.body.affairID, (err, affair)=>{
        for(let item of affair.lists){
          if(item._id == req.body.listID){
            for(let i of item.items){
              if(i._id == req.body.id){
                return res.json(i)
              }
            }
          }
        }
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/addRemark
  addRemark: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      
      Models.Affair.findById(req.body.affairID, (err, affair)=>{
        for(let item of affair.lists){
          if(item._id == req.body.listID){
            for(let i of item.items){
              if(i._id == req.body.id){
                i.remarks.push({
                  words: req.body.data,
                  user: JSON.parse(req.session.user).name,
                  date: Date.now(),
                })
                Models.Affair.findByIdAndUpdate(req.body.affairID, affair, err=>{
                  return res.json(true)
                })
              }
            }
          }
        }
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/deleteRemark
  deleteRemark: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      
      Models.Affair.findById(req.body.affairID, (err, affair)=>{
        for(let item of affair.lists){
          if(item._id == req.body.listID){
            for(let i of item.items){
              if(i._id == req.body.itemID){
                for(let j=0; j<i.remarks.length; j++){
                  if(i.remarks[j]._id == req.body.id){
                    i.remarks.splice(j, 1)
                    Models.Affair.findByIdAndUpdate(req.body.affairID, affair, err=>{
                      return res.json(true)
                    })
                  }
                }
              }
            }
          }
        }
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/deleteItem
  deleteItem: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      
      Models.Affair.findById(req.body.affairID, (err, affair)=>{
        for(let item of affair.lists){
          if(item._id == req.body.listID){
            for(let i=0; i<item.items.length; i++){
              if(item.items[i]._id == req.body.id){
                item.items.splice(i, 1)
                Models.Affair.findByIdAndUpdate(req.body.affairID, affair, err=>{
                  return res.json(true)
                })
              }
            }
          }
        }
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/deleteList
  deleteList: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      
      Models.Affair.findById(req.body.affairID, (err, affair)=>{
        for(let i=0; i<affair.lists.length; i++){
          if(affair.lists[i]._id == req.body.listID){
            affair.lists.splice(i, 1)
            Models.Affair.findByIdAndUpdate(req.body.affairID, affair, err=>{
              return res.json(true)
            })
          }
        }
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/deleteAffair
  deleteAffair: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      
      Models.Affair.findByIdAndRemove(req.body.id, (err, affair)=>{
        return res.json(true)
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/editItem
  editItem: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      
      Models.Affair.findById(req.body.affairID, (err, affair)=>{
        for(let item of affair.lists){
          if(item._id == req.body.listID){
            for(let i=0; i<item.items.length; i++){
              if(item.items[i]._id == req.body.id){
                item.items[i].name = req.body.name
                item.items[i].description = req.body.description
                Models.Affair.findByIdAndUpdate(req.body.affairID, affair, err=>{
                  return res.json(true)
                })
              }
            }
          }
        }
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/renameList
  renameList: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      
      Models.Affair.findById(req.body.affairID, (err, affair)=>{
        for(let i=0; i<affair.lists.length; i++){
          if(affair.lists[i]._id == req.body.listID){
            affair.lists[i].name = req.body.name
            Models.Affair.findByIdAndUpdate(req.body.affairID, affair, err=>{
              return res.json(true)
            })
          }
        }
      })
    } catch(err){
      next(err)
    }
  },
  // get /api/getOfferJob
  getOfferJob: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      
      Models.OfferJob.find({}, (err, jobs)=>{
        return res.json(jobs)
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/getOfferJobById
  getOfferJobById: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      
      Models.OfferJob.findById(req.body.id, (err, job)=>{
        return res.json(job)
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/getSuggestByID
  getSuggestByID: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      
      Models.OfferJob.findById(req.body.id, (err, offerJob)=>{
        Models.Suggest.find({'offerJob.id': req.body.id}, (err, suggests)=>{
          return res.json({
            suggests,
            offerJob
          })
        })
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/getSuggestsByFilter
  getSuggestsByFilter: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      
      Models.Suggest.find(req.body.data, (err, suggests)=>{
        return res.json({
          suggests,
        })
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/updateRound
  updateRound: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.json('请先登录！')
      
      Models.Suggest.findById(req.body.id, (err, suggest)=>{
        suggest.rounds[req.body.round] = {
          date: req.body.date,
          place: req.body.place,
          interviewer: req.body.interviewer,
          remark: req.body.remark,
          status: req.body.status
        }
        Models.Suggest.findByIdAndUpdate(suggest._id, suggest, (err)=>{
          return res.redirect('/hire#interview')
        })
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/crossOriginSignin
  crossOriginSignin: (req, res, next)=>{
    try{
      Models.User.findOne({email: req.body.email}, (err, user)=>{
        res.header('Access-Control-Allow-Origin', '*');
        let message, result = false;
        if(err) return res.end(err)
        if(!user){
          message = '账号不存在'
        }
        else if(req.body.password != user.password){
          message = '账号密码不匹配'
        }
        else{
          result = true
          message = '登录成功'
        }
        return res.json({
          result,
          message
        })
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/wechatMpResume
  postWechatMpResume: (req, res, next)=>{
    try{
      res.header('Access-Control-Allow-Origin', '*');

      const wechatServer = 'https://www.rulertech.com:3500'
      let photos = '\n'

      if (Array.isArray(req.body.resume.photos)) {
        req.body.resume.photos.forEach(item => {
          photos += wechatServer + item.path
        })
      }

      const reason = `
<p style="font-weight: bold;">--基本信息</p>
<p style="display: flex">
    <span style="width: 50%;">性别：${req.body.resume.online.gender == 1?'女':'男'}</span>
    <span style="width: 50%;">年龄：${req.body.resume.online.age}</span>
</p>
<p style="display: flex">
    <span style="width: 50%;">住址：${req.body.resume.online.place}</span>
    <span style="width: 50%;">电话：${req.body.resume.online.telephone}</span>
</p>
<p style="display: flex">
    <span style="width: 50%;">QQ/微信：${req.body.resume.online.wechat}</span>
    <span style="width: 50%;">邮箱：${req.body.resume.online.email}</span>
</p>
<p style="display: flex">
    <span style="width: 50%;">工作年限：${req.body.resume.online.workYear}</span>
    <span style="width: 50%;">婚姻状况：${req.body.resume.online.marriage == 1?'已婚':'未婚'}</span>
</p>
<p style="display: flex">
    <span>身份证：${req.body.resume.online.idcard}</span>
</p>

<p style="font-weight: bold;">--学历信息</p>
<p>学校：${req.body.resume.online.education.school}</p>
<p>专业：${req.body.resume.online.education.major}</p>
<p>学历：${req.body.resume.online.education.level}</p>

<p style="font-weight: bold;">--工作经历</p>
<p style="display: flex; flex-direction: row; justify-content: space-between">
    <span>公司名称：${req.body.resume.online.work.company}</span>
    <span>职位：${req.body.resume.online.work.job}</span>
    <span>时间：${(new Date(req.body.resume.online.work.begin)).getFullYear()}-${(new Date(req.body.resume.online.work.begin)).getMonth()+1}-${(new Date(req.body.resume.online.work.begin)).getDate()} 至 ${(new Date(req.body.resume.online.work.end)).getFullYear()}-${(new Date(req.body.resume.online.work.end)).getMonth()+1}-${(new Date(req.body.resume.online.work.end)).getDate()}</span>
</p>

<p style="font-weight: bold;">--自我评价</p>
<p>${req.body.resume.online.oneWord}</p>
  `
      let file = photos == '\n'?undefined:{
        name: '微信小程序照片附件',
        path: photos
      }
      Models.Suggest({
        name: req.body.resume.online.name,
        operator: '微信小程序',
        rounds: [],
        reason,
        file: file,
        offerJob: {
          name: req.body['job_title']
        },
        date: Date.now(),
        status: 0
      }).save(err=>{
        if(err){
          return res.json({
            result: false,
            message: '投递失败'
          })
        }
        return res.json({
          result: true,
          message: '投递成功~'
        })
      })
    } catch(err){
      next(err)
    }
  },
  // get /api/wechatMpResume
  getWechatMpResume: (req, res, next)=>{
    try{
      res.header('Access-Control-Allow-Origin', '*');
      
      Models.Organization.findOne({}, (err, company)=>{
        if(err){
          return res.json({
            result: false,
            data: err,
            message: '获取失败'
          })
        }

        Models.OfferJob.find({}, (err, offerJobs)=>{
          if(err){
            return res.json({
              result: false,
              data: err,
              message: '获取失败'
            })
          }

          return res.json({
            result: true,
            data: {
              name: company.name,
              introduction: company.introduction,
              offerJobs
            },
            message: '获取成功'
          })
        })
      })
    } catch(err){
      next(err)
    }
  },
  // get /api/wechatApi
  getWechatApi: (req, res, next)=>{
    try{
      res.header('Access-Control-Allow-Origin', '*');
      
      return res.json({
        result: true,
        wechat: true
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/newChannel
  newChannel: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.redirect('/signin')

      let options = {
        uploadDir: updatePath,
        encoding: 'utf8'
      }
      let form = new multiparty.Form(options);

      form.parse(req, function(err, fields, files) {
        let file = files.file[0]

        const companyDirectory = path.join(publicPath, '/file', JSON.parse(req.session.company)._id , '/pdf/')
        if(!fs.existsSync(path.join(publicPath, '/file', JSON.parse(req.session.company)._id)))
          fs.mkdirSync(path.join(publicPath, '/file', JSON.parse(req.session.company)._id));
        if(!fs.existsSync(companyDirectory))
          fs.mkdirSync(companyDirectory);
        
        let dstPath = companyDirectory + file.originalFilename;
        
        fs.rename(file.path, dstPath, err=>{
          fields.file = {
            name: file.originalFilename,
            path: dstPath.split('public')[1]
          }
          fields.operator = (JSON.parse(req.session.user)).name
          fields.date = Date.now()

          Models.Channel(fields).save(err=>{
            if(err) return res.end(err)
            return res.redirect('/hire#channel')
          })
        })
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/getChannel
  getChannel: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.redirect('/signin')

      Models.Channel.findById(req.body.id, (err, channel)=>{
        if(err)
          return res.json(err)
        return res.json(channel)
      })
    } catch(err){
      next(err)
    }
  },
  // post /api/deleteChannel
  deleteChannel: (req, res, next)=>{
    try{
      if(!req.session.user)
        return res.redirect('/signin')

      Models.Channel.findByIdAndRemove(req.body.id, (err, channel)=>{
        if(err)
          return res.json(err)
        return res.json(channel)
      })
    } catch(err){
      next(err)
    }
  }
};

module.exports = Api;
