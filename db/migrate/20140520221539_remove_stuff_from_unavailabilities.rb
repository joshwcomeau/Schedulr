class RemoveStuffFromUnavailabilities < ActiveRecord::Migration
  def change
    remove_column :unavailabilities, :monday_st 
     remove_column :unavailabilities, :monday_et
      remove_column :unavailabilities, :tuesday_st
      remove_column :unavailabilities, :tuesday_et
      remove_column :unavailabilities, :wednesday_st
      remove_column :unavailabilities, :wednesday_et
      remove_column :unavailabilities, :thursday_st
      remove_column :unavailabilities, :thursday_et
      remove_column :unavailabilities, :friday_st
      remove_column :unavailabilities, :friday_et
      remove_column :unavailabilities, :saturday_st
      remove_column :unavailabilities, :saturday_et
      remove_column :unavailabilities, :sunday_st
      remove_column :unavailabilities, :sunday_et
  end
end
