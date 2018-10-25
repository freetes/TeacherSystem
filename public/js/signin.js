// 请求前，验证表单数据
$(".signinBtn").click(function(e){
  e.preventDefault();
  
  const formArr = $(".signinForm").serializeArray()
  if(formArr.length == 3){
    localStorage.setItem('remember', JSON.stringify({
      email: formArr[0].value,
      password: formArr[1].value
    }))
  }
  else{
    localStorage.removeItem('remember')
  }
  if( $(".userIdInput").val() == '')
    return showMessage('请输入账号后再登录')
  if( $(".userPasswordInput").val() == '')
    return showMessage('请输入密码后再登录')

  // 提交请求
  $(".signinForm").submit()
})

function showMessage(msg) {
  $(".text-danger").css('display', 'block')
  $(".text-danger").text(msg)
  setTimeout(function () {
    $(".text-danger").css('display', 'hidden')
  }, 1500)
}

$(document).ready(function () {
  if(localStorage.getItem('remember')){
    const data = JSON.parse(localStorage.getItem('remember'))

    $($("form").find('input')[0]).val(data.email)
    $($("form").find('input')[1]).val(data.password)
    $($("form").find('input')[2]).attr('checked', 'checked')
  }
})
