
// 提示框
function alertModal(title='', context='', size='sm'){
  $(".modal-dialog").removeClass()
  $("#alertInfoModal").children('div').addClass('modal-dialog')
  $(".modal-dialog").addClass('modal-'+size)
  $("#alertInfoModal").find(".modal-title").html(title)
  $("#alertInfoModal").find(".alertMessage").html(context)
  $("#alertInfoModal").modal('show')
  setTimeout(function () {
    $("#alertInfoModal").modal('hide')
  }, 1000)
}

function showModal(title='', context='', size='sm'){
  $(".modal-dialog").removeClass()
  $("#alertInfoModal").children('div').addClass('modal-dialog')
  $(".modal-dialog").addClass('modal-'+size)
  $("#alertInfoModal").find(".modal-title").html(title)
  $("#alertInfoModal").find(".alertMessage").html(context)
  $("#alertInfoModal").modal('show')
}

function hideModal() {
  setTimeout(function () {
    $("#alertInfoModal").modal('hide')
  }, 1000)
}

function hiddenBtn() {
  $("#menu").find("span").toggle()

  if($("#content").css("margin-left") == '140px'){
    localStorage.setItem('hiddenMenu', 'true')
    $("#menu").css("width", "70px")
    $("#content").css("margin-left", "70px")
    $("#menu").find('li').css("width", "50px")
  }
  else{
    localStorage.setItem('hiddenMenu', 'false')
    $("#menu").css("width", "140px")
    $("#content").css("margin-left", "140px")
    $("#menu").find('li').css("width", "120px")
  }
}

// Date prototype

Date.prototype.format = function (format) {
  var o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
  };
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
  return format;
}