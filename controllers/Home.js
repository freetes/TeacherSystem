// 处理主页的请求
const Home = {
  // GET /
  index: (req, res)=>{
    if(req.session.username == undefined || req.session.username == null)
      return res.redirect(303, '/signin');
  
    res.render('index', {
      title: `Hello world!`
    });
  },

  // GET /signin
  signin: (req, res)=>{
    req.session.username = null;

    res.render('signin', {
      title: ''
    });
  }
};

module.exports = Home;
