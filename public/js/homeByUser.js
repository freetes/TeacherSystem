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
// 上传新的薪资
const setNewPay = ()=>{
  if($(".newPay").val() != '' && $(".applySemesterSelect").val() != '')
    $.post('/users/newPay', 
      {
        newPay: $(".newPay").val(),
        applySemester: $(".applySemesterSelect").val(),
        applyDate: getNewDate()
      },
      result=>{
        if(result){
            window.location.reload();
        }
      }
    )
};
// 修改薪资
const changePay = ()=>{
  if($(".newPay").val() != '')
    $.post('/users/changePay',
      {
        newPay: $(".newPay").val(),
        applyDate: getNewDate()
      },
      result=>{
        if(result){
            window.location.reload();
        }
      }
    )
};
// 提交审核
const checkPay = ()=>{
  $.post('/users/checkPay',
    result=>{
      if(result){
          window.location.reload();
      }
      else{
        
      }
    }
  )
};

// 点击事件
const allClassClick = ()=>{
  $(".mainDiv").css("display", "none");
  $(".addClassDiv").css("display", "none");
  $(".payCtrlDiv").css("display", "none");
  if($(".allClassDiv").css("display")=='none') $(".allClassDiv").slideToggle();
};
const addClassClick = ()=>{
  $(".mainDiv").css("display", "none");
  $(".payCtrlDiv").css("display", "none");
  $(".allClassDiv").css("display", "none");
  if($(".addClassDiv").css("display")=='none') $(".addClassDiv").slideToggle();
};
const mainDivClick = ()=>{
  $(".allClassDiv").css("display", "none");
  $(".addClassDiv").css("display", "none");
  $(".payCtrlDiv").css("display", "none");
  if($(".mainDiv").css("display")=='none') $(".mainDiv").slideToggle();
};
const payDivClick = ()=>{
  $(".allClassDiv").css("display", "none");
  $(".mainDiv").css("display", "none");
  $(".addClassDiv").css("display", "none");
  if($(".payCtrlDiv").css("display")=='none') $(".payCtrlDiv").slideToggle();
};

const getNewDate = ()=>{
  return `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`;
}