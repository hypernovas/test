class ReportsController < ApplicationController

    before_action :check_authorization
    
    def index
      @reports = Report.all

    end

    def blankcont(rec,attrs)
      attrs.each do |attr|
        if !rec.send(attr) or rec.send(attr).to_s.empty?
          return false
        end
      end
      return true
    end

    def show
      blk= params[:blanck]
      id = params[:id] 
      @report = Report.find(id) 
      @filters = @report.filters
      
      if @filters.empty?
        flash[:notice] = 'No report fields specified'
        redirect_to reports_path
      end
      
      configs={}
      @attr_names = []
      @filters.each do |filter|
        if !configs.has_key? filter.table_name
          configs[filter.table_name] = {}
        end
        @attr_names << filter.field_name
        configs[filter.table_name][filter.field_name]={}
        configs[filter.table_name][filter.field_name]['value']=filter.value if (filter.value and !filter.value.to_s.empty?)
        configs[filter.table_name][filter.field_name]['min_value']=filter.min_value if (filter.min_value and !filter.min_value.to_s.empty?)
        configs[filter.table_name][filter.field_name]['max_value']=filter.max_value if (filter.max_value and !filter.max_value.to_s.empty?)
        configs[filter.table_name][filter.field_name]['min_date']=filter.min_date if (filter.min_date and !filter.min_date.to_s.empty?)
        configs[filter.table_name][filter.field_name]['max_date']=filter.max_date if (filter.max_date and !filter.max_date.to_s.empty?)
      end
      
      @results = Report.generate(configs)
      
      @records = []
      @results.each do |record|
        if blk==1
          @attr_names.each do |attr|
            if record.send(attr) and not record.send(attr).to_s.empty?
              @records << record
              break
            end
          end
        else
          #@attr_names.each do |attr|
          if blankcont(record,@attr_names)
          #if record.send(attr) and not record.send(attr).to_s.empty?
            @records << record
            break
          end
        #end
        end
      end
    end
    
    def new 
      @report = Report.new
    end
    
    def create
      @report = Report.create!(params[:report])
      @user =  User.find(session[:user_id])
      
      @report.last_modified_by = "#{@user.first_name} #{@user.last_name}"
      @report.save()
      flash[:notice] = "#{@report.title} was successfully created."
      redirect_to edit_report_path(@report.id)
    end
    
    def edit
      @report = Report.find(params[:id])
      @report_filter = {
      	'Table' => '25%',
      	'Field' => '25%',
      	'Value' => '10%',
      	'Amount Min' => '10%',
      	'Amount Max' => '10%',
      	'Date Min' => '10%',
      	'Date Max' => '10%'
      }
      @filters = @report.filters
      @user = User.find(session[:user_id])
    end
    
    def update
      report = params[:report]
      @report = Report.find(report[:id])
      report.delete('id')
      respond_to do |format|
        if @report.update_attributes(report)
          format.js {render js: "$('#save_info').notify('Successfully saved', {arrowShow: false, className: 'success', position:'left middle'});"}
          format.html{ redirect_to reports_path, :notice => "successfully updated" }
        end
      end

    end
    
    def destroy
      id = params[:id]
      @report_record = Report.find(id)
      flash[:notice] = "#{@report_record.title} is deleted."
      @report_record.destroy
      redirect_to reports_path
    end
    
    def check_authorization
      unless current_user.function and current_user.function.include? 'report management'
          flash[:notice]="Sorry, authorization check failed!"
          redirect_to homepage_path
      end
    end
    
    private
    def sort_column
        Donor.column_names.include?(params[:sort]) ? params[:sort] : "created_at"
    end
    def sort_direction
        %w[asc desc].include?(params[:direction]) ? params[:direction] : "asc"
    end
    
    
end