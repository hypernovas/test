Feature: Donor Edit
  Background: users logged in 
    Given the following users exist:
      | username   | password 	   	     | email		    	| first_name	  | last_name	| function			|
      | Jojo       | testpassword123     | 222@gmail.com	| B				| E			| donor management	|
      | Ste        | testpassword123     | 333@gmail.com	| C				| F			| report management	|
      | Bob        | testpassword123     | 444@gmail.com	| C				| F			| dashboard			|
    
    Given the donors table:
      | first_name	| last_name	| organization	| company	| title	| flag	|
      | Albert		| Einstein	| AAA		| Apple		| Prof.	| I		|
      | John			| Smiths	  | BBB			| Facebook	| Mr.	| O		|
      | Daniel		| Freud		  | CCC			| Linkedin	| Mr.	| I		|
   
  Given I have logged in as "Jojo" with "testpassword123"

Scenario: Navigate to donor edit page
  Given I am on donor page
	When I click "Edit" of row 1
	Then I should be on donor edit page 1
	
Scenario: Update donor basic
  Given I am on donor edit page 1
  Then I should see "Albert"
  And I should see "Basic"
  And I should not see "Update Donor"
  When I switch to "Basic"
  And I fill in the following:
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
  And I follow "Update Donor"
  Then I should see "Save successful"
