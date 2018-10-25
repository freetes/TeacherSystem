// 提示框
function showNewSuggestModal() {
  $.get('/api/getOfferJob').done(res=>{
    let offerJobOptions = ''
    for(let item of res){
      offerJobOptions += `<option value="${item._id}"> ${item.name}(${item.department})</option>`
    }

    showModal('新增候选人', `
    <form action="/hire" enctype="multipart/form-data" method="post">
      <div>
        <label for="">*姓名：</label>
        <input type="text" name="name" placeholder="请输入姓名" required>
      </div>
      <br>
      <div>
        <label for="">*招聘职务：</label>
        <select name="offerJob" style="width: 50%" placeholder="请输入需求来源部门" required>
          ${offerJobOptions}
        </select>
        <span class="btn" style="color: #4A90E2" onclick="showNewOfferJobModal()">新增职务</span>
      </div>
      <br>
      <div>
        <label for="">简历文件：</label>
        <input type="file" name="file" accept=".pdf">
      </div>
      <br>
      <div>
        <label for="">推荐时间：</label>
        <input type="datetime-local" name="date" value="${(new Date(Date.now())).format('yyyy-MM-ddThh:mm')}" required>
      </div>
      <br>
      <div>
        <label for="">推荐原因：</label>
        <textarea rows='6' name="reason" placeholder="请填写推荐原因"></textarea>
      </div>
      <br>
      <button type="submit" class="btn btn-primary">确定新增</button>
    </form>
    `, 'md')
  })
}

function showNewChannelModal() {
  showModal('新增渠道', `
  <form action="/api/newChannel" enctype="multipart/form-data" method="post">
    <div>
      <label for="">*名称：</label>
      <input type="text" name="name" placeholder="请输入名称" required>
    </div>
    <br>
    <div>
      <label for="">描述：</label>
      <input type="text" name="description" placeholder="请输入描述">
    </div>
    <br>
    <div>
      <label for="">*模板文件：</label>
      <input type="file" name="file" required>
    </div>
    <br>
    <button type="submit" class="btn btn-primary">确定新增</button>
  </form>
  `, 'md')
}

function showNewOfferJobModal() {
  $.get('/api/getCompanyInfo').done(res=>{
    let departmentOptions = ''
    for(let item of res.department){
      departmentOptions += `<option value="${item.name}"> ${item.name} </option>`
      if(item.subDepartment.length!=0){
        for(let subItem of item.subDepartment){
          departmentOptions += `<option value="${item.name}-${subItem.name}"> ${item.name}-${subItem.name} </option>`
        }
      }
    }
    $.post('/api/getEmployeesByFilter', {}).done(res=>{
      let leaderOptions = ''
      for(let item of res){
        leaderOptions += `<option value="${item.personalInfo.name}"> ${item.personalInfo.name} </option>`
      }
      showModal('新增招聘职位', `
        <form action="/hire/newOfferJob" method="post">
          <div>
            <label for="">*职称：</label>
            <input type="text" name="name" placeholder="请输入职位名称" required>
          </div>
          <br>
          <div>
            <label for="">*员工类型：</label>
            <select name="employeeKind" placeholder="请输入需求来源部门" required>
              <option value='全职'>全职</option>
              <option value='实习'>实习</option>
              <option value='兼职'>兼职</option>
            </select>
          </div>
          <br>
          <div>
            <label for="">*部门：</label>
            <select name="department" style="width: 50%" placeholder="请输入需求来源部门" required>
              ${departmentOptions}
            </select>
            <span class="btn" style="color: #4A90E2" onclick="showAddDepartmentModal()">新增部门</span>
          </div>
          <br>
          <div>
            <label for="">*招聘HR：</label>
            <select style="width: 50%" name="leader" required>
              ${leaderOptions}
            </select>
            <span class="btn" style="color: #4A90E2" onclick="location.href='/employee/new'">新增HR</span>
          </div>
          <br>
          <div>
            <label for="">招聘人数：</label>
            <input type="number" name="number" placeholder="请输入招聘人数">
          </div>
          <br>
          <div>
            <label for="">开始时间：</label>
            <input type="date" name="beginDate" placeholder="请输入姓名">
          </div>
          <br>
          <div>
            <label for="">期望到岗时间：</label>
            <input type="date" name="date" placeholder="请输入姓名">
          </div>
          <br>
          <div>
            <label for="">职位描述：</label>
            <textarea rows='6' name="description" placeholder="请输入职位描述"></textarea>
          </div>
          <br>
          <button type="submit" class="btn btn-primary">确定新建</button>
        </form>
      `, 'md')
    })
  })
}

function showNewInterviewModal(id, name) {
  showModal('安排面试', `
  <form action="/hire/hireNewInterview" method="post">
    <div>
      <label for="">候选人：</label>
      <input type="text" name="name" readonly value='${name}'>
    </div>
    <br>
    <div>
      <label for="">面试官：</label>
      <input type="text" name="interviewer" placeholder="请输入面试官">
    </div>
    <br>
    <div>
      <label for="">面试时间：</label>
      <input type="datetime-local" name="date" placeholder="请输入面试时间">
    </div>
    <br>
    <div>
      <label for="">面试地点：</label>
      <input type="text" name="place" placeholder="请输入面试地点">
    </div>
    <br>
    <div style='display: none'>
      <label for="">id</label>
      <input type="text" name="id" value="${id}">
    </div>
    <button type="submit" class="btn btn-primary">安排</button>
  </form>
  `, 'md')

  window.event.stopPropagation()
}

function showAddRoundModal(id, name, n) {
  showModal(`安排第${n+1}轮面试`, `
  <form action="/hire/addNewRound" method="post">
    <div>
      <label for="">候选人：</label>
      <input type="text" name="name" readonly value='${name}'>
    </div>
    <br>
    <div>
      <label for="">面试官：</label>
      <input type="text" name="interviewer" placeholder="请输入面试官">
    </div>
    <br>
    <div>
      <label for="">面试时间：</label>
      <input type="datetime-local" name="date" placeholder="请输入面试时间">
    </div>
    <br>
    <div>
      <label for="">面试地点：</label>
      <input type="text" name="place" placeholder="请输入面试地点">
    </div>
    <br>
    <div style='display: none'>
      <label for="">id</label>
      <input type="text" name="id" value="${id}">
    </div>
    <button type="submit" class="btn btn-primary">上传</button>
  </form>
  `, 'md')

  window.event.stopPropagation()
}

function showChangeSuggestModal(id){
  showModal('填写结果', `
    <form action='/changeSuggest' method='POST'>
      <div style='display: none'>
        <input type='text' name="id" value="${id}"></textarea>
      </div>
      <div>
        <label for="">*推荐结果：</label>
        <div>
          <input type="radio" name="status" placeholder="通过" value='1' required>
          <label style='text-align: left'>通过</label>
          <input type="radio" name="status" placeholder="不通过" value='-1' required>
          <label style='text-align: left'>不通过</label>
        </div>
      </div>
      <br>
      <div>
        <label for="">备注：</label>
        <textarea rows='6' name="remark" placeholder="请输入备注"></textarea>
      </div>
      <br>
      <button type="submit" class="btn btn-primary">确定</button>
    </form>
  `, 'md')

  window.event.stopPropagation()
}

function showChangeInterviewModal(id){
  showModal('填写面试结果', `
    <form action='/changeInterview' method='POST'>
      <div style='display: none'>
        <input type='text' name="id" required value="${id}"></textarea>
      </div>
      <div>
        <label for="">*面试结果：</label>
        <div>
          <input type="radio" name="status" onclick="$('.endInput').css('display', 'flex')" placeholder="通过" value='1' required>
          <label style='text-align: left'>通过</label>
          <input type="radio" name="status" onclick="$('.endInput').css('display', 'none')" placeholder="不通过" value='-1' required>
          <label style='text-align: left'>不通过</label>
          <input type="radio" name="status" onclick="$('.endInput').css('display', 'none')" placeholder="未到面" value='-2' required>
          <label style='text-align: left'>未到面</label>
        </div>
      </div>
      <br>
      <div class="endInput" style="display: none">
        <label for="">*是否有下轮面试：</label>
        <div>
          <input type="radio" name="end" placeholder="通过" value='1'>
          <label style='text-align: left'>有</label>
          <input type="radio" name="end" placeholder="不通过" value='-1'>
          <label style='text-align: left'>无</label>
        </div>
      </div>
      <br>
      <div>
        <label for="">备注：</label>
        <textarea rows='6' name="remark" placeholder="请输入备注"></textarea>
      </div>
      <br>
      <button type="submit" class="btn btn-primary"s>确定</button>
    </form>
  `, 'md')

  window.event.stopPropagation()
}

function showSuggestInfo(id) {
  $.post('/api/getSuggestInfo', {id}).done(res=>{
    showModal('详情', `
      <div>
        <label for="" style="width: 15%; text-align: right">姓名：</label>
        <input type="text" style="width: 80%" name="title" value="${res.name}" readonly>
      </div>
      <div>
        <label for="" style="width: 15%; text-align: right">职务：</label>
        <input type="text" style="width: 80%" name="title" value="${res.offerJob.name}" readonly>
      </div>
      <div>
        <label for="" style="width: 15%; text-align: right">用户：</label>
        <input type="text" style="width: 80%" name="title" value="${res.operator}" readonly>
      </div>
      <div>
        <label for="" style="width: 15%; text-align: right">推荐原因：</label>
        <textarea rows='4' style="width: 80%; margin: 0 !important; padding: 5px 10px !important" name="reason" readonly>${res.reason}</textarea>
      </div>
      <br>
      <div style="display: ${res.remark == undefined?'none': 'block'}">
        <label for="" style="width: 15%; text-align: right">推荐反馈：</label>
        <textarea rows='4' style="width: 80%; margin: 0 !important; padding: 5px 10px !important" name="reason" readonly>${res.remark}</textarea>
      </div>
      <div>
        <label for="" style="width: 15%; text-align: right">附件：</label>
        <a href='${res.file != undefined?res.file.path:'#suggest'}' style="display: -webkit-inline-flex; color: #007C85; width: 80%; margin: 0 !important; padding: 5px 10px !important" target="view_window">${res.file !=undefined?res.file.name+'(点击预览)':'未上传'}</a>
      </div>
      <div>
        <label for="" style="width: 15%; text-align: right">推荐日期：</label>
        <input type="text" style="width: 80%" name="date" placeholder="推荐日期" value="${(new Date(res.date)).format('yyyy-MM-dd hh:mm')}" readonly>
      </div>

      <button class="btn btn-ing" onclick="showEditSuggestModal('${res._id}')">编辑</button>
      <span onclick="showDeleteSuggestModal('${res._id}')">删除</span>
      <br>
      `, 'md')
  })
}

function showChannel(id) {
  $.post('/api/getChannel', {id}).done(res=>{
    showModal('详情', `
      <div>
        <label for="" style="width: 15%; text-align: right">名称：</label>
        <input type="text" style="width: 80%" name="title" value="${res.name}" readonly>
      </div>
      <div>
        <label for="" style="width: 15%; text-align: right">描述：</label>
        <input type="text" style="width: 80%" name="title" value="${res.description}" readonly>
      </div>
      <div>
        <label for="" style="width: 15%; text-align: right">创建用户：</label>
        <input type="text" style="width: 80%" name="title" value="${res.operator}" readonly>
      </div>
      <div>
        <label for="" style="width: 15%; text-align: right">创建日期：</label>
        <input type="text" style="width: 80%" name="date" placeholder="创建日期" value="${(new Date(res.date)).format('yyyy-MM-dd hh:mm')}" readonly>
      </div>

      <div>
        <label for="" style="width: 15%; text-align: right">附件：</label>
        <a href='${res.file != undefined?res.file.path:'#suggest'}' style="display: -webkit-inline-flex; color: #007C85; width: 80%; margin: 0 !important; padding: 5px 10px !important" target="view_window">${res.file !=undefined?res.file.name+'(点击预览)':'未上传'}</a>
      </div>

      <br>
      <button class="btn btn-danger" onclick="showDeleteChannelModal('${res._id}')">删除</button>
      <br>
      `, 'md')
  })
}

function showEditSuggestModal(id){
  $.post('/api/getSuggestInfo', {id}).done(res=>{
    $.get('/api/getOfferJob').done(data=>{
      let offerJobOptions = ''
      for(let item of data){
        if(item._id == res.offerJob.id)
          offerJobOptions += `<option selected="selected" value="${item._id}"> ${item.name}(${item.department})</option>`
        else  
          offerJobOptions += `<option value="${item._id}"> ${item.name}(${item.department})</option>`
      }
        
      showModal('编辑候选人', `
      <form action="/hire" enctype="multipart/form-data" method="post">
        <div style="display: none">
          <input type="text" name="id" value='${res._id}'>
        </div>

        <div>
          <label for="">姓名：</label>
          <input type="text" name="name" value='${res.name}' placeholder="请输入姓名" required>
        </div>
        <br>
        <div>
          <label for="">招聘职务：</label>
          <select name="offerJob" placeholder="请输入需求来源部门" required>
          ${offerJobOptions}
          </select>
        </div>
        <br>
        <div>
          <label for="">重新上传简历文件：</label>
          <a style="width: 45%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #337ab7; " href='${res.file != undefined?res.file.path:'#'}' style="display: -webkit-inline-flex; color: #007C85; width: 80%; margin: 0 !important; padding: 5px 10px !important" target="view_window">${res.file !=undefined?res.file.name+'(点击预览)':'未上传'}</a>
          <label style="width: 10%; text-align: center; cursor: pointer;">
            <input type="file" style="display: none" type="file" name="file" accept=".pdf"/>
            上传
          </label>

          <label style="width: 10%; text-align: center; cursor: pointer; display: ${(res.file==undefined||res.file.path==undefined)?'none':'block'}" onclick="showDeleteFileModal('${res._id}')">删除<label>
        </div>
        <br>
        <div>
          <label for="">推荐原因：</label>
          <textarea rows='4' name="reason" placeholder="请填写推荐原因">${res.reason}</textarea>
        </div>
        <br>
        <div>
          <label for="">推荐反馈：</label>
          <textarea rows='4' name="remark" placeholder="请填写推荐反馈">${res.remark}</textarea>
        </div>
        <br>
        <div>
          <label for="">推荐结果：</label>
          <div>
            <input type="radio" name="status" value='0' ${res.status==0?'checked':''}>
            <label>待审核</label>
            <input type="radio" name="status" value='1' ${(res.status==1 || res.status == 2)?'checked':''}>
            <label>已通过</label>
            <input type="radio" name="status" value='-1' ${res.status==-1?'checked':''}>
            <label>未通过</label>
          </div>
        </div>
        <br>
        <button class="btn btn-primary">完成编辑</button>
      </form>
      `, 'md')
    })
  })
}

function showDeleteFileModal(id){
  showModal('删除简历文件', `
    <button class="btn btn-danger" onclick="$.post('/hire/deleteFile', {id: ${id}}).done(res=>window.location.reload())">确定删除</button>
  `, 'sm')
}

function showInterviewInfo(id) {
  $.post('/api/getInterviewInfo', {id}).done(res=>{
    let rounds = ''
    if(res.rounds.length!=0){
      for(let i=0 ;i<res.rounds.length; i++){
        rounds += `
        <tr onclick="showRoundInfo('${i+1}', '${id}')">
          <td>${i+1}</td>
          <td>${(new Date(res.rounds[i].date)).format('yyyy-MM-dd hh:mm')}</td>
          <td>${res.rounds[i].place}</td>
          <td>${res.rounds[i].interviewer}</td>
          <td>${res.rounds[i].status == 0? '等待面试结果中': res.rounds[i].status == 1? '已通过':res.rounds[i].status == -1? '未通过':'未到面'}</td>
        </tr>`
      }
  
      rounds = `
      <table class="table table-hover">
        <thead>
          <tr>
            <th>轮次</th>
            <th>时间</th>
            <th>地点</th>
            <th>面试官</th>
            <th>结果</th>
          </tr>
        </thead>
        <tbody>
          ${rounds}
        </tbody>
      </table>`
    }

    showModal(`${res.name}的面试详情`, `
      <form>
      <div>
        <label for="">姓名：</label>
        <input type="text" name="title" value="${res.name}" readonly>
      </div>
      <div>
        <label for="">职务：</label>
        <input type="text" name="title" value="${res.job}" readonly>
      </div>
      <div>
        <label for="">部门：</label>
        <input type="text" name="title" value="${res.department}" readonly>
      </div>
      <div>
        <label for="">用户：</label>
        <input type="text" name="title" value="${res.operator}" readonly>
      </div>
      <div style="display: ${res.remark == undefined?'none': 'block'}">
        <label for="">面试反馈：</label>
        <textarea rows='6' name="reason" readonly>${res.remark}</textarea>
      </div>
      <div>
        <label for="">附件：</label>
        <a href='${res.file==undefined?'':res.file.path==undefined?'':res.file.path}' style="display: -webkit-inline-flex; color: #007C85; margin: 0 !important; padding: 5px 10px !important" target="view_window">${res.file==undefined?'无':res.file.name==undefined?'无':res.file.name+'(点击预览)'}</a>
      </div>
      <br>
      </form>
      ${rounds}
      <span class="btn btn-ing" onclick="showEditInterviewModal('${res._id}')">编辑</span>
      <span onclick="showDeleteInterviewModal('${res._id}')">删除</span>
      `, 'md')
  })
}

function showInterviewBySuggestId(id) {
  $.post('/api/getSuggestInfo', {id}).done(res=>{
    if(res == null){
      return alertModal('提示', '无此人的面试信息')
    }
    let rounds = ''
    if(res.rounds.length!=0){
      for(let i=0 ;i<res.rounds.length; i++){
        rounds += `
        <tr onclick="showRoundInfo('${i+1}', '${id}')">
          <td>${i+1}</td>
          <td>${(new Date(res.rounds[i].date)).format('yyyy-MM-dd hh:mm')}</td>
          <td>${res.rounds[i].place}</td>
          <td>${res.rounds[i].interviewer}</td>
          <td>${res.rounds[i].status == 0? '等待面试结果中': res.rounds[i].status == 1? '已通过': '未通过'}</td>
        </tr>`
      }
  
      rounds = `
      <table class="table table-hover">
        <thead>
          <tr>
            <th>轮次</th>
            <th>时间</th>
            <th>地点</th>
            <th>面试官</th>
            <th>结果</th>
          </tr>
        </thead>
        <tbody>
          ${rounds}
        </tbody>
      </table>`
    }

    showModal(`${res.name}的面试详情`, `
      ${rounds}
      <span class="btn btn-ing" onclick="showEditInterviewModal('${res._id}')">编辑</span>

      `, 'md')
  })
}

function showEditInterviewModal(id) {
  $.post('/api/getSuggestInfo', {id}).done(res=>{
    if(res == null){
      return alertModal('提示', '无此人的面试信息')
    }
    let rounds = ''
    if(res.rounds.length!=0){
      for(let i=0 ;i<res.rounds.length; i++){
        rounds += `
        <tr onclick="showRoundInfo('${i+1}', '${id}')">
          <td>${i+1}</td>
          <td>
            <input type="datetime-local" value="${(new Date(res.rounds[i].date)).format('yyyy-MM-ddThh:mm')}" name="date[${i}]">
          </td>
          <td>
            <input type="text" value="${res.rounds[i].place}" name="place[${i}]">
          </td>
          <td>
            <input type="text" value="${res.rounds[i].interviewer}" name="interviewer[${i}]">
          </td>
        `
        // 最后一个
        if(i == res.rounds.length-1){
          rounds += `
            <td>
              <input type='radio' name='status' value='1' ${res.rounds[i].status==1?'checked':''}>
              <label>已通过</label>
              <br>
              <input type='radio' name='status' value='0' ${res.rounds[i].status==0?'checked':''}>
              <label>待审核</label>
              <br>
              <input type='radio' name='status' value='-1' ${res.rounds[i].status==-1?'checked':''}>
              <label>未通过</label>
              <br>
              <input type='radio' name='status' value='-2' ${res.rounds[i].status==-2?'checked':''}>
              <label>未到面</label>
            </td>
          </tr>`
        }
        else{
          rounds += `
            <td>${res.rounds[i].status == 0? '等待面试结果中': res.rounds[i].status == 1? '已通过': '未通过'}</td>
          </tr>`
        }
      }
  
      rounds = `
      <table class="table table-hover">
        <thead>
          <tr>
            <th>轮次</th>
            <th>时间</th>
            <th>地点</th>
            <th>面试官</th>
            <th>面试结果</th>
          </tr>
        </thead>
        <tbody>
          ${rounds}
        </tbody>
      </table>`
    }

    showModal(`${res.name}的面试详情`, `
      <form action='/hire/editInterview' method='POST'>
      <div style="display: none">
        <input type="text" name="id" value="${res._id}">
      </div>
      <br>
      ${rounds}
      <button class='btn btn-ing'>完成编辑</button>
      </form>
      `, 'lg')
  })
}

function showOfferJob(id){
  $.post('/api/getSuggestByID', {id}).done(res=>{
    let trs = ''
    for(let item of res.suggests){
      trs += `
        <tr onclick="showAllInfo('${item._id}')">
          <td>${item.name}</td>
          <td>${item.operator}</td>
          <td>${(new Date(item.date)).format('yyyy-MM-dd hh:mm')}</td>
          <td>${item.status==0?'未填写':item.status==-1?'未通过':'已通过'} ${item.interviewStatus==0?'':item.interviewStatus==1?'，面试已通过':'，面试失败'}</td>
        </tr>
      `
    }
    showModal('招聘职位详情', `
    <form>
    <div>
      <label for="">职称：</label>
      <input type="text" name="title" value="${res.offerJob.name}" readonly>
    </div>
    <div>
      <label for="">部门：</label>
      <input type="text" name="title" value="${res.offerJob.department}" readonly>
    </div>
    <div>
      <label for="">职业描述：</label>
      <textarea rows='4' name="title" readonly>
        ${res.offerJob.description}
      </textarea>
    </div>
    </form>
    <br>
    <button class="btn btn-ing" onclick="showEditOfferJobModal('${res.offerJob._id}')">编辑</button>
    <span onclick="showDeleteOfferJobModal('${res.offerJob._id}')">删除</span>

    <table class="table table-hover" ${trs==''?"style='display: none'":''}>
      <thead>
        <tr>
          <th>姓名</th>
          <th>推荐顾问</th>
          <th>推荐日期</th>
          <th>推荐结果</th>
        </tr>
      </thead>
      <tbody>
        ${trs}
      </tbody>
    </table>
    `, 'lg')
  })
}

function showEditOfferJobModal(id){
  $.post('/api/getOfferJobById', {id}).done(offerJob=>{
    $.get('/api/getCompanyInfo').done(res=>{
      let departmentOptions = ''
      for(let item of res.department){
        departmentOptions += `<option ${offerJob.department == item.name?'selected':''} value="${item.name}"> ${item.name} </option>`
        if(item.subDepartment.length!=0){
          for(let subItem of item.subDepartment){
            departmentOptions += `<option ${offerJob.department == item.name+'-'+subItem.name?'selected':''} value="${item.name}-${subItem.name}"> ${item.name}-${subItem.name} </option>`
          }
        }
      }
      $.post('/api/getEmployeesByFilter', {}).done(res=>{
        let leaderOptions = ''
        for(let item of res){
          leaderOptions += `<option value="${item.personalInfo.name}" ${offerJob.leader==item.personalInfo.name?'seleted':''}> ${item.personalInfo.name} </option>`
        }
        showModal('编辑职位', `
          <form action="/hire/updateOfferJob" method="post">
            <input type="text" style="display: none" value="${offerJob._id}" name="id">

            <div>
              <label for="">*职称：</label>
              <input type="text" value="${offerJob.name}" name="name" placeholder="请输入职位名称" required>
            </div>
            <br>
            <div>
              <label for="">*员工类型：</label>
              <select name="employeeKind" placeholder="请输入需求来源部门" required>
                <option value='全职' ${offerJob.employeeKind=='全职'?'selected':''}>全职</option>
                <option value='实习' ${offerJob.employeeKind=='实习'?'selected':''}>实习</option>
                <option value='兼职' ${offerJob.employeeKind=='兼职'?'selected':''}>兼职</option>
              </select>
            </div>
            <br>
            <div>
              <label for="">*部门：</label>
              <select name="department" style="width: 50%" placeholder="请输入需求来源部门" required>
                ${departmentOptions}
              </select>
              <span class="btn" style="color: #4A90E2" onclick="showAddDepartmentModal()">新增部门</span>
            </div>
            <br>
            <div>
              <label for="">*招聘HR：</label>
              <select name="leader" required>
                ${leaderOptions}
              </select>
            </div>
            <br>
            <div>
              <label for="">招聘人数：</label>
              <input type="number" value="${offerJob.number}" name="number" placeholder="请输入招聘人数">
            </div>
            <br>
            <div>
              <label for="">开始时间：</label>
              <input type="date" name="beginDate" value="${(new Date(offerJob.beginDate)).format('yyyy-MM-dd')}" placeholder="请输入姓名">
            </div>
            <br>
            <div>
              <label for="">期望到岗时间：</label>
              <input type="date" name="date" value="${(new Date(offerJob.date)).format('yyyy-MM-dd')}" placeholder="请输入姓名">
            </div>
            <br>
            <div>
              <label for="">职位描述：</label>
              <textarea rows='6' name="description" placeholder="请输入职位描述">${offerJob.description}</textarea>
            </div>
            <br>
            <div>
              <label for="">职位状态：</label>
              <div>
              <input type='radio' name='status' value='0' ${offerJob.status==0?'checked':''}>
              <label>进行中</label>
              </div>
              <div>
              <input type='radio' name='status' value='1' ${offerJob.status==1?'checked':''}>
              <label>已完成</label>
              </div>
              <div>
              <input type='radio' name='status' value='-1' ${offerJob.status==-1?'checked':''}>
              <label>暂停</label>
              </div>
            </div>
            <br>
            <button type="submit" class="btn btn-primary">完成编辑</button>
          </form>
        `, 'md')
      })
    })
  })
}

function showRoundInfo(i, id){
  $.post('/api/getSuggestInfo', {id}).done(res=>{
    showModal(`${res.name}的第${i}轮面试详情`, `
      <div>
        <label for="" style="width: 15%; text-align: right">姓名：</label>
        <input type="text" style="width: 80%" name="title" value="${res.name}" readonly>
      </div>
      <div>
        <label for="" style="width: 15%; text-align: right">时间：</label>
        <input type="datetime-local" style="width: 80%" name="title" value="${(new Date(res.rounds[i-1].date)).format('yyyy-MM-ddThh:mm')}" readonly>
      </div>
      <div>
        <label for="" style="width: 15%; text-align: right">地点：</label>
        <input type="text" style="width: 80%" name="title" value="${res.rounds[i-1].place}" readonly>
      </div>
      <div>
        <label for="" style="width: 15%; text-align: right">面试官：</label>
        <input type="text" style="width: 80%" name="title" value="${res.rounds[i-1].interviewer}" readonly>
      </div>
      <div>
        <label for="" style="width: 15%; text-align: right">面试结果：</label>
        <input type="text" style="width: 80%" name="title" value="${res.rounds[i-1].status == 0? '等待面试结果中': res.rounds[i-1].status == 1? '已通过': '未通过'}" readonly>
      </div>
      <br>
      <div>
        <label for="" style="width: 15%; text-align: right">面试反馈：</label>
        <textarea rows='6' style="width: 80%; margin: 0 !important; padding: 5px 10px !important" name="reason" readonly>${!!res.rounds[i-1].remark?res.rounds[i-1].remark:''}</textarea>
      </div>
      <br>
      <button class="btn btn-ing" onclick="showEditRoundInfo('${i}', '${id}')">编辑</button>
    `, 'md')
  })
}

function showEditRoundInfo(i, id){
  $.post('/api/getSuggestInfo', {id}).done(res=>{
    showModal(`${res.name}的第${i}轮面试详情`, `
      <form action="/api/updateRound" method="post">
      <input style="display: none" type="text" name="id" value="${id}" readonly>
      <input style="display: none" type="text" name="round" value="${i-1}" readonly>

      <div>
        <label for="">姓名：</label>
        <input type="text" name="title" value="${res.name}" readonly>
      </div>
      <div>
        <label for="">时间：</label>
        <input type="datetime-local" name="date" value="${(new Date(res.rounds[i-1].date)).format('yyyy-MM-ddThh:mm')}" >
      </div>
      <br>
      <div>
        <label for="">地点：</label>
        <input type="text" name="place" value="${res.rounds[i-1].place}">
      </div>
      <br>
      <div>
        <label for="">面试官：</label>
        <input type="text" name="interviewer" value="${res.rounds[i-1].interviewer}">
      </div>
      <br>
      <div>
        <label for="">面试结果：</label>
        <div>
        <input type='radio' name='status' value='1' ${res.rounds[i-1].status==1?'checked':''}>
        <label>已通过</label>
        </div>
        <div>
        <input type='radio' name='status' value='0' ${res.rounds[i-1].status==0?'checked':''}>
        <label>待审核</label>
        </div>
        <div>
        <input type='radio' name='status' value='-1' ${res.rounds[i-1].status==-1?'checked':''}>
        <label>未通过</label>
        </div>
        <div>
        <input type='radio' name='status' value='-2' ${res.rounds[i-1].status==-2?'checked':''}>
        <label>未到面</label>
        </div>
      </div>
      <br>
      <div>
        <label for="">面试反馈：</label>
        <textarea rows='6' style="width: 80%; margin: 0 !important; padding: 5px 10px !important" name="remark">${!!res.rounds[i-1].remark?res.rounds[i-1].remark:''}</textarea>
      </div>
      <br>
      <button class="btn btn-ing">完成编辑</button>
      </form>
    `, 'md')
  })
}

function showDeleteSuggestModal(id){
  showModal('删除推荐', `
    <button class="btn btn-danger" onclick="$.post('/hire/deleteSuggest', {id: '${id}'}, res=>window.location.reload())">确定删除</button>
  `)
  window.event.stopPropagation()
}

function showDeleteChannelModal(id){
  showModal('删除渠道', `
    <button class="btn btn-danger" onclick="$.post('/api/deleteChannel', {id: '${id}'}, res=>window.location.reload())">确定删除</button>
  `)
  window.event.stopPropagation()
}

function showDeleteInterviewModal(id){
  showModal('删除面试', `
    <button class="btn btn-danger" onclick="$.post('/hire/deleteInterview', {id: '${id}'}, res=>window.location.reload())">确定删除</button>
  `)
  window.event.stopPropagation()
}

function showDeleteOfferJobModal(id){
  showModal('删除招聘职位', `
    <button class="btn btn-danger" onclick="$.post('/hire/deleteOfferJob', {id: '${id}'}, res=>window.location.reload())">确定删除</button>
  `)
  window.event.stopPropagation()
}

function showAddOfferModal(id){
  showModal('填写Offer', `
    <form action='/hire/addOffer' method='POST'>
      <input type="text" style="display: none" name="id" value="${id}">
      <textarea name="offer" rows='15' style="width: 100%; margin: 0 !important; padding: 5px 10px;" placeholder="请填写offer信息"></textarea>
      <br>
      <button class="btn btn-ing">保存</button>
    </form>
  `, 'md')
  window.event.stopPropagation()
}

function showOfferModal(id){
  $.post('/api/getSuggestInfo', {id}).done(res=>{
    showModal(`${res.name}的Offer`, `
      <textarea name="offer" rows='15' style="width: 100%; margin: 0 !important; padding: 5px 10px;">${res.offer}</textarea>
      <br>
      <div style="margin-top: 15px;">
        <button class="btn btn-ing" onclick="showAddOfferModal('${id}')">编辑</button>
        <span onclick="showDeleteOfferModal('${id}')">删除</span>
      </div>
    `, 'md')
  })
  window.event.stopPropagation()
}

function showDeleteOfferModal(id){
  showModal(`删除Offer`, `
    <button class="btn btn-danger" onclick="$.post('/hire/deleteOffer', {id: '${id}'}, res=>window.location.reload())">确定删除</button>
  `, 'sm')
}

$(".tableDiv > table > tbody > tr").hover(function(){
  $(this).find('.deleteBtn').toggle()
})

const hash = location.hash.slice(1)
const search = location.search.slice(1).split('=')[1]

$(".tableDiv").css("display", "none")

if(hash != undefined && hash != '')
  $('.'+hash+'Btn').click()

if(search != undefined && search != ''){
  showInterviewBySuggestId(search)
  window.history.pushState({},0,'hire#interview');
}

if(hash == '' || hash == undefined){
  $(".suggestBtn").click()
}

function toggleTable(node, table){
  location.hash = $(node).attr('class').split('btn')[0].split('B')[0]
  $("button").removeClass('select')
  $(node).addClass('select')
  $(".tableDiv").css("display", "none")
  $(table).toggle()
}

const suggestTrs = $(".suggestTbody").html()
const interviewTrs = $(".interviewTbody").html()

// 筛选框
$(".filterDiv p").click(function(){
  $(this).next().toggle()
})

$(".suggestTable .filterDiv input").click(function(){
  $(".suggestTbody").html(suggestTrs)
  let arr = $(".filterDiv").serializeArray()

  let result = {}
  for(let item of arr){
    result[item.name] = item.value
  }

  for(let tr of $(".suggestTbody").children('tr')){
    for(let item of arr){
      if(tr.innerHTML.indexOf(item.value) == -1){
        $(tr).remove()
        break;
      }
    }
  }
})

$(".interviewTable .filterDiv input").click(function(){
  $(".interviewTbody").html(interviewTrs)
  let arr = $(".filterDiv").serializeArray()

  let result = {}
  for(let item of arr){
    result[item.name] = item.value
  }

  for(let tr of $(".interviewTbody").children('tr')){
    for(let item of arr){
      if(tr.innerHTML.indexOf(item.value) == -1){
        $(tr).remove()
        break;
      }
    }
  }
})

function clearAllRadio(form){
  $(form).find('input[type="radio"]').attr('checked', 'checked')

  $(form).find('input[type="radio"]').attr('checked', false)

  if(form == '.suggestFilter')
    $(".suggestTbody").html(suggestTrs)
  else if(form == '.interviewFilter'){
    $(".interviewTbody").html(interviewTrs)
  }
}

function showAddDepartmentModal(){
  $.get('/api/getCompanyInfo').done(res=>{
    let departmentOptions = ''
    for(let item of res.department){
      departmentOptions += `<option value="${item.name}"> ${item.name} </option>`
    }
    showModal('新增部门', `
      <form action="/api/addSubDepartment" method="post" onsubmit="return false">
        <div>
          <label>父部门：</label>
          <select>
            <option value='' name="name">/</option>
            ${departmentOptions}
          </select>
        </div>
        <br>
        <div>
          <label>部门名：</label>
          <input type="text" name="subName" placeholder="不能含有“-”">
        </div>
        <br>
        <button class="btn btn-ing" onclick="addDepartment(this)">新增</button>
      </form>
    `)
  })
}

function addDepartment(node){
  let data = {
    name: $(node).prevAll('div').find('select').val(),
    subName: $(node).prevAll('div').find('input').val()
  }
  data.name == ''?data.name = undefined:''
  $.post('/api/addSubDepartment', data).done(res=>{
    alertModal('提示', res.message)
    setTimeout(function(){
      window.location.reload
    }, 1500)
  })
}

function showAllInfo(id){
  $.post('/api/getSuggestInfo', {id}).done(res=>{
    let suggestInfo = `
      
      <div style="text-align: left; margin-top: 20px; border-left: 5px solid blue; padding-left: 10px; font-weight: bold;">应聘信息
      <h3 class="dropdown close" style="opacity: 1;">
        <span class="dropdown-toggle" href="#" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">
          <span class="glyphicon glyphicon-menu-down"></span>
        </span>
        <ul class="dropdown-menu">
          <li><a onclick="showEditSuggestModal('${res._id}')">编辑</a></li>
          <li><a onclick="showDeleteSuggestModal('${res._id}')">删除</a></li>
        </ul>
      </h3>
      </div>
      <div style="display: flex; flex-direction: row; justify-content: flex-start; align-items: center;">
        <span style="margin: 10px 40px">姓名：${res.name}</span>
        <span style="margin: 10px 40px">应聘职位：${res.offerJob.name}</span>
        <span style="margin: 10px 40px">手机号码：${res.name}</span>
        <div style="margin: 10px 40px; display: flex; flex-direction: column; align-items: center;">
          <span>来源于 ${res.operator}</span>
          <span>${(new Date(res.date)).format('yyyy-MM-dd hh:mm')}</span>
        </div>
      </div>
      <p style="text-align: left; margin-top: 20px; border-left: 5px solid blue; padding-left: 10px; font-weight: bold;">人选资料</p>
      <div>
        <div style="border: 1px solid gray; font-size: 14px; line-height: 25px; margin: 20px 40px; text-align: left; background-color: white; padding: 10px 20px;">${res.reason}</div>
        <p style="margin: 20px 40px; text-align: left;">
          简历附件：
          ${res.file?'<a style="color: blue;" target="_blank" href="'+res.file.path+'">'+res.file.name+'</a>':'无简历'}
        </p>
      </div>
      <p style="text-align: left; margin-top: 20px; border-left: 5px solid blue; padding-left: 10px; font-weight: bold;">推荐评价</p>
      <div style="text-align: left">
        <p style="margin: 20px 40px">${res.remark}</p>
      </div>
      <br>
    `

    let interviewInfo = ``
    if(res.status != 2){
      interviewInfo = `
        <p style="text-align: left; margin-top: 20px; border-left: 5px solid blue; padding-left: 10px; font-weight: bold;">面试进度</p>
        <p style="text-align: left; margin: 10px 40px;">无面试信息</p>
      `
    }
    else if(res.rounds.length!=0){
      for(let i=0 ;i<res.rounds.length; i++){
        interviewInfo += `
        <tr onclick="showRoundInfo('${i+1}', '${res._id}')">
          <td>${i+1}</td>
          <td>${(new Date(res.rounds[i].date)).format('yyyy-MM-dd hh:mm')}</td>
          <td>${res.rounds[i].place}</td>
          <td>${res.rounds[i].interviewer}</td>
          <td>${res.rounds[i].status == 0? '等待面试结果中': res.rounds[i].status == 1? '已通过': '未通过'}</td>
        </tr>`
      }
  
      interviewInfo = `
      <div style="text-align: left; margin-top: 20px; border-left: 5px solid blue; padding-left: 10px; font-weight: bold;">面试信息
      <h3 class="dropdown close" style="opacity: 1;">
        <span class="dropdown-toggle" href="#" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">
          <span class="glyphicon glyphicon-menu-down"></span>
        </span>
        <ul class="dropdown-menu">
          <li><a onclick="showEditInterviewModal('${res._id}')">编辑</a></li>
          <li><a onclick="showDeleteInterviewModal('${res._id}')">删除</a></li>
        </ul>
      </h3>
      </div>
      <table class="table table-hover">
        <thead>
          <tr>
            <th>轮次</th>
            <th>时间</th>
            <th>地点</th>
            <th>面试官</th>
            <th>结果</th>
          </tr>
        </thead>
        <tbody>
          ${interviewInfo}
        </tbody>
      </table>
      `
    }

    showModal('人才详情', `
      ${suggestInfo}
      ${interviewInfo}
    `, 'lg')
  })
}

$('.suggestNameSearcher').change(function(){
  const name = this.value
  clearAllRadio(".suggestFilter")
  for(let tr of $(".suggestTbody").children('tr')){
    if(tr.innerHTML.indexOf(name) == -1){
      $(tr).remove()
    }
  }
})

$('.interviewNameSearcher').change(function(){
  const name = this.value
  clearAllRadio(".interviewFilter")
  for(let tr of $(".interviewTbody").children('tr')){
    if(tr.innerHTML.indexOf(name) == -1){
      $(tr).remove()
    }
  }
})