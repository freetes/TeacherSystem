
// 折叠子部门
$(".glyphicon-menu-down").click(function(){
  $(this).parent().next().slideToggle()
  $(this).toggleClass('glyphicon-menu-right glyphicon-menu-down')
})

$(".glyphicon-menu-right").click(function(){
  $(this).parent().next().slideToggle()
  $(this).toggleClass('glyphicon-menu-right glyphicon-menu-down')
})

$(".departmentList li").click(function(){
  let that = this
  $('.departmentList').find('li').removeClass('selected')
  $(that).addClass('selected')
  const departmentName = $($(that).find(".departmentName")[0]).attr('value')
  // 根目录
  if(!departmentName){
    $($(".departmentDetail").find('li')[0]).css('display', 'none')
    $($(".departmentDetail").find('li')[2]).css('display', 'none')
    $(".selectedDepartment").text($('.companySubName').text())
    $(".employeeList").children('tr').css("display", "none")
    $(".employeeList").children('tr').toggle()
    return 
  }
  // 部门
  else if($(that).parent().parent().parent().hasClass('departmentList')){
    $($(".departmentDetail").find('li')[0]).css('display', 'block')
    $($(".departmentDetail").find('li')[1]).css('display', 'block')
    $($(".departmentDetail").find('li')[2]).css('display', 'block')
  }
  // 子部门
  else{
    $($(".departmentDetail").find('li')[0]).css('display', 'block')
    $($(".departmentDetail").find('li')[1]).css('display', 'none')
    $($(".departmentDetail").find('li')[2]).css('display', 'block')
  }
  $(".selectedDepartment").text(departmentName)

  // 待优化
  let trs = $(".employeeList").children('tr')
  trs.css("display", "none")
  for(let tr of trs){
    if($($(tr).children('td')[2]).text() == departmentName)
      $(tr).toggle()
  }
})
$('.companySubName').parent().click()

function changeDepartmentName(){
  showModal('修改部门名', `
    <div>
      <label>部门名:</label>
      <input type="text" value="${$("li.selected")[1].innerText}" />
    </div>
    <br>
    <button class="btn" onclick="changeDepartmentNameFunc(this)">修改</button>
  `)
}

function addSubDepartment(){
  showModal('新建子部门', `
    <div>
      <label>部门名:</label>
      <input type="text" value="" />
    </div>
    <br>
    <button class="btn" onclick="addSubDepartmentFunc(this)">新建</button>
  `)
}

function deleteDepartment(){
  showModal('删除该部门', `
    <br>
    <button class="btn" onclick="deleteDepartmentFunc(this)">确定删除</button>
  `)
}

function changeDepartmentNameFunc(node) {
  const val = $($(node).parent().find('input')[0]).val()
  for(let item of $(".departmentList").find("span.departmentName")){
    if(val == $(item).text())
      return alertModal('提示', '部门名重复，请修改')
  }
  const data = {
    lastName: $(".selectedDepartment").text(),
    nowName: val
  }
  $.post('/api/changeDepartmentName', data).done(res=>{
    alertModal('提示', res.message)
    setTimeout(function(){
      window.location.reload()
    }, 500)
  })
}

function addSubDepartmentFunc(node) {
  const val = $($(node).parent().find('input')[0]).val()
  if($(".selectedDepartment").text() == $(".companySubName").text()){
    const data = {
      name: undefined,
      subName: val
    }
    return $.post('/api/addSubDepartment', data).done(res=>{
      alertModal('提示', res.message)
      setTimeout(function(){
        window.location.reload()
      }, 500)
    })
  }
  // 查重
  for(let item of $(".departmentList").find("span.departmentName")){
    if($(".selectedDepartment").text() == $(item).text()){
      if($(item).hasClass('hasSubDepartmentSpan')){
        for(let subItem of $(item).nextAll().find('span.departmentName')){
          if($(subItem).text() == val){
            return alertModal('提示', '部门名重复！')
          }
        }
      }
    }
  }
  const data = {
    name: $(".selectedDepartment").text(),
    subName: val
  }
  $.post('/api/addSubDepartment', data).done(res=>{
    alertModal('提示', res.message)
    setTimeout(function(){
      window.location.reload()
    }, 500)
  })
}

function deleteDepartmentFunc(node) {
  // 查重
  for(let item of $('.employeeList').find('tr')){
    if($(item).css("display") != 'none')
    return alertModal('提示', '该部门尚有活人，不能删除！')
  }
  
  const data = {
    name: $(".selectedDepartment").text(),
  }
  $.post('/api/deleteDepartment', data).done(res=>{
    if(res){
      alertModal('提示', '删除成功！')
    }
    else{
      alertModal('提示', '失败，不知道出了什么岔子！')
    }
    setTimeout(function(){
      window.location.reload()
    }, 500)
  })
}