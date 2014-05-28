class Location < ActiveRecord::Base
  belongs_to :company
  has_many :schedules

  validates :name, presence: true
  validates :address, presence: true
end
