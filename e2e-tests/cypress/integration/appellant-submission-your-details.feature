@smoketest
Feature: A user provides their details
  The user is required to provide a valid name and email to complete an appeal.

  Scenario Outline: Valid name and email provided
    When the user provides their valid <name> and <email>
    Then the appeal's Your Details task is completed with <name> and <email>
    And the user can see that their appeal has been updated with <name> and <email>

    Examples:
      | name         | email                 |
      | "Good"       | "abc@mail.com"        |
      | "Good Name"  | "abc.def@mail.fr"     |
      | "Good-Name"  | "abc_def@mail.com"    |
      | "Also' Good" | "abc.def2@mail.com"   |

  Scenario Outline: Invalid email provided
    When the user provides the email <invalid email>
    Then the user is informed that the provided email is invalid
    And the user can see that their appeal has not been updated with "email"

    Examples:
       | invalid email                |
       | "abc-@mail.com"              |
       | "abc..def@mail.com"          |
       | ".abc@mail.com"              |
       | "abc#def@mail.com"           |
       | "abc=@mail.com"              |
       | "abc@mail.c"                 |
       | "abc.def@mail#archive.com"   |
       | "abc#def@mail"               |
       | "abc#def@mail..com"          |


  Scenario Outline: Invalid name provided
    When the user provides the name <invalid name>
    Then the user is informed that the provided name is invalid
    And the user can see that their appeal has not been updated with "name"
    Examples:
      | invalid name          |
      | "(Bad Name"           |
      | "Bad Name 2"          |
      | "Bad^Name"            |
      | "bad@name.com"        |

  Scenario: Email detail is missing
    When the user provides only a name
    Then the user is informed that the email is missing
    And the user can see that their appeal has not been updated with "name and email"

  Scenario: Name detail is missing
    When the user provides only an email
    Then the user is informed that the name is missing
    And the user can see that their appeal has not been updated with "name and email"

  Scenario: Prospective appellant provides a valid name that replaces previous value
    Given user has previously provided a name "Timmy Tester" and email "timmy@example.com"
    When the user provides an updated name "Jonny Tester"
    Then the appeal's Your Details task remains completed with name "Jonny Tester" and email "timmy@example.com"

  Scenario: Prospective appellant provides an invalid name that does not replace previous value
    Given user has previously provided a name "Timmy Testfield" and email "t.testfield@example.com"
    When the user provides the name "Bad Name 2"
    Then the user is informed that the provided name is invalid
    And the appeal's Your Details task remains completed with name "Timmy Testfield" and email "t.testfield@example.com"

  Scenario: Prospective appellant provides a valid email that replaces previous value
    Given user has previously provided a name "Timmy Testfield" and email "timmy@example.com"
    When the user provides an updated email "t.testfield@example.com"
    Then the appeal's Your Details task remains completed with name "Timmy Testfield" and email "t.testfield@example.com"

  Scenario: Prospective appellant provides an invalid email that does not replace previous value
    Given user has previously provided a name "Timmy Testfield" and email "timmy@example.com"
    When the user provides the email "abc#def@mail..com"
    Then the user is informed that the provided email is invalid
    And the appeal's Your Details task remains completed with name "Timmy Testfield" and email "timmy@example.com"
