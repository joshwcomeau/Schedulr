module SchedulesHelper
  HOURHEIGHT = 50
  MORNINGOFFSET = 1 * HOURHEIGHT

  ### NOTES ON SHIFT PLACEMENT. 
  # There are 3 important variables for positioning each shift: 
  #  - Day of the week (distance from left)   
  #  - Hour of the day (distance from top) 
  #  - Length of shift (height) 

  def businessClosedClassAdd(location, day, time, onthehour)
    open = location[day.downcase+"_open"].hour
    close = location[day.downcase+"_close"].hour

    if location[day.downcase+"_open"].min != 0
      open += 0.5
    end
    
    if location[day.downcase+"_close"].min != 0
      close += 0.5
    end
    


    return "background: #DDD; border: 0px" if ( open > time || close <= time ) 

    
  end

  def getDateOffset(s)
    (s.start_time.day - @schedule.week_of.day).to_i
  end

  def getTimeOffset(s)
    ((s.start_time.hour + ( s.start_time.min / 60.0 ) ) - (@earliest_open) )
  end

  def getShiftHeight(s)
    (s.end_time - s.start_time) / 3600
  end


  def printTime(time)
    time >= 12 ? timeLabel = 'PM' : timeLabel = 'AM'
    time -= 12 if time > 12

    "<div class='hour_label'>#{time}:00 <span class='am_pm_label'>#{timeLabel}</span> -</div>".html_safe
  end

  def printTimeFloat(time)
    if time.min != 0
      return time.hour + 0.5
    else
      return time.hour
    end
  end
  
end
