require 'rails_helper'

RSpec.describe User, type: :model do
  
  describe 'ActiveModel test' do
    
    it 'has a valid user factory' do
      expect(build(:user)).to be_valid
    end
    
    describe 'attribute username' do
      it 'is invalid without a username' do
        expect(build(:no_username_user)).not_to be_valid
      end
      it "should be unique" do
        user = User.new
        expect(user).to validate_uniqueness_of(:username).case_insensitive 
      end
    end
    
    describe 'attribute password' do
      it 'is invalid without a password' do
        expect(build(:no_password_user)).not_to be_valid
      end
      
      it 'is invalid without a password confirmation' do
        expect(build(:no_password_confirmation_user)).not_to be_valid
      end
      
      it 'should validate the confirmation of password ' do
        user = User.new
        expect(user).to validate_confirmation_of(:password).on(:create)
      end 
    end
      
    describe 'attribute email' do
      it 'is invalid without a email' do
        expect(build(:no_email_user)).not_to be_valid
      end
      it "should be unique" do
        user = User.new
        expect(user).to validate_uniqueness_of(:email).case_insensitive 
      end
    end
    
    describe "name check" do
      it 'is invalid without a first name' do
        expect(build(:no_first_name_user)).not_to be_valid
      end
      it 'is invalid without a last name' do
        expect(build(:no_last_name_user)).not_to be_valid
      end
    end
    
  end
end
