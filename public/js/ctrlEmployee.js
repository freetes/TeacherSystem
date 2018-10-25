// const listTr = $(".employeeList").html()

// 筛选功能
$("input[type='checkbox']").click(function(e){
  $(this).parent().toggleClass('choosed')

  this.checked = $(this).parent().hasClass('choosed')
  let filter = []
  for(let item of $(".filterForm").serializeArray()){
    let x = {}
    x[item.name] = item.value
    filter.push(x)
  }
  $(".employeeList").html('')
  $.post('/api/getEmployeesByFilter', {data: filter})
    .done(data=>{
      // console.log(data)
      showFilterInfo($(".filterForm").serializeArray(), data.length)
      for(let item of data){
        const entryDate = new Date(item.statusChange.entry.date)
        const date = entryDate.getFullYear() + '/' +(entryDate.getMonth()+1) + '/' + entryDate.getDate()
        $(".employeeList").append($(`<tr onclick="location.href='/employee/${item.companyInfo.employeeID}'"></tr>`).html(`
          <td>${item.companyInfo.employeeID}</td>
          <td>${item.personalInfo.name}</td>
          <td>${item.companyInfo.department}</td>
          <td>${item.companyInfo.job}</td>
          <td>${item.contactInfo.telephone}</td>
          <td>${!item.contactInfo.email?'':item.contactInfo.email}</td>
          <td>${date}</td>
          <td>${item.companyInfo.employeeType}</td>
        `))
      }
    })
})

function showFilterInfo(filter, length) {
  $(".displayFilter").html('')
  let info = {}
  for(let item of filter){
    if(!info[item.name])
      info[item.name] = item.value
    else
      info[item.name] += ',' + item.value
  }
  if(!!info['companyInfo.employeeType']){
    $(".displayFilter").append($("<span></span>").text(`员工类型：${info['companyInfo.employeeType']}`))
  }
  if(!!info['companyInfo.status']){
    $(".displayFilter").append($("<span></span>").text(`员工状态：${info['companyInfo.status']}`))
  }
  if(!!info['companyInfo.department']){
    $(".displayFilter").append($("<span></span>").text(`部门：${info['companyInfo.department']}`))
  }
  if(!!info['educationInfo.level']){
    $(".displayFilter").append($("<span></span>").text(`学历：${info['educationInfo.level']}`))
  }
  if(!!info['personalInfo.gender']){
    $(".displayFilter").append($("<span></span>").text(`性别：${info['personalInfo.gender']==0?'男':(info['personalInfo.gender']==1?'女':'男,女')}`))
  }
  $(".displayFilter").append($("<span style='background-color: white; color: black'></span>").text(`共${length}人`))
  if($(".displayFilter").children('span').length == 1){
    for(let item of $(".choosed").find('input')){
      item.checked = false
    }
    $(".radio-inline").removeClass('choosed')
    $(".employeeList").html('')
    
    $(".displayFilter").css('display', 'none')
    $.post('/api/getEmployeesByFilter', {data: []})
    .done(data=>{
      showFilterInfo($(".filterForm").serializeArray(), data.length)
      for(let item of data){
        const entryDate = new Date(item.statusChange.entry.date)
        const date = entryDate.getFullYear() + '/' +(entryDate.getMonth()+1) + '/' + entryDate.getDate()
        $(".employeeList").append($(`<tr onclick="location.href='/employee/${item.companyInfo.employeeID}'"></tr>`).html(`
          <td>${item.companyInfo.employeeID}</td>
          <td>${item.personalInfo.name}</td>
          <td>${item.companyInfo.department}</td>
          <td>${item.companyInfo.job}</td>
          <td>${item.contactInfo.telephone}</td>
          <td>${!item.contactInfo.email?'':item.contactInfo.email}</td>
          <td>${date}</td>
          <td>${item.companyInfo.employeeType}</td>
        `))
      }
    })
  }
  else{
    $(".displayFilter").css('display', 'block')
    $(".displayFilter").append($(`<span onclick="showFilterInfo([], 0)" style='background-color: white; height: 16px; width: 16px; cursor: pointer'></span>`).html(`<img src="/img/icon/删除.png" style="width: 16px; height: 16px; line-height: 16px">`))
  }
}

$(".searchInput").change(function (){
  for(let item of $(".employeeList").children('tr')){
    $(item).css('display', 'table-row')
  }
  const val = $(this).val()
  if(!!val)
    for(let item of $(".employeeList").children('tr')){
      if($(item).text().indexOf(val)==-1)
        $(item).css('display', 'none')
    }
})


let employees = []
// excel导入
function handleFile(file) {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = function(e){
		const workBook = XLSX.read(e.target.result, {type: 'array'});
		const data = XLSX.utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[0]]);

    employees = []

    for(let item of data){
      let employee = {}

      // 个人基本信息
      employee['personalInfo.name'] = item['姓名']
      employee['personalInfo.idcard.kind'] = item['证件类型']
      employee['personalInfo.idcard.number'] = item['证件号码']
      employee['personalInfo.idcard.validDate.begin'] = new Date(item['证件有效期开始'])
      employee['personalInfo.idcard.validDate.end'] = new Date(item['证件有效期结束'])
      employee['personalInfo.birthday'] = new Date(item['出生日期'])
      employee['personalInfo.birthday'] = new Date(item['出生日期'])
      employee['personalInfo.gender'] = parseInt(item['性别'])
      employee['personalInfo.group'] = item['民族']
      employee['personalInfo.politicalStatus'] = item['政治面貌']
      employee['personalInfo.marital'] = item['婚姻状况']
      employee['personalInfo.hadChild'] = item['生育状况']
      employee['personalInfo.householdKind'] = item['户籍类型']
      employee['personalInfo.householdLocation'] = item['户籍地址']
      employee['personalInfo.nowLocation'] = item['现居地址']

      // 联系方式
      employee['contactInfo.telephone'] = item['手机号码']
      employee['contactInfo.email'] = item['邮箱']
      employee['contactInfo.wechat'] = item['微信']
      employee['contactInfo.qq'] = item['qq']
      employee['contactInfo.emergencyContact.name'] = item['紧急联系人姓名']
      employee['contactInfo.emergencyContact.relationship'] = item['紧急联系人关系']
      employee['contactInfo.emergencyContact.number'] = item['紧急联系人手机号']

      // 公司信息
      employee['companyInfo.employeeID'] = item['工号']
      employee['companyInfo.department'] = item['部门']
      employee['companyInfo.job'] = item['职务']
      employee['companyInfo.employeeType'] = item['员工类型']
      employee['companyInfo.companyEmail'] = item['公司邮箱']
      employee['companyInfo.status'] = item['员工状态']

      // 工资卡信息
      employee['bankCard.bank'] = item['开户银行']
      employee['bankCard.address'] = item['开户银行地址']
      employee['bankCard.number'] = item['银行卡号']

      // 合同信息
      employee['contract.begin'] = new Date(item['合同开始日期'])
      employee['contract.end'] = new Date(item['合同结束日期'])
      
      employees.push(employee)
    }

    let trs = ''
    for(let item of employees){
      trs+=`
      <tr>
        <td>${item['companyInfo.employeeID']}</td>
        <td>${item['personalInfo.name']}</td>
        <td>${item['companyInfo.department']}</td>
        <td>${item['companyInfo.job']}</td>
        <td>${item['companyInfo.employeeType']}</td>
        <td>${item['companyInfo.status']}</td>
      </tr>`
    }
    let html = `
    <button class="btn" onclick="addEmployeeByExcel()">一键导入</button>
    <table class="table">
      <thead>
        <tr>
          <th>工号</th>
          <th>姓名</th>
          <th>部门</th>
          <th>职务</th>
          <th>员工类型</th>
          <th>员工状态</th>
        </tr>
      </thead>
      <tbody>
      ${trs}
      </tbody>
    </table>`
    showModal('从Excel批量导入', html, 'md')
	}
}

function addEmployeeByExcel(){
  let count = 0, done = 0, wrong = []
  for(let item of employees){
    let entryData = {
      name: item['personalInfo.name'],
      employeeID: item['companyInfo.employeeID'],
      department: item['companyInfo.department'],
      job: item['companyInfo.job'],
      entryTime: new Date(Date.now()),
      employeeType: item['companyInfo.employeeType'],
      hasTryTime: false,
      tryTime: 0,
      turnTime: new Date(Date.now()),
    }
    item['statusChange.entry.date'] = new Date(Date.now())
    $.post('/employee/new', {data: item, entryData}).done(res => {
      if (res.result) {
        done ++
      }
      else{
        wrong.push({
          employeeID: employees[count]['companyInfo.employeeID'],
          name: employees[count]['personalInfo.name'],
          reason: res.message,
        })
      }
      count ++

      if(count == employees.length){
        let ps = ''
        for(let item of wrong)
          ps += `
            <tr>
              <td>${item.employeeID}</td>
              <td>${item.name}</td>
              <td>${item.reason}</td>
            </tr>
          `
        if(wrong.length > 0)
          ps = `
          <p>错误原因：</p>
          <table class="table table-hover">
            <thead>
              <tr>
                <td>工号</td>
                <td>姓名</td>
                <td>原因</td>
              </tr>
            </thead>
            <tbody>
            ${ps}
            </tbody>
          </table>
          `
        showModal('导入结果', `
          <p>一共导入${count}个职员，成功${done}个，失败${wrong.length}个！</p>
          ${ps}
        `)
      }
    })
  }
}
