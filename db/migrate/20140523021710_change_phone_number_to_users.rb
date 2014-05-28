class ChangePhoneNumberToUsers < ActiveRecord::Migration
  def change
  	remove_column :users, :phone_number
  	add_column :users, :phone_number, :string
  end
end
