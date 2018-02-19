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
				$(".alertMessage").text("发布公告成功！");
				$("#alertInfoModal").modal();
			}
			else{
				$(".alertMessage").text("出错了！");
				$("#alertInfoModal").modal();
			}
			location.reload()
		}
	)
}

// 驳回按钮点击事件
function refuseBtn(value){
	const refuseHtml = `<input class="form-control refuseInput" placeholder="请输入驳回原因"><br><botton class="btn btn-warning btn-block" value="${value}" onclick="refuseRequest(this.getAttribute('value'))">驳回</botton>`
	$(".alertMessage").html(refuseHtml);
	$("#alertInfoModal").modal();
}

function addNewUserModal() {
	const addNewUserHtml = `
		<input type="text" class="form-control newUserIdInput" name="id" placeholder="请输入新老师的工号"><br>
		<input type="text" class="form-control newUserNameInput" name="name" placeholder="请输入新老师的姓名"><br>
		<input type="password" class="form-control newUserPasswdInput" name="password" placeholder="请输入密码"><br>
		<botton class="btn btn-primary btn-block" onclick="addNewUser()">新增</botton>
		`
	$(".alertMessage").html(addNewUserHtml);
	$("#alertInfoModal").modal();
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

function changeUserBtn(node) {
	console.log(node)
}

function deleteUserBtn(node) {
	console.log(node)
}

// POST /secretary/passRequest
function passRequest(value){
	$.post('/secretary/passRequest',
		{
			id: value
		},
		result=>{
			if(result){
				$(".alertMessage").text("通过审核以成功！");
				$("#alertInfoModal").modal();
			}
			else{
				$(".alertMessage").text("出错了！");
				$("#alertInfoModal").modal();
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
				$(".alertMessage").text("驳回成功！");
				$("#alertInfoModal").modal();
			}
			else{
				$(".alertMessage").text("出错了！");
				$("#alertInfoModal").modal();
			}
			location.reload()
		}
	)
}

const getNewDate = ()=>{
  return `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`;
}
