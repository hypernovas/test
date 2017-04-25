class AddColToDonors < ActiveRecord::Migration
  def up
    add_column :donors, :role, :string
    add_column :donors, :note, :string
    add_column :donors, :spouse, :string
  end
  
  def down
    remove_column :donors, :role
    remove_column :donors, :note
    remove_column :donors, :spouse
  end
end
