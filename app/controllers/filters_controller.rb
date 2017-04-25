class FiltersController < ApplicationController
    before_action :check_authorization
    
    def index
        
    end

    def show
        
    end
    
    def new 
        @filter = Filter.new
    end
    
    def create
        a = params[:attr]
        @report = Report.find(params[:id]);
        @filter = @report.filters.build({
            :table_name => (a[0].downcase if a[0]),
            :field_name => (a[1].downcase if a[1]),
            :value => a[2],
            :min_value => a[3],
            :max_value => a[4],
            :min_date => a[5],
            :max_date => a[6]
        })
        @filter.save!
        
        @filter.table_name = a[0].humanize if a[0]
        @filter.field_name = (a[1].split('_').map(&:capitalize).join(' ') if a[1])
        render :json => @filter if request.xhr?
        @filter.last_modified_by = User.find(session[:user_id])
        
    end
    
    def update
        @filter = Filter.find(params[:id])
        a = params[:attr]
        @filter.update_attributes({
            :table_name => (a[0].downcase if a[0]),
            :field_name => (a[1].downcase if a[1]),
            :value => a[2],
            :min_value => a[3],
            :max_value => a[4],
            :min_date => a[5],
            :max_date => a[6]
        })
        
        @filter.table_name = a[0].humanize if a[0]
        @filter.field_name = (a[1].split('_').map(&:capitalize).join(' ') if a[1])
        
        render :json => @filter if request.xhr?
        @filter.last_modified_by = User.find(session[:user_id])
        
    end
    
    def destroy
        @filter = Filter.find(params[:id])
        @filter.destroy
        render :nothing => true

    end
    
    def check_authorization
      unless current_user.function.include? 'report management'
          flash[:notice]="Sorry, authorization check failed!"
          redirect_to homepage_path
      end

    end
end