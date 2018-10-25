
function addEducationDiv() {
  if ($(".educationDiv").length >= 10)
    alertModal('提示', '学历数目已超载!')
  else
    $(".educationDiv").last().after($("<div class='educationDiv'></div>").html(`
      <br>
      <label for="">第${$(".educationDiv").length+1}学历</label>
      <div>
        <label for="">学历:</label>
        <select name="educationInfo.level", value="">
          <option value="">请选择</option>
          <option value="本科">本科</option>
          <option value="硕士">硕士</option>
          <option value="博士">博士</option>
          <option value="博士以上">博士以上</option>
          <option value="专科">专科</option>
          <option value="专科以下">专科以下</option>
        </select>
        <div>
          <label for="">毕业院校:</label>
          <input type="text" name="educationInfo.school"/>
        </div>
        <div>
          <label for="">专业:</label>
          <input type="text" name="educationInfo.major"/>
        </div>
        <div>
          <label for="">就读日期:</label>
          <input type="date" name="educationInfo.time.begin"/><span>至</span>
          <input type="date" name="educationInfo.time.end"/>
        </div>
      </div>
    `))
  if ($(".educationDiv").length >= 2)
    $(".deleteEducationDivBtn").css("display", "block")
}

function deleteEducationDiv() {
  $('.educationDiv').last().remove()
  if ($(".educationDiv").length == 1)
    $(".deleteEducationDivBtn").css("display", "none")
}

$('form').submit(function(e){
  e.preventDefault()
  let data = {}
  let educationInfoArray = []
  let count = -1
  for (let item of $(".form").serializeArray()) {
    if (item.value != '') {
      if (item.name.indexOf("educationInfo") != -1) {
        if (item.name.indexOf("level") != -1) {
          count++
          educationInfoArray[count] = {}
          educationInfoArray[count]['level'] = item.value
        }
        else if(item.name.indexOf("time.begin") != -1){
          educationInfoArray[count]['time'] = {}
          educationInfoArray[count]['time']['begin'] = item.value
        }
        else if(item.name.indexOf("time.end") != -1){
          educationInfoArray[count]['time']['end'] = item.value
        }
        else{
          educationInfoArray[count][`${item.name.split('.').pop()}`] = item.value
        }
      } 
      else
        data[item.name] = item.value
    }
  }
  data.educationInfo = educationInfoArray

  let entryData = {
    name: data['personalInfo.name'],
    employeeID: data['companyInfo.employeeID'],
    department: data['companyInfo.department'],
    job: data['companyInfo.job'],
    entryTime: data['statusChange.entry.date'],
    employeeType: data['companyInfo.employeeType']
  }

  // 全职员工
  if(data['companyInfo.employeeType'] == '全职'){
    // 无试用期
    if (data['entry.hasTryTime'] == 0) {
      entryData.hasTryTime = false
      data['companyInfo.status'] = '正式'
      entryData.turnTime = entryData.entryTime
    }
    // 有试用期
    else {
      entryData.hasTryTime = true
      data['companyInfo.status'] = '试用'
      entryData.tryTime = data['entry.hasTryTime']
      // 预计转正日期 = 入职日期 + 试用期
      if(new Date(entryData.entryTime).getMonth() + 1 + parseInt(entryData.tryTime) > 12){
        entryData.turnTime = new Date((new Date(entryData.entryTime).getFullYear()+1)+ '/' + (new Date(entryData.entryTime).getMonth() + 1 + parseInt(entryData.tryTime)-12) + '/' + new Date(entryData.entryTime).getDate())
      }
      else{
        entryData.turnTime = new Date((new Date(entryData.entryTime).getFullYear())+ '/' + (new Date(entryData.entryTime).getMonth() + 1 + parseInt(entryData.tryTime)) + '/' + new Date(entryData.entryTime).getDate())
      }
    }
  }
  
  else{
    entryData.hasTryTime = false
    entryData.turnTime = entryData.entryTime
    data['companyInfo.status'] = data['companyInfo.employeeType']
  }

  delete data['entry.hasTryTime']
  delete data['entry.turnTime']

  $.post(location.pathname, {data, entryData}).done(res => {
    if (res.result) {
      alertModal('提示', res.message)
      setTimeout(function () {
        window.location.href = '/employee'
      }, 1500)
    }
    else{
      alertModal('提示', res.message)
    }
  })
})
$(".addEmployeeBtn").click(e => {

})

// 节流函数
function debounce(idle, action){
  let last
  return function(){
    let ctx = this, args = arguments
    clearTimeout(last)
    last = setTimeout(function(){
      action.apply(ctx, args)
    }, idle)
  }
}

{
  let items = $('form').children('h3')

  for(let i=0; i<items.length; i++){
    items[i] = $(items[i]).offset().top
  }

  window.onscroll = debounce(100, function () {
    let scrollTop = $(window).scrollTop()
    let distense = [];
    for(let i=0; i<items.length; i++){
      distense[i] = {
        len: Math.abs(items[i] - scrollTop),
        id: i
      }
    }
    distense.sort((a, b)=>a.len-b.len)
    
    $(".infoMenu").find('a').removeClass('select')
    $($(".infoMenu").find('a')[distense[0].id]).addClass('select')
  })
}


$(".infoMenu").find('a').click(function(){
  $(".infoMenu").find('a').removeClass('select')
  $(this).addClass('select')
})

function deleteEmployee(id) {
  showModal('删除', `
  <div>
    <label>请输入工号:</label>
    <input type="text" value="" />
    </div>
  <br>
  <button class="btn" onclick="deleteEmployeeFunc(this, '${id}')">确定删除</button>
  `)
}

function deleteEmployeeFunc(node, id) {
  if(id == $($(node).parent().find('input')[0]).val()){
    $.post('/api/deleteEmployee', {id}).done(res=>{
      if(res){ 
        alertModal('提示', '删除成功！')
      }
      else{
        alertModal('提示', '失败，不知道出了什么岔子！')
      }
      window.location.href = '/employee'
    })
  }
  else{
    alertModal('提示', '工号不一致!')
  }
}

$(".editButton").click(function () {
  $(".displaySpan").toggle()
  $(".newInput").toggle()
  $(".addEmployeeBtn").toggle()
})

if(location.pathname.indexOf('/new') == -1){
  let val
  for(let item of $("span.displaySpan")){
    if(!$(item).text()){
      val = $(item).next().val()

      if(val)
        $(item).text(val)
      else
        $(item).text('')
    }
  }
}

function addResume(id){
  showModal('个人简历', `
    <form action="/employee/addResume/${id}", enctype="multipart/form-data", method='POST'>
      <div style="display: none">
        <input type="text" value="${id}" style="width: 80%; margin: 0 10%;" name="id">
      </div>
      <div>
        <input type="file" style="width: 80%; margin: 0 10%;" name="file" accept=".pdf" required>
      </div>
      <br>
      <button class="btn">确定添加</button>
    </form>
  `)
}

function deleteResumeModal(id){
  showModal('确定删除', `
    <button class="btn" onclick="deleteResume('${id}')">确定删除</button>
  `)
}

function deleteResume(id){
  $.post(`/employee/deleteResume/${id}`).done(res=>{
    location.reload()
  })
}
