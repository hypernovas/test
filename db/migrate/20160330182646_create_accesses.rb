class CreateAccesses < ActiveRecord::Migration
  def change
    create_table :accesses do |t|
      t.integer :access_code
      t.string :email

      t.timestamps null: false
    end
  end
end
