Feature: Verification of quality plan manager

   Scenario: 1.Viewing plan manager page
      Given STEP-1: Should verify page title, plan count and overlay text
      When STEP-2: Should be able to navigate to new plan page

   Scenario: 2.Verify different plan actions on already available plans
      When STEP-1: Should check actions available on a particular plan
      Then STEP-2: Should verify if plan can be duplicated
      Then STEP-3: Should verify plan can be activated
      Then STEP-4: Should verify plan can be deactivated
      Then STEP-5: Should verify plan can be deleted
      Then STEP-6: Should verify invalid plan cannot be activated