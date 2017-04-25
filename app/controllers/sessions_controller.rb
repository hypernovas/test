class SessionsController < ApplicationController
 
  skip_before_action :require_login, only:[:new,:create]
 
  def new
  end

 def create
    user = User.find_by_username(params[:session][:username])
    # If the user exists AND the password entered is correct.
    if user && user.authenticate(params[:session][:password])
      # Save the user id inside the browser cookie. This is how we keep the user 
      # logged in when they navigate around our website.
      session[:user_id] = user.id
      flash[:notice] = "Welcome back #{user.username}"
      redirect_to homepage_path
    else
    # If user's login doesn't work, send them back to the login form.
      flash[:notice] = "Username and password do not match our record!"
      redirect_to root_path
    end
  end

  def destroy
    flash[:notice] = "You have successfully logged out!"
    session[:user_id] = nil
    redirect_to root_path
  end

end
