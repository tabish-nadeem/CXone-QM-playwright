Feature: Auto answer admin view modal tests

   Scenario: 1.Auto-Answer modal test cases
      Given STEP-1: verify auto response rule icon should be visible to yesno,radio,checkbox type element only
      When STEP-2: Should open auto response modal, select behaviourCategories and save auto answer rules for each element
      Then STEP-3: should verify & edit saved behaviour auto response rules
      Then STEP-4: Should not allow save auto answer rules and display warning message when selecting identical behaviourCategories
      Then STEP-5: Should not allow save auto answer rules and display warning message when selecting identical sentiments
      Then STEP-6: Should open auto response modal, select sentiments and save auto answer rules for each element
      Then STEP-7: should verify & edit saved sentiment auto response rules
      Then STEP-8: should verify saved sentiment auto response rules when changing ruletype to behaviour is canceled
      Then STEP-9: Should open auto response modal, select categories and save auto answer rules for each element
      Then STEP-10: should verify & edit saved auto answer rules
      Then STEP-11: should save form as draft and verify auto-answer rules
      Then STEP-12: should duplicate form and verify auto-answer rules
      Then STEP-13: should publish form and verify auto-answer rules
      Then STEP-14: should be able to remove auto answer rules for each question