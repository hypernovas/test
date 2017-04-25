class RemoveAccessfromUser < ActiveRecord::Migration
  def change
    remove_column :users, :access_code
  end
end
