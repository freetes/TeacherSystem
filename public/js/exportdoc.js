function sort(node) {
	const choice = node.value,
		allTr = $("#excelTableBody").children()

	$("#excelTableBody").html('')
	let choiceFun
	// 按照教研室排序
	if (choice == 1) {
		choiceFun = function (a, b) {
			return a.firstChild.nextSibling.innerText - b.firstChild.nextSibling.innerText
		}
	}
	// 按照工号排序
	else {
		choiceFun = function (a, b) {
			return a.firstChild.innerText - b.firstChild.innerText
		}
	}

	allTr.sort(choiceFun)

	$("#excelTableBody").html(allTr)
}

// 导出相关
function exportExcelFile() {
	const alltr = $("#excelTableBody").children()
	for(let tr of alltr){
		$(tr.firstChild.nextSibling).remove();
		$(tr.firstChild).remove();
	}
	const wb = XLSX.utils.table_to_book(document.getElementById("excelTable"))
	const date = window.location.search.substring(1).split('&')
	// 配置下载的文件格式
	const wopts = {
		bookType: 'xlsx',
		bookSST: true,
		type: 'binary',
		cellStyles: true
	}
	saveAs(new Blob([s2ab(XLSX.write(wb, wopts))], {
		type: "application/octet-stream"
	}), date[0].substr(2) + '-' + date[1].substr(2) + '教师预发工资信息表' + '.' + wopts.bookType);
	setTimeout(function(){location.reload()}, 1500)
}

function s2ab(s) {
	if (typeof ArrayBuffer !== 'undefined') {
		var buf = new ArrayBuffer(s.length);
		var view = new Uint8Array(buf);
		for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
		return buf;
	} else {
		var buf = new Array(s.length);
		for (let i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
		return buf;
	}
}

function saveAs(obj, fileName) {
	var tmpa = document.createElement("a");
	tmpa.download = fileName || "下载";
	tmpa.href = URL.createObjectURL(obj);
	tmpa.click();
	setTimeout(function () {
		URL.revokeObjectURL(obj);
	}, 100);
}