function editCompanyInfo() {
  $.get("/api/getCompanyInfo").done(res=>{
    // console.log(res)
    let logos = ''
    for(let item of res.logo){
      logos += `<img src="${item.path}">`
    }

    showModal('编辑公司信息', `
      <form action="/" enctype="multipart/form-data" method="post">
        <div>
        <label for="" style="width: 10%; text-align: right">公司名：</label>
        <input type="text" style="width: 85%" name="name" placeholder="公司名" value="${res.name}" required>
        </div>
        <br>
        <div>
        <label for="" style="width: 10%; text-align: right">公司简称：</label>
        <input type="text" style="width: 85%; display:inline" name="subName" value="${res.subName}" required>
        </div>
        <br>
        <div>
        <label for="" style="width: 10%; text-align: right">所属行业：</label>
        <input type="text" style="width: 85%; display:inline" name="industry" value="${res.industry}">
        </div>
        <br>
        <div>
        <label for="" style="width: 10%; text-align: right">公司地址：</label>
        <textarea rows='2' style="width: 85%; margin: 0 !important; padding: 5px 10px !important" name="location" placeholder="请填写公司地址">${!!res.location?res.location:''}</textarea>
        </div>
        <br>
        <div>
        <label for="" style="width: 10%; text-align: right">公司简介：</label>
        <textarea rows='6' style="width: 85%; margin: 0 !important; padding: 5px 10px !important" name="introduction" placeholder="请填写公司简介">${!!res.introduction?res.introduction:''}</textarea>
        </div>
        <br>
        <div>
        <label for="" style="width: 10%; text-align: right">公司福利：</label>
        <textarea rows='6' style="width: 85%; margin: 0 !important; padding: 5px 10px !important" name="welfare" placeholder="请填写公司福利">${!!res.welfare?res.welfare:''}</textarea>
        </div>
        <br>
        <div>
        <label for="" style="width: 10%; text-align: right">logos：</label>
        ${logos}
        <input type="file" style="width: 85%; display:inline" name="logo" accept=".jpg, .png" multiple="multiple">
        </div>
        <br>
        <div>
        <label for="" style="width: 10%; text-align: right">风采展示：</label>
        <input type="file" style="width: 85%; display:inline" name="img" accept=".jpg, .png" multiple="multiple">
        </div>
        <br>
        <button type="submit" class="btn btn-primary">确定</button>
      </form>
    `, 'lg')
  })
}

function addNewLogo(node){
    $(node).prev().after(`<input type="file" style="width: 26%; display:inline; margin-left: 1%;" name="logo${$("input[type='file']").length+1}" accept=".jpg, .png">`)
}

function createCompanyNews() {
  showModal('新增企业新闻', `
      <form action="/api/createNews" method="post">
          <div>
          <label for="" style="width: 10%; text-align: right">标题：</label>
          <input type="text" style="width: 85%" name="title" placeholder="请输入标题" required>
          </div>
          <br>
          <div>
          <label for="" style="width: 10%; text-align: right">链接：</label>
          <input type="text" style="width: 85%; display:inline" name="link" placeholder="请输入链接" required>
          </div>
          <br>
          <div>
          <label for="" style="width: 10%; text-align: right">标签：</label>
          <input type="text" style="width: 85%; display:inline" name="tag" placeholder="请输入标签（中间用空格隔开）">
          </div>
          <br>
          <div>
          <label for="" style="width: 10%; text-align: right">简介：</label>
          <textarea rows='6' style="width: 85%; margin: 0 !important; padding: 5px 10px !important" name="introduction" required placeholder="请填写新闻简介"></textarea>
          </div>
          <br>
          <div>
          <label for="" style="width: 10%; text-align: right">日期：</label>
          <input type="datetime-local" style="width: 85%; display:inline" name="date" required value="${(new Date(Date.now()).format('yyyy-MM-ddThh:mm'))}">
          </div>
          <br>

          <button type="submit" class="btn btn-primary">确定</button>
      </form>
  `, 'md')
}

function countAddOne(id, name){
  $.post('/api/countAddOne', {id, name}).done(res=>{
    alertModal('提示', res.message)
  })
}

function addTags(id) {
  showModal('新增标签', `
      <form action="/api/addTags" method="post">
          <div style="display: none">
          <label for="" style="width: 10%; text-align: right">id：</label>
          <input type="text" style="width: 85%" name="id" placeholder="请输入标题" value="${id}" required>
          </div>
          <div>
          <label for="" style="width: 20%; text-align: right">标签：</label>
          <input type="text" style="width: 70%; display:inline" name="tag" placeholder="中间用空格隔开">
          </div>
          <br>

          <button type="submit" class="btn btn-primary">确定</button>
      </form>
  `, 'sm')
}

function showImg(url){
  let container = document.createElement('div')

  container.id = 'imgContainer'
}

function moveImgsDiv(direction, max){
  let margin = parseInt($(".imgDiv").first().css('margin-left'))
  // 左移
  if(direction == 1 && margin > 5-max*310){
    margin = margin - 310
    $(".imgDiv").first().animate({'margin-left': margin + 'px'})
  }
  else if(direction == -1 && margin < 5){
    margin = margin + 310
    $(".imgDiv").first().animate({'margin-left': margin + 'px'})
  }
}