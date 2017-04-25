require 'csv'

class DonorsController < ApplicationController

    before_action :check_authorization


    def index
        @donor_attr = Donor.attribute_names
        @donor_attr_show = ["flag", "title", "first_name", "last_name", "organization", "company"]
        @donors = Donor.search_by(params[:donor]).where('active = 1')
    end

    def new
        @donor = Donor.new
        @donor_contact = [
	        "contact_date",
	        "followup_date",
	        "narrative"
	    ]
	    @donor_finance = [
            '_type',
            'date',
            'amount',
            'description',
            'designation'
        ]
        #render(:partial => 'donor_info', :object => @donor) if request.xhr?
    end

    def destroy
        id = params[:id]
        @donor = Donor.find(id)
        @donor.destroy
        flash[:notice] = "#{@donor.first_name} #{@donor.last_name} is deleted."
        @donor.update_attributes(:active => 0)    #why you use this!!!!
        redirect_to donors_path
    end

    def create
        params[:donor][:active] = 1
        @donor = Donor.create!(params[:donor])
        #flash[:notice] = "#{@donor.first_name} #{@donor.last_name} was successfully created."
        if params[:where] == "inplace"
            render :json => @donor
        else
            render :json => {:id => @donor.id}
        end
    end

    def show
        id = params[:id]
        @active = params[:active]
        @donor = Donor.find(id)

        if @donor.subscribeflag == "Y"
        subscribe = "Yes"
      elsif @donor.subscribeflag == "N"
        subscribe = "No"
      end

        @donor_basic = {
            'Subscribe' => subscribe,
            'Title' => @donor.title,
            'Role' => @donor.role,
            'First Name' => @donor.first_name,
            'Last Name' => @donor.last_name,
            'Middle Name' => @donor.middle_name,
            'Salution' => @donor.salution,
            'Email' => @donor.email,
  	        'Organization' => @donor.organization,
  	        'Company' => @donor.company,
  	        'Spouse' => @donor.spouse,
  	        'Street Address' => @donor.street_address,
  	        'Street Address 2' => @donor.street_address_2,
  	        'City' => @donor.city,
  	        'State' => @donor.state,
  	        'Countrt' => @donor.country,
  	        'Zip Code' => @donor.zipcode,
            'Cell Phone' => @donor.cell_phone,
            'Home Phone' => @donor.home_phone,
            'Business Phone' => @donor.business_phone,
            'Note' => @donor.note
	        }
	    @donor_contact = [
	        "contact_date",
	        "followup_date",
	        "narrative"
	    ]
	    @contacts = Contact.where(:donor_id => @donor.id)
	    @finances = Finance.where(:donor => @donor.id)
	    @donor_finance = [
            '_type',
            'date',
            'amount',
            'description',
            'designation'
        ]
    end

    def update
      @donor = Donor.find(params[:id])
      @donor.update_attributes(params[:donor])

      if @donor.flag == "I"
        type = "Individual"
      elsif @donor.flag == "O"
        type = "Organization"
      end

      if @donor.subscribeflag == "Y"
        subscribe = "Yes"
      elsif @donor.subscribeflag == "N"
        subscribe = "No"
      end

      render :json => @donor if request.xhr? && params[:where] == "inplace"
      @donor_basic = {
            'Title' => @donor.title,
            'Role' => @donor.role,
            'First Name' => @donor.first_name,
            'Last Name' => @donor.last_name,
            'Middle Name' => @donor.middle_name,
            'Salution' => @donor.salution,
            'Email' => @donor.email,
  	        'Organization' => @donor.organization,
  	        'Company' => @donor.company,
  	        'Spouse' => @donor.spouse,
  	        'Street Address' => @donor.street_address,
  	        'Street Address 2' => @donor.street_address_2,
  	        'City' => @donor.city,
  	        'State' => @donor.state,
  	        'Country' => @donor.country,
  	        'Zip Code' => @donor.zipcode,
            'Cell Phone' => @donor.cell_phone,
            'Home Phone' => @donor.home_phone,
            'Business Phone' => @donor.business_phone,
            'Note' => @donor.note
	        }
      render(:partial => 'donor_summary', :object => @donor_basic) if request.xhr? && !params[:where]
    end

    def showByContact
      contact_id = params[:contactId]
      @contact = Contact.find(contact_id)
      @donor = @contact.donor
      redirect_to controller:'donors', action:'show', id:@donor.id, active:2
    end

    def showSummary
      id = params[:id]
      @donor = Donor.find(id)

      if @donor.flag == "I"
        type = "Individual"
      elsif @donor.flag == "O"
        type = "Organization"
      end

      @donor_basic = {
          'Type' => type,
          'Title' => @donor.title,
          'Role' => @donor.role,
          'First Name' => @donor.first_name,
          'Last Name' => @donor.last_name,
          'Middle Name' => @donor.middle_name,
          'Salution' => @donor.salution,
          'Email' => @donor.email,
  	      'Organization' => @donor.organization,
  	      'Company' => @donor.company,
  	      'Spouse' => @donor.spouse,
  	      'Street Address' => @donor.street_address,
  	      'Street Address 2' => @donor.street_address_2,
  	      'City' => @donor.city,
  	      'State' => @donor.state,
  	      'Country' => @donor.country,
  	      'Zip Code' => @donor.zipcode,
          'Cell Phone' => @donor.cell_phone,
          'Home Phone' => @donor.home_phone,
          'Business Phone' => @donor.business_phone,
          'Note' => @donor.note
	     }
	     render(:partial => 'donor_summary', :object => @donor_basic) if request.xhr?
    end

    def importIndex
      session[:upload_path]=nil
    end

    def upload
      @uploaded_file = params[:post][:file]
      session[:upload_path] = @uploaded_file.path
      session[:file_type] = File.extname(@uploaded_file.original_filename)
      render :json => 'Successfully Uploaded' if request.xhr?
    end

    def import
      response_array={}
      if(session[:upload_path])
        case session[:file_type]
        when ".csv" then @file = Roo::CSV.new(session[:upload_path])
        when ".xls" then @file = Roo::Excel.new(session[:upload_path])
        when ".xlsx" then @file = Roo::Excelx.new(session[:upload_path])
        end
        @file.default_sheet = @file.sheets.first
      end

      if(!@file)
        response_array['status']=1;
        render :json=>response_array if request.xhr?
        return
      end

      @models = []
      @fields = []
      @donor_index = []
      @contact_index = []
      @finance_index = []

      isEmpty = (params[:selector]["0"].join=="")?true:false

      if(isEmpty)
        response_array['status']=2;
        render :json=>response_array if request.xhr?
        return
      end

      counter = 0
      if(!isEmpty)
        params[:selector].each_value do |row|
          @models << row[0].classify.constantize
          @fields << row[1].parameterize.underscore.to_sym
          if (row[0]=="Donor")
            @donor_index << counter
          elsif (row[0]=="Contact")
            @contact_index << counter
          elsif (row[0]=="Finance")
            @finance_index << counter
          end
          counter+=1
        end
      end

      donor_param = {}
      contact_param = {}
      finance_param = {}

      row_stop = @file.last_row
      (2...row_stop).each do |line_num|
        @donor_index.each do |d_i|
          donor_param[@fields[d_i]] = @file.row(line_num)[d_i]
        end
        @contact_index.each do |c_i|
          if(@fields[c_i]==:contact_date || @fields[c_i]==:followup_date)
            contact_param[@fields[c_i]] = Date.strptime(@file.row(line_num)[c_i],"%m/%d/%Y")
          else
            contact_param[@fields[c_i]] = @file.row(line_num)[c_i]
          end
        end
        @finance_index.each do |f_i|
          if(@fields[f_i]==:date )
            finance_param[@fields[f_i]] = Date.strptime(@file.row(line_num)[f_i],"%m/%d/%Y")
          elsif(@fields[f_i]==:amount)
            finance_param[@fields[f_i]] = @file.row(line_num)[f_i].to_f
          else
            finance_param[@fields[f_i]] = @file.row(line_num)[f_i]
          end
        end

        donor_param[:active] = 1
        donor_param[:created_by] = session[:user]
        donor_param[:last_modified_by] = session[:user]
        donor_param[:last_modified_at] = DateTime.now
        @donor = Donor.new donor_param
        if !@donor.save
          #debugger
          response_array['status'] = 3
          render :json=>response_array if request.xhr?
          return
        end

        if !contact_param.empty?
          contact_param[:created_by] = session[:user]
          contact_param[:last_modified_by] = session[:user]
          contact_param[:last_modified_at] = DateTime.now
          @contact = @donor.contacts.new contact_param
          if !@contact.save
            #debugger
            response_array['status'] = 3
            render :json=>response_array if request.xhr?
            return
          end
        end

        if !finance_param.empty?
          finance_param[:created_by] = session[:user]
          finance_param[:last_modified_by] = session[:user]
          finance_param[:last_modified_at] = DateTime.now
          @finance = @donor.finances.new finance_param
          if !@finance.save
            #debugger
            response_array['status'] = 3
            render :json=>response_array if request.xhr?
            return
          end
        end
      end
      response_array['status']=0
      render :json => response_array if request.xhr?
    end

    def check_authorization
        unless current_user.function and current_user.function.include? 'donor management'
            flash[:notice]="Sorry, authorization check failed!"
            redirect_to homepage_path
        end
    end
end
