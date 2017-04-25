class CreateFilters < ActiveRecord::Migration
  def change
    create_table :filters do |t|
      t.string :table_name
      t.string :field_name
      t.string :value
      t.decimal :min_value
      t.decimal :max_value
      t.date :min_date
      t.date :max_date
      t.string :created_by
      t.datetime :created_at
      t.string :last_modified_by
      t.datetime :last_modified_at
      t.references :report, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
