// 处理主页的请求

const Home = {};

// 
Home.index = (req, res)=>{
  if(req.session.username == undefined || req.session.username == null)
    return res.redirect(303, '/signin');

  res.render('index', {
    title: `Hello world!`
  });
}

// signin GET
Home.signin = (req, res)=>{


  res.render('signin', {
    title: ''
  });
}

module.exports = Home;
