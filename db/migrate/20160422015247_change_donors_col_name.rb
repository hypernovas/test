class ChangeDonorsColName < ActiveRecord::Migration
  def up
    change_table :donors do |t|
      t.rename :type, :flag
    end
  end
end
