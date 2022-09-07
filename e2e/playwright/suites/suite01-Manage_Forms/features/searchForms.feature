Feature: Search forms on grid Protractor Tests

    Scenario: Scenario-1 Test cases for RAIN-462 Search Forms
        Given should create multiple forms and search form by numbers on grid : P1
        When should create multiple forms and search form by alphabets on grid : P1
        Then should  verify that appropriate message should be displayed on grid if no matches found to user for his search string : P1
