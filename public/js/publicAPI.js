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

// 获取公告
const getMessage = async()=>{
  let messages = await $.post('/api/getMessage', 
    {
    },
    message=>{
      return message
    }
  );
  return messages
};

// 获取姓名
const getName = (id)=>{
  $.post('/api/getName', 
    {
      id: id
    },
    name=>{
      console.log(name)
    }
  );
};
