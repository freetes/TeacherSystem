// 修改密码
const changePasswd = ()=>{
  $.post('/api/confirmPasswd', 
    {
      oldPasswd: $(".oldPasswdInput").val()
    },
    result=>{
      if(result){
        if($(".newPasswdInput").val() != $(".newPasswdAgainInput").val())
          return $(".changePasswdMessage").text("两次输入的密码不相同！");
        // 修改密码
        $.post('/api/changePasswd', 
          {
            newPasswd: $(".newPasswdInput").val()
          },
          result=>{
            if(result){
              $(".changePasswdMessage").text("修改成功，请重新登录！");
              setTimeout(()=>{
                location.reload();
              }, 500);
            }
          }
        )
      }
      else{
        return $(".changePasswdMessage").text("原密码错误！");
      }
    }
  );
    
  
};