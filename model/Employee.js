const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 员工数据模式
const EmployeeSchema = new Schema({
  // 基本信息
  personalInfo: {
    // 姓名
    name: {
      type: String,
      required: true
    },
    // 证件
    idcard: {
      // 证件类型
      kind: String,
      // 证件号码
      number: Number,
      validDate: {
        begin: Date,
        end: Date
      }
    },
    // 出生日期
    birthday: Date,
    // 性别
    gender: Number,
    // 民族
    group: String,
    // 政治面貌
    politicalStatus: String,
    // 婚姻状况
    marital: String,
    // 生育情况
    hadChild: String,
    // 户籍类型
    householdKind: String,
    // 户籍地址
    householdLocation: String,
    // 现居地址
    nowLocation: String,
    // 个人简历
    resume: {
      name: String,
      path: String
    }
  },
  // 联系方式
  contactInfo: {
    // 手机号
    telephone: {
      type: String,
      require: true
    },
    // 个人邮箱
    email: String,
    // 微信
    wechat: String,
    // qq
    qq: String,
    // 紧急联系人
    emergencyContact: {
      // 紧急联系人姓名
      name: String,
      // 紧急联系人关系
      relationship: String,
      // 紧急联系人电话
      number: String
    }
  },
  // 公司信息
  companyInfo: {
    // 工号
    employeeID: {
      type: String,
      required: true
    },
    // 部门
    department: {
      type: String,
      required: true
    },
    // 职务
    job: {
      type: String,
      required: true
    },
    // 员工类型
    employeeType: {
      type: String,
      required: true
    }, 
    // 公司邮箱
    companyEmail: String,
    // 目前状态： 实习/试用/正式/离职
    status: String,
  },
  //学历信息
  educationInfo: [{
    // 学历
    level: String,
    // 毕业院校
    school: String,
    // 专业
    major: String,
    // 就读起止时间
    time: {
      begin: Date,
      end: Date
    }
  }],
  // 工资卡信息
  bankCard: {
    // 开户行
    bank: String,
    // 开户支行地址
    address: String,
    // 银行卡号
    number: String
  },
  // 合同
  contract: {
    begin: Date,
    end: Date
  },
  // 入离调转
  statusChange: {
    // 入职
    entry: {
      // 入职日期
      date: {
        type: Date,
        required: true
      },
    },
    // 转正
    turnPositive: {
      // 转正类型
      kind: String,
      // 转正日期
      date: Date
    },
    // 调转
    change: [{
      // 调转类型
      kind: String,
      // 调转日期
      date: Date,
      // 前部门
      lastDepartment: String,
      // 前职位
      lastJob: String,
      // 现部门
      nowDepartment: String,
      // 现职务
      nowJob: String
    }],
    // 离职
    resignation: {
      // 离职类型
      kind: String,
      // 离职日期
      date: Date
    },
  }
});

EmployeeSchema.static.getAll = (callback)=>{
  this.find({}, data=>{
    for(let item of data){
      item.personalInfo.identityInfo.gender.kind == 0?
        item.personalInfo.identityInfo.gender.kind='男':
        item.personalInfo.identityInfo.gender.kind='女';
    }
  })
}

// 数据模型
const Employee = mongoose.model('Employee', EmployeeSchema)

module.exports = Employee;
