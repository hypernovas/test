var userTable={
  setup: function(){
    var table = $('#user_table').DataTable({
      aaSorting: [1,'asc']
    });
    
    // append column search box
    $('#user_table tfoot th.filter').each(function(){
        var title = $(this).text();
        $(this).html( '<input type="text" placeholder=" '+title+'" />' );
    });
    
    // apply column search
    table.columns().every( function () {
        var that = this;
        $( 'input', this.footer() ).on( 'keyup change', function () {
            if ( that.search() !== this.value ) {
                that
                    .search( this.value)
                    .draw(false);
            }
        } );
    } );
    
    $('#user_table tbody #viewbtn').on('click',function(event){
      event.preventDefault();
      $.ajax({
          url: $(this).attr('href'),
          success: function(data,request,xhrobj){
            $('#userInfo .modal-body').html(data);  
            $('#userInfo').modal();  
          }
      });
    });
    
   
    
  }
};

$(userTable.setup);