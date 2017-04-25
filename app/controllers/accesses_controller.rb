class AccessesController < ApplicationController
    before_action :check_authorization
    
    def index
        @accesses = Access.all()
        @access_attr = ['email']
    end
    
    def create
        to_create={}
        params[:access].each do |attr|
            to_create[attr[0]]=attr[1].to_s.downcase
        end
        @access = Access.create(to_create)
        render :json => @access if request.xhr? && params[:where] == "inplace"
    end
    
    def update
        @access = Access.find(params[:id])
        to_update={}
        params[:access].each do |attr|
          to_update[attr[0]] = attr[1].downcase
        end
        @access.update_attributes(to_update)
        render :json => @access if request.xhr? && params[:where] == "inplace"
    end
    
    def destroy
        @access = Access.find(params[:id])
        @access.destroy
        flash[:notice] = "#{@access.email} is deleted."
        redirect_to accesses_path
    end
    
    def check_authorization
        unless current_user.function and current_user.function.include? 'user management'
            flash[:notice]="Sorry, authorization check failed!"
            redirect_to homepage_path
        end
    end
end
