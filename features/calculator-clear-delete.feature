Feature: Calculator Clear and Delete Functions
  As a user
  I want to clear the calculator or delete digits
  So that I can correct mistakes or start over

  Background:
    Given I have a calculator open

  Scenario: Clear all with AC button
    Given I have entered "123"
    When I click "AC"
    Then the display should show "0"
    And the previous display should be empty

  Scenario: Delete last digit with DEL button
    Given I have entered "456"
    When I click "DEL"
    Then the display should show "45"

  Scenario: Delete from single digit shows zero
    Given I have entered "7"
    When I click "DEL"
    Then the display should show "0"

  Scenario: Delete from decimal number
    Given I have entered "12.34"
    When I click "DEL"
    Then the display should show "12.3"
    When I click "DEL"
    Then the display should show "12."
    When I click "DEL"
    Then the display should show "12"

  Scenario: Delete when display shows zero
    Given the display shows "0"
    When I click "DEL"
    Then the display should show "0"

  Scenario: Clear after error state
    Given I have a division by zero error
    When I click "AC"
    Then the display should show "0"
    And I can start fresh calculations