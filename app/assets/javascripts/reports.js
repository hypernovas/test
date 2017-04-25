var reportTable={
  setup: function(){
    $('#report-table').DataTable({
      aaSorting: [3,'desc']
    });
  }
};

$(reportTable.setup);

var reportResult={
  setup: function(){
    $('#report-detail').DataTable({
      colReorder: true,
      dom: 'Bfrtip',
      buttons:[
        'copy','csv','excel','pdf','print'  
      ]
    });
  }
}

$(reportResult.setup)