Feature: Signin to the system
Background: users in database
    Given the following users exist:
    | username   | password 	   | email		   | first_name	| last_name	|
    | Tony       | testpassword23  | 111@gmail.com | aaa		| aaa		|
    | Jojo       | notthistime     | 222@gmail.com | bbb		| bbb		|
    | Ste        | welcomeback     | 333@gmail.com | ccc		| ccc		|

Scenario: try to login with true identity (happy path)
	Given I am on the index page
	When I login with "Jojo" and "notthistime"
	And I press "Login"
	Then I should be on home page

Scenario: try to login with false identity (sad path)
	Given I am on the index page
	When I login with "Jojo" and "welcomeback"
	And I press "Login"
	Then I should be on index page
	And I should see "Username and password do not match our record!"
