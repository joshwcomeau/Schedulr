class AddFielsBackToUsers < ActiveRecord::Migration
  def change
  	add_column :users, :fname, :string
  	add_column :users, :lname, :string
  	add_column :users, :phone_number, :integer
  	add_column :users, :avatar, :string
  	add_column :users, :start_date, :date
  	add_column :users, :manager, :boolean
  end
end
