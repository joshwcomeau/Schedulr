class AddShiftsUsersJoinTable < ActiveRecord::Migration
  def change
    create_table :shifts_users, id: false do |t|
      t.belongs_to :shift
      t.belongs_to :user
    end
  end
end
