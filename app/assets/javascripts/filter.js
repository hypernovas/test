$(document).ready(function() {
    if ( $.fn.dataTable.isDataTable( '#filter_tab' ) ) {
    	Filworker.table = $('#filter_tab').DataTable();
		}
		else {
    	Filworker.table = $('#filter_tab').DataTable( {
        "ordering": false,
        "drawCallback": function( settings ) {
        //topRow();
    		},
    		"dom": 'lrtip'
    	});
		}
		
	$("#filter-panel #add").click(Filworker.insRow);
	$("#filter-panel #edit").click(Filworker.editRow);
	$("#filter-panel #delete").click(Filworker.delData);
	$("#filter-panel #save").click(Filworker.saveData);
	$("#filter-panel #cancel").click(Filworker.cncRow);
  	$("#filter_tab tbody").on("click", "tr", Filworker.selRow);
} );


var Filworker = {
	selected: null,
	original: null,
	table: null,
	//insert new row at first row and config it
	insRow : function(){
		if(!$("#add").hasClass("adding")){
			$("#add").addClass("adding");
			var row = Filworker.table.row.add(["","","","","","",""]).draw().node();
			$(row).addClass("selected").siblings().removeClass("selected");
			
			//reset buttons
		  	$("#save").show();
			$("#cancel").show();
			$("#edit").hide();
			$("#delete").hide();
			$("#add").hide();
			//
			Filworker.addRow($(row));
			Filworker.topRow();
	  }
	},
	
	//config the new added row for operating
	addRow: function(J_row) {
		if(J_row) Filworker.selected = J_row;
		else      
			$("#add")
		     .notify("Failed to add a new line!", {gap: 20, arrowShow: false, className: "error", position:"left middle"});//Filworker.selected = $("#filter_tab tbody .selected").first();
		
		Filworker.cofNewRow();
	},
	
	cofNewRow: function(){
		
		if(Filworker.selected.length){
			var cells_sel_tab = $("td", Filworker.selected).slice(0, 1);
			var cells_sel_fld = $("td", Filworker.selected).slice(1, 2);
			var cells_inp = $("td", Filworker.selected).slice(2, 5);
			var cells_date = $("td", Filworker.selected).slice(5, 7);
				
			cells_sel_tab.each(function(){
			if($("select", $(this)).length == 0)
				$(this).html("<select id='selectpicker-tab' class='selectpicker'>"+
							"<option data-hidden='true' value=''>Choose the table name...</option>" +
	  						"<option value='donor'>Donor</option>"+
							"<option value='contact'>Contact</option>"+
							"<option value='finance'>Finance</option>"+
							"</select>"
				);
			});
				
			cells_sel_fld.each(function(){
				if($("select", $(this)).length == 0)
					$(this).html("<select id='selectpicker-fld' class='selectpicker'>"
								+"<option class='bs-title-option' value='placeholder'>Choose a Table name first!</option>"
            					+ "</select>"	
					);
				});
				
			cells_inp.each(function(){
				if($("input", $(this)).length == 0)
					$(this).html("<input style='width:100%;' value='"+$(this).html().trim()+"'>");
			});
				
			cells_date.each(function(){
				if($("input", $(this)).length == 0)
					$(this).html("<input style='width:100%;' type='text' class='datepicker'>");
			});
			$('.selectpicker').selectpicker();
			$('.datepicker').datepicker({
				format: 'yyyy-mm-dd',
				autoclose: true});
			//config the datepicking
			//Filworker.choDate(cells_date[0], cells_date[1]);
		}
		
			//dynamic field select
		$('.selectpicker#selectpicker-tab').change(function(){
							
		    var selected = $(this).find("option:selected").val();
		    $('.selectpicker#selectpicker-fld').find('[value=placeholder]').remove();
		    //alert(selected);
		    switch (selected) {
		      case 'contact':
		        $('.selectpicker#selectpicker-fld').selectpicker('toggle');
		        $('.selectpicker#selectpicker-fld')
							.html("<option data-hidden='true' value=''>Choose the field name...</option>" 
								+'<option value="contact_date">Contact Date</option>'
								+'<option value="followup_date">Followup Date</option>'
								+'<option value="narrative">Narrative</option>'
								+'<option value="created_by">Create by (Person)</option>'
								+'<option value="last_modified_by">Last Modified by (Person)</option>'
								+'<option value="created_at">Created at (Date)</option>'
								+'<option value="last_modified_at">Last Modified at (Date)</option>')
							.selectpicker('refresh');
		        break;
		        
		      case 'donor':
		        $('.selectpicker#selectpicker-fld').selectpicker('toggle');
		        $('.selectpicker#selectpicker-fld')
							.html("<option data-hidden='true' value=''>Choose the field name...</option>" 
								  +'<option value="title">Title</option>'
							      +'<option value="first_name">First Name</option>'
							      +'<option value="last_name">Last Name</option>'
							      +'<option value="middle_name">Middle Name</option>'
							      +'<option value="salution">Salution</option>'
							      +'<option value="email">Email</option>'
							      +'<option value="organization">Organization</option>'
							      +'<option value="company">Company</option>'
							      +'<option value="street_address">Street Address</option>'
							      +'<option value="city">City</option>'
							      +'<option value="state">State</option>'
							      +'<option value="country">Country</option>'
							      +'<option value="zipcode">Zip Code</option>'
							      +'<option value="home_phone">Home Phone</option>'
							      +'<option value="business_phone">Business Phone</option>'
							      +'<option value="created_by">Create by (Person)</option>'
							      +'<option value="last_modified_by">Last Modified by (Person)</option>'
							      +'<option value="created_at">Created at (Date)</option>'
							      +'<option value="last_modified_at">Last Modified at (Date)</option>'
							      +'<option value="active">Active</option>')
							.selectpicker('refresh');
		        break;
		        
		      case 'finance':
		        $('.selectpicker#selectpicker-fld').selectpicker('toggle');
		        $('.selectpicker#selectpicker-fld')
							.html("<option data-hidden='true' value=''>Choose the field name...</option>" 
								+'<option value="_type">Type</option>'
						        +'<option value="date">Date</option>'
						        +'<option value="amount">Amount</option>'
						        +'<option value="description">Description</option>'
						        +'<option value="designation">Designation</option>'
						        +'<option value="created_by">Create by (Person)</option>'
						        +'<option value="last_modified_by">Last Modified by (Person)</option>'
						        +'<option value="created_at">Created at (Date)</option>'
						        +'<option value="last_modified_at">Last Modified at (Date)</option>')
							.selectpicker('refresh');
		        break;
		      
		      default:
		        return false;
		    }
		});
	},
	
	cncRow: function(){
        // new row
        if ($("#add").hasClass("adding") && !$("#edit").hasClass("editing")){
	        Filworker.table.row(Filworker.selected).remove().draw(false);
            Filworker.reBtn();
        }
        // edit row
        else if($("#edit").hasClass("editing") && !$("#add").hasClass("adding")){
	        var row = Filworker.table.row(Filworker.selected)
	        row.data(Filworker.original).draw();
          Filworker.reBtn();
        }
      
	}
	,
	
	reBtn: function(){
		$("#add").removeClass("adding");
		$("#edit").removeClass("editing");
		$("#add").show();
		$("#edit").show();
		$("#delete").show();
		$("#cancel").hide();
		$("#save").hide();
	},
	
	editRow: function(){
		if($("#filter_tab tr").hasClass("selected") && !$("#filter_tab td").hasClass("dataTables_empty")){
			Filworker.original = Filworker.save_raw_row();
			$("#edit").addClass("editing");
			Filworker.selected = $("#filter_tab tr.selected")
			Filworker.cofEditRow();
			
			//reset btn
			$("#add").hide();
			$("#edit").hide();
			$("#save").show();
			$("#cancel").show();
			$("#delete").hide();
		}
		
	},
	
	cofEditRow: function(){
		
		if(Filworker.selected.length){
			var cells_sel_tab = $("td", Filworker.selected).slice(0, 1);
			var cells_sel_fld = $("td", Filworker.selected).slice(1, 2);
			var cells_inp = $("td", Filworker.selected).slice(2, 5);
			var cells_date = $("td", Filworker.selected).slice(5, 7);
				
			cells_sel_tab.each(function(){
				if($("select", $(this)).length == 0)
					$(this).html("<select id='selectpicker-tab' class='selectpicker'>"+
						"<option data-hidden='true' value=''>Choose the table name...</option>" +
	  					"<option value='donor'>Donor</option>"+
						"<option value='contact'>Contact</option>"+
						"<option value='finance'>Finance</option>"+
						"</select>"
					);
			});
				
			cells_sel_fld.each(function(){
				if($("select", $(this)).length == 0)
					$(this).html("<select id='selectpicker-fld' class='selectpicker'>"
					+ "<option data-hidden='true' value=''>Choose the field name...</option>"
                    + "</select>"	
				);
			});
				
			cells_inp.each(function(){
				if($("input", $(this)).length == 0)
					$(this).html("<input style='width:100%;' value='"+$(this).html().trim()+"'>");
			});
				
			cells_date.each(function(){
				if($("input", $(this)).length == 0)
					$(this).html("<input style='width:100%;' type='text' class='datepicker'>");
			});
			$('.selectpicker').selectpicker();
			$('.datepicker').datepicker({
				format: 'yyyy-mm-dd',
				autoclose: true});
			//config the datepicking
			//Filworker.choDate(cells_date[0], cells_date[1]);
		}
		
		Filworker.editFld(cells_sel_tab,cells_sel_fld,cells_date);
		
		//dynamic field select
		$('.selectpicker#selectpicker-tab').change(function(){
							
		    var selected = $(this).find("option:selected").val();
		    $('.selectpicker#selectpicker-fld').find('[value=placeholder]').remove();
		    //alert(selected);
		    switch (selected) {
		      case 'contact':
		        $('.selectpicker#selectpicker-fld').selectpicker('toggle');
		        $('.selectpicker#selectpicker-fld')
					.html("<option data-hidden='true' value=''>Choose the field name...</option>" 
						+'<option value="contact_date">Contact Date</option>'
						+'<option value="followup_date">Followup Date</option>'
						+'<option value="narrative">Narrative</option>'
						+'<option value="created_by">Create by (Person)</option>'
						+'<option value="last_modified_by">Last Modified by (Person)</option>'
						+'<option value="created_at">Created at (Date)</option>'
						+'<option value="last_modified_at">Last Modified at (Date)</option>')
					.selectpicker('refresh');
		        break;
		        
		      case 'donor':
		        $('.selectpicker#selectpicker-fld').selectpicker('toggle');
		        $('.selectpicker#selectpicker-fld')
					.html("<option data-hidden='true' value=''>Choose the field name...</option>" 
				    	+'<option value="title">Title</option>'
				    	+'<option value="first_name">First Name</option>'
				    	+'<option value="last_name">Last Name</option>'
				    	+'<option value="middle_name">Middle Name</option>'
				    	+'<option value="salution">Salution</option>'
				    	+'<option value="email">Email</option>'
				    	+'<option value="organization">Organization</option>'
				    	+'<option value="company">Company</option>'
				    	+'<option value="street_address">Street Address</option>'
				    	+'<option value="city">City</option>'
				    	+'<option value="state">State</option>'
				    	+'<option value="country">Country</option>'
				    	+'<option value="zipcode">Zip Code</option>'
				    	+'<option value="home_phone">Home Phone</option>'
				    	+'<option value="business_phone">Business Phone</option>'
				    	+'<option value="created_by">Create by (Person)</option>'
				    	+'<option value="last_modified_by">Last Modified by (Person)</option>'
				    	+'<option value="created_at">Created at (Date)</option>'
				    	+'<option value="last_modified_at">Last Modified at (Date)</option>')
					.selectpicker('refresh');
		        break;
		        
		      case 'finance':
		        $('.selectpicker#selectpicker-fld').selectpicker('toggle');
		        $('.selectpicker#selectpicker-fld')
					.html("<option data-hidden='true' value=''>Choose the field name...</option>" 
						+'<option value="type">Type</option>'
					    +'<option value="date">Date</option>'
					    +'<option value="amount">Amount</option>'
					    +'<option value="description">Description</option>'
					    +'<option value="designation">Designation</option>'
					    +'<option value="created_by">Create by (Person)</option>'
					    +'<option value="last_modified_by">Last Modified by (Person)</option>'
					    +'<option value="created_at">Created at (Date)</option>'
					    +'<option value="last_modified_at">Last Modified at (Date)</option>')
					.selectpicker('refresh');
		        break;
		      
		      default:
		        return false;
		    }
			});
		
	},
	
	editFld :function(a,b,c){
		var table1 = Filworker.original[0].trim().toLowerCase();
		console.log(table1.trim())
		$("select",a).selectpicker('val', table1);
		
		var selected = $("select",a).find("option:selected").val();
		    switch (selected) {
		      case 'contact':
		        $('.selectpicker#selectpicker-fld').selectpicker('toggle');
		        $('.selectpicker#selectpicker-fld')
					.html("<option data-hidden='true' value=''>Choose the field name...</option>" 
						+'<option value="contact_date">Contact Date</option>'
						+'<option value="followup_date">Followup Date</option>'
						+'<option value="narrative">Narrative</option>'
						+'<option value="created_by">Create by (Person)</option>'
						+'<option value="last_modified_by">Last Modified by (Person)</option>'
						+'<option value="created_at">Created at (Date)</option>'
						+'<option value="last_modified_at">Last Modified at (Date)</option>')
					.selectpicker('refresh');
		        break;
		        
		      case 'donor':
		        $('.selectpicker#selectpicker-fld').selectpicker('toggle');
		        $('.selectpicker#selectpicker-fld')
					.html("<option data-hidden='true' value=''>Choose the field name...</option>" 
						+'<option value="title">Title</option>'
						+'<option value="first_name">First Name</option>'
						+'<option value="last_name">Last Name</option>'
						+'<option value="middle_name">Middle Name</option>'
						+'<option value="salution">Salution</option>'
						+'<option value="email">Email</option>'
						+'<option value="organization">Organization</option>'
						+'<option value="company">Company</option>'
						+'<option value="street_address">Street Address</option>'
						+'<option value="city">City</option>'
						+'<option value="state">State</option>'
						+'<option value="country">Country</option>'
						+'<option value="zipcode">Zip Code</option>'
						+'<option value="home_phone">Home Phone</option>'
						+'<option value="business_phone">Business Phone</option>'
						+'<option value="created_by">Create by (Person)</option>'
						+'<option value="last_modified_by">Last Modified by (Person)</option>'
						+'<option value="created_at">Created at (Date)</option>'
						+'<option value="last_modified_at">Last Modified at (Date)</option>')
					.selectpicker('refresh');
		        break;
		        
		      case 'finance':
		        $('.selectpicker#selectpicker-fld').selectpicker('toggle');
		        $('.selectpicker#selectpicker-fld')
					.html("<option data-hidden='true' value=''>Choose the field name...</option>" 
						+'<option value="type">Type</option>'
						+'<option value="date">Date</option>'
						+'<option value="amount">Amount</option>'
						+'<option value="description">Description</option>'
						+'<option value="designation">Designation</option>'
						+'<option value="created_by">Create by (Person)</option>'
						+'<option value="last_modified_by">Last Modified by (Person)</option>'
						+'<option value="created_at">Created at (Date)</option>'
						+'<option value="last_modified_at">Last Modified at (Date)</option>')
					.selectpicker('refresh');
		        break;
		      
		      default:
		        return false;
		    
		    }
		    
	   var field1 = Filworker.original[1].trim().toLowerCase().split(' ').join('_');
		$("select",b).selectpicker('val', field1); 
		
		var min_date1 = Filworker.original[5].trim();
		$("input",c[0]).datepicker('update', min_date1);
		
		var max_date1 = Filworker.original[6].trim();
		$("input",c[1]).datepicker('update', max_date1); 
	},
	
	
	save_raw_row :function(){
		Filworker.selected= $("#filter_tab tr.selected")
		if(Filworker.selected.length){
			var row_con = [];
			$("td",Filworker.selected).each(function(){
				var cell_con =$(this).text();
				row_con.push(cell_con);
			});
		}
		return row_con;
	},
	
	saveData: function(){
		if($("#add").hasClass("adding") || $("#edit").hasClass("editing")){
			if(Filworker.selected.length){
			var attr = [];
			var cells_sel_tab = $("td", Filworker.selected).slice(0, 1);
			cells_sel_tab.each(function(){
				attr.push($("select", $(this)).val());
			});
		
			var cells_sel_fld = $("td", Filworker.selected).slice(1, 2);
			cells_sel_fld.each(function(){
				var fld=$("select", $(this)).val();
				attr.push(fld);
			});
		
			var cells_inp = $("td", Filworker.selected).slice(2, 5);
			cells_inp.each(function(){
				attr.push($("input", $(this)).val());
			});
		
			var cells_date = $("td", Filworker.selected).slice(5, 7);
			cells_date.each(function(){
				attr.push($("input", $(this)).val());
			});
		
			if(attr[0] == ""){ 
				$("#add").notify("Please select the Table.", {gap: 290, arrowShow: false, className: "error", position:"left middle"});
				return false;
			}
			if(attr[1] == ""){ 
				$("#back").notify("Please select the Field.", {gap: 290, arrowShow: false, className: "error", position:"left middle"});
				return false;
			}
			if(Filworker.selected.data("id"))
				$.ajax({
					type: "PUT",
					url: "/filters/" + Filworker.selected.data("id"),
					data: {"attr": attr},
			  	success: function(data, requestStatus, xhrObject){ Filworker.saveRow(data); },
			    error: function(xhrObj, textStatus, exception) {
					$("#add").notify("Failed to save data!", {arrowShow: false, className: "error", position:"left middle"});
			  }
			})
			else
				$.ajax({
					type: "POST",
					url: "/filters/",
					data: {"attr": attr, "id": $("#ReportId").text()},
			    success: function(data, requestStatus, xhrObject){ Filworker.saveRow(data); },
			    error: function(xhrObj, textStatus, exception) {
					$("#add").notify("Failed to add data!", {arrowShow: false, className: "error", position:"left middle"});
			  }
			})
		}
		}
	},
	
  saveRow: function(data){
	if(data.id) Filworker.selected.data("id", data.id);
	
	Filworker.table.row(Filworker.selected).data([
		data.table_name,
		data.field_name,
		data.value,
		data.min_value,
		data.max_value,
		data.min_date,
		data.max_date
	]).draw();
	
	Filworker.selected.removeClass("selected");

  //reset button
	Filworker.reBtn();
	
	$("#add").notify("Successfully saved!", {arrowShow: false, className: "success", position:"left middle"});
	
},

	
	topRow : function(){
		if($("#add").hasClass("adding")){
			Filworker.selected.detach();
			$("#filter_tab tbody").prepend(Filworker.selected);
		//Filworker.selected.addClass("selected").siblings().removeClass("selected");
		}
	},
	
	selRow: function(event){
		if (!$("#add").hasClass("adding") && !$("#edit").hasClass("editing")){
			if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
            Filworker.table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
		}
	},
	
	delRow: function(){

	  Filworker.table.row('.selected').remove().draw(false);
	  $("#add").notify("Successfully deleted!", {arrowShow: false, className: "success", position:"left middle"});
	},
	
	delData :function(){
		Filworker.selected = $("#filter_tab tbody .selected")
		if(Filworker.selected.length){
			var sure = confirm("Are you Sure?");
			if (sure){
				Filworker.selected.each(function(){
					if ($(this).data("id"))
							$.ajax({
								type: "DELETE",
								url : "/filters/"+$(this).data("id"),
								timeout: 5000,
								success: function(data, requestStatus, xhrObject){Filworker.delRow();},
								error: function(xhrObj, textStatus, exception){
									$("#add").notify("Failed to delete data!", {gap: 20, arrowShow: false, className: "error", position:"left middle"});
								}
							})
				});
			}
		}
	},
	
	choDate : function(a,b){
		var d1 = a.datepicker({
			format: 'yyyy-mm-dd',
			autoclose: true
		});
		
		var d2 = b.datepicker({
			format: 'yyyy-mm-dd',
			autoclose: true
		})
	},
};




