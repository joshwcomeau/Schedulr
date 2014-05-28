class RemoveUserIdFromShifts < ActiveRecord::Migration
  def change
    remove_column :shifts, :user_id
  end
end
