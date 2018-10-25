function addUserBtn(){
  showModal('新增账号', `
    <div>
      <label class=""> 邮箱
      <input class="" type="email">
    </div>
    <div>
      <label class=""> 姓名
      <input class="" type="text">
    </div>
    <div>
      <label class=""> 密码
      <input class="" type="password">
    </div>
    <div class='hidden'>
      <label class=""> 权限
      <input class="" type="number" value='0'>
    </div>
    <button class="btn" onclick="addUser(this)">新增</button>
  `)
}

function addUser(node){
  let inputs = $(node).prevAll().find('input')
  let data = {
    email: inputs[0].value,
    name: inputs[1].value,
    password: inputs[2].value,
    level: inputs[3].value,
  }
  $.post('/api/addUser', data).done(res=>{
    console.log(res)
    if (res.result) {
      alertModal('提示', res.message)
      setTimeout(function () {
        window.location.href = '/admin'
      }, 1500)
    }
    else{
      alertModal('提示', res.message)
    }
  })
}

function resetPassword(email){
  $.post('/api/resetPasswd', {email}).done(res=>{
    if (res.result) {
      alertModal('提示', res.message)
      setTimeout(function () {
        window.location.href = '/admin'
      }, 1500)
    }
    else{
      alertModal('提示', res.message)
    }
  })
}

function showDeleteModal(email){
  showModal('确定删除', `<button class='btn btn-danger' onclick="deleteUser('${email}')">确定删除</button>`)
}

function deleteUser(email) {
  $.post('/api/deleteUser', {email}).done(res=>{
    if (res) {
      alertModal('提示', '删除成功')
      setTimeout(function () {
        window.location.href = '/admin'
      }, 1500)
    }
    else{
      alertModal('提示', '删除失败')
    }
  })
}
