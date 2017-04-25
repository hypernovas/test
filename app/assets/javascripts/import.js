$(document).ready(function(){
	Selector.table = $('#selector-table').DataTable({
		ordering: false,
		dom:'t',
		"language":{
			"zeroRecords":"",
			"emptyTable":"",
			"infoEmpty":""
		}
	});
	$('#selector-panel #add').click(Selector.insRow);
  	$('#selector-panel #edit').click(Selector.editRow);
  	$('#selector-panel #delete').click(Selector.delRow);
  	$("#selector-panel #cancel").click(Selector.cncRow);
  	$("#selector-panel #save").click(Selector.saveRow);
  	$("#selector-table tbody").on("click", "tr", Selector.selRow);
  	Uploader.listener();
  	Importer.listener();
  }
);

var Uploader = {
	listener: function(){
		
		var progressbox     = $('#progressbox');
	    var progressbar     = $('#progressbar');
	    var statustxt   = $('#statustxt');
	    var uploadButton    = $("#uploadBtn");
	    var output  = $("#output");
	    var uploadForm = $('#upload-form')
	    var completed   = '0%';
		
		$(uploadForm).ajaxForm({
	  		beforeSend: function() {
	  			uploadButton.attr('disabled','');
	            statustxt.empty();
	            progressbox.show();
	            progressbar.width(completed);
	            statustxt.html(completed);
	            statustxt.css('color','#000'); //initial color of status text
	        },
	        uploadProgress: function(event, position, total, percentComplete) {
	            progressbar.width(percentComplete + '%') //update progressbar percent complete
	            statustxt.html(percentComplete + '%'); //update status text
	            if(percentComplete>50) {
	                statustxt.css('color','#fff'); //change status text to white after 50%
	            }
	        },
	        complete: function(response) { // on complete
	        	uploadButton.notify(response.responseText,{gap: 20, arrowShow: false, className: "success", position:"left middle"}); //update element with received data
	            uploadForm.resetForm();  // reset form
	            uploadButton.removeAttr('disabled'); //enable submit button
	            progressbox.hide(); // hide progressbar
	        },
	        success: function(response){
	        	uploadButton.notify(response.responseText,{gap: 20, arrowShow: false, className: "success", position:"left middle"}); //update element with received data
	        }
	  	}).submit(function(e){
		    return false;
		});
	}
}

var Importer = {
	listener: function(){
		$("#import-btn").click(function(event){
			var selector_data = {};
			selector_data['selector'] = [];
			$("#selector-table tbody tr").map(function() {
			  // Within tr we find the last td child element and get content
			 selector_data['selector'].push($(this).find("td").map(function(){
			    return($(this).html())
			  }).get())
			});
			console.log(selector_data);
	  		$.ajax({
	  			url: $(this).attr('href'),
	  			type: 'POST',
	  			dataType: 'json',
	  			data: selector_data,
	  			success: function(data,status,xhr){
	  				console.log(xhr.status)
	  				switch (data["status"]){
	  					case 0:
	  						$('#import-btn').notify('Successfully imported!',{gap: 20, arrowShow: false, className: "success", position:"left middle"});
	  						break;
	  					case 1:
	  						$('#import-btn').notify('No file uploaded!',{gap: 20, arrowShow: false, className: "error", position:"left middle"});
	  						break;
	  					case 2:
	  						$('#import-btn').notify('No field specified!',{gap: 20, arrowShow: false, className: "error", position:"left middle"});
	  						break;
	  					case 3:
	  						$('#import-btn').notify('Import failed! Please check the file again',{gap: 20, arrowShow: false, className: "error", position:"left middle"});
	  						break;	
	  				}
	  				
	  			},
	  			error: function(xhr,status){
	  				console.log(xhr.status)
	  				$('#import-btn').notify('Failed to import! Please try again or contact the admin',{gap: 20, arrowShow: false, className: "error", position:"left middle"});
	  			}
	  		})
	  		
	  		return false;
	  	});
	  	
	}
}

var Selector = {
	selected: null,
	table: null,
	original: null,
	selRow: function(event){
		if (!$("#add").hasClass("adding") && !$("#edit").hasClass("editing")){
			if ( $(this).hasClass('selected') ) {
	            $(this).removeClass('selected');
	        }
	        else {
	            Selector.table.$('tr.selected').removeClass('selected');
	            $(this).addClass('selected');
	        }
		}
	},
	insRow: function(){
		var add = $('#selector-panel #add');
		if(!add.hasClass("adding")){
			add.addClass("adding");
			var row = Selector.table.row.add(["",""]).draw().node();
			$(row).addClass("selected").siblings().removeClass("selected");
			
			//reset buttons
		  	$("#save").show();
			$("#cancel").show();
			$("#edit").hide();
			$("#delete").hide();
			$("#add").hide();
			
			Selector.addRow($(row));
	  }
	},
	editRow: function(){
		if($("#selector-table tr").hasClass("selected") && !$("#selector-table td").hasClass("dataTables_empty")){
			Selector.original = Selector.save_raw_row();
			$("#edit").addClass("editing");
			Selector.selected = $("#selector-table tr.selected")
			Selector.cofEditRow();
			
			//reset btn
			$("#add").hide();
			$("#edit").hide();
			$("#save").show();
			$("#cancel").show();
			$("#delete").hide();
		}
		
	},
	delRow: function(){
		Selector.table.row('.selected').remove().draw(false);
	},
	//config the new added row for operating
	addRow: function(J_row) {
		if(J_row) Selector.selected = J_row;
		else      
			$("#add")
		     .notify("Failed to add a new line!", {arrowShow: false, className: "error", position:"left middle"});
		Selector.cofNewRow();
	},
	cofNewRow: function(){
		if(Selector.selected.length){
			var cells_sel_tab = $("td", Selector.selected).slice(0,1);
			var cells_sel_fld = $("td", Selector.selected).slice(1,2);
				
			cells_sel_tab.each(function(){
				if($("select", $(this)).length == 0)
					$(this).html("<select id='selector-tab' class='selectpicker'>"+
								"<option data-hidden='true' value=''>Choose the table name...</option>" +
		  						"<option value='donor'>Donor</option>"+
								"<option value='contact'>Contact</option>"+
								"<option value='finance'>Finance</option>"+
								"</select>"
					);
			});
				
			cells_sel_fld.each(function(){
				if($("select", $(this)).length == 0)
					$(this).html("<select id='selector-fld' class='selectpicker'>"
								+"<option class='bs-title-option' value='placeholder'>Choose a Table name first!</option>"
            					+ "</select>"	
					);
				});
			
			$('.selectpicker').selectpicker();
		}
		//dynamic field select
		$('.selectpicker#selector-tab').change(function(){
		    var selected = $(this).find("option:selected").val();
		    $('.selectpicker#selector-fld').find('[value=placeholder]').remove();
		    switch (selected) {
		      case 'contact':
		        $('.selected .selectpicker#selector-fld').selectpicker('toggle');
		        $('.selected .selectpicker#selector-fld')
							.html("<option data-hidden='true' value=''>Choose the field name...</option>" 
								+'<option value="contact_date">Contact Date</option>'
								+'<option value="followup_date">Followup Date</option>'
								+'<option value="narrative">Narrative</option>')
							.selectpicker('refresh');
		        break;
		        
		      case 'donor':
		        $('.selectpicker#selector-fld .selected').selectpicker('toggle');
		        $('.selectpicker#selector-fld')
							.html("<option data-hidden='true' value=''>Choose the field name...</option>" 
								  +'<option value="role">Role</option>'
								  +'<option value="title">Title</option>'
							      +'<option value="first_name">First Name</option>'
							      +'<option value="last_name">Last Name</option>'
							      +'<option value="middle_name">Middle Name</option>'
							      +'<option value="spouse">Spouse</option>'
							      +'<option value="salution">Salution</option>'
							      +'<option value="email">Email</option>'
							      +'<option value="organization">Organization</option>'
							      +'<option value="company">Company</option>'
							      +'<option value="street_address">Street Address</option>'
							      +'<option value="street_address_2">Street Address 2</option>'
							      +'<option value="city">City</option>'
							      +'<option value="state">State</option>'
							      +'<option value="country">Country</option>'
							      +'<option value="zipcode">Zipcode</option>'
							      +'<option value="home_phone">Home Phone</option>'
							      +'<option value="business_phone">Business Phone</option>'
							      +'<option value="note">Note</option>')
							.selectpicker('refresh');
		        break;
		        
		      case 'finance':
		        $('.selectpicker#selector-fld .selected').selectpicker('toggle');
		        $('.selectpicker#selector-fld')
							.html("<option data-hidden='true' value=''>Choose the field name...</option>" 
								+'<option value="_type">Type</option>'
						        +'<option value="date">Date</option>'
						        +'<option value="amount">Amount</option>'
						        +'<option value="description">Description</option>'
						        +'<option value="designation">Designation</option>')
							.selectpicker('refresh');
		        break;
		      
		      default:
		        return false;
		    }
		});
	},
	cofEditRow: function(){
		if(Selector.selected.length){
			var cells_sel_tab = $("td", Selector.selected).slice(0, 1);
			var cells_sel_fld = $("td", Selector.selected).slice(1, 2);
			var cells_inp = $("td", Selector.selected).slice(2, 5);
			var cells_date = $("td", Selector.selected).slice(5, 7);
				
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
		
		Selector.editFld(cells_sel_tab,cells_sel_fld,cells_date);
		
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
								+'<option value="narrative">Narrative</option>')
					.selectpicker('refresh');
		        break;
		        
		      case 'donor':
		        $('.selectpicker#selectpicker-fld').selectpicker('toggle');
		        $('.selectpicker#selectpicker-fld')
					.html("<option data-hidden='true' value=''>Choose the field name...</option>" 
						+'<option value="role">Role</option>'
						+'<option value="title">Title</option>'
						+'<option value="first_name">First Name</option>'
						+'<option value="last_name">Last Name</option>'
						+'<option value="middle_name">Middle Name</option>'
						+'<option value="spouse">Spouse</option>'
						+'<option value="salution">Salution</option>'
						+'<option value="email">Email</option>'
						+'<option value="organization">Organization</option>'
						+'<option value="company">Company</option>'
						+'<option value="street_address">Street Address</option>'
						+'<option value="street_address_2">Street Address 2</option>'
						+'<option value="city">City</option>'
						+'<option value="state">State</option>'
						+'<option value="country">Country</option>'
						+'<option value="zipcode">Zipcode</option>'
						+'<option value="home_phone">Home Phone</option>'
						+'<option value="business_phone">Business Phone</option>'
						+'<option value="note">Note</option>')
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
						        +'<option value="designation">Designation</option>')
					.selectpicker('refresh');
		        break;
		      
		      default:
		        return false;
		    }
		});
	},
	editFld :function(a,b,c){
		var table1 = Selector.original[0].trim().toLowerCase();
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
								+'<option value="narrative">Narrative</option>')
					.selectpicker('refresh');
		        break;
		        
		      case 'donor':
		        $('.selectpicker#selectpicker-fld').selectpicker('toggle');
		        $('.selectpicker#selectpicker-fld')
					.html("<option data-hidden='true' value=''>Choose the field name...</option>" 
						+'<option value="role">Role</option>'
						+'<option value="title">Title</option>'
						+'<option value="first_name">First Name</option>'
						+'<option value="last_name">Last Name</option>'
						+'<option value="middle_name">Middle Name</option>'
						+'<option value="spouse">Spouse</option>'
						+'<option value="salution">Salution</option>'
						+'<option value="email">Email</option>'
						+'<option value="organization">Organization</option>'
						+'<option value="company">Company</option>'
						+'<option value="street_address">Street Address</option>'
						+'<option value="street_address_2">Street Address 2</option>'
						+'<option value="city">City</option>'
						+'<option value="state">State</option>'
						+'<option value="country">Country</option>'
						+'<option value="zipcode">Zipcode</option>'
						+'<option value="home_phone">Home Phone</option>'
						+'<option value="business_phone">Business Phone</option>'
						+'<option value="note">Note</option>')
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
						        +'<option value="designation">Designation</option>')
					.selectpicker('refresh');
		        break;
		      
		      default:
		        return false;
		    
		    }
		    
		var field1 = Selector.original[1].trim().toLowerCase().split(' ').join('_');
		$("select",b).selectpicker('val', field1); 
		
	},
	cncRow: function(){
        // new row
        if ($("#add").hasClass("adding") && !$("#edit").hasClass("editing")){
	        Selector.table.row(Selector.selected).remove().draw(false);
            Selector.reBtn();
        }
        // edit row
        else if($("#edit").hasClass("editing") && !$("#add").hasClass("adding")){
	        var row = Selector.table.row(Selector.selected)
	        row.data(Selector.original).draw();
          	Selector.reBtn();
        }
	},
	reBtn: function(){
		$("#add").removeClass("adding");
		$("#edit").removeClass("editing");
		$("#add").show();
		$("#edit").show();
		$("#delete").show();
		$("#cancel").hide();
		$("#save").hide();
	},
	save_raw_row :function(){
		Selector.selected = $("#selector-table tr.selected")
		if(Selector.selected.length){
			var row_con = [];
			$("td",Selector.selected).each(function(){
				var cell_con =$(this).text();
				row_con.push(cell_con);
			});
		}
		return row_con;
	},
	saveRow: function(){
		var selects = Selector.selected.find('.selectpicker')
		for(var i=0;i<selects.length;i++){
			var select = selects.slice(i,i+1)
			select.parents('td').html(select.find("option:selected").text())
		}
		Selector.selected.removeClass('selected')
		Selector.reBtn()
	}
}

var ImportTool = {
	import: function(event){
		event.preventDefault();
  		$.ajax({
  			url: $(this).attr('href'),
  			type: 'post',
  			dataType:'json',
  			success: function(data){
  				console.log(data)
  				$(this).notify('Successfully imported!',{gap: 20, arrowShow: false, className: "success", position:"left middle"})
  			},
  			error: function(){
  				$(this).notify('Failed to import! Please try again or contact the admin',{gap: 20, arrowShow: false, className: "error", position:"left middle"})
  			}
  		})
	}
}