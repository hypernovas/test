class CreateFinances < ActiveRecord::Migration
  def change
    create_table :finances do |t|
      t.string :type
      t.date :date
      t.decimal :amount
      t.text :description
      t.string :designation
      t.references :donor, index: true, foreign_key: true
      t.references :contact, index: true, foreign_key: true
      t.string :created_by
      t.datetime :created_at
      t.string :last_modified_by
      t.datetime :last_modified_at

      t.timestamps null: false
    end
  end
end
