// 上传新的薪资
function setNewPay(){
  const newPay = parseFloat($(".newPay").val()==''?0:$(".newPay").val())

  if(newPay !=0 && $(".applyMonthSelect").val() != ''){
    const lastPay = parseFloat($(".lastPay").val()==''?0:$(".lastPay").val()),
          newPay = parseFloat($(".newPay").val()==''?0:$(".newPay").val()),
          lastReward = parseFloat($(".lastReward").val()==''?0:$(".lastReward").val()),
          newReward = parseFloat($(".newReward").val()==''?0:$(".newReward").val()),
          pay = {
            last: lastPay,
            change: newPay - lastPay,
            final: newPay,
          },
          reward = {
            last: lastReward,
            change: newReward - lastReward,
            final: newReward,
          }

    $.post('/users/newPay',
      {
        pay: pay,
        reward: reward,
        applyMonth: $(".applyMonthSelect").val(),
        applyDate: getNewDate()
      },
      result=>{
        if(result){
          updateAlertModal('通知信息', '提交成功！')
        }
        else{
          updateAlertModal('通知信息', '提交失败！')
        }
        location.reload(300)
      }
    )
  }
};

// 修改薪资
function changePay(value){
  const newPay = parseFloat($(".newPay").val()==''?0:$(".newPay").val())

  if(newPay !=0){
    const lastPay = parseFloat($(".lastPay").val()==''?0:$(".lastPay").val()),
          newPay = parseFloat($(".newPay").val()==''?0:$(".newPay").val()),
          lastReward = parseFloat($(".lastReward").val()==''?0:$(".lastReward").val()),
          newReward = parseFloat($(".newReward").val()==''?0:$(".newReward").val()),
          pay = {
            last: lastPay,
            change: newPay - lastPay,
            final: newPay,
          },
          reward = {
            last: lastReward,
            change: newReward - lastReward,
            final: newReward,
          }

    $.post('/users/changePay',
      {
        id: value,
        pay: pay,
        reward: reward,
        applyDate: getNewDate()
      },
      result=>{
        if(result){
          updateAlertModal('通知信息', '修改成功！')
        }
        else{
          updateAlertModal('通知信息', '修改失败！')
        }
        location.reload(300)
      }
    )
  }
};

const getNewDate = ()=>{
  return `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`;
}

// 点击事件
const addNewClass = ()=>{
  $(".addNewClassMessage").text("")
  for(let item of $("input.publicInput")){
    if(item.value==''){
      $(".addNewClassMessage").text("必须全部填写")
      return 
    }
  }
  if($(".classKindSelect").val() == 'normal'){
    for(let item of $(".normalClass").find('input.form-control')){
      if(item.value==''){
        $(".addNewClassMessage").text("必须全部填写")
        return 
      }
    }
  }
  else if($(".classKindSelect").val() == 'design'){
    for(let item of $(".designClass").find('input.form-control')){
      if(item.value==''){
        $(".addNewClassMessage").text("必须全部填写")
        return 
      }
    }
  }
  else if($(".classKindSelect").val() == 'train'){
    for(let item of $(".trainClass").find('input.form-control')){
      if(item.value==''){
        $(".addNewClassMessage").text("必须全部填写")
        return 
      }
    }
  }
  else{
    for(let item of $(".otherClass").find('input.form-control')){
      if(item.value==''){
        $(".addNewClassMessage").text("必须全部填写")
        return 
      }
    }
  }
  
  $(".addNewClassForm").submit()
}
const allClassClick = ()=>{
  $(".homePageDiv").css("display", "none")
  if($(".allClassDiv").css("display")=='none') $(".allClassDiv").slideToggle();
}
const addClassClick = ()=>{
  $(".homePageDiv").css("display", "none")
  if($(".addClassDiv").css("display")=='none') $(".addClassDiv").slideToggle();
}

const mainDivClick = ()=>{
  $(".homePageDiv").css("display", "none")
  if($(".mainDiv").css("display")=='none') $(".mainDiv").slideToggle();
}
const payDivClick = ()=>{
  $(".homePageDiv").css("display", "none")
  if($(".payCtrlDiv").css("display")=='none') $(".payCtrlDiv").slideToggle();
}

// 选择课程类别
// $(".classKindSelect").change(function(){
//   if(this.value == 'normal'){
//     $(".classesInputGroup").html(`<div class="input-group"><span class="input-group-addon">标准学时</span>
//         <input type="text" name="standardHours" class="form-control"/>
//       </div>
//       <div class="input-group"><span class="input-group-addon">理论学时</span>
//         <input type="text" name="theoryHours" class="form-control"/>
//       </div>
//       <div class="input-group"><span class="input-group-addon">实验学时</span>
//         <input type="text" name="experimentHours" class="form-control"/>
//       </div>
//       <div class="input-group"><span class="input-group-addon">合班系数</span>
//         <input type="text" name="point" class="form-control"/>
//       </div>
//       <div class="input-group"><span class="input-group-addon">实际学时</span>
//         <input type="text" name="finalHours" class="form-control"/>
//       </div>`)
//   }
//   else if(this.value == 'design'){
//     $(".classesInputGroup").html(`<div class="input-group"><span class="input-group-addon">周数</span>
//         <input type="text" name="week" class="form-control"/>
//       </div>
//       <div class="input-group"><span class="input-group-addon">实验学时</span>
//         <input type="text" name="experimentHours" class="form-control"/>
//       </div>
//       <div class="input-group"><span class="input-group-addon">合班系数</span>
//         <input type="text" name="point" class="form-control"/>
//       </div>
//       <div class="input-group"><span class="input-group-addon">实际学时</span>
//         <input type="text" name="finalHours" class="form-control"/>
//       </div>`)
//   }
//   else if(this.value == 'train'){
//     $(".classesInputGroup").html(`<div class="input-group"><span class="input-group-addon">单位学时</span>
//         <input type="text" name="unitHours" class="form-control"/>
//       </div>
//       <div class="input-group"><span class="input-group-addon">合班系数</span>
//         <input type="text" name="point" class="form-control"/>
//       </div>
//       <div class="input-group"><span class="input-group-addon">实际学时</span>
//         <input type="text" name="finalHours" class="form-control"/>
//       </div>`)
//   }
//   else{
//     $(".classesInputGroup").html(`<div class="input-group"><span class="input-group-addon">周数</span>
//         <input type="text" name="week" class="form-control"/>
//       </div>
//       <div class="input-group"><span class="input-group-addon">单位学时</span>
//         <input type="text" name="unitHours" class="form-control"/>
//       </div>
//       <div class="input-group"><span class="input-group-addon">合班系数</span>
//         <input type="text" name="point" class="form-control"/>
//       </div>
//       <div class="input-group"><span class="input-group-addon">实际学时</span>
//         <input type="text" name="finalHours" class="form-control"/>
//       </div>`)
//   }
// })
