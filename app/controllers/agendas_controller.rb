class AgendasController < ApplicationController
  def show
    id = params[:id]
    @contact = Contact.find(id)
    #debugger
    render(:partial => 'agenda_details', :object => @contact) if request.xhr?
  end
end
