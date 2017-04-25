var accessDataTable = {
    setup: function(){
        var table = $('#access_table').DataTable({bSort:false});
        
    // 2. selection by click
        $('#access_table tbody').on( 'click', 'tr', function () {
            if ( !$('#access_table').hasClass('locked') ){
                if ( $(this).hasClass('selected') ) {
                    $(this).removeClass('selected');
                }
                else {
                    table.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                }
            }
        } );
        
        var original_row;
    // 2. quick edit row
         $('#access-result #quick_edit').on( 'click', function (e) {
            if ($('#access_table').hasClass('locked')){
                saveData();
            }
            else if ($('#access_table tr').hasClass('selected')){
                original_row = save_raw_data();
                $('#access_table').addClass('locked');
                $('#access_table tr.selected td:first-child').each( function () {
                    var title = $(this).text();
                    $(this).html( "<input style='width:100%' value='" + $(this).html().trim() + "'>");
                } );
    	        $("#access-result #quick_edit").text("Save");
    	        $("#access-result #cancel").show();
    	        $("#access-result #quick_add").hide();
            }
     
        } );
        
        function save_raw_data(){
            var selected_c = $('#access_table tr.selected');
    	      if(selected_c.length){
    	        var attr = [];
    	    	var cells = $("td", selected_c).slice(1);
    	    	  
    	    	$('#access_table tr.selected td:not(:last-child)').each(function(){
                  var title = $(this).text();
    	          attr.push(title);
              });
            }
    	    return attr;
        };
        
        
        // 3. quick add row
        $('#access-result #quick_add').on( 'click', function (e) {
            if ($('#access_table').hasClass('locked')){
                saveData();
            }
            else{
                var row = table.row.add(["",""]).draw().node();
                $('#access_table').addClass('locked');
                $(row).addClass("selected").addClass("newrow").siblings().removeClass("selected");
                $('#access_table tr.selected td:first-child').each( function () {
                    var title = $(this).text();
                    $(this).html( "<input style='width:100%' value='" + $(this).html().trim() + "'>");
                } );
    	        $("#access-result #quick_add").text("Save");
    	        $("#access-result #cancel").show();
    	        $("#access-result #quick_edit").hide();
            }
     
        } );        
        
        // 4. cancel 
        $('#access-result #cancel').on( 'click', function (e) {
          var selected_c = $('#access_table tr.selected');
          var btn = selected_c.children('td').last().html();
          if ($('#access_table').hasClass('locked')){
            // new row
            if (selected_c.hasClass("newrow")){
    	        table.row(selected_c).remove().draw(false);
                reset_btn();
            }
            // edit row
            else{
    	      var row = table.row(selected_c)
    	      row.data([original_row,btn]).draw();
              reset_btn();
            }
          }
        });
    
    // 5. save data and draw new row
        function toObject(names, values) {
          var result = {};
          for (var i = 0; i < names.length; i++)
               result[names[i]] = values[i];
          return result;
        };
        
    // 6. show all button
        function reset_btn(){
            $("#access-result #quick_add").text("Quick Add").show();
    	    $("#access-result #quick_edit").text("Quick Edit").show();
    	    $("#access-result #cancel").hide();
    	    $("#access-result #access_table").removeClass("locked");
        }
        
        function saveData(){
            var head = $('#access_table thead');
            var attr_name = head.data("attrname");
            var selected_c = $('#access_table tr.selected');
    	    if(selected_c.length){
    	    	var attr = [];
    	    	var cells = $("td:first-child", selected_c);
    	    	cells.each(function(){
    	    		attr.push($("input", $(this)).val().trim());
    	    	});
    	    	var update = toObject(attr_name, attr);
    	    	var id = selected_c.data("id");
        		if(selected_c.data("id"))
        			$.ajax({
        				type: "PUT",
    	    			url: "/accesses/" + selected_c.data("id"),
    	    			data: {"access" : update, "where" : "inplace"},
    	    			timeout: 5000,
    	    		    success: function(data, requestStatus, xhrObject){ saveRow(data, selected_c); },
    	    		    error: function(xhrObj, textStatus, exception) {
    			    	$("#add_row").notify("Failed to save data!", {gap: 205, arrowShow: false, className: "error", position:"left middle"});
    			       }
    		    	})
    	    	else
    		    	$.ajax({
    		    		type: "POST",
    		    		url: "/accesses",
    		    		data: {"access": update, "where" : "inplace"},
    		    		timeout: 5000,
    		    	    success: function(data, requestStatus, xhrObject){ saveRow(data, selected_c); },
    		    	    error: function(xhrObj, textStatus, exception) {
    		    			$("#add").notify("Failed to add data!", {gap: 205, arrowShow: false, className: "error", position:"left middle"});
    		    	    }
    		    	})
            	}
        };
        
        function saveRow(data, selected_c){
    	    if(data.id) selected_c.data("id", data.id);
    	    var row = table.row(selected_c)
    	    var btn = ""
    	    if($('tr.newrow').length>0){
    	        btn += "<a id='deletebtn' class='btn btn-danger btn-xs' href='/accesses/"+data.id+"' data-method='delete' rel='nofollow' data-confirm='Are you sure?'>Delete</a>";
    	    }else{
    	        btn += $("tr.selected #deletebtn").html();
    	    }
    	    row.data([
    	      data.email,
    	      btn
    	    ]).draw();
    	    reset_btn();
          $("#access-result #quick_add").notify("Successfully saved!", {gap: 205, arrowShow: false, className: "success", position:"left middle"}); 
        }
    },
    
    
    
}

$(accessDataTable.setup);
