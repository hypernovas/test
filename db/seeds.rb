# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

# user seed
users = [{:username => 'ateam', :password => 'ateam', :password_confirmation => 'ateam', :current_password=>'ateam',
       :email => 'smalltigerson@tamu.edu', :first_name => 'Xianzhi', :last_name => 'Liu', :function => 'donor management, dashboard, report management, user management',
       :phone_number => '9794029226', :street_address => '1501 Holleman Dr.', :zipcode => "77845", :city => "College Station"
       }
       ]
users.each do |user|
  User.create!(user)
end
