# spec/support/spec_test_helper.rb
module SpecTestHelper   
  def login_admin
    login(:admin)
  end

  def login(user)
    user = User.where(:login => user.to_s).first if user.is_a?(Symbol)
    request.session[:user] = user.id
  end

  def current_user
    User.find(request.session[:user])
  end
end

module TableMatchHelper
  # @param table [Array[Array]]
  # @param expected_table [Array[Array[String]]]
  # The expected_table values are String. They are converted to
  # Regexp when they start and end with a '/'
  # Example:
  #
  #   assert_table_match(
  #     [["Name", "Date"], ["Philippe", "Feb 08"]],
  #     [["Name", "Date"], ["Philippe", "/\w{3} \d{2}/"]]
  #   )
  def assert_tables_match(table, expected_table)
    expected_table.each_index do |row_index|
      expected_table[row_index].each_index do |column_index|
        expected_cell = expected_table[row_index][column_index]
        cell = table.try(:[], row_index).try(:[], column_index)
        begin
          assert_cells_match(cell, expected_cell)
        rescue
          puts "Cell at line #{row_index} and column #{column_index}: #{cell.inspect} does not match #{expected_cell.inspect}"
          puts "Expecting:"
          table.each { |row| puts row.inspect }
          puts "to match:"
          expected_table.each { |row| puts row.inspect }
          raise $!
        end
      end
    end
  end

  def assert_cells_match(cell, expected_cell)
    if expected_cell[0].chr == '/' && expected_cell[-1].chr == '/'
      expect(cell).to match(Regexp.new(expected_cell[1..-2]))
    else
      expect(cell).to eq(expected_cell)
    end
  end
end # module TableMatchHelper

