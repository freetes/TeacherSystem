function sort(node){
	const choice = node.value,
				allTr = $("#excelTable").children()

	$("#excelTable").html('')
	let choiceFun
	// 按照教研室排序
	if(choice == 1){
		choiceFun = function(a, b){
		return a.firstChild.nextSibling.innerText-b.firstChild.nextSibling.innerText
		}
	}
	// 按照工号排序
	else{
		choiceFun = function(a, b){
		return a.firstChild.innerText-b.firstChild.innerText
		}
	}

	allTr.sort(choiceFun)

	$("#excelTable").html(allTr)
}

// 导出相关
function exportExcelFile(){
	const wb = XLSX.utils.table_to_book(document.getElementById("excelTable"))
	// 配置下载的文件格式
	const wopts = { bookType: 'xlsx', bookSST: true, type: 'binary', cellStyles: true }

	saveAs(new Blob([s2ab(XLSX.write(wb, wopts))], { type: "application/octet-stream"}), "下载的文件" + '.' + (wopts.bookType == "biff2" ? "xls" : wopts.bookType));
}

function s2ab(s) {
	if (typeof ArrayBuffer !== 'undefined') {
			var buf = new ArrayBuffer(s.length);
			var view = new Uint8Array(buf);
			for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
			return buf;
	} else {
			var buf = new Array(s.length);
			for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
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
