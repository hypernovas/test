class FinancesController < ApplicationController
    def create
        a = params[:attr]
        @donor = Donor.find(params[:id])
        @finance = @donor.finances.build({
            :_type => a[0],
            :date => a[1],
            :amount => a[2],
            :description => a[3],
            :designation => a[4],
            :created_by => User.find(session[:user_id]).username,
            :last_modified_by => User.find(session[:user_id]).username
        })
        @finance.save!
        if a[5] != "" && !a[5].nil?
            if a[5] != "-1"
               con = Contact.find(a[5])
               if(!con.finances.nil?)
                   original = con.finances.id
               else
                   original = nil
               end
               con.update_attributes!({:finances => @finance})
           end
        end
        jdata={
            :id => @finance.id,
            :val => [@finance._type,
                     @finance.date,
                     @finance.amount,
                     @finance.description,
                     @finance.designation
            ],
            :original => original,
            :no_foreign => @finance.contact.nil?,
            :info => [
                     @finance.created_by,
                     @finance.last_modified_by
            ]
        }
        render :json => jdata if request.xhr?
    end

    def destroy
        @finance = Finance.find(params[:id])
        original =  @finance.contact
        if(original.nil?)
            original = ""
        else 
            original = original.id
        end
        @finance.destroy
        render :json => [original] if request.xhr?
    end
    
    def update
        @finance = Finance.find(params[:id])
        a = params[:attr]
        @finance.update_attributes!({
            :_type => a[0],
            :date => a[1],
            :amount => a[2],
            :description => a[3],
            :designation => a[4],
            :created_by => User.find(session[:user_id]).username,
            :last_modified_by => User.find(session[:user_id]).username
        })
        if a[5] != "" && !a[5].nil?
            if a[5] == "-1"
                con = @finance.contact
                if !con.nil?
                    con.update_attributes!({:finances => nil})
                end
                @finance.update_attributes!({:contact => nil})
            else
               con = Contact.find(a[5])
               if(!con.finances.nil?)
                   original = con.finances.id
               else
                   original = nil
               end
               con.update_attributes!({:finances => @finance})
           end
        end
        jdata={
            :id => @finance.id,
            :val => [@finance._type,
                     @finance.date,
                     @finance.amount,
                     @finance.description,
                     @finance.designation
            ],
            :original => original,
            :no_foreign => @finance.contact.nil?,
            :info => [
                     @finance.created_by,
                     @finance.last_modified_by
            ]
        }
        render :json => jdata if request.xhr?
        
    end
    
    def show
        @finance = Finance.find(params[:id])
        if @finance.contact.nil?
            jdata = ""
        else
            jdata = @finance.contact.id
        end
        render :json => [jdata] if request.xhr?
    end
end
