Feature: Inactive Forms Protractor Tests

    Scenario: Scenario-1 Test cases to be executed for RAIN-698
        Given should verify unpublish button is disabled by default: P1
        When should verify User is be able to deactivate an active form; Also verify the cancel option for deactivate : P1
        Then should verify user should be able to Active a disabled form : P1
        Then should verify user is be able to deactivate multiple activated forms : P1
        Then should verify user is be able to delete a inactive form : P1
        Then should verify user should be able to duplicate a disabled form : P2
