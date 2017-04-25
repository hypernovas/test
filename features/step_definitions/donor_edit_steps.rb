When /(?:|I) click "([^"]*)" of row ([0-9]+)$/ do |btn, rownum|
	row = Nokogiri::HTML(page.body).css("tbody tr:nth-child(#{rownum})")
	puts row
	button = row.css("#{btn}")[0]
	click_on(button)
end

When /(?:|I) switch to "([^"]*)"$/ do |tab|
	click_on(tab)
end