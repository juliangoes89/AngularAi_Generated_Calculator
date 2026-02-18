Feature: Basic Calculator Operations
  As a user
  I want to perform basic arithmetic calculations
  So that I can solve mathematical problems

  Background:
    Given I have a calculator open
    And the display shows "0"

  Scenario: Adding two positive numbers
    When I click "5"
    And I click "+"
    And I click "3"
    And I click "="
    Then the display should show "8"

  Scenario: Subtracting two numbers
    When I click "1" then "0"
    And I click "-"
    And I click "4"
    And I click "="
    Then the display should show "6"

  Scenario: Multiplying two numbers
    When I click "7"
    And I click "×"
    And I click "6"
    And I click "="
    Then the display should show "42"

  Scenario: Dividing two numbers
    When I click "2" then "0"
    And I click "÷"
    And I click "4"
    And I click "="
    Then the display should show "5"

  Scenario: Division by zero shows error
    When I click "5"
    And I click "÷"
    And I click "0"
    And I click "="
    Then the display should show "Error"

  Scenario: Working with decimal numbers
    When I click "3"
    And I click "."
    And I click "1" then "4"
    And I click "+"
    And I click "2"
    And I click "."
    And I click "7"
    And I click "="
    Then the display should show a number close to "5.84"

  Scenario: Chain multiple operations
    When I click "1" then "0"
    And I click "+"
    And I click "5"
    And I click "-"
    And I click "3"
    And I click "="
    Then the display should show "12"