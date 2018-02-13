const Models = require('../model/dataModel');

// 处理用户
const User = {
  // POST /newPay
  newPay: (req, res)=>{
    Models.PayModel({
      id: req.session.userid,
      pay: req.body.newPay,
      isChecked: 0,
      applySemester: req.body.applySemester,
      applyDate: req.body.applyDate
    }).save((err, result)=>{
      return res.json(true);
    })
  },

  // POST /changePay
  changePay: (req, res)=>{
    Models.PayModel.findByIdAndUpdate({_id: req.body.id}, {'pay': req.body.newPay, 'applyDate': req.body.applyDate}, (err, result)=>{
      if(err) return res.json(false);
      return res.json(true);
    })
  },
  
  // POST /checkPay
  checkPay: (req, res)=>{
    Models.PayModel.findByIdAndUpdate({_id: req.body.id}, {'isChecked': 1}, (err, result)=>{
      if(err) return res.json(false);
      return res.json(true);
    })
  },

  // POST /newClass
  newClass: (req, res)=>{
    req.body.id = req.session.userid
    req.body.isChecked = false
    switch(req.body.classKind){
      case 'normal':
      delete req.body.classKind
      Models.NormalClassModel(req.body).save((err, result)=>{
        return res.redirect(303, '/')
      }); break;
      case 'design':
      delete req.body.classKind
      Models.DesignClassSchema(req.body).save((err, result)=>{
        return res.redirect(303, '/')
      }); break;
      case 'train':
      delete req.body.classKind
      Models.TrainClassSchema(req.body).save((err, result)=>{
        return res.redirect(303, '/')
      }); break;
      case 'produce':
      delete req.body.classKind
      Models.ProduceClassSchema(req.body).save((err, result)=>{
        return res.redirect(303, '/')
      }); break;
      case 'graduate':
      delete req.body.classKind
      Models.GraduateClassSchema(req.body).save((err, result)=>{
        return res.redirect(303, '/')
      }); break;
      default: break;
    }
  },
};

module.exports = User;
