class ChangeAccess < ActiveRecord::Migration
  def change
    remove_column :accesses, :access_code
  end
end
