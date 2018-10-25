
let boyGirlDiv = echarts.init(document.getElementById('boyGirlDiv'))
let employeeStatusDiv = echarts.init(document.getElementById('employeeStatusDiv'))
let employeeTypeDiv = echarts.init(document.getElementById('employeeTypeDiv'))
let futureDiv = echarts.init(document.getElementById('futureDiv'))

let changeNumber

function togglePage(node, page){
    $(".tools span").removeClass('select')
    $(node).addClass('select')
    $(".pageDiv").css("display", "none")
    $(page).toggle()
}
$(".tools span").first().click()

function toggleTbody(node, tbody){
    $(".hirePage .contentDiv .btns span").removeClass('select')
    $(node).addClass('select')
    $(".tablesDiv table tbody").css("display", "none")
    $(tbody).toggle()
}

function toggleChangeInfo(node, info){
    $(".employeePage .contentDiv .btns span").removeClass('select')
    $(node).addClass('select')
    showChangeInfo(changeNumber[info])
}

function showChangeInfo(info){
    $(".entry").text(info.entry)
    $(".turnPositive").text(info.turnPositive)
    $(".change").text(info.change)
    $(".resignation").text(info.resignation)
}

$.get('/api/getAllInfo').done(result=>{
    // 处理部门人数
    let number = {}
    for(let employee of result.employees){
        if(!number[`${employee.companyInfo.department}`]){
            number[`${employee.companyInfo.department}`] = 1
        }
        else{
            number[`${employee.companyInfo.department}`]++
        }
    }

    let dataResult = {
        length: result.employees.length,
        gender: {
            boys: 0,
            girls: 0
        },
        employeeType: {
            实习: 0,
            全职: 0,
            兼职: 0,
        },
        employeeStatus: {
            正式: 0,
            实习: 0,
            试用: 0,
            离职: 0
        },
        department: getArr(number),
        changeNumber: {
            today: {
                change: 0,
                entry: 0,
                resignation: 0,
                turnPositive: 0
            },
            week: {
                change: 0,
                entry: 0,
                resignation: 0,
                turnPositive: 0
            },
            month: {
                change: 0,
                entry: 0,
                resignation: 0,
                turnPositive: 0
            }
        }
    }
    // result.data.change.length + result.data.entry.length + result.data.resignation.length + result.data.turnPositive.length
    for(let item of result.data.change){
        let date = new Date(item.date)
        if(date.getFullYear() == new Date().getFullYear() && date.getMonth() == new Date().getMonth() && date.getDate() == new Date().getDate()){
            dataResult.changeNumber.today.change++
        }
        else if(date.getFullYear() == new Date().getFullYear() && date.getMonth() == new Date().getMonth() && date.getDate() <= new Date().getDate()){
            dataResult.changeNumber.week.change++
        }
        else{
            dataResult.changeNumber.month.change++
        }
    }

    for(let item of result.data.entry){
        let date = new Date(item.date)
        if(date.getFullYear() == new Date().getFullYear() && date.getMonth() == new Date().getMonth() && date.getDate() == new Date().getDate()){
            dataResult.changeNumber.today.entry++
        }
        else if(date.getFullYear() == new Date().getFullYear() && date.getMonth() == new Date().getMonth() && date.getDate() <= new Date().getDate()){
            dataResult.changeNumber.week.entry++
        }
        else{
            dataResult.changeNumber.month.entry++
        }
    }

    for(let item of result.data.resignation){
        let date = new Date(item.date)
        if(date.getFullYear() == new Date().getFullYear() && date.getMonth() == new Date().getMonth() && date.getDate() == new Date().getDate()){
            dataResult.changeNumber.today.resignation++
        }
        else if(date.getFullYear() == new Date().getFullYear() && date.getMonth() == new Date().getMonth() && date.getDate() <= new Date().getDate()){
            dataResult.changeNumber.week.resignation++
        }
        else{
            dataResult.changeNumber.month.resignation++
        }
    }

    for(let item of result.data.turnPositive){
        let date = new Date(item.date)
        if(date.getFullYear() == new Date().getFullYear() && date.getMonth() == new Date().getMonth() && date.getDate() == new Date().getDate()){
            dataResult.changeNumber.today.turnPositive++
        }
        else if(date.getFullYear() == new Date().getFullYear() && date.getMonth() == new Date().getMonth() && date.getDate() <= new Date().getDate()){
            dataResult.changeNumber.week.turnPositive++
        }
        else{
            dataResult.changeNumber.month.turnPositive++
        }
    }
    for(let i=0; i < dataResult.department.length; i++){
        dataResult.department[i] = dataResult.department[i].name + ' ' + dataResult.department[i].value + '人'
    }

    for(let item of result.employees){
        if(item.personalInfo.gender == 0)
            dataResult.gender.boys++
        else
            dataResult.gender.girls++

        if(item.companyInfo.employeeType == '全职')
            dataResult.employeeType.全职++
        else if(item.companyInfo.employeeType == '实习')
            dataResult.employeeType.实习++
        else
            dataResult.employeeType.兼职++
        
        if(item.companyInfo.employeeType == '实习')
            dataResult.employeeStatus.实习++
        else if(item.companyInfo.employeeType == '离职')
            dataResult.employeeStatus.离职++
        else if(item.companyInfo.status == '试用')
            dataResult.employeeStatus.试用++
        else
            dataResult.employeeStatus.正式++

    }
    
    changeNumber = dataResult.changeNumber
    boyGirlDiv.setOption({
        color: ['#AAAAAA','#99ccff', '#C67171', '#90EE90', '#8B6914'],
        tooltip: {
            trigger: 'item',
            formatter: "{b}: {c} ({d}%)"
        },
        series: [
            {
                name:'访问来源',
                type:'pie',
                radius:'80%',
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[
                    {value:dataResult.gender.boys, name:'男'},
                    {value:dataResult.gender.girls, name:'女'}
                ]
            }
        ]
    })

    employeeStatusDiv.setOption({
        color: ['#AAAAAA','#99ccff', '#C67171', '#90EE90', '#8B6914'],

        tooltip: {
            trigger: 'item',
            formatter: "{b}: {c} ({d}%)"
        },
        series: [
            {
                name:'访问来源',
                type:'pie',
                radius:'80%',
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[
                    {value:dataResult.employeeStatus.试用, name:'试用'},
                    {value:dataResult.employeeStatus.正式, name:'正式'},
                    {value:dataResult.employeeStatus.实习, name:'实习'},
                    {value:dataResult.employeeStatus.离职, name:'离职'}
                ]
            }
        ]
    })

    employeeTypeDiv.setOption({
        color: ['#AAAAAA','#99ccff', '#C67171', '#90EE90', '#8B6914'],

        tooltip: {
            trigger: 'item',
            formatter: "{b}: {c} ({d}%)"
        },
        series: [
            {
                name:'访问来源',
                type:'pie',
                radius:'80%',
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[
                    {value:dataResult.employeeType.全职, name:'全职'},
                    {value:dataResult.employeeType.实习, name:'实习'},
                    {value:dataResult.employeeType.离职, name:'兼职'}
                ]
            }
        ]
    })

    let futureData = {
        data: ['入职', '转正', '调动', '离职'],
        date: [],
        change: {
            name:'调动',
            type:'line',
            smooth: true,
            data:[]
        },
        entry: {
            name:'入职',
            type:'line',
            smooth: true,
            data:[]
        },
        turnPositive: {
            name:'转正',
            type:'line',
            smooth: true,
            data:[]
        },
        resignation: {
            name:'离职',
            type:'line',
            smooth: true,
            data:[]
        }
    }
    for(let i=11; i>=0; i--){
        if(new Date().getMonth()+1-i>0){
            futureData.date.push(`${new Date().getFullYear()}-${new Date().getMonth()+1-i}`)
        }
        else{
            futureData.date.push(`${new Date().getFullYear()-1}-${new Date().getMonth()+12+1-i}`)
        }
    }

    for(let item of futureData.date){
        let changes = 0,
            entrys = 0,
            turnPositives = 0,
            resignations = 0;
        
        let itemDate = new Date(item)
        for(let change of result.data.change){
            let date = new Date(change.date)
            if(date.getFullYear() == itemDate.getFullYear() && date.getMonth() == itemDate.getMonth()){
                changes++
            }
        }
        for(let entry of result.data.entry){
            let date = new Date(entry.entryTime)
            if(date.getFullYear() == itemDate.getFullYear() && date.getMonth() == itemDate.getMonth()){
                entrys++
            }
        }
        for(let resignation of result.data.resignation){
            let date = new Date(resignation.date)
            if(date.getFullYear() == itemDate.getFullYear() && date.getMonth() == itemDate.getMonth()){
                resignations++
            }
        }
        for(let turnPositive of result.data.turnPositive){
            let date = new Date(turnPositive.date)
            if(date.getFullYear() == itemDate.getFullYear() && date.getMonth() == itemDate.getMonth()){
                turnPositives++
            }
        }
        futureData.change.data.push(changes)
        futureData.turnPositive.data.push(turnPositives)
        futureData.resignation.data.push(resignations)
        futureData.entry.data.push(entrys)
    }
    console.log(futureData)
    futureDiv.setOption(option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: futureData.data
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: futureData.date,
        },
        yAxis: {
            type: 'value'
        },
        series: [
            futureData.entry,
            futureData.turnPositive,
            futureData.change,
            futureData.resignation,
        ]
    })
    
    $(".hirePage .contentDiv .btns span").first().click()
    $(".employeePage .contentDiv .btns span").first().click()
})

function getArr(obj){
    let arr = []
    Object.keys(obj).forEach(function(name){
        arr.push({
            value: obj[name],
            name
        })
    });
    return arr
}
