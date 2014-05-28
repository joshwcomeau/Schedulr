class SchedulesController < ApplicationController
  before_filter :require_login, :only => :new 

  def show
    @schedule_day_formatted = Date.iso8601(params[:id])
    @schedule = Schedule.where("week_of = ?", @schedule_day_formatted).first

    @shifts = @schedule.shifts

    puts "SCHEDULE:\n\n"
    puts @schedule.location


    @location = @schedule.location

    @earliest_open = @location.company.earliest_open(@location).floor
    @latest_close = @location.company.latest_close(@location).ceil
  end

  def new
    @shifts = []
    @company = current_user.company
    @locations = @company.locations
    @location = @company.locations.first
    @earliest_open = @company.earliest_open(@location)
    @latest_close = @company.latest_close(@location)
    render :layout => "no_top_bar"
  end

  def create

    # Organize and separate our data
    scheduleData = params['schedule']['0']
    shiftData = []

    shiftIDs = []

    puts scheduleData

    for i in (1...params['schedule'].length)
      shiftData << params['schedule'][i.to_s]
    end

    # Either find or create a schedule with our schedule params
    @schedule = Schedule.create!(schedule_params)

    shiftData.each do |shift|
      @shift = @schedule.shifts.new

      day = @schedule.week_of + shift["day"].to_i
      @shift.start_time = day.to_time + ( shift["start"].to_f * 3600 ).to_i
      @shift.end_time = day.to_time + ( shift["end"].to_f * 3600 ).to_i

      @shift.save

      shift["database_id"] = @shift.id

    end

    respond_to do |format|
      format.json { render :json => { shifts: shiftData } }
    end


  end

  private

  def schedule_params
    params.require(:schedule).require(:"0").permit(:week_of, :location_id)
  end

  # def shift_params(n)
  #   params.require(:schedule).require(n.to_sym).permit(:)
  # end
end
