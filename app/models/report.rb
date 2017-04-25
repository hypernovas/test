class Report < ActiveRecord::Base
    has_many :filters, dependent: :destroy
    
    attr_accessible :title, :description, :last_run, :created_by, :created_at, :last_modified_by, :last_modified_at
    
    validates :title, :presence => true
    
    def self.generate(configs)
      tables = configs.keys
      select_statement = ""
      where_statement = ""
      if tables.count == 1
        model = tables[0].singularize.classify.constantize
        
        configs.each do |table,field|
          field.each do |fieldname,attribute|
            select_statement += table.pluralize+"."+fieldname+","
            attribute.each do |attrname,value|
              case attrname
              when 'value'
                if value.start_with? '%'
                  where_statement+=fieldname+" LIKE '"+value.to_s+"%' AND "
                else
                  where_statement+=fieldname+"='"+value.to_s+"' AND "
                end
              when 'min_value'
                  where_statement+=fieldname+">='"+value.to_s+"' AND "
              when 'max_value'
                  where_statement+=fieldname+"<='"+value.to_s+"' AND "
              when 'min_date'
                  where_statement+=fieldname+">='"+value.to_s+"' AND "
              when 'max_date'
                  where_statement+=fieldname+"<='"+value.to_s+"' AND "
              end
            end
          end
        end
        
        if !select_statement.empty?
          select_statement = select_statement[0...select_statement.rindex(',')]
          records = model.all.select(select_statement)
        else
          records = nil
        end
        
        if !where_statement.empty?
          where_statement = where_statement[0...where_statement.rindex(' ',-2)]
          records = records.where(where_statement)
        end
        
      elsif tables.count == 2
        if tables.include? 'finance' and tables.include? 'contact'
          records = nil
        else
          configs.each do |table,field|
            field.each do |fieldname,attribute|
              select_statement += table.pluralize+"."+fieldname+","
              attribute.each do |attrname,value|
                case attrname
                when 'value'
                  if value.start_with? '%'
                    where_statement+=fieldname+" LIKE '"+value.to_s+"%' AND "
                  else
                    where_statement+=fieldname+"='"+value.to_s+"' AND "
                  end
                when 'min_value'
                    where_statement+=fieldname+">='"+value.to_s+"' AND "
                when 'max_value'
                    where_statement+=fieldname+"<='"+value.to_s+"' AND "
                when 'min_date'
                    where_statement+=fieldname+">='"+value.to_s+"' AND "
                when 'max_date'
                    where_statement+=fieldname+"<='"+value.to_s+"' AND "
                end
              end
            end
          end
          
          if tables.include? 'contact'
            if !select_statement.empty?
              select_statement = select_statement[0...select_statement.rindex(',')]
              records = Donor.joins(:contacts).select(select_statement)
            else
              records = nil
            end
          elsif tables.include? 'finance'
            if !select_statement.empty?
              select_statement = select_statement[0...select_statement.rindex(',')]
              records = Donor.joins(:finances).select(select_statement)
            else
              records = nil
            end
          end
          
          if !where_statement.empty?
            where_statement = where_statement[0...where_statement.rindex(' ',-2)]
            records = records.where(where_statement)
          end
        end
      elsif tables.count == 3
        configs.each do |table,field|
          field.each do |fieldname,attribute|
            select_statement += table.pluralize+"."+fieldname+","
            attribute.each do |attrname,value|
              case attrname
              when 'value'
                if value.start_with? '%'
                  where_statement+=fieldname+" LIKE '"+value.to_s+"%' AND "
                else
                  where_statement+=fieldname+"='"+value.to_s+"' AND "
                end
              when 'min_value'
                  where_statement+=fieldname+">='"+value.to_s+"' AND "
              when 'max_value'
                  where_statement+=fieldname+"<='"+value.to_s+"' AND "
              when 'min_date'
                  where_statement+=fieldname+">='"+value.to_s+"' AND "
              when 'max_date'
                  where_statement+=fieldname+"<='"+value.to_s+"' AND "
              end
            end
          end
        end
        
        if !select_statement.empty?
          select_statement = select_statement[0...select_statement.rindex(',')]
          records = Donor.joins(:contacts, :finances).select(select_statement)
        end
        
        if !where_statement.empty?
          where_statement = where_statement[0...where_statement.rindex(' ',-2)]
          records = records.where(where_statement)
        end
      end
      return records
    end
end
