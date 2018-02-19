$(function(){
	$(".navbar-nav").first().children().first().click()
})

// 顶部导航栏点击事件
$(".navbar-nav").first().children().click(function(){
	$(".navbar-nav").first().children().removeClass('active')
	this.className = 'active'
	if(this.innerText.includes("首页")){
		$(".container-fluid").css("display", "none")
		$(".container-fluid")[0].style.display = "block"
		$(".container-fluid")[1].style.display = "block"
	}
	else if(this.innerText.includes("用户管理")){
		$(".container-fluid").css("display", "none")
		$(".container-fluid")[0].style.display = "block"
		$(".container-fluid")[2].style.display = "block"
	}
	else if(this.innerText.includes("工资管理")){
		$(".container-fluid").css("display", "none")
		$(".container-fluid")[0].style.display = "block"
		$(".container-fluid")[3].style.display = "block"
	}
	else if(this.innerText.includes("课程管理")){
		$(".container-fluid").css("display", "none")
		$(".container-fluid")[0].style.display = "block"
		$(".container-fluid")[4].style.display = "block"
	}
})

$(".sendMessageReceiverSelect").change(function(){
	if(this.value=='one'){
		$(".sendMessageReceiverInput").slideToggle()
	}
	else
		$(".sendMessageReceiverInput").css("display", 'none')
})
// 发布公告
function sendMessage(){
	$.post('/secretary/sendMessage',
		{
			message: $(".sendMessageContent").val(),
			receiver: $(".sendMessageReceiverSelect").val()=='all'?'all':$(".sendMessageReceiverInput").val(),
			level: $(".sendMessageLevel").val(),
			date: getNewDate()
		},
		result=>{
			if(result){
				updateAlertModal('通知信息', '发布公告成功！')
			}
			else{
				updateAlertModal('通知信息', '发布公告失败！')
			}
			location.reload()
		}
	)
}

// 驳回按钮点击事件
function refuseBtn(value){
	const refuseHtml = `<input class="form-control refuseInput" placeholder="请输入驳回原因"><br><botton class="btn btn-warning btn-block" value="${value}" onclick="refuseRequest(this.getAttribute('value'))">驳回</botton>`
	updateAlertModal('驳回', refuseHtml);
}

function addNewUserModal() {
	const addNewUserHtml = `
		<input type="text" class="form-control newUserIdInput" name="id" placeholder="请输入新老师的工号"><br>
		<input type="text" class="form-control newUserNameInput" name="name" placeholder="请输入新老师的姓名"><br>
		<input type="password" class="form-control newUserPasswdInput" name="password" placeholder="请输入密码"><br>
		<botton class="btn btn-primary btn-block" onclick="addNewUser()">新增</botton>
		`
	updateAlertModal('新增老师', addNewUserHtml)
}

function addNewUser(){
	if($(".newUserIdInput").val() == undefined || $(".newUserNameInput").val() == undefined || $(".newUserPasswdInput").val() == undefined)
		return ;
	$.post('/secretary/addNewUser',
		{
			id: $(".newUserIdInput").val(),
			name: $(".newUserNameInput").val(),
			password: $(".newUserPasswdInput").val()
		},
		result=>{
			if(result)
				location.reload()
		}
	)
}

function changeUserBtn(node){
	const changeUserHtml = `
		<div class="row">
		<div class="form-group">
			<label class="control-label col-sm-3">工号</label>
			<div class="col-sm-9">
				<input type="text" class="form-control changeUserIdInput" name="id" placeholder="" value="${node.parentNode.parentNode.children[0].innerText}">
			</div>
		</div>
		<br>
		<div class="form-group">
			<label class="control-label col-sm-3">姓名</label>
			<div class="col-sm-9">
				<input type="text" class="form-control changeUserNameInput" name="name" placeholder="" value="${node.parentNode.parentNode.children[1].innerText}">
			</div>
		</div>
		<br>
		<div class="form-group">
			<label class="control-label col-sm-3">密码</label>
			<div class="col-sm-9">
				<input type="text" class="form-control changeUserPasswdInput" name="password" placeholder="" value="${node.parentNode.parentNode.children[2].innerText}">
			</div>
		</div>
		<br>	
		<div class="col-sm-offset-3 col-sm-9">
			<botton value="${node.getAttribute('value')}" class="btn btn-primary btn-block" onclick="changeUser(this)">修改</botton>
		</div>
		</div>
	`
	updateAlertModal('修改用户', changeUserHtml)
}

function changeUser(node){
	$.post('secretary/changeUser',
		{
			_id: node.getAttribute('value'),
			id: $(".changeUserIdInput").val(),
			name: $(".changeUserNameInput").val(),
			password: $(".changeUserPasswdInput").val()
		},
		result=>{
			if(result){
				updateAlertModal('通知信息', '修改成功！')
			}
			else{
				updateAlertModal('通知信息', '修改失败！')
			}
			location.reload(500)
		}
	)
}

function deleteUserBtn(node){
	const deleteUserHtml = `
		<botton value="${node.getAttribute('value')}" class="btn btn-primary btn-block" onclick="deleteUser(this)">确定修改</botton>
	`
	updateAlertModal('删除用户', deleteUserHtml)
}

function deleteUser(node){
	$.post('secretary/deleteUser',
		{
			_id: node.getAttribute('value')
		},
		result=>{
			if(result){
				updateAlertModal('通知信息', '删除成功！')
			}
			else{
				updateAlertModal('通知信息', '删除失败！')
			}
			location.reload(500)
		}
	)
}

// POST /secretary/passRequest
function passRequest(value){
	$.post('/secretary/passRequest',
		{
			id: value
		},
		result=>{
			if(result){
				updateAlertModal('通知信息', '通过审核成功！')
			}
			else{
				updateAlertModal('通知信息', '通过审核失败！')				
			}
			location.reload()
		}
	)
}

// POST /secretary/refuseRequest
function refuseRequest(value){
	if($(".refuseInput").val()==''){
		$(".alertMessage").html("请输入驳回信息！");
		return $("#alertInfoModal").modal();
	}
	$.post('/secretary/refuseRequest',
		{
			id: value,
			message: $(".refuseInput").val(),
			date: getNewDate()
		},
		result=>{
			if(result){
				updateAlertModal('通知信息', '驳回成功！')				
			}
			else{
				updateAlertModal('通知信息', '驳回失败！')				
			}
			location.reload()
		}
	)
}

const getNewDate = ()=>{
  return `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`;
}
