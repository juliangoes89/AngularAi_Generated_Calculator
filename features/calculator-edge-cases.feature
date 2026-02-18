Feature: Calculator Error Handling and Edge Cases
  As a user
  I want the calculator to handle errors gracefully
  So that I can recover from mistakes and continue calculating

  Background:
    Given I have a calculator open

  Scenario: Division by zero shows error
    When I perform calculation "10 ÷ 0"
    Then the display should show "Error"
    And the calculator should be in error state

  Scenario: Recovery from error state
    Given I have a division by zero error
    When I click "AC"
    Then the display should show "0"
    And I can perform normal calculations

  Scenario: Very large number display
    When I perform calculation "999999999 × 999999999"
    Then the display should show a number in scientific notation

  Scenario: Very small number display
    When I perform calculation "1 ÷ 9999999"
    Then the display should show a very small number

  Scenario: Consecutive equals operations
    When I click "5"
    And I click "+"
    And I click "3"
    And I click "="
    Then the display should show "8"
    When I click "="
    Then the display should show "8"

  Scenario: Operation without second operand
    When I click "5"
    And I click "+"
    And I click "="
    Then the display should show "5"

  Scenario: Multiple operations in sequence
    When I click "2"
    And I click "+"
    And I click "3"
    And I click "×"
    And I click "4"
    And I click "="
    Then the display should show "20"