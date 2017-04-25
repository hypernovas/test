require "date"

class Contact < ActiveRecord::Base
  has_one :finances, class_name:"Finance"
  belongs_to :donor
  
  attr_accessible :contact_date, :followup_date, :narrative, :donor_id, :contact_person_id, :created_by, :last_modified_by, :finances
  
  validates :contact_date, :presence => true
  validates :narrative, :presence => true
  
end
