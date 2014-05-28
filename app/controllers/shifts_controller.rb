class ShiftsController < ApplicationController

  def create

    # first, delete all shifts from this schedule.

    params[:shifts].each do |shift|
      @user = User.find(shift[1]["user_id"])
      @user.shifts << Shift.find(shift[1]["shift_id"])
    end

    respond_to do |format|
      format.json { render :json => { msg: "Success!" } }
    end

  end
end
