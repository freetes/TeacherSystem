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
	else if(this.innerText.includes("教师信息管理")){
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

// 功能按钮点击事件
$(".userDiv").find("div.col-md-2").first().find("button").click(function(){
	if(this.innerText.includes('教师信息一览表')){
		$(".userDiv").find("div.col-md-10").children()[1].style.display = "none"
		$(".userDiv").find("div.col-md-10").children()[0].style.display = "block"	
	}
	else if(this.innerText.includes('不在岗教师一览表')){
		$(".userDiv").find("div.col-md-10").children()[0].style.display = "none"
		$(".userDiv").find("div.col-md-10").children()[1].style.display = "block"
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

// 增加新的教师
function addNewUserModal() {
	const addNewUserHtml = `
		<div class="input-group">
			<span class="input-group-addon">工号</span>
			<input type="text" class="form-control newUserIdInput" name="id" placeholder="请输入新老师的工号"><br>
		</div>
		<br>
		<div class="input-group">
			<span class="input-group-addon">姓名</span>
			<input type="text" class="form-control newUserNameInput" name="name" placeholder="请输入新老师的姓名"><br>
		</div>
		<br>
		<div class="input-group">
			<span class="input-group-addon">密码</span>
			<input type="text" class="form-control newUserPasswdInput" name="password" placeholder="请输入密码" value="123456"><br>
		</div>
		<br>
		<button class="btn btn-primary btn-block" onclick="addNewUser()">新增</button>
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

function resetPassword(node){
	$.post('/secretary/resetPassword',
		{_id: node.getAttribute('value')},
		result=>{
			if(result){
				updateAlertModal('通知信息', '重置成功！')
			}
			else{
				updateAlertModal('通知信息', '重置失败！')
			}
			location.reload(500)
		}
	)
}

function changeUserBtn(node){
	const changeUserHtml = `
		<div class="input-group">
			<span class="input-group-addon">工号</span>
			<input type="text" class="form-control changeUserIdInput" name="id" placeholder="" value="${node.parentNode.parentNode.children[0].innerText}">
		</div>
		<br>
		<div class="input-group">
			<span class="input-group-addon">姓名</span>
			<input type="text" class="form-control changeUserNameInput" name="name" placeholder="" value="${node.parentNode.parentNode.children[1].innerText}">
		</div>
		<br>
		<div class="input-group">
			<span class="input-group-addon">教研室</span>
			<input type="text" class="form-control changeUserKindInput" name="password" placeholder="" value="${node.parentNode.parentNode.children[2].innerText}">
		</div>
		<br>
		<div class="input-group">
			<span class="input-group-addon">密码</span>
			<input type="text" class="form-control changeUserPasswdInput" name="password" placeholder="" value="${node.parentNode.parentNode.children[3].innerText}">
		</div>
		<br>
		<button value="${node.getAttribute('value')}" class="btn btn-primary btn-block" onclick="changeUser(this)">修改</button>

	`
	updateAlertModal('修改用户', changeUserHtml)
}

function changeUser(node){
	$.post('secretary/changeUser',
		{
			_id: node.getAttribute('value'),
			id: $(".changeUserIdInput").val(),
			name: $(".changeUserNameInput").val(),
			kind: $(".changeUserKindInput").val(),
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
	const deleteUserHtml = `<button value="${node.getAttribute('value')}" class="btn btn-primary btn-block" onclick="deleteUser(this)">确定修改</button>`
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
			id: value,
			applyDate: getNewDate()
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

// excel
$("#excelInput").change(function () {
	const file = this.files[0]
	//文件格式不符合
  if(file.name.split('.').pop()!=='xlsx' && file.name.split('.').pop()!=='xls'){
		$("#excelInput").val('');
		updateAlertModal('通知信息', '文件类型错误！')
    return
  }
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = function(e){
		const workBook = XLSX.read(e.target.result, {type: 'array'});
		const data = XLSX.utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[0]]);

		console.log(workBook.Sheets[workBook.SheetNames[0]])

		const wopts = { bookType: 'xlsx', bookSST: true, type: 'binary', cellStyles: true }
		saveAs(new Blob([s2ab(XLSX.write(workBook, wopts))], { type: "application/octet-stream"}), "下载的文件" + '.' + (wopts.bookType == "biff2" ? "xls" : wopts.bookType));
		
		document.getElementById("excelTable").innerHTML = XLSX.utils.sheet_to_json(workBook)

		let excelTableHtml = ``
		for(let item of data){
			if(item['工号'] != undefined){
				// 不足5位，则在前面补零
				if(item['工号'].length != 5)
					item['工号'] = Array(6-item['工号'].length).join('0') + item['工号']
				excelTableHtml += `<tr><td>${item['工号']}</td><td>${item['姓名']}</td></tr>` 
			}
		}
		excelTableHtml = `<button class="btn btn-block btn-primary" onclick="addNewUsersByExcel($(this).next().find('tbody').find('tr'))">一键导入</button><table class="table table-bordered"><thead><tr><th>工号</th><th>姓名</th></tr></thead><tbody>${excelTableHtml}</tbody></table>`
		updateAlertModal('新增教师', excelTableHtml)
	}
	$("#excelInput").val('');
})

// 导出相关
function exportExcelFile(){
	const wb = XLSX.utils.table_to_book(document.getElementById("excelTable"))
	// 配置下载的文件格式
	const wopts = { bookType: 'xlsx', bookSST: true, type: 'binary', cellStyles: true }

	console.log(wb)
	wb.Sheets[wb.SheetNames[0]].C1.s = { font: { sz: 14, bold: true, color: { rgb: "FFFFAA00" } }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "FFFF00" } } };
	saveAs(new Blob([s2ab(XLSX.write(wb, wopts))], { type: "application/octet-stream"}), "下载的文件" + '.' + (wopts.bookType == "biff2" ? "xls" : wopts.bookType));

}

function s2ab(s) {
	if (typeof ArrayBuffer !== 'undefined') {
			var buf = new ArrayBuffer(s.length);
			var view = new Uint8Array(buf);
			for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
			return buf;
	} else {
			var buf = new Array(s.length);
			for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
			return buf;
	}
}
function saveAs(obj, fileName) {//当然可以自定义简单的下载文件实现方式 
	var tmpa = document.createElement("a");
	tmpa.download = fileName || "下载";
	tmpa.href = URL.createObjectURL(obj); //绑定a标签
	tmpa.click(); //模拟点击实现下载
	setTimeout(function () { //延时释放
			URL.revokeObjectURL(obj); //用URL.revokeObjectURL()来释放这个object URL
	}, 100);
}


function addNewUsersByExcel(nodes){
	for(let item of nodes){
		$.post('/secretary/addNewUser',
			{
				id: $(item).children().first().text(),
				name: $(item).children().first().next().text(),
				password: $(item).children().first().text(),
			},
			result=>{
				if(result)
					$(item).fadeToggle()
			}
		)
	}
}

const getNewDate = ()=>{
  return `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`;
}
