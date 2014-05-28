class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :fname
      t.string :lname
      t.integer :phone_number
      t.string :email
      t.string :avatar
      t.date :start_date

      t.timestamps
    end
  end
end
