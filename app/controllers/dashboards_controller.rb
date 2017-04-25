class DashboardsController < ApplicationController
    before_action :check_authorization
  
    def index
      @agenda_records = AgendaView.all
      @donors = Donor.all.where('active = 1').order(updated_at: :desc)
      @report_records = Report.all.order(updated_at: :desc)
      #debugger
      render_to_string(:partial => 'reports_view', :object => @report_records) if request.xhr?
      render_to_string(:partial => 'agendas_view', :object => @agenda_records) if request.xhr?
    end
    
    def viewDonor
      @donor = Donor.find(params[:id])
      
      if @donor.flag == "I"
        type = "Individual"
      elsif @donor.flag == "O"
        type = "Organization"
      end
      
      @donor_basic = {
            'Type' => type,
            'Title' => (@donor.title.capitalize if @donor.title),
            'First Name' => (@donor.first_name.capitalize if @donor.first_name),
            'Last Name' => (@donor.last_name.capitalize if @donor.last_name),
            'Middle Name' => (@donor.middle_name.capitalize if @donor.middle_name),
            'Salution' => (@donor.salution.capitalize if @donor.salution),
            'Email' => @donor.email,
  	        'Organization' => @donor.organization,
  	        'Company' => (@donor.company.capitalize if @donor.company),
  	        'Street Address' => @donor.street_address,
  	        'City' => (@donor.city.capitalize if @donor.city),
  	        'State' => (@donor.state.capitalize if @donor.state),
  	        'Countrt' => (@donor.country.capitalize if @donor.country),
  	        'Zip Code' => @donor.zipcode,
            'Home Phone' => @donor.home_phone,
            'Business Phone' => @donor.business_phone
	        }
      render(:partial => 'added_donor_info',:object=>@donor_basic) if request.xhr?
    end
    
    def check_authorization
        unless current_user.function and current_user.function.include? 'dashboard'
            flash[:notice]="Sorry, authorization check failed!"
            redirect_to homepage_path
        end
    end
end

