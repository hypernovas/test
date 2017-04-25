When /^(?:|I )login with "([^"]*)" and "([^"]*)"$/ do |name, psw|
  fill_in("Username", :with => name)
  fill_in("Password", :with => psw)
end
