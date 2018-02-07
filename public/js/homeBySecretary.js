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
		}
	)
}

function getAllInfo(){
	$.post('/api/secretary/getAllInfo',
		{
			
		},
		info=>{
			$("#userInfoTable").html("");
			$("#payInfoTable").html("");
			const users = info.user;
			let trs1="";
			const pay = info.pay;
			let trs2="";
			for(let item of users){
				trs1+=`<tr><td>${item.name}</td><td>${item.id}</td><td>${item.password}</td></tr>`
				for(let item2 of pay){
					if(item.id==item2.id){
						if(item2.isChecked==1){
							trs2+=`<tr><td>${item.name}</td><td>${item2.id}</td><td>${item2.pay}</td><td>${item2.isChecked}</td><td><button class="btn btn-default" value="${item2._id}" onclick="passRequest(this.value)">待确认</button></td><td>${item2.applySemester}</td><td>${item2.applyDate}</td></tr>`
						}
						else if(item2.isChecked==2){
							trs2+=`<tr><td>${item.name}</td><td>${item2.id}</td><td>${item2.pay}</td><td>${item2.isChecked}</td><td>已确认</td><td>${item2.applySemester}</td><td>${item2.applyDate}</td></tr>`	
						}
						else{
							trs2+=`<tr><td>${item.name}</td><td>${item2.id}</td><td>${item2.pay}</td><td>${item2.isChecked}</td><td>未上传</td><td>${item2.applySemester}</td><td>${item2.applyDate}</td></tr>`	
						}
					}
					
				}
			}
			$("#userInfoTable").append(trs1);
			$("#payInfoTable").append(trs2);
		}
	)
}
