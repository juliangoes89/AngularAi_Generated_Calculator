Feature: Calculator Input and Display
  As a user
  I want to input numbers and see them displayed correctly
  So that I can verify my input before performing calculations

  Background:
    Given I have a calculator open

  Scenario: Display shows initial zero
    Then the display should show "0"
    And the previous display should be empty

  Scenario: Entering single digit numbers
    When I click "7"
    Then the display should show "7"

  Scenario: Entering multi-digit numbers
    When I click "1" then "2" then "3" then "4"
    Then the display should show "1234"

  Scenario: Entering decimal numbers
    When I click "5"
    And I click "."
    And I click "9" then "9"
    Then the display should show "5.99"

  Scenario: Cannot enter multiple decimal points
    When I click "3"
    And I click "."
    And I click "1"
    And I click "."
    And I click "4"
    Then the display should show "3.14"

  Scenario: Decimal point as first character
    When I click "."
    And I click "5"
    Then the display should show "0.5"

  Scenario: Replacing initial zero with first digit
    Given the display shows "0"
    When I click "9"
    Then the display should show "9"