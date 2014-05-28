class CreateUnavailabilities < ActiveRecord::Migration
  def change
    create_table :unavailabilities do |t|
      t.datetime :monday_st
      t.datetime :monday_et
      t.datetime :tuesday_st
      t.datetime :tuesday_et
      t.datetime :wednesday_st
      t.datetime :wednesday_et
      t.datetime :thursday_st
      t.datetime :thursday_et
      t.datetime :friday_st
      t.datetime :friday_et
      t.datetime :saturday_st
      t.datetime :saturday_et
      t.datetime :sunday_st
      t.datetime :sunday_et
      t.belongs_to :user

      t.timestamps
    end
  end
end
