Feature: Logic/Edit rules modal Prot Tests

   Scenario: 1.Test cases for RAIN-1404 Form Logic
      Given STEP-1: Logic icon should be visible for radio,yesNo,checkbox, dropdown with choices and DateTime elements only
      When STEP-2: Add rule button should not be visible if there is only one element in the form body
      Then STEP-3: add rule to question in a published form and verify if the rules can be deleted
      Then STEP-4: edit rule applied to a question
      Then STEP-5: add rule to a question and then delete that element from form area so rule associated with it will also get deleted
      Then STEP-6: If user will delete a question which is hidden then rule associated with it should get delete
      Then STEP-7: add rule to a question then save that form and check rule by opening that form
      Then STEP-8: single edit for multiple rules