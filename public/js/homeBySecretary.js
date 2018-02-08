$(document).ready(function(){
	$(".navbar-nav").first().children().first().click()
	getAllInfo()
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
})

// 驳回按钮点击事件
function refuseBtn(value){
	const refuseHtml = `<input class="form-control refuseInput" placeholder="请输入驳回原因"><br><botton class="btn btn-default btn-block" value="${value}" onclick="refuseRequest(this.getAttribute('value'))">驳回</botton>`
	$(".alertMessage").html(refuseHtml);
	$("#alertInfoModal").modal();
}

// POST /api/secretary/getAllInfo
function getAllInfo(){
	$.post('/api/secretary/getAllInfo',
		{
			
		},
		info=>{
			displayInfo(info)
		}
	)
}

function displayInfo(info){
	$("#userInfoTable").html("");
	$("#payInfoTable").html("");
	const users = info.user;
	let userTrs="";
	const pay = info.pay;
	let payTrs="";
	for(let item of users){
		userTrs+=`<tr><td>${item.name}</td><td>${item.id}</td><td>${item.password}</td></tr>`
		for(let payItem of pay){
			if(item.id==payItem.id){
				if(payItem.isChecked==1){
					payTrs+=`<tr><td>${payItem.applySemester}</td><td>${payItem.applyDate}</td><td>${item.name}</td><td>${payItem.id}</td><td>${payItem.pay}</td>
					<td>
					<button class="btn btn-default" value="${payItem._id}" onclick="passRequest(this.value)">通过</button>
					<button class="btn btn-default" value="${payItem._id}" onclick="refuseBtn(this.value)">驳回</button>
					</td></tr>`
				}
				else if(payItem.isChecked==2){
					payTrs+=`<tr><td>${payItem.applySemester}</td><td>${payItem.applyDate}</td><td>${item.name}</td><td>${payItem.id}</td><td>${payItem.pay}</td><td>已确认</td></tr>`	
				}
				else{
					payTrs+=`<tr><td>${payItem.applySemester}</td><td>${payItem.applyDate}</td><td>${item.name}</td><td>${payItem.id}</td><td>${payItem.pay}</td><td>未上传</td></tr>`	
				}
			}
		}
	}
	$("#userInfoTable").append(userTrs);
	$("#payInfoTable").append(payTrs);
}

// POST /api/secretary/passRequest
function passRequest(value){
	$.post('/api/secretary/passRequest',
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
			getAllInfo();
		}
	)
}

// POST /api/secretary/refuseRequest
function refuseRequest(value){
	if($(".refuseInput").val()==''){
		$(".alertMessage").html("请输入驳回信息！");
		return $("#alertInfoModal").modal();
	}
	$.post('/api/secretary/refuseRequest',
		{
			id: value,
			message: $(".refuseInput").val(),
			date: getNewDate()
		},
		result=>{
			if(result){
				$(".alertMessage").html("驳回成功！");
				$("#alertInfoModal").modal();
			}
			else{
				$(".alertMessage").html("出错了！");
				$("#alertInfoModal").modal();
			}
			getAllInfo();
		}
	)
}

const getNewDate = ()=>{
  return `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`;
}
