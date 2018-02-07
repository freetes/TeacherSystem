const addUser = ()=>{
  $.post('/admin/addUser',
    {
      id: $(".newUserId").val(),
      name: $(".newUserName").val(),
      password: $(".newUserPassword").val(),
      level: $(".newUserLevel").val()=='普通'?0:$(".newUserLevel").val()=='秘书'?1:2,
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