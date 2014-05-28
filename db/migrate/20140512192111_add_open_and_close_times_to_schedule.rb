class AddOpenAndCloseTimesToSchedule < ActiveRecord::Migration
  def change
    add_column :schedules, :open_hour, :time
    add_column :schedules, :close_hour, :time
  end
end
