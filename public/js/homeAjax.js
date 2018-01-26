// 修改密码
const changePasswd = ()=>{
  if($(".userPasswd").text() != $(".oldPasswdInput").val())
    return $(".changePasswdMessage").text("原密码错误！");
  if($(".newPasswdInput").val() != $(".newPasswdAgainInput").val())
    return $(".changePasswdMessage").text("两次输入的密码不相同！");
  if($(".newPasswdInput").val() == $(".userPasswd").text())
    return $(".changePasswdMessage").text("新密码和原密码相同！");
  // 
  $.post('/users/changePasswd', 
  {
    newPasswd: $(".newPasswdInput").val()
  },
  result=>{
    if(result){
      $(".changePasswdMessage").text("修改成功，请重新登录！");
      setTimeout(()=>{
        window.location.reload();
      }, 500);
    }
  }
  )
};

// 
const allClassClick = ()=>{
  if($(".mainDiv").css("display")=='block') $(".mainDiv").slideToggle();
  if($(".addClassDiv").css("display")=='block') $(".addClassDiv").slideToggle();
  if($(".payCtrlDiv").css("display")=='block') $(".payCtrlDiv").slideToggle();
  if($(".allClassDiv").css("display")=='none') $(".allClassDiv").slideToggle();
};

const addClassClick = ()=>{
  if($(".mainDiv").css("display")=='block') $(".mainDiv").slideToggle();
  if($(".addClassDiv").css("display")=='none') $(".addClassDiv").slideToggle();
  if($(".payCtrlDiv").css("display")=='block') $(".payCtrlDiv").slideToggle();
  if($(".allClassDiv").css("display")=='block') $(".allClassDiv").slideToggle();
};

const mainDivClick = ()=>{
  if($(".mainDiv").css("display")=='none') $(".mainDiv").slideToggle();
  if($(".addClassDiv").css("display")=='block') $(".addClassDiv").slideToggle();
  if($(".payCtrlDiv").css("display")=='block') $(".payCtrlDiv").slideToggle();
  if($(".allClassDiv").css("display")=='block') $(".allClassDiv").slideToggle();
};

const payDivClick = ()=>{
  if($(".mainDiv").css("display")=='block') $(".mainDiv").slideToggle();
  if($(".addClassDiv").css("display")=='block') $(".addClassDiv").slideToggle();
  if($(".payCtrlDiv").css("display")=='none') $(".payCtrlDiv").slideToggle();
  if($(".allClassDiv").css("display")=='block') $(".allClassDiv").slideToggle();
};

