class CreateContactPeople < ActiveRecord::Migration
  def change
    create_table :contact_people do |t|
      t.string :title
      t.string :first_name
      t.string :last_name
      t.string :middle_name
      t.string :salution
      t.string :email
      t.string :company
      t.string :street_address
      t.string :city
      t.string :state, :default=>'Texas'
      t.string :country, :default=>'United States'
      t.integer :zipcode
      t.string :home_phone
      t.string :business_phone
      t.string :mobile_phone
      t.string :created_by
      t.datetime :created_at
      t.string :last_modified_by
      t.datetime :last_modified_at
      t.references :organization, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
