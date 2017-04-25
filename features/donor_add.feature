Feature: Donor Add
Background: users logged in and navigate to donor search page
  Given the following users exist:
    | username   | password 	   	   | email		   	| first_name	| last_name	| function			|
    | Jojo       | testpassword123     | 222@gmail.com	| B				| E			| donor management	|
    | Ste        | testpassword123     | 333@gmail.com	| C				| F			| report management	|
    | Bob        | testpassword123     | 444@gmail.com	| D				| G			| dashboard			|
  
  Given I have logged in as "Jojo" with "testpassword123"
Scenario: Navigate to add new donor page
  When I am on donor page
  And I follow "Add New"
  Then I should be on the new donor page

@javascript
Scenario: Fill out donor basic information
  Given I am on the new donor page
  When I fill in the following:
  	| title	| Mr.	|
  	| salution	| Mr.	|
  	| first_name	| Albert	|
  	| last_name	| Einstein	|
  	| middle_name	| Jr.	|
  	| email	| abc@tamu.edu	|
  	| home_phone	| 123456789	|
  	| business_phone	| 987654321	|
  	| zipcode	| 11111	|
  	| company	| Apple	|
  	| organization	| ABC	|
  	| street_address	| St. Peter Street	|
  	| city	| Houston	|
  And I select "O" from "donor_flag"
  And I submit with "Create Donor"
  #Then I should see "Successfully saved"
  Then I should be on the new donor page
  And I follow "Back"
  Then I should see "O"
  And I should see "Albert"
  And I should see "Einstein" 
  And I should see "Mr."
  And I should see "ABC"
  And I should see "Apple"