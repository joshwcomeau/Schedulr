class SessionsController < ApplicationController
  def new

  end

  def create
  	user = login(params[:email], params[:password])
  	if logged_in?
      # Get current date
      @current_week = Date.today.beginning_of_week
      redirect_to root_url
  	else
  		flash[:alert] = "Invalid login, please try again!"
  		redirect_to root_url
  	end
  end

  def destroy
    logout
    redirect_to root_url
  end
  private
  def session_params
    params.require(:session).permit(:email, :password)
  end
end
