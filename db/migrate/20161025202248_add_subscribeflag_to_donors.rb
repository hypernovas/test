class AddSubscribeflagToDonors < ActiveRecord::Migration
  def change
    add_column :donors, :subscribeflag, :string
  end
end
