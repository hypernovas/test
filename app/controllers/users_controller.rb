class UsersController < ApplicationController
	before_action :check_authorization, except: [:homepage,:new,:create]
	skip_before_action :require_login, only: [:new, :create]
	
	def index
		@users = User.all
		@user_attr_show = ['first_name','last_name','email','function']
	end
	
	def show
		id = params[:id]
		@user = User.find(id)
		@user_info = {
			'first_name' => @user.first_name,
			'last_name' => @user.last_name,
			'email' => @user.email,
			'username' => @user.username,
			'function' => @user.function,
			'street_address' => @user.street_address,
			'city' => @user.city,
			'state' => @user.state,
			'country' => @user.country
		}
		render(:partial => 'user_info',:object => @user_info) if request.xhr?
	end
	
  	def new
  		@new_user = User.new()
  	end

	def create
		@new_user = User.new(params[:user])
		@new_user.current_password = params[:user][:password]
		if Access.exists?(:email => params[:user][:email])
			#valid access email
			if @new_user.save # password match
		  		session[:user_id] = @new_user.id
		    	flash[:notice] = "You have signed up successfully.\n Please login with your account information."
	      		redirect_to root_path
		  	else
		    	redirect_to new_user_path
		  	end
		else # invalid access email
			#debugger
			flash[:notice] = "Unauthorized email address"
			redirect_to new_user_path
		end
	end
	
	def edit
		id = params[:id]
		@user = User.find(id)
		@user_info = {
			'first_name' => @user.first_name,
			'last_name' => @user.last_name,
			'email' => @user.email,
			'username' => @user.username,
			'function' => @user.function,
			'street_address' => @user.street_address,
			'city' => @user.city,
			'state' => @user.state,
			'country' => @user.country
		}
	end
	
	def update
		@user = User.find(params[:id])
		function =  params[:user][:function]
		func_str = ""
		if function
			function.each do |f|
				if f!=""
					func_str+=f.gsub("\"",'')+", "
				end
			end
		end
		user_update = {
			:first_name => params[:user][:first_name],
			:last_name => params[:user][:last_name],
			:password => @user.current_password,
			:password_confirmation => @user.current_password,
			:email => params[:user][:email],
			:function => func_str.chomp(', '),
			:phone_number => params[:user][:phone_number],
			:street_address => params[:user][:street_address],
			:city => params[:user][:city],
			:state => params[:user][:state],
			:country => params[:user][:country],
			:zipcode => params[:user][:zipcode]
		}
		if @user.update_attributes(user_update)
			render json: @user if request.xhr?
	    else
			Rails.logger.info(@user.errors.messages.inspect)
			render :action => 'edit'
		end
	end
	
	def destroy
		id = params[:id]
        @user = User.find(id)
        flash[:notice] = "#{@user.first_name} #{@user.last_name} is deleted."
        User.destroy(@user)
        redirect_to users_path
	end
	
	def homepage
	end
	
	def check_authorization
        unless current_user.function and current_user.function.include? 'user management'
            flash[:notice]="Sorry, authorization check failed!"
            redirect_to homepage_path
        end
    end
    
end