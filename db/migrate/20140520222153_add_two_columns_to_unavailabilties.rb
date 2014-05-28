class AddTwoColumnsToUnavailabilties < ActiveRecord::Migration
  def change
    add_column :unavailabilities, :day, :string
    add_column :unavailabilities, :duration_start, :time
    add_column :unavailabilities, :duration_end, :time
  end
end
