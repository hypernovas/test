class AddFieldToDonors < ActiveRecord::Migration
  def change
    add_column :donors, :type, :string
    add_column :donors, :active, :integer, :default => 1
  end
end
