class CreateOrganizations < ActiveRecord::Migration
  def change
    create_table :organizations do |t|
      t.string :name
      t.string :street_address
      t.string :city
      t.string :state, :default=>'Texas'
      t.string :country, :default=>'United States'
      t.integer :zipcode
      t.string :fax
      t.string :created_by
      t.datetime :created_at
      t.string :last_modified_by
      t.datetime :last_modified_at

      t.timestamps null: false
    end
  end
end
