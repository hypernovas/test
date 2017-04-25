Feature: Donor Search
Background: users logged in and nevigate to donor search page
  Given the following users exist:
    | username   | password 	   	     | email		    	| first_name	  | last_name	| function			|
    | Jojo       | testpassword123     | 222@gmail.com	| B				| E			| donor management	|
    | Ste        | testpassword123     | 333@gmail.com	| C				| F			| report management	|
    | Bob        | testpassword123     | 444@gmail.com	| C				| F			| dashboard			|
  
  Given the donors table:
    | first_name	| last_name	| organization	| company	| title	| flag	|
    | Albert		| Einstein	| AAA			| Apple		| Prof.	| I		|
    | John			| Smiths	| BBB			| Facebook	| Mr.	| O		|
    | Daniel		| Freud		| CCC			| Linkedin	| Mr.	| I		|
  
  Given I have logged in as "Jojo" with "testpassword123"
  And I follow "Donor Management"
 
Scenario: Donor View
  When I click "View" of row 1
	Then I should be on donnor edit page 1
  