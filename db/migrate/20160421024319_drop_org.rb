class DropOrg < ActiveRecord::Migration
  def change
    drop_table :contact_people
    drop_table :organizations
  end
end
