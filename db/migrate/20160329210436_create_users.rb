class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :username
      t.string :email
      t.string :password_digest
      t.string :current_password
      t.string :first_name
      t.string :last_name
      t.string :function
      t.integer :access_code
      t.string :created_by
      t.string :last_modified_by
      t.datetime :created_at
      t.datetime :last_modified_at

      t.timestamps null: false
    end
  end
end
