var AgendaInfo = {
  setup: function(){
    $('#agendaTable td a').click(AgendaInfo.getAgendaInfo);
  },
  getAgendaInfo: function(event){
    event.preventDefault();
    $.ajax({
      type:'GET',
      url: $(this).attr('href'),
      success: AgendaInfo.showAgendaInfo,
      error: function(xhrobj,textStatus,exception){
        alert('Error!');
        return false;
      }
    });
    return false;
  },
  showAgendaInfo: function(data,request,xhrobj){
    $('#agendaInfo .modal-body').html(data);
    $('#agendaInfo').modal();
    return false;
  },
  hideAgendaInfo: function(){
    return false;
  }
};

$(AgendaInfo.setup);

/*var AddedDonorInfo = {
  setup: function(){
    $('#addedDonorTable td a').click(AddedDonorInfo.getAddedDonorInfo);
  },
  getAddedDonorInfo: function(event){
    event.preventDefault();
    $.ajax({
      type:'GET',
      url: $(this).attr('href'),
      success: function(data,request,xhrobj){
        $('#addedDonorInfo .modal-body').html(data);
        $('#addedDonorInfo').modal();
        return false;
      },
      error: function(xhrobj,textStatus,exception){
        alert('Error!');
        return false;
      }
    });
  },
  hideAddedDonorInfo: function(){
    return false;
  }
};

$(AddedDonorInfo.setup);*/


var dataTable = {
  setup: function(){
    AgendaTable.setup();
    DonorTable.setup();
    ReportTable.setup();
  }
};

var AgendaTable={
  setup: function(){
    var table = $('#agendaTable').DataTable({'bSort': false});
    $('#agendaTable tbody').on('click','tr',function(){
      var contactId = table.row(this).data()[0];
      $(location).attr('href', '/donorContact?contactId='+contactId+'&active=2');
    });
  }
};

var DonorTable={
  setup: function(){
    var table = $('#addedDonorTable').DataTable({'bSort': false});
    $('#addedDonorTable tbody').on('click','tr',function(){
      var donorId = table.row(this).data()[0];
      $(location).attr('href', '/donors/'+donorId+'?active=1');
    });
  }
};

var ReportTable={
  setup: function(){
    var table = $('#reportTable').DataTable({'bSort': false});
    $('#reportTable tbody').on('click','tr',function(){
      var reportId = table.row(this).data()[0];
      $(location).attr('href', '/reports/'+reportId);
    });
  }
};

$(dataTable.setup);
