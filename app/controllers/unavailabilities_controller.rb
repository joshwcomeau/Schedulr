class UnavailabilitiesController < ApplicationController
	before_filter :load_user
  def new
		@unavailabilities = @user.unavailabilities.build
	end
  def create
    @unavailability = @user.unavailabilities.build(unavailability_params)
    if @unavailability.save
      redirect_to new_user_unavailability_path(@user)
    else
      redirect_to root_url
    end
  end
  def destroy
    a = Unavailability.find(params[:id])
    if a.destroy
      redirect_to new_user_unavailability_path(@user)
    else
     redirect_to root_url
    end
  end

  private
  def unavailability_params
    params.require(:unavailability).permit(:day, :duration_start, :duration_end)
  end
  def load_user
   @user = current_user
  end
end
