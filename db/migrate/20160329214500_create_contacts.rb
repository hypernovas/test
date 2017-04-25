class CreateContacts < ActiveRecord::Migration
  def change
    create_table :contacts do |t|
      t.date :contact_date
      t.date :followup_date
      t.text :narrative
      t.references :donor, index: true, foreign_key: true
      t.string :created_by
      t.datetime :created_at
      t.string :last_modified_by
      t.datetime :last_modified_at

      t.timestamps null: false
    end
  end
end
