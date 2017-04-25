FactoryGirl.define do
  
  factory :user do
    username "12345678"
    password "222"
    password_confirmation "222"
    first_name "john"
    last_name "smith"
    email "johnsmith@yahoo.com"
    
    factory :no_username_user do
      username nil
    end
    
    factory :no_password_user do
      password nil
    end
    
    factory :no_password_confirmation_user do
      password_confirmation nil
    end
    
    factory :no_email_user do
      email nil
    end
    
    factory :no_first_name_user do
      first_name nil
    end
    
    factory :no_last_name_user do
      last_name nil
    end
  end
  
end