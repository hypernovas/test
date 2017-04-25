require 'rails_helper'
require 'spec_helper'

RSpec.describe DonorsController, type: :controller do
    describe '#new' do
        it 'should route to donors#new' do
            expect(:get => new_donor_path).to route_to(
                :controller => 'donors',
                :action => 'new'
            )
        end
        
        describe 'after successful route' do
            before :each do
                allow(Donor).to receive('new'){@donor}
                get :new
            end
            it 'should render the new donor template' do
                
                expect(response).to render_template('new')
            end
            it 'should make the empty user available in the template' do
                expect(assigns(:donor)).to eq(@donor)
            end
        end
    end
    describe '#create' do
    end
end