$(function () {
	$(".navbar-nav").first().children().first().click()
})

// 顶部导航栏点击事件
$(".navbar-nav").first().children().click(function () {
	$(".navbar-nav").first().children().removeClass('active')
	this.className = 'active'
	if (this.innerText.includes("首页")) {
		$(".container-fluid").css("display", "none")
		$(".container-fluid")[0].style.display = "block"
		$(".container-fluid")[1].style.display = "block"
	} else if (this.innerText.includes("教师信息管理")) {
		$(".container-fluid").css("display", "none")
		$(".container-fluid")[0].style.display = "block"
		$(".container-fluid")[2].style.display = "block"
	} else if (this.innerText.includes("工资管理")) {
		$(".container-fluid").css("display", "none")
		$(".container-fluid")[0].style.display = "block"
		$(".container-fluid")[3].style.display = "block"
	} else if (this.innerText.includes("课程管理")) {
		$(".container-fluid").css("display", "none")
		$(".container-fluid")[0].style.display = "block"
		$(".container-fluid")[4].style.display = "block"
	}
})

// 功能按钮点击事件
$(".userDiv").find("div.col-md-2").first().find("button").click(function () {
	if (this.innerText.includes('教师信息一览表')) {
		$(".userDiv").find("div.col-md-10").children()[1].style.display = "none"
		$(".userDiv").find("div.col-md-10").children()[0].style.display = "block"
	} else if (this.innerText.includes('不在岗教师一览表')) {
		$(".userDiv").find("div.col-md-10").children()[0].style.display = "none"
		$(".userDiv").find("div.col-md-10").children()[1].style.display = "block"
	}
})

$(".sendMessageReceiverSelect").change(function () {
	if (this.value == 'one') {
		$(".sendMessageReceiverInput").slideToggle()
	} else
		$(".sendMessageReceiverInput").css("display", 'none')
})

// 通过excel快速导入课程
$("#courseExcelInput").change(function () {
	const file = this.files[0]
	//文件格式不符合
	if (file.name.split('.').pop() !== 'xlsx' && file.name.split('.').pop() !== 'xls') {
		$("#courseExcelInput").val('');
		return updateAlertModal('通知信息', '文件类型错误！')
	}
	const reader = new FileReader();
	reader.readAsArrayBuffer(file);
	reader.onload = function (e) {
		const workBook = XLSX.read(e.target.result, {
			type: 'array'
		});
		const data = XLSX.utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[0]]);
		addNewCoursesByExcel(data)
	}
	$("#courseExcelInput").val('');
})

function addNewCoursesByExcel(nodes) {
	let courseInfo
	
	updateAlertModal('导入中', `
		<div class="progress">
			<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0">
				<span class="sr-only">45% Complete</span>
			</div>
		</div>
	`)
	nodes.forEach((item, index) => {
		courseInfo = {
			id: item['课程号'], // 课程号
			name: item['课程名称'], // 课程名称
			place: item['上课地点'], // 上课地点
			number: item['教学班人数'], // 教学班人数
			kind: item['课程性质'], // 课程性质
			dateInfo: {
				year: item['学年'], // 学年
				semester: item['学期'], // 学期
				dayOfWeek: item['星期几'], // 星期几
				beginWeek: item['起始周'], // 起始周
				classTime: item['上课节次'], // 上课节次
				time: item['上课时间'], // 上课时间
			},
			teacherInfo: { // 教师信息
				id: item['教工号'], // 教工号
				name: item['姓名'], // 姓名
				telephone: item['教师联系电话'], // 教师联系电话
				department: item['教师所属学院'], // 教师所属学院
				gender: item['性别'], // 性别
				education: item['最高学历'], // 最高学历
				alias: item['职称名称'], // 职称名称
			},
			classroomInfo: { // 教室信息
				id: item['场地编号'], // 场地编号
				name: item['场地名称'], // 场地名称
				building: item['教学楼'], // 教学楼
				kind: item['场地类别名称'], // 场地类别名称
				seats: item['座位数'], // 座位数
				beginWeek: item['场地上课起始周'], // 场地上课起始周
				classTime: item['场地上课节次'], // 场地上课节次
				classComposition: item['教学班组成'], // 教学班组成
				campus: item['校区'], // 校区
			},
			chooseInfo: { // 选课信息
				id: item['选课课号'], // 选课课号
				department: item['开课学院'], // 开课学院
				credit: item['学分'], // 学分
				hour: item['总学时'], // 总学时
				number: item['选课人数'], // 选课人数
				weekHour: item['周学时'] // 周学时
			}
		}
		$.post('/secretary/addNewCourse', {
				course: courseInfo
			},
			result => {
				if (result) {
					$(".progress-bar").attr("aria-valuenow", (index+1)/nodes.length*100)
					$(".progress-bar").css("width", (index+1)/nodes.length*100+'%')
					if($(".progress-bar").attr("aria-valuenow") == 100){
						setTimeout(() => {
							updateAlertModal('通知', '全部导入完成！')
						}, 1000);
					}
				} else
					console.log('导入失败')
			}
		)

	});
}

// 发布公告
function sendMessage() {
	$.post('/secretary/sendMessage', {
			message: $(".sendMessageContent").val(),
			receiver: $(".sendMessageReceiverSelect").val() == 'all' ? 'all' : $(".sendMessageReceiverInput").val(),
			level: $(".sendMessageLevel").val(),
			date: getNewDate()
		},
		result => {
			if (result) {
				updateAlertModal('通知信息', '发布公告成功！')
			} else {
				updateAlertModal('通知信息', '发布公告失败！')
			}
			location.reload(1000)
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

function addNewUser() {
	if ($(".newUserIdInput").val() == undefined || $(".newUserNameInput").val() == undefined || $(".newUserPasswdInput").val() == undefined)
		return;
	$.post('/secretary/addNewUser', {
			id: $(".newUserIdInput").val(),
			name: $(".newUserNameInput").val(),
			password: $(".newUserPasswdInput").val()
		},
		result => {
			if (result)
				location.reload(1000)
		}
	)
}

function resetPassword(node) {
	$.post('/secretary/resetPassword', {
			_id: node.getAttribute('value')
		},
		result => {
			if (result) {
				updateAlertModal('通知信息', '重置成功！')
			} else {
				updateAlertModal('通知信息', '重置失败！')
			}
			location.reload(1000)
		}
	)
}

function changeUserBtn(node) {
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

function changeUser(node) {
	$.post('secretary/changeUser', {
			_id: node.getAttribute('value'),
			id: $(".changeUserIdInput").val(),
			name: $(".changeUserNameInput").val(),
			kind: $(".changeUserKindInput").val(),
			password: $(".changeUserPasswdInput").val()
		},
		result => {
			if (result) {
				updateAlertModal('通知信息', '修改成功！')
			} else {
				updateAlertModal('通知信息', '修改失败！')
			}
			location.reload(1000)
		}
	)
}

function deleteUserBtn(node) {
	const deleteUserHtml = `<button value="${node.getAttribute('value')}" class="btn btn-primary btn-block" onclick="deleteUser(this)">确定修改</button>`
	updateAlertModal('删除用户', deleteUserHtml)
}

function deleteUser(node) {
	$.post('secretary/deleteUser', {
			_id: node.getAttribute('value')
		},
		result => {
			if (result) {
				updateAlertModal('通知信息', '删除成功！')
			} else {
				updateAlertModal('通知信息', '删除失败！')
			}
			location.reload(1000)
		}
	)
}

// POST /secretary/passRequest
function passRequest(value) {
	$.post('/secretary/passRequest', {
			id: value,
			applyDate: getNewDate()
		},
		result => {
			if (result) {
				updateAlertModal('通知信息', '通过审核成功！')
			} else {
				updateAlertModal('通知信息', '通过审核失败！')
			}
			location.reload(1000)
		}
	)
}

// POST /secretary/refuseRequest
function refuseRequest(value) {
	if ($(".refuseInput").val() == '') {
		return $(".alertMessage").html("请输入驳回信息！");
	}
	$.post('/secretary/refuseRequest', {
			id: value,
			message: $(".refuseInput").val(),
			date: getNewDate()
		},
		result => {
			if (result) {
				updateAlertModal('通知信息', '驳回成功！')
			} else {
				updateAlertModal('通知信息', '驳回失败！')
			}
			location.reload(1000)
		}
	)
}

// 用户视图功能集
// 用户排序
$(".viewWorkingTableSortBtn").click(function () {
	const choice1 = this.previousSibling.previousSibling.value,
		choice2 = this.previousSibling.value,
		allTr = $("#workingTable").children()
	$("#workingTable").html('')
	let choiceFun
	// 按照教研室排序
	if (choice1 == 1) {
		if (choice2 == 1)
			choiceFun = function (a, b) {
				return a.firstChild.nextSibling.innerText - b.firstChild.nextSibling.innerText
			}
		else
			choiceFun = function (b, a) {
				return a.firstChild.nextSibling.innerText - b.firstChild.nextSibling.innerText
			}
	}
	// 按照工号排序
	else {
		if (choice2 == 1)
			choiceFun = function (a, b) {
				return a.firstChild.innerText - b.firstChild.innerText
			}
		else
			choiceFun = function (b, a) {
				return a.firstChild.innerText - b.firstChild.innerText
			}
	}

	allTr.sort(choiceFun)

	$("#workingTable").html(allTr)
})

// 工资视图功能集
// 工资排序
$(".payTableSortBtn").click(function () {
	const choice1 = this.previousSibling.previousSibling.value,
		choice2 = this.previousSibling.value,
		allTr = $("#payTable").children()
	$("#payTable").html('')
	let choiceFun
	// 按照教研室排序
	if (choice1 == 1) {
		if (choice2 == 1)
			choiceFun = function (a, b) {
				return a.firstChild.nextSibling.innerText - b.firstChild.nextSibling.innerText
			}
		else
			choiceFun = function (b, a) {
				return a.firstChild.nextSibling.innerText - b.firstChild.nextSibling.innerText
			}
	}
	// 按照工号排序
	else if (choice1 == 2) {
		if (choice2 == 1)
			choiceFun = function (a, b) {
				return a.firstChild.innerText - b.firstChild.innerText
			}
		else
			choiceFun = function (b, a) {
				return a.firstChild.innerText - b.firstChild.innerText
			}
	}
	// 按提交日期排序
	else {
		if (choice2 == 1)
			choiceFun = function (a, b) {
				return new Date(b.firstChild.nextSibling.nextSibling.innerText) - new Date(a.firstChild.nextSibling.nextSibling.innerText)
			}
		else
			choiceFun = function (b, a) {
				return new Date(b.firstChild.nextSibling.nextSibling.innerText) - new Date(a.firstChild.nextSibling.nextSibling.innerText)
			}
	}
	allTr.sort(choiceFun)
	$("#payTable").html(allTr)
})

const getNewDate = () => {
	return `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`;
}