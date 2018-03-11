
  // 请求前，验证表单数据
$(".signinBtn").click(function(e){
  e.preventDefault();
  
  if( $(".userIdInput").val() == '')
    return $(".text-danger").text('账号不能为空！')
  if( $(".userPasswordInput").val() == '')
    return $(".text-danger").text('密码不能为空！')
  if( $(".userVerifyCodeInput").val() == '')
    return $(".text-danger").text('验证码不能为空！')

  // 提交请求
  $(".signinForm").submit()
})

// 验证码提示
$(".verifyPopoverHelp").hover(function(){
  $(".verifyPopoverHelp").popover('show')
}, function(){
  $(".verifyPopoverHelp").popover('hide')
})
