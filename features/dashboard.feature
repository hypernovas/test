Feature: Dashboard

Background: users has logged in and go to the dashboard page
   
    Given the following users exist:
     | username   | password 	      | email			    | first_name	| last_name	| function	|
     | Tony       | testpassword23    | 111@gmail.com	    | A				| D			| dashboard	|
	  
	Given the reports table:
     | title	|  description	| create_at	  | last_modified_at   | last_modified_by	   |
	 | 2014 	|  aaa			| 2014-3-21   | 2014-4-11          | AAA     | 
     | 2013		|  bbb			| 2013-3-22   | 2013-4-10          | BBB     |
	 | 2012		|  ccc			| 2012-3-23   | 2012-4-19           | CCC     |
	
    Given the donors table:
      | first_name	| last_name	| organization	| company	| title	| flag	|
      | Albert		| Einstein	| AAA			| Apple		| Prof.	| I		|
      | John		| Smiths	| BBB			| Facebook	| Mr.	| O		|
      | Daniel		| Freud		| CCC			| Linkedin	| Mr.	| I		|
	
	Given the contacts table:
	  | contact_date	| followup_date	| narrative	| donor_id	|
	  | 2016-04-01		| 2016-05-20	| a			| 1			|
	  | 2016-04-02		| 2016-05-13	| b			| 2			|
	  
    Given I have logged in as "Tony" with "testpassword23"
    Then I should be on the homepage
	And I follow "Dashboard"
	Then I should be on dashboard page
	
	Scenario: check out agenda
	  Given I am on dashboard page
	  Then I should see the following "agendaTable" table without first and last column:
	  | Name              | Organization  | Contact Date   |  Followup Date 	|
	  | Mr. John Smiths    	  | BBB           | 2016-04-02     | 2016-05-13         |
	  | Prof. Albert Einstein  | AAA           | 2016-04-01     | 2016-05-20         |


	Scenario: check out recently report
	  Given I am on dashboard page
	  Then I should see the following "reportTable" table without first column:
	  | Title	| Description  	| Last Modified By 	|
	  | 2012 	| ccc			| CCC				|
	  | 2013	| bbb			| BBB				|
	  | 2014	| aaa			| AAA				|
	  
	
	Scenario: check out recently edited contact
	  Given I am on dashboard page
	  Then I should see the following "addedDonorTable" table without first column:
	  | Type| First Name	| Last Name	| Company  	| Organization	|
      | I	| Daniel		| Freud		| Linkedin	| CCC 		|
      | O	| John			| Smiths	| Facebook	| BBB		|	
      | I	| Albert		| Einstein	| Apple		| AAA		| 
