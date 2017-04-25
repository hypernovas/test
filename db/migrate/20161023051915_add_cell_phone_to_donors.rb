class AddCellPhoneToDonors < ActiveRecord::Migration
  def change
    add_column :donors, :cell_phone, :string
  end
end
