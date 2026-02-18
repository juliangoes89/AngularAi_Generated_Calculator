Feature: Simple Calculator Test
  As a user
  I want to test basic functionality
  So that I know the calculator works

  Background:
    Given I have a calculator open

  Scenario: Display shows initial zero
    Then the display should show "0"

  Scenario: Simple addition
    When I click "2"
    And I click "+"
    And I click "3"
    And I click "="
    Then the display should show "5"