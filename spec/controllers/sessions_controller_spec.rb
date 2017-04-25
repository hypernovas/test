require 'rails_helper'
require 'spec_helper'

RSpec.describe SessionsController, type: :controller do
  describe "user logging in" do
    it "should route /login to sessios#create" do
      expect(:post => login_path).to route_to(
        :controller => "sessions",
        :action => "create"
      )
    end
    describe "after valid routing" do
      describe "on successful finding the user" do
        before :each do
          @user1 = double('user1',:id => 1,:username => 'aaa', :password => '111')
          allow(User).to receive(:find_by_username).with(@user1.username){@user1}
        end
        describe " and after calling model to get the user instance" do
          describe "on successful log in" do
            before :each do
              allow(@user1).to receive(:authenticate).with(@user1.password){true}
              post :create, {:session => {:username => 'aaa', :password => '111'}}
            end
            it "the session should be set up" do
              expect(session[:user_id]).to eq(@user1.id)
            end
            it "and should be redirected to user homepage" do
              expect(response).to redirect_to(homepage_path)
            end
          end
          describe "on failed log in" do
            before :each do
              allow(@user1).to receive(:authenticate).with(@user1.password){false}
              post :create, {:session => {:username => 'aaa', :password => '111'}}
            end
            it "should be redirected to index page on failure log in" do
              expect(response).to redirect_to(root_path)
            end
          end
        end
      end
      describe "on failed finding the user" do
        before :each do
          allow(User).to receive(:find_by_username).with('bbb'){nil}
          post :create, {:session => {:username => 'bbb', :password => '111'}}
        end
        it "should redirect to login page if the user does not exist" do
          expect(response).to redirect_to(root_path)
        end
      end
    end
  end
    
  describe 'user logging out' do
    it "should route /logout to sessios#destroy" do
      expect(:get => logout_path).to route_to(
        :controller => "sessions",
        :action => "destroy"
      )
    end
        
    describe 'after successful route to sessions#destroy' do
      before :each do
        get :destroy
      end
      it "should assign the flash message" do
        expect(flash[:notice]).to eq("You have successfully logged out!")
      end
      it "should clear the session" do
        expect(session[:user_id]).to eq(nil)
      end
      it "should redirect to index page" do
        expect(response).to redirect_to root_path  
      end
    end
  end
end
