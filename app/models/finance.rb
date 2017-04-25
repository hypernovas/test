class Finance < ActiveRecord::Base
  belongs_to :donor
  belongs_to :contact
  
  attr_accessible :_type, :date, :amount, :description, :designation, :donor, :contact, :created_by, :created_at, :last_modified_by, :last_modified_at
  
  validates :_type, :presence => true
  validates :date, :presence => true
  validates :amount, :presence => true
end
