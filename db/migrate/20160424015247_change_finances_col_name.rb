class ChangeFinancesColName < ActiveRecord::Migration
  def up
    change_table :finances do |t|
      t.rename :type, :_type
    end
  end
end
