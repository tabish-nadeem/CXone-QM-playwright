Feature: Duplicate Form Modal Prot Tests

    Scenario: Scenario-1 List of tests for RAIN-468
        Given should create a duplicate form of existing form;Also should verify if existing name is specified while duplicating form
        When should be able to cancel duplicate form creation : P2
        Then should be able to create a duplicate form of already duplicated form : P2
        Then should create a duplicate form from active form and duplicated form status should be draft :P2
        Then should verify that user is not able to save a form with special characters except "-" and "_" :P1
  
