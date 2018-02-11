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
const getMessage =async ()=>{
  let m
  await $.get('/api/getMessage', 
    messages=>{
      m=messages
    }
  );
  await changeMessage(m).then(changeMessages=>m=changeMessages)
  return m
};

const changeMessage = async changeMessages=>{
  for(let item of changeMessages){
    await getName(item.sender).then(name=>item.sender=name)
  }
  return changeMessages
}

// 获取姓名
const getName = async id=>{
  let name
  await $.post('/api/getName', 
    {
      id: id
    },
    n=>{
      name = n
    }
  );
  return name
};
