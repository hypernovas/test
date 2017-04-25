# Usage:
# I should see the following "invoices" table:
#   | Invoice #    | Date     | Total Amount |
#   |    /\d+/     | 27/01/12 |       $30.00 |
#   |    /\d+/     | 12/02/12 |       $25.00 |
Then /^I should see the following "([^"]*)" table without first and last column:$/ do |table_id, expected_table|
  expected_table = expected_table.raw
  table = Nokogiri::HTML(page.body).css("table##{table_id}").map do |table|
    table.css("thead,tbody tr").map do |tr|
      tr.css('th:not(:first-child):not(:last-child), td:not(:first-child):not(:last-child)').map do |td|
        td.text
      end
    end
  end[0]
  assert_tables_match(table, expected_table)
end

World(TableMatchHelper)
