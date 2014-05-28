class Company < ActiveRecord::Base
  has_many :locations
  has_many :schedules, through: :locations
  has_many :users

  validates :name, presence: true

  # These two methods calculate the earliest/latest times the business is open, so we don't waste space in the 
  # schedule by showing hours that the business is always closed.
  def earliest_open(location)
    earliest = nil

    7.times do |i|
      current_time = location["#{days_array[i]}_open"].hour
      
      if location["#{days_array[i]}_open"].min == 30
        current_time += 0.5
      end

      if earliest == nil || current_time < earliest
        earliest = current_time
      end
    end

    puts "EARLIEST IS \n #{earliest} \n\n\n\n\n"

    earliest
  end

  def latest_close(location)
    latest = nil

    7.times do |i|
      current_time = location["#{days_array[i]}_close"].hour

      if location["#{days_array[i]}_close"].min == 30
        current_time += 0.5
      end

      if latest == nil || current_time > latest
        latest = current_time
      end
    end

    puts "latest IS \n #{latest} \n\n\n\n\n"

    latest
  end

  def days_array
    ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  end
end
