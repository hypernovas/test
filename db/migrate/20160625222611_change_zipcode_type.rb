class ChangeZipcodeType < ActiveRecord::Migration
  def change
    change_column :donors, :zipcode, :string
  end
end
