const Models = require('./dataModel');

const ctrlDB = {
  // 主页获取信息
  getAllInfoInIndexPage: async (email)=>{
    return {
      // company: await Models.Organization.findOne(),
      user: await Models.User.findOne({email: email}),
    }
  },
};

module.exports = ctrlDB;
