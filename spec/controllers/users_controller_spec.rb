require 'rails_helper'
require 'spec_helper'

RSpec.describe UsersController, type: :controller do
    
    describe '#new' do
        it 'should route to users#new' do
            expect(:get => new_user_path).to route_to(
                :controller => 'users',
                :action => 'new'
            )
        end
        describe 'after successful route' do
            before :each do
                allow(User).to receive('new'){@user}
                get :new
            end
            it 'should render the sign up template' do
                expect(response).to render_template('new')
            end
            it 'should make the empty user available in the template' do
                expect(assigns(:user)).to eq(@user)
            end
        end
    end
    
    describe '#create' do
        before :each do
            @fake_user = double(:id => '1',:email => 'aaa@gmail.com')
            @user = {:id => '1', :email => 'aaa@gmail.com'}
            allow(User).to receive(:new).with(@user){@fake_user}
        end
        it 'should route to users#create' do
            expect(:post => users_path).to route_to(
                :controller => 'users',
                :action => 'create'
            )
        end
        describe 'after successful route' do
            describe 'successful finding the user email in access table(happy path 1)' do
                before :each do
                    allow(Access).to receive(:exists?).with(:email => @fake_user.email) {true}
                end
                describe 'successful creating (happy path 2)' do
                    before :each do
                        allow(@fake_user).to receive(:save).and_return(true)
                        post :create, {:user => @user}
                    end
                    it 'should set up the session' do
                        expect(session[:user_id]).to eq(@fake_user.id)
                    end
                    it 'should redirect to login page' do
                        expect(response).to redirect_to(root_path)
                    end
                end
                
                describe 'unsuccessful creating (sad path 2)' do
                    before :each do
                        allow(@fake_user).to receive(:save) {false} 
                        post :create, {:user => @user}
                    end
                    it 'should redirect to the sign up page' do
                        expect(response).to redirect_to(new_user_path)
                    end
                end
            end
            
            describe 'unsuccessful finding the user email in access table (sad path 1)' do
                before :each do
                    allow(Access).to receive(:exists?).with(:email => @fake_user.email) {false}
                    post :create, {:user => @user}
                end
                it 'should set up the flash' do
                    expect(flash[:notice]).to eq("Unauthrized email address.")
                end
                it 'should redirect to the sign up page' do
                    expect(response).to redirect_to(new_user_path)
                end
            end
        end
    end
end

