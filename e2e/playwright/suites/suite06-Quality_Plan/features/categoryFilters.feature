Feature: Verification of category filters quality plan

   Scenario: 1.Category Filter tests
      Given STEP-1: should be able to see category filter
      When STEP-2: should be able to set and delete individual category, and clear all categories
      Then STEP-3: should be able to create new draft plan with category filters and should reopen and verify the saved filter
      Then STEP-4: should not be able to see category filter when tenant has no QMA license
