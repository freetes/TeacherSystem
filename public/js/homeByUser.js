$(document).ready(function(){
  getAllMessages()
})
// 上传新的薪资
function setNewPay(){
  if($(".newPay").val() != '' && $(".applySemesterSelect").val() != '')
    $.post('/users/newPay', 
      {
        newPay: $(".newPay").val(),
        applySemester: $(".applySemesterSelect").val(),
        applyDate: getNewDate()
      },
      result=>{
        if(result){
          $(".alertMessage").text("上传成功！");
          $("#alertInfoModal").modal();
          setTimeout(function(){
            location.reload()
          }, 2000);
        }
        else{
          $(".alertMessage").text("出错了！");
          $("#alertInfoModal").modal();
        }
      }
    )
};
// 修改薪资
function changePay(value){
  if($(".newPay").val() != '')
    $.post('/users/changePay',
      {
        id: value,
        newPay: $(".newPay").val(),
        applyDate: getNewDate()
      },
      result=>{
        if(result){
          $(".alertMessage").text("修改成功！");
          $("#alertInfoModal").modal(); 
          setTimeout(function(){
            location.reload()
          }, 2000);
        }
        else{
          $(".alertMessage").text("出错了！");
          $("#alertInfoModal").modal();
        }
      }
    )
};
// 提交审核
function checkPay(value){
  $.post('/users/checkPay',
    {
      id: value,
    },
    result=>{
      if(result){
        $(".alertMessage").text("提交成功！");
        $("#alertInfoModal").modal();
        setTimeout(function(){
          location.reload()
        }, 2000);
      }
      else{
        $(".alertMessage").text("出错了！");
        $("#alertInfoModal").modal();
      }
    }
  )
};

// 点击事件
const allClassClick = ()=>{
  $(".mainDiv").css("display", "none");
  $(".addClassDiv").css("display", "none");
  $(".payCtrlDiv").css("display", "none");
  if($(".allClassDiv").css("display")=='none') $(".allClassDiv").slideToggle();
};
const addClassClick = ()=>{
  $(".mainDiv").css("display", "none");
  $(".payCtrlDiv").css("display", "none");
  $(".allClassDiv").css("display", "none");
  if($(".addClassDiv").css("display")=='none') $(".addClassDiv").slideToggle();
};
const mainDivClick = ()=>{
  $(".allClassDiv").css("display", "none");
  $(".addClassDiv").css("display", "none");
  $(".payCtrlDiv").css("display", "none");
  if($(".mainDiv").css("display")=='none') $(".mainDiv").slideToggle();
};
const payDivClick = ()=>{
  $(".allClassDiv").css("display", "none");
  $(".mainDiv").css("display", "none");
  $(".addClassDiv").css("display", "none");
  if($(".payCtrlDiv").css("display")=='none') $(".payCtrlDiv").slideToggle();
};

const getNewDate = ()=>{
  return `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`;
}

function getAllMessages(){
  getMessage().then(message=>{
    for(let item of message){
      getName(item.sender).then(name=>{
        if(item.receiver == 'all'){
          $(".allMessageBox").append(`
            <div class="col-md-12 bg-${item.level}">
              <div class="col-md-9 bg-${item.level}">
                <h4>${item.message}</h4>
              </div>
              <div class="col-md-3 bg-${item.level}">
                <p class="text-right">${item.date}</p>
                <p class="text-right">from ${name}</p>
              </div>
            </div>
            `)
        }
        else{
          $(".myMessageBox").append(`
          <div class="col-md-12 bg-${item.level}">
            <div class="col-md-9">
              <h4>${item.message}</h4>
            </div>
            <div class="col-md-3">
              <p class="text-right">${item.date}</p>
              <p class="text-right">from ${name}</p>
            </div>
          </div>
          `)
        }
      })
    }
  })
}
