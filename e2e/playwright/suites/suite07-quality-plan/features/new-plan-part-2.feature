Feature: Verification of performance and plan monitoring screen for acknowledge type of workflow

    Scenario: Scenario-1 Plan Summary Tests
        Given Step-1: should verify default values
        When Step-2: should verify plan days and interactions per agent
        Then Step-3: should verify total interactions and interactions per day per evaluator

     Scenario: Scenario-2 Evaluator Modal Tests
        When Step-1: should open new plan and verify that no evaluators are selected by default
        Then Step-2: should be able to add evaluators and save plan, and then update the plan
        Then Step-3: should not be able to add or delete evaluators for activated plan

     Scenario: Scenario-3 Enhanced Evaluator Modal Tests
        When Step-1: EnhancedEvaluator : should open new plan and verify that no evaluators are selected by default
        Then Step-2: EnhancedEvaluator : should open enhanced evaluator modal to add evaluators
        Then Step-3: EnhancedEvaluator : should be able to add evaluators , save plan as draft and verify evaluators
        Then Step-4: EnhancedEvaluator : should be able to remove evaluators from draft plan, activate plan and verify the changes
        Then Step-5: EnhancedEvaluator : should not be able to add or delete evaluators for activated plan

     Scenario: Scenario-4 Edit-Evaluator scenarios
        When Step-1: should open active plan and verify that add-evaluator button is enabled
        Then Step-2: should open active plan and verify that edit-evaluator info icon is visible with tooltip
        Then Step-3: should be able to add evaluators to active plan and save plan
        Then Step-4: should be able to remove evaluators from active plan and save plan
        Then Step-5: should open draft plan and verify that add-evaluator button is enabled and edit-evaluator info icon is not visible
        Then Step-6: should open inactive plan and verify that add-evaluator button is disabled, edit-evaluator info icon and delete evaluator button is not visible

     Scenario: Scenario-5 Save Draft and Activate scenarios
        When Step-1: should open new plan, press cancel, press Yes, and check that plan does not exist
        Then Step-2: should open new plan, press cancel, Press "No", and check that the page was not closed
        Then Step-3: should open new plan, press cancel without changing any plan details and check that we return to plan manager
        Then Step-4: should open a new plan, press Save as Draft and then press Save and Activate, check nothing happens till plan name is edited
        Then Step-5: should verify QP Details page state for an active plan

     Scenario: Scenario-6 Leave page modal scenarios
        When Step-1: should verify if user lands on desired page after clicking "YES" on warning modal
        Then Step-2: should verify that user is able to continue on page after clicking "NO" button on warning pop up
    

