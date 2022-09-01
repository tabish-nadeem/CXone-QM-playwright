Feature:  Scoring modal Prot Tests

   Scenario: 1.Viewing Scoring modal
      Given STEP-1: Scoring modal should open after clicking on scoring button and Should close after clicking on set/cancel button
      When STEP-2: Scoring modal should open with default values to the radio button
      Then STEP-3: Scoring modal should open with default values to the checkbox after adding multiple options
      Then STEP-4: Scoring modal should open with default values to the radio button after adding option using copy
      Then STEP-5: Scoring modal should open with default values to the checkbox after adding multiple options

   Scenario: 2.Test cases to be executed for RAIN-1087 Scoring Dialogue - Reset questions
      When STEP-6: Reset button should be disabled by default and get enabled when enable scoring checkbox is checked
      Then STEP-7: Should verify functionality of Reset button on scoring modal
      

   Scenario: 3.RAIN-955- Current Score
      When STEP-8: Should verify current score is 0 if scoring is not enable
      Then STEP-9: Should verify current score is 100 if user fill all ans correct
      Then STEP-10: Should verify current score is getting updated after changing the ans option
      Then STEP-11: Correct current score and percentage should get calculated for elements

   Scenario: 4.RAIN-955- NA option selection and current points
      When STEP-12: If there is NA, After selecting NA question should get removed from calculation multiple add- radio
      Then STEP-13: If there is NA, After selecting NA question should get removed from calculation - radio

   Scenario: 5.Test cases for RAIN-958
      Then STEP-14: Scorable checkbox should be disabled by default and should get enabled if enable scoring checkbox is checked
      

   Scenario: 6.Test cases for RAIN-1643 Mandatory representation
      Then STEP-15: Count asterisk(*) on scoring modal
      
      
