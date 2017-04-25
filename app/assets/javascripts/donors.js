var donorInfo = {
  setup: function(){
    $('#donorInfo').on('ajax:success',function(event,data,status,xhr){
      $('#summary-table tbody').html(data);
      $("#basic-submit").notify("Successfully saved", {className: "success", position:"left middle"});
    });
    $('#donorInfo').on('ajax:error',function(event,xhr,status,error){
      $("#basic-submit").notify("Error occurred, please try later...", {className: "error", position:"left middle"});
    });
  }
};

$(donorInfo.setup);

var newDonorInfo = {
  setup: function(){
     $('#newDonorInfo').on('ajax:success',function(event,data,status,xhr){
      $('#donorId').text(data.id);
      $("#basic-submit").notify("Successfully saved", {className: "success", position:"left middle"});
    });
    $('#newDonorInfo').on('ajax:error',function(event,xhr,status,error){
      $("#basic-submit").notify("Error occurred, please try later...", {className: "error", position:"left middle"});
    });
  }
}

$(newDonorInfo.setup);

var donorDataTable = {
  setup: function(){
    // DataTable
    var table = $('#table_donor').DataTable({
      "bStateSave": true,
      aoColumns :[
          { "sTitle": "Action","bSortable": false },
          { "sTitle": "Flag","bSortable": false, },
          { "sTitle": "Title", "bSortable": false,},
          { "sTitle": "First Name", "bSortable": true,},
          { "sTitle": "Last Name", "bSortable": true,},
          { "sTitle": "Organization ", "bSortable": true},
          { "sTitle": "Company ", "bSortable": true}
        ],
      fnDrawCallback: function(){
        summaryInfo.setup();
      },
      aaSorting: [3,'asc']
    });
    
    
    $('#table_donor tbody').on('click', 'tr', function(){
      if (!$('#table_donor').hasClass('locked')){
        if ( $(this).hasClass('selected') ) {
          $(this).removeClass('selected');
        }else {
          $('tr.selected').removeClass('selected');
          $(this).addClass('selected');
        }
      }
    });
      
    // append column search box
    $('#table_donor tfoot th.filter').each( function () {
        var title = $(this).text();
        $(this).html( '<input type="text" placeholder=" '+title+'" />' );
    } );
    
    // apply column search
    table.columns().every( function () {
        var that = this;
        $( 'input', this.footer() ).on( 'keyup change', function () {
            if ( that.search() !== this.value ) {
                that
                    .search( this.value )
                    .draw(false);
            }
        } );
    } );
  
    var original_row;
    
    //  quick edit row
     $('#donor-result #quick_edit').on( 'click', function (e) {
        if (!$('#table_donor').hasClass('locked')){
          if ($('#table_donor tr').hasClass('selected')){
            original_row = save_raw_data();
            $('#table_donor').addClass('locked');
            $('#table_donor tr.selected td').slice(1).each( function () {
                var title = $(this).text();
                $(this).html( "<input style='width:100%' value='" + $(this).html().trim() + "'>");
            } );
	        $("#donor-result #quick_edit").hide();
	        $('#donor-result #save').show();
	        $("#donor-result #cancel").show();
	        $('#donor-result #import').hide();
	        $("#donor-result #add").hide();
	        $("#donor-result #quick_add").hide();
        }
      }
    } );
    
    function save_raw_data(){
        var selected_c = $('#table_donor tr.selected');
	      if(selected_c.length){
	        var attr = [];
	    	  var cells = $("td", selected_c).slice(1);
	    	  
	    	  $('#table_donor tr.selected td').each( function () {
            var title = $(this).text();
	    		  attr.push(title);
          });
        }
	    	return attr;
    };
    
    
    //  quick add row
    $('#donor-result #quick_add').on( 'click', function (e) {
        if (!$('#table_donor').hasClass('locked')){
            var row = table.row.add(["","","","","","",""]).draw(false).node();
            $('#table_donor').addClass('locked');
            $(row).addClass("selected").addClass("newrow").siblings().removeClass("selected");
            $('#table_donor tr.selected td').slice(1).each( function () {
                var title = $(this).text();
                $(this).html( "<input style='width:100%' value='" + $(this).html().trim() + "'>");
            } );
  	        $("#donor-result #quick_add").hide();
  	        $('#donor-result #save').show();
  	        $("#donor-result #cancel").show();
  	        $('#donor-result #import').hide();
  	        $("#donor-result #add").hide();
  	        $("#donor-result #quick_edit").hide();
        }
    } );
    
    //  cancel 
    $('#donor-result #cancel').on( 'click', function (e) {
      var selected_c = $('#table_donor tr.selected');
      if ($('#table_donor').hasClass('locked')){
        // new row
        if (selected_c.hasClass("newrow")){
	        table.row(selected_c).remove().draw('page');
          reset_btn();
        }
        // edit row
        else{
          var butns = $("tr.selected #actions").html();
	        var row = table.row(selected_c)
	        original_row[0] = butns;
	        row.data(original_row).draw('page');
          reset_btn();
        }
      }
    });

    //  save data and draw new row
    function toObject(names, values) {
      var result = {};
      for (var i = 0; i < names.length; i++)
           result[names[i]] = values[i];
      return result;
    };
    
    // reset all button
    function reset_btn(){
	    $("#donor-result #add").show();
      $("#donor-result #quick_add").show();
	    $("#donor-result #quick_edit").show();
	    $("#donor-result #import").show();
	    $("#donor-result #save").hide();
	    $("#donor-result #cancel").hide();
	    $("#donor-result #table_donor").removeClass("locked");
    }
    
    $('#donor-result #save').click(saveData);
    
    // submit data
    function saveData(){
        var head = $('#table_donor thead');
        var attr_name = head.data("attrname");
        var selected_c = $('#table_donor tr.selected');
  	    if(selected_c.length){
  	    	var attr = [];
  	    	var cells = $("td", selected_c).slice(1);
  	    	cells.each(function(){
  	    		attr.push($("input", $(this)).val().trim());
  	    });
	    	var update = toObject(attr_name, attr);
	    	var id = selected_c.data("id");
    		if(selected_c.data("id"))
    			$.ajax({
    				type: "PUT",
	    			url: "/donors/" + selected_c.data("id"),
	    			data: {"donor" : update, "where" : "inplace"},
	    			timeout: 5000,
	    		    success: function(data, requestStatus, xhrObject){ saveRow(data, selected_c); },
	    		    error: function(xhrObj, textStatus, exception) {
			    	    $("#donor-result #add_row").notify("Failed to save data!", {gap: 205, arrowShow: false, className: "error", position:"left middle"});
			       }
		    	})
	    	else
		    	$.ajax({
		    		type: "POST",
		    		url: "/donors",
		    		data: {"donor": update, "where" : "inplace"},
		    		timeout: 5000,
		    	    success: function(data, requestStatus, xhrObject){ saveRow(data, selected_c); },
		    	    error: function(xhrObj, textStatus, exception) {
		    			  $("#donor-result #add").notify("Failed to add data!", {gap: 205, arrowShow: false, className: "error", position:"left middle"});
		    	    }
		    	})
        	}
    };

    // redraw data table
    function saveRow(data, selected_c){
	    if(data.id) selected_c.data("id", data.id);
	    var butns;
	    if($('tr.newrow').length>0){
	      $("tr.newrow td:first-child").attr({'id':"actions","class":"","style":'width:15%'})
	      butns = "<a id='view'; class='btn btn-success btn-xs' href='/donorSummary/"+data.id+"', data-remote='true'>View</a>\
                 <a class='btn btn-success btn-xs' href='/donors/"+data.id+"'>Edit</a>\
                 <a id='deletebtn' class='btn btn-danger btn-xs' href='/donors/"+data.id+"' data-method='delete' rel='nofollow' data-confirm='Are you sure?'>Delete</a>";
	    }else{
	      butns = $("tr.selected #actions").html();
	    }
	   
  	  table.row(selected_c).data([
  	      butns,
  	      data.flag,
  	      data.title,
  	      data.first_name,
  	      data.last_name,
  	      data.organization,
  	      data.company
  	      ]).draw(false);
	    reset_btn();
	    $('tr.newrow').removeClass('newrow');
       $("#donor-result #add").notify("Successfully saved!", {arrowShow: false, className: "success", position:"left middle"}); 
     }
  }
};

$(donorDataTable.setup);

var summaryInfo={
  setup: function(){
    $('#table_donor td #view').on('click',summaryInfo.showSummary);
  },
  showSummary: function(event){
    event.preventDefault();
    $.ajax({
      url: $(this).attr('href'),
      method: 'get',
      timeout: 5000,
      success: function(data,request,xhrObj){
        $('#donorSummary .modal-body').html(data);
        $('#donorSummary').modal();
      }
    });
  }
};

$(function(){
  var active = $('#activeLabel').text();
  switch (active){
    case '1':
      {
        $('.active').removeClass('active');
        $('#basic-tab').parent().addClass('active');
        $('#basic').addClass('active');
        break;
      }
    case '2':
      {
        $('.active').removeClass('active');
        $('#contact-tab').parent().addClass('active');
        $('#contact').addClass('active');
        break;
      }
    case '3':
      {
        $('.active').removeClass('active');
        $('#finance-tab').parent().addClass('active');
        $('#finance').addClass('active');
        break;
      }
  }
})
