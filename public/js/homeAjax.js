// 修改密码
const changePasswd = ()=>{
  if($(".userPasswd").text() != $(".oldPasswdInput").val())
    return $(".changePasswdMessage").text("原密码错误！");
  if($(".newPasswdInput").val() != $(".newPasswdAgainInput").val())
    return $(".changePasswdMessage").text("两次输入的密码不相同！");
  if($(".newPasswdInput").val() == $(".userPasswd").text())
    return $(".changePasswdMessage").text("新密码和原密码相同！");
  // $.post('/changePasswd', )
};
