Then /^the "([^"]*)" field should be empty$/ do |field|
    field_labeled(field).value.should =~ nil
end

Then /^the "([^"]*)" field should be "([^"]*)"$/ do |field, value|
    field_labeled(field).value.should =~ /#{value}/
end

    
