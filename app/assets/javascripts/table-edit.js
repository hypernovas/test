function nypTable(table_name, config){

var inkey = ["i", "I", "d", "D", "b", "B"];
var original;
var selected_c;
var foreign_key;
var foreign_tab;
var foreign_col;
var table_c = $("#table_"+table_name).DataTable( {
	"columnDefs": [
		{"targets": config.norder, "orderable": false}
	],
	"order": config.sort,
  	"dom": "rt<'col-md-6'li><'col-md-6'p>",
	destroy: true
} );

table_c.row("#table_"+table_name+" tbody #"+table_name+"_template").remove().draw();

$("#view_"+table_name).click(viewRow);
$("#add_"+table_name).click(insRow);
$("#edit_"+table_name).click(editRow);
$("#delete_"+table_name).click(delData);
$("#cancel_"+table_name).click(cnclRow);
$("#reset_"+table_name).click(rstSrch);
$("#table_"+table_name+" tbody").on("click", "tr", selRow);
$("#table_"+table_name+" tbody .foreign_key").click(function(e){
	getForeign($(e.target).closest("tr").data("id"), showForeign);
});

(function(){
var typingTimer;
var $input = $('#search_'+table_name);

$input.on('keyup', function () {
	clearTimeout(typingTimer);
	typingTimer = setTimeout(function(){
		table_c.column("#table_"+table_name+" th:last").search("").draw();
		table_c.search($input.val()).draw();
	}, 500);
});

$input.on('keydown', function () {
  clearTimeout(typingTimer);
});
})();

function rstSrch(){
		table_c.column("#table_"+table_name+" th:last").search("").draw();
		table_c.search("").draw();
}

function getForeign(id, fn){
	if(id == -1) fn(null)
	else $.ajax({
		type: "GET",
		url: "/"+table_name+"s/" + id,
		timeout: 5000,
		success: fn,
		error: function(xhrObj, textStatus, exception) {
			$("#title_"+table_name).notify("Failed to get data!", {arrowShow: false, className: "error", position:"right middle"});
		}
	});
}

function showForeign(data) {
	var regexp="";
	if(data) data.forEach(function(val, idx){
		regexp += "(^"+ val +"$)"
		if(idx < data.length-1) regexp += "|";
	});
	foreign_tab.column("#table_"+foreign_key+" th:last").search(regexp,true,false).draw();
	$("#" + foreign_key + "-tab").tab("show");
}

function editForeign(data){
	var field = $("#" + table_name + "_field" + (config.edit.length-1));
	var val = [];
	foreign_tab.rows().every(function(){
		var r = this.data();
		var s = "";
		foreign_col.forEach(function(val){ s += r[val].substring(0, 50) + " | " });
		val.push([$(this.node()).data("id"), s]);
	});
	val.forEach(function(val){
		var item = $("<option value='"+val[0]+"'>"+val[1]+"</option>")
		if($("[value='"+val[0]+"']" ,field).length == 0) field.append(item);
	});
	if(data){
		field.val(data);
		original = data;
	}
}

function saveForeign(now, remote){
		if(original) $("#table_"+foreign_key+" tbody td[data-search='"+original[0]+"'] .foreign_key").hide();
		if(remote) $("#table_"+table_name+" tbody td[data-search='"+remote+"'] .foreign_key").hide();
		$("#table_"+foreign_key+" tbody td[data-search='"+now+"'] .foreign_key").show();
}

function selDate(a, b){
	var now = new Date();
    var d1 = a.datepicker({
    	format: "yyyy-mm-dd",
    	endDate: now,
    	autoclose: true
    });
    if(b){
    	d1.on('changeDate', function() {
	    	d2.datepicker("setStartDate", d1.datepicker("getDate"));
	    	b[0].focus();
    	});
	    var d2_start = d1.datepicker("getDate");
	    if(!d2_start) d2_start = now;
	    var d2 = b.datepicker({
	    	format: "yyyy-mm-dd",
	    	startDate: d2_start,
	    	autoclose: true
	    });
    }
}

function viewRow(){
	if(!$("#edit_"+table_name).hasClass("editing")){
		var now = $("#table_"+table_name+" tbody .info").first();
		if(now.is(selected_c) == false){
			selected_c = now;
			if(selected_c.length){
				var cells = $("td", selected_c);
				config.edit.forEach(function(val, idx){
					var field = $("#" + table_name + "_field" + idx);
					if(val == "b") getForeign(selected_c.data("id"), editForeign);
					else field.val($(cells[idx]).html().trim());
					field.prop("disabled", true);
				});
				$("#"+table_name+"_cb").val(selected_c.data("cb"));
				$("#"+table_name+"_lmb").val(selected_c.data("lmb"));
				$("#info_"+table_name).collapse("show");
			}
		} else $("#info_"+table_name).collapse("toggle");
	}
}

function selRow(event) {
	if(!$("#edit_"+table_name).hasClass("editing") && $(".dataTables_empty", $(this)).length == 0){
		if($(this).hasClass("info"))
			if(event.ctrlKey || event.metaKey) $(this).removeClass("info");
			else table_c.$("tr.info").removeClass("info");
		else {
			if(!(event.ctrlKey || event.metaKey))
				table_c.$("tr.info").removeClass("info");
			$(this).addClass("info");
		}
	}
}

function insRow() {
	if(!$("#edit_"+table_name).hasClass("editing")){
		editRow(0, true);
	}
}

function editRow(event, newrow) {
		if($("#edit_"+table_name).hasClass("editing")) saveData();
		else {
			if(newrow) selected_c = -1;
			else selected_c = $("#table_"+table_name+" tbody .info").first();
			if(selected_c.length || newrow){
				$("#edit_"+table_name).text("Save");
				$("#edit_"+table_name).addClass("editing");
				$("#delete_"+table_name).hide();
				$("#cancel_"+table_name).show();
				$("#info_"+table_name).collapse("show");
				var cells = $("td", selected_c);
				var dcell = [];
				config.edit.forEach(function(val, idx){
						var field = $("#" + table_name + "_field" + idx);
						if(newrow){
							if(val == "b") getForeign(-1, editForeign);
							else field.val("");
						}
						else if(val == "b") getForeign(selected_c.data("id"), editForeign);
						else field.val($(cells[idx]).html().trim());
						if(val == "d" || val == "D") dcell.push(field);
						if(inkey.indexOf(val) != -1) field.prop("disabled", false);
						else field.prop("disabled", true);
						field.removeClass("err");
				});
				if(newrow){
					$("#"+table_name+"_cb").val("");
					$("#"+table_name+"_lmb").val("");
				} else {
					$("#"+table_name+"_cb").val(selected_c.data("cb"));
					$("#"+table_name+"_lmb").val(selected_c.data("lmb"));
				}
				if(dcell != []) selDate(dcell[0], dcell[1]);
			}
		}
}

function saveRow(data){
	rstBtn();
	if(selected_c != -1){
		if(data.id) selected_c.data("id", data.id);
		table_c.row(selected_c).data( data.val.concat({
			"display": "<div class='btn btn-xs btn-default foreign_key'>Show "+foreign_key+"</div>",
			"@data-search": String(data.id) || 0
		}) ).draw();
		if(data.no_foreign) $(".foreign_key", selected_c).hide();
		$(".foreign_key", selected_c).click(function(e){
			getForeign($(e.target).closest("tr").data("id"), showForeign);
		});
		if(data.info){
			selected_c.data("lmb", data.info[1]);
			selected_c.data("cb", data.info[0]);
		}
	} else {
		var row = table_c.row.add(data.val.concat({
			"display": "<div class='btn btn-xs btn-default foreign_key'>Show "+foreign_key+"</div>",
			"@data-search": String(data.id) || 0
		}));
		row.data(data.val.concat({
			"display": "<div class='btn btn-xs btn-default foreign_key'>Show "+foreign_key+"</div>",
			"@data-search": String(data.id) || 0
		})).draw();
		row = row.node();
		$(row).find("td:last").attr("data-search", String(data.id));
		if(data.id) $(row).data("id", data.id);
		if(data.no_foreign) $(".foreign_key", row).hide();
		$(".foreign_key", row).click(function(e){
			getForeign($(e.target).closest("tr").data("id"), showForeign);
		});
		if(data.info){
			$(row).data("lmb", data.info[1]);
			$(row).data("cb", data.info[0]);
		}
	}
	$("#title_"+table_name).notify("Successfully saved!", {arrowShow: false, className: "success", position:"right middle"});
}

function cnclRow(){
rstBtn();
	$("#info_"+table_name+" .err").removeClass("err");
}

function delRow(data){
	rstBtn();
	table_c.row('.info').remove().draw(false);
	if(data && data[0] != "")
		$("#table_"+foreign_key+" tbody td[data-search='"+data+"'] .foreign_key").hide();
	$("#title_"+table_name).notify("Successfully deleted!", {arrowShow: false, className: "success", position:"right middle"});
}

function rstBtn(){
	$("#edit_"+table_name).text("Edit");
	$("#edit_"+table_name).removeClass("editing");
	$("#cancel_"+table_name).hide();
	$("#delete_"+table_name).show();
	if($("#info_"+table_name).hasClass("in"))
		$("#info_"+table_name).collapse("hide");
}

function delData(event){
	selected_c = $("#table_"+table_name+" tbody .info");
	if(selected_c.length){
		var sure;
		if(event.ctrlKey || event.metaKey) sure = true
		else sure = confirm("Are you sure?");
		if(sure)
			selected_c.each( function(){
				if($(this).data("id"))
				 	$.ajax({
						type: "DELETE",
				      	url: "/"+table_name+"s/" + $(this).data("id"),
				       	timeout: 5000,
				       	success: function(data, requestStatus, xhrObject){ delRow(data); },
				       	error: function(xhrObj, textStatus, exception) {
				       		$("#title_"+table_name).notify("Failed to delete data!", {arrowShow: false, className: "error", position:"right middle"});
				       	}
					})   
				else delRow();
			});
	}
	selected_c = -1;
}

function saveData(){
	if(selected_c.length || selected_c == -1){
		var attr = [];
		var err = false;
		config.edit.forEach(function(val, idx) {
		    if(val != "x"){
				var field = $("#" + table_name + "_field" + idx);
				var item = "";
				if(field.val()) item = field.val().trim();
				if(item == "" && (["I", "D"].indexOf(val) != -1)){ 
					err = true;
					field.addClass("err");
					$("#title_"+table_name).notify("Please enter missing items.", {arrowShow: false, className: "error", position:"right middle"});
				} else field.removeClass("err");
				attr.push(item);
		    }
		});
		if(!err){
			if(selected_c != -1 && selected_c.data("id"))
				$.ajax({
					type: "PUT",
					url: "/"+table_name+"s/" + selected_c.data("id"),
					data: {"attr": attr},
					timeout: 5000,
				    success: function(data, requestStatus, xhrObject){
				    	saveRow(data);
				    	saveForeign(attr[attr.length-1], data.original);
				    },
				    error: function(xhrObj, textStatus, exception) {
						$("#title_"+table_name).notify("Failed to save data!", {arrowShow: false, className: "error", position:"right middle"});
				    }
				})
			else
				$.ajax({
					type: "POST",
					url: "/"+table_name+"s/",
					data: {"attr": attr, "id": $("#donorId").text()}, 
					timeout: 5000,
				    success: function(data, requestStatus, xhrObject){
				    	saveRow(data);
				    	saveForeign(attr[attr.length-1], data.original);
				    },
				    error: function(xhrObj, textStatus, exception) {
						$("#title_"+table_name).notify("Failed to add data!", {arrowShow: false, className: "error", position:"right middle"});
				    }
				});
		}
	}
}

this.tab = table_c;
this.foreign_key = function(key){
	foreign_key = key;
}
this.foreign_tab = function(tab){
	foreign_tab = tab;
}
this.foreign_col = function(row){
	foreign_col = row;
}

};

$(document).ready(function(){
	var tabc = new nypTable("contact", {norder: [3], sort: [[ 0, "desc" ], [ 1, "desc" ]], edit: ["D","d","I","b"] });
	var tabf = new nypTable("finance", {norder: [5], sort: [[1, "desc"], [2, "desc"]], edit: ["I","D","I","i","i","b"] });
	tabc.foreign_key("finance");
	tabc.foreign_tab(tabf.tab);
	tabc.foreign_col([1,2,0]);
	tabf.foreign_key("contact");
	tabf.foreign_tab(tabc.tab);
	tabf.foreign_col([0,2]);
});
