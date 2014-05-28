class ChangeCompanyIdToLocationIdSchedules < ActiveRecord::Migration
  def change
    rename_column :schedules, :company_id, :location_id
  end
end
