class AddWeekToSchedule < ActiveRecord::Migration
  def change
    add_column :schedules, :week_of, :date
  end
end
