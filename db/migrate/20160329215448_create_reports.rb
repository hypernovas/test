class CreateReports < ActiveRecord::Migration
  def change
    create_table :reports do |t|
      t.string :title
      t.text :description
      t.datetime :last_run
      t.string :created_by
      t.datetime :created_at
      t.string :last_modified_by
      t.datetime :last_modified_at

      t.timestamps null: false
    end
  end
end
