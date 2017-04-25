class ChangeDonorStreetAddress < ActiveRecord::Migration
  def change
    add_column :donors, :street_address_2, :string
  end
end
