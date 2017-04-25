class AddColToUser < ActiveRecord::Migration
  def up
    add_column :users, :phone_number, :string
    add_column :users, :street_address, :string
    add_column :users, :city, :string
    add_column :users, :state, :string, :default => 'Texas'
    add_column :users, :country, :string, :default => 'United States'
    add_column :users, :zipcode, :integer
  end
  
end
