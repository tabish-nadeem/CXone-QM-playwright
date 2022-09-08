Feature: Manage form tests

    Scenario: Scenario-1 viewing manage forms page
        Given P2: verify page title, form count and create form button
        When P1: should reflect timestamp and user name for last modification

    Scenario: Scenario-2 Test cases for RAIN-1085
        Given P3: Activate button should be disabled by defaultorm button
        When P1: should activate multiple forms
        Then P1: should activate only draft forms and should neglect already activated(earlier published) ones

    Scenario: Scenario-3 Test cases to be executed for RAIN-464
        Given P1: should publish a single form using a more menu
        When P2: Activate option should not be present for already activated form in more menu
        
    Scenario: Scenario-4 Test cases to be executed for RAIN-465
        Given P1: should show popover message if mouse over on delete icon of published form
        When P2: should not delete forms if user will try to delete two forms having status as one is draft and other is activated
        Then P1: should delete multiple draft forms by selecting checkboxes and clicking on delete button in upper tool bar
        Then P1: should delete a single draft form using delete icon
