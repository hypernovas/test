Feature: Signup
Background: user in database and given access code
    Given the following users exist:
    | username   | password 	   | email		   | first_name	| last_name	|
    | Tony       | testpassword23  | 111@gmail.com | aaa		| aaa		|
    | Jojo       | notthistime     | 222@gmail.com | bbb		| bbb		|
    | Ste        | welcomeback     | 333@gmail.com | ccc		| ccc		|

	And Given the email:
	|  email  	        |
	|  frank@gmail.com  |

	Given I am on the index page 
	When I follow "Sign Up"
	Then I am on the signup page

Scenario: signup with new identity(happy path)
	Given I am on the signup page
	When I fill in "Username" with "frank"
	And I fill in "Password" with "abcdefgh"
	And I fill in "First Name" with "Frank"
	And I fill in "Last Name" with "Zhang"
	And I fill in "Confirm Password" with "abcdefgh"
	And I fill in "Email" with "frank@gmail.com"
	And I fill in "First Name" with "Frank"
	And I fill in "Last Name" with "Zhang"
	And I press "Create"
	Then I should be on the index page
	And I should see "You have signed up successfully"


Scenario: try to signup with invalid information(sad path)
	Given I am on the signup page
	When I fill in "Username" with "frank"
	And I fill in "Password" with "abcdefgh"
	And I fill in "First Name" with "Frank"
	And I fill in "Last Name" with "Zhang"
	And I fill in "Confirm Password" with "abcdefgh"
	And I fill in "Email" with "frank1@gmail.com"
	And I fill in "First Name" with "Frank"
	And I fill in "Last Name" with "Zhang"
	And I press "Create"
	Then I should be on signup page
	Then I should see "Unauthorized email address"

