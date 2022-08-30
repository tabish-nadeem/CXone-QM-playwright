Feature: Verification of Interaction page records and able to create a Self Assessment

    Scenario: Scenario-1 Initiating the Self Assessment as a Manager1
        Given Step-1: Should launch incontact center URL
        When Step-2: Should enter the Username and Password as Manager1 and click on next button
        Then Step-3: Should navigate to Self Assessments Page and verifying New Self Assessment button
        Then Step-4: Should verify Create New Self Assessment Modal label text
        Then Step-5: Should Initiate a Self Assessment
        Then Step-6: Should verify Initiated Self Assessment
        Then Step-7: Should verify Interaction player Popup URL
        Then Step-8: Should logout from application for Manager1 user

    Scenario: Scenario-2 Verifying initiated self assessment data by Manager 1 at Manager 2 side
        When Step-1: Should enter the Username and Password as Manager2 and click on next button
        Then Step-2: Should verify Self Assessment Data Initiated by Manager1
        Then Step-3: Should logout from application for Manager2 user

    Scenario: Scenario-3 Verify Submitting Self-assessment from agent side
        When Step-1: Should enter the Username and Password as Agent User1 and click on next button
        Then Step-2: Should submit Evaluation
        Then Step-3: Should logout from application for Agent User1 user

    Scenario: Scenario-4 Verify data at manager 1 side after agent completes self assessment
        When Step-1: Should enter the Username and Password as Manager1 and click on next button
        Then Step-2: Should verify Self Assessment Grid
        Then Step-3: Should verify verify Cancel Delete Operation
        Then Step-4: Should verify delete operation for completed self assessment
        Then Step-5: Should logout from application for Manager1 user

    Scenario: Scenario-5 Verify self-assessment at agent side
        Then Step-1: Should verify self assessment at agent side

    Scenario: Scenario-6 Verifying the Status filter
        When Step-1: Should enter the Username and Password for Admin User and click on next button
        Then Step-2: Should verify Create Self Assessment Tasks
        Then Step-3: Should Verify Filter
        Then Step-4: Should Verify Column Sorting