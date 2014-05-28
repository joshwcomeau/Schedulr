class User < ActiveRecord::Base
  authenticates_with_sorcery!
  has_many :unavailabilities    
  has_and_belongs_to_many :shifts
  belongs_to :company
  has_many :schedules, through: :shifts 

  mount_uploader :image, ImageUploader

  validates :fname, presence: true
  validates :lname, presence: true
  validates :email, presence: true
  validates :email, uniqueness: true
  validates_format_of :email,:with => /\A[^@\s]+@([^@\s]+\.)+[^@\s]+\z/

  def current_week_num(backWeeks=0)
    t = Date.today - (7*backWeeks)
    return t.cweek
  end

  def getYear
    Date.today.year
  end

  def get_schedule
    scheduleDate = Date.commercial(getYear, current_week_num)
    schedule = Schedule.where("week_of = ?", scheduleDate).last
  end

  def current_schedule_week_of
    # IF we have associated shifts, grab the schedule of the most recent shift.
    if self.schedules.count > 0
      self.schedules.last.week_of
    end
  end

  def findHours(week)
    monday = Date.commercial(getYear, week)
    schedule = self.schedules.where("week_of = ?", monday).first

    if schedule
      shifts_this_week = schedule.shifts
      total_hours = []
      shifts_this_week.each do |x|   
        time_start = x.start_time.in_time_zone("Eastern Time (US & Canada)") 
        time_end = x.end_time.in_time_zone("Eastern Time (US & Canada)") 

        x_min = time_end.strftime("%M") 
        x_min = (x_min.to_f/60)
        x_hour = time_end.strftime("%H").to_f

        y_min = time_start.strftime("%M") 
        y_min = (y_min.to_f/60)
        y_hour = time_start.strftime("%H").to_f

        total_hours << (x_min + x_hour) - (y_min + y_hour) 
      end
      return total_hours.inject(:+).round
    end
  end

  def totalHoursThisWeek
    findHours(current_week_num(0))
  end

  def totalHoursLastWeek
    findHours(current_week_num(1))
  end

  def totalHoursTwoWeeksAgo
    findHours(current_week_num(2))
  end

  def totalShiftsScheduledFor
    self.shifts.where("schedule_id = ?", get_schedule.id).count
  end

  def totalShiftsThisWeek
    self.schedules.where('location_id = ?', myLocationOfEmployment).count
  end

  def fnameCAP
    self.fname.upcase
  end

  def lnameCAP
    self.lname.upcase
  end

  def myLocationOfEmployment 
    self.company_id
  end

  def shiftsThisWeek
    self.shifts.where('schedule_id = ?', get_schedule)
  end

  def getLocationList
    self.company.locations
  end

  def getLocation
    getLocationList.first
  end

  def getEmployees
    employeeNames = []
    self.company.users.each do |emp|
      employeeNames << "#{emp.fname} #{emp.lname}"
    end

    employeeNames
  end


  def as_json(options = { })
    h = super(options)
    h[:current_schedule] = current_week_num
    h[:totalHoursThisWeek] = totalHoursThisWeek
    h[:totalHoursLastWeek] = totalHoursLastWeek
    h[:totalHoursTwoWeeksAgo] = totalHoursTwoWeeksAgo
    h[:totalShiftsScheduledFor] = totalShiftsScheduledFor
    h[:totalShiftsThisWeek] = totalShiftsThisWeek
    h[:shiftsThisWeek] = shiftsThisWeek
    h[:fnameCAP] = fnameCAP
    h[:lnameCAP] = lnameCAP
    h[:company] = self.company.name
    h[:locations] = getLocationList
    h[:location] = getLocation
    h[:employees] = getEmployees
    h
  end

end
