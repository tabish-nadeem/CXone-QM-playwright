Feature: Verification of performance and plan monitoring screen for acknowledge type of workflow

   Scenario: Scenario-1 Teams and Groups Tests
      Given Step-1: should click on save and activate and verify the error message that one team needs to be selected
      When Step-2: should verify user is able to successfully select specific teams and groups from dropdowns, and the intersection count of agents should be correct
      Then Step-3: should be able to save teams and groups data and verify after opening draft plan

   Scenario: Scenario-2 Sampling and Evaluation Type Tests
      When Step-1: should have the default values and states for a new plan
      Then Step-2: should check that info message popup if max-days-back value is greater than 7 and the Occurrence date change from month to weekly
      Then Step-3: should be able to save as draft plan and verify sampling after opening the plan

   Scenario: Scenario-3 Plan Duration Tests
      When Step-1: should have the default values and states for a new plan
      Then Step-2: should reset start date to equal end date if start date is greater than end date
      Then Step-3: should be able to save as draft a recurring weekly plan
      Then Step-4: should be able to save as draft a one time plan

