Feature: Inactive Forms Protractor Tests

    Scenario: Scenario-1 Test cases to be executed for RAIN-698
        Given Step-1: should verify unpublish button is disabled by default: P1
        When Step-2: should verify User is be able to deactivate an active form; Also verify the cancel option for deactivate : P1
        Then Step-3: should verify user should be able to Active a disabled form : P1
        Then Step-4: should verify user is be able to deactivate multiple activated forms : P1
        Then Step-5: should verify user is be able to delete a inactive form : P1
        Then Step-6: should verify user should be able to duplicate a disabled form : P2

    