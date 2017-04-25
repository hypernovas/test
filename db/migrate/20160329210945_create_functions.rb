class CreateFunctions < ActiveRecord::Migration
  def change
    create_table :functions do |t|
      t.string :name
      t.string :created_by
      t.string :last_modified_by
      t.datetime :created_at
      t.datetime :last_modified_at

      t.timestamps null: false
    end
  end
end
