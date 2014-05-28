class AddCompanyIdToSchedule < ActiveRecord::Migration
  def change
    add_column :schedules, :company_id, :integer
  end
end
