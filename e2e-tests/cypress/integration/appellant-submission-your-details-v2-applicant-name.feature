@smoketest
Feature: Name of original applicant

  Scenario: Valid name
    Given appeal is made on behalf of another applicant
    When original applicant name is submitted
    Then appeal tasks are presented
    And appeal is updated with the original applicant

  Scenario Outline: Invalid name
    Given appeal is made on behalf of another applicant
    When original applicant name <original applicant> is submitted
    Then original applicant value <original applicant> is invalid because <reason>
    And applicant name is presented
    And appeal is not updated with the original applicant <original applicant>
    Examples:
      | original applicant                                                                  | reason                            |
      | ""                                                                                  | "name missing"                    |
      | "A"                                                                                 | "name outside size constraints"   |
      | "Invalid name because it is eighty-one characters long  abcdefghijklmnopqrstuvwxyz" | "name outside size constraints"   |
      | "Invalid name with prohibited characters *3(/+"                                     | "name with prohibited characters" |
