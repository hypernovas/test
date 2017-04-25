Feature: Homepage
Background: users logged in to homepage
   Given the following users exist:
    | username   | password 	   	   | email			| first_name	| last_name	| function			|
    | Tony       | testpassword123	   | 111@gmail.com	| A				| D			| donor management, dashboard, report management, user management	|
    | Jojo       | testpassword123     | 222@gmail.com	| B				| E			| donor management	|
    | Stephen    | testpassword123     | 333@gmail.com	| C				| F			| report management	|
    | Bob        | testpassword123     | 444@gmail.com	| D				| G			| dashboard			|
   
Scenario: Administrator
  Given I have logged in as "Tony" with "testpassword123"
  Then I should be on home page  
  
  And I follow "Donor Management"
  Then I should be on the donor page  
  
  Given I am on the home page
  And I follow "Dashboard"
  Then I should be on the dashboard page
  
  Given I am on the home page
  And I follow "Report"
  Then I should be on the report page  
  
  Given I am on the home page
  And I follow "Sign Out"
  Then I should be on the index page
  
Scenario: Donor Manager
  Given I have logged in as "Jojo" with "testpassword123"
  Then I should be on home page  
  
  And I follow "Donor Management"
  Then I should be on the donor page  
  
  Given I am on the home page
  And I follow "Dashboard"
  Then I should be on the homepage
  
  Given I am on the home page
  And I follow "Report"
  Then I should be on the homepage
  
  Given I am on the home page
  And I follow "Sign Out"
  Then I should be on the index page
  
Scenario: Dashboard Manager
  Given I have logged in as "Bob" with "testpassword123"
  Then I should be on home page  
  
  And I follow "Donor Management"
  Then I should be on the homepage
  
  Given I am on the home page
  And I follow "Dashboard"
  Then I should be on the dashboard page
  
  Given I am on the home page
  And I follow "Report"
  Then I should be on the homepage
  
  Given I am on the home page
  And I follow "Sign Out"
  Then I should be on the index page
  
Scenario: Report Manager
  Given I have logged in as "Stephen" with "testpassword123"
  Then I should be on home page  
  
  And I follow "Donor Management"
  Then I should be on the homepage
  
  Given I am on the home page
  And I follow "Dashboard"
  Then I should be on the homepage
  
  Given I am on the home page
  And I follow "Report"
  Then I should be on the report page
  
  Given I am on the home page
  And I follow "Sign Out"
  Then I should be on the index page
  
