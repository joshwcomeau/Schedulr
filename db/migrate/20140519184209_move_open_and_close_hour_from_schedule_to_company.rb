class MoveOpenAndCloseHourFromScheduleToCompany < ActiveRecord::Migration
  def change
    add_column :locations, :monday_open, :time
    add_column :locations, :monday_close, :time
    add_column :locations, :tuesday_open, :time
    add_column :locations, :tuesday_close, :time
    add_column :locations, :wednesday_open, :time
    add_column :locations, :wednesday_close, :time
    add_column :locations, :thursday_open, :time
    add_column :locations, :thursday_close, :time
    add_column :locations, :friday_open, :time
    add_column :locations, :friday_close, :time
    add_column :locations, :saturday_open, :time
    add_column :locations, :saturday_close, :time
    add_column :locations, :sunday_open, :time
    add_column :locations, :sunday_close, :time

    remove_column :schedules, :open_hour
    remove_column :schedules, :close_hour
  end
end
