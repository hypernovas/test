Feature: Donor Search
Background: users logged in and navigate to donor search page
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
  
Scenario: Donor Overview
  Then I should see the following "table_donor" table without first column:
    | Flag  | Title   | First Name	| Last Name	| Organization	| Company	    | 
    | I     | Prof.   | Albert      | Einstein  | AAA           | Apple       |
    | O     | Mr.     | John        | Smiths    | BBB           | Facebook    |
    | I     | Mr.     | Daniel      | Freud     | CCC           | Linkedin    |
  
  