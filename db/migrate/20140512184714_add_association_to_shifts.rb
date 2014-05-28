class AddAssociationToShifts < ActiveRecord::Migration
  def change
    add_column :shifts, :schedule_id, :integer
  end
end
