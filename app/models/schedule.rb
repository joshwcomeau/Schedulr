class Schedule < ActiveRecord::Base
  has_many :shifts
  has_many :users, through: :shifts
  belongs_to :location
  



end
