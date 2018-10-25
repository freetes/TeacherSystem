
var E = window.wangEditor
var editor = new E('#toolbar', '#editor')

var desEditor

editor.customConfig.menus = [
  'bold',
  'italic',
  'underline',
  'list',
]
editor.create()

function createList(){
  showModal('新增列表', `
    <form action="" method="post">
      <div>
        <label for="" style="width: 30%; text-align: right">列表标题：</label>
        <input type="text" style="width: 60%" name="name" placeholder="请输入列表标题" required>
      </div>
      <br>
      <button type="submit" class="btn btn-primary">确定</button>
    </form>
  `, 'sm')
}

function createItem(id, ID){
  showModal('新增项目', `
    <div style="text-align: left; display: flex; flex-direction: column;">
      <div>
        <label for="" style="width: 15%; text-align: right">名称：</label>
        <input type="text" style="width: 80%" name="name" placeholder="请输入项目名称" required>
      </div>
      <br>
      <div>
        <label for="" style="width: 15%; text-align: right;">描述：</label>
        <textarea name='description' rows='8' style='margin: 0 !important; width: 80%; padding: 5px 10px'></textarea>
      </div>
      <button type="submit" onclick="addItem(this, '${id}', '${ID}')" style="margin-top: 10px; width: 50px; margin-left: 50%;" class="btn btn-primary">确定</button>
    </div>
  `, 'md')
}

function addItem(node, id, ID){
  let name = $($(node).parent().find('input')[0]).val()
  let description = $($(node).parent().find('textarea')[0]).val()

  $.post(`/api/createAffairItem/${id}`, {name, id: ID, description}).done(res=>{
    location.reload()
  })
}

function showInfo(id, listID, affairID){
  $.post('/api/getItemInfo', {id, listID, affairID}).done(res=>{
    $(".name").text(res.name)
    $(".user").text(res.user)
    $(".description").html(res.description)

    $(".submitBtn").attr('onclick', `submitRemark('${id}', '${listID}', '${affairID}')`)
    $(".deleteBtn").attr('onclick', `showDeleteModal('${id}', '${listID}', '${affairID}')`)
    $(".editBtn").attr('onclick', `showEditModal('${id}', '${listID}', '${affairID}')`)
    $(".content").html('')
    if(res.remarks.length == 0){
      $(".content").append('<span class="small">暂无备注</span>')
    }
    else{
      res.remarks.sort((a, b)=>new Date(b.date) - new Date(a.date))
      for(let item of res.remarks){
        $(".content").append(`
          <div class="remark">
            <div>${item.words}</div>

            <div class="small">
              <span style="color: skyblue">${item.user}</span>
              <span> in ${(new Date(item.date)).format('yyyy-MM-dd hh:mm')}</span>
              <span class="deleteRemarkBtn" style="display:none" onclick="deleteRemark('${item._id}', '${id}', '${listID}', '${affairID}')">删除</span>
            </div>
          </div>
        `)
      }
      $(".remark").hover(function(){
        $(this).find('.deleteRemarkBtn').toggle()
      })
    }
    $(".infoDiv").css('display', 'block')
  })
}

function submitRemark(id, listID, affairID){
  $.post('/api/addRemark', {id, listID, affairID, data: editor.txt.html()}).done(res=>{
    editor.txt.html('')
    showInfo(id, listID, affairID)
  })
}

function deleteItem(id, listID, affairID){
  $.post('/api/deleteItem', {id, listID, affairID}).done(res=>{
    location.reload()
  })
}

function deleteList(listID, affairID){
  $.post('/api/deleteList', {listID, affairID}).done(res=>{
    location.reload()
  })
}

function deleteRemark(id, itemID, listID, affairID){
  $.post('/api/deleteRemark', {id, itemID, listID, affairID}).done(res=>{
    return showInfo(itemID, listID, affairID)
  })
}

function renameListModal(node, listID, affairID){
  let name = $(node).parent().prev().text()

  showModal('修改名称', `
  <div>
    <label for="" style="width: 20%; text-align: right">名称：</label>
    <input type="text" style="width: 70%" name="description" placeholder="请输入项目名称" value="${name}">
  </div>
  <br>
  <button type="submit" class="btn btn-primary" onclick="renameList(this, '${listID}', '${affairID}')">确定修改</button>
  `)
}

function renameList(node, listID, affairID){
  const name = $(node).parent().parent().find('input').val()
  $.post('/api/renameList', {name, listID, affairID}).done(res=>{
    location.reload()
  })
}

function showEditModal(id, listID, affairID){
  $.post('/api/getItemInfo', {id, listID, affairID}).done(res=>{
    showModal('修改项目', `
    <div style="text-align: left; display: flex; flex-direction: column;">
      <div>
        <label for="" style="width: 15%; text-align: right">名称：</label>
        <input type="text" style="width: 80%" name="name" placeholder="请输入项目名称" required value="${res.name}">
      </div>
      <br>
      <div>
        <label for="" style="width: 15%; text-align: right;">描述：</label>
        <textarea name='description' rows='8' style='margin: 0 !important; width: 80%; padding: 5px 10px'>${res.description}</textarea>
      </div>
      <button type="submit" class="btn btn-primary"  style="margin-top: 10px; width: 100px; margin-left: 50%" onclick="editItem(this, '${id}', '${listID}', '${affairID}')">确定修改</button>
    </div>
  `, 'md')
  })
}

function showDeleteModal(id, listID, affairID){
  showModal('确定删除', `
    <button class="btn btn-primary" onclick="deleteItem('${id}', '${listID}', '${affairID}')">确定删除</button>
  `)
}

function showDeleteListModal(listID, affairID){
  showModal('删除', `
    <button class="btn btn-primary" onclick="deleteList('${listID}', '${affairID}')">确定删除</button>
  `)
}

function editItem(node, id, listID, affairID){
  const name = $($(node).parent().parent().find('input')[0]).val()
  const description = $($(node).parent().parent().find('textarea')[0]).val()

  $.post('/api/editItem', {name, description, id, listID, affairID}).done(res=>{
    location.reload()
  })
}

$(".tools").hover(function(){
  $(this).find(".btns").toggle()
})

$(".header").hover(function(){
  $(this).find("button").toggle()
})

window.onload = function() {
  let x = $(".container-fluid").css('width')
  $(".lists").css("width", 330 * parseFloat($(".lists").find(".list").length))
  $(".container-fluid").css('width', x)

  var a = document.getElementById("canvas");
  var scroll_width = 35; //滚动一下的距离

  if(document.addEventListener){
    document.addEventListener('DOMMouseScroll', mousewheel_event, false); // FF
  }
  a.onmousewheel = mousewheel_event; // IE/Opera/Chrome
  function mousewheel_event(e) {
    if(e.deltaX == 0){
      var e = e || window.event, v;
      e.wheelDelta ? v=e.wheelDelta : v=e.detail;
      if(v>3||-v>3) v=-v;
      v>0 ? a.scrollLeft+=scroll_width : a.scrollLeft-=scroll_width;
      
      e.preventDefault(); //阻止浏览器的默认滚动
    }
  }
};
