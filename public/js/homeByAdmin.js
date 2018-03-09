const addUser = ()=>{
  $.post('/admin/addUser',
    {
      id: $(".newUserId").val(),
      name: $(".newUserName").val(),
      password: $(".newUserPassword").val(),
      level: $(".newUserLevel").val()=='普通教职工'?0:$(".newUserLevel").val()=='教学秘书'?1:2,
    },
    result=>{
      if(result){
				$(".alertMessage").text("新增成功！");
				$("#alertInfoModal").modal();
			}
			else{
				$(".alertMessage").text("出错了！");
				$("#alertInfoModal").modal();
			}
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

		let excelTableHtml = ``
		for(let item of data){
			if(item['工号'] != undefined){
				// 不足5位，则在前面补零
				if(item['工号'].length != 5)
					item['工号'] = Array(6-item['工号'].length).join('0') + item['工号']
				excelTableHtml += `<tr><td>${item['工号']}</td><td>${item['姓名']}</td><td>${item['__EMPTY_1']}</td></tr>` 
			}
		}
		excelTableHtml = `<button class="btn btn-block btn-primary" onclick="addNewUsersByExcel($(this).next().find('tbody').find('tr'))">一键导入</button><table class="table table-bordered"><thead><tr><th>工号</th><th>姓名</th><th>教研室排行</th></tr></thead><tbody>${excelTableHtml}</tbody></table>`
		updateAlertModal('新增教师', excelTableHtml)
	}
	$("#excelInput").val('');
})

function addNewUsersByExcel(nodes){
	for(let item of nodes){
		$.post('/secretary/addNewUser',
			{
				id: $(item).children().first().text(),
				name: $(item).children().first().next().text(),
				password: $(item).children().first().text(),
				departRank: $(item).children().first().next().next().text()
			},
			result=>{
				if(result)
					$(item).fadeToggle()
				if(item == nodes[nodes.length-1]){
					updateAlertModal('通知消息', '一键导入完成！')
					location.reload()
				}
			}
		)
	}
}
