Feature:  Scoring modal Prot Tests

   Scenario: 1.Viewing Scoring modal
      Given Scoring modal should open after clicking on scoring button and Should close after clicking on set/cancel button
      When Scoring modal should open with default values to the radio button
      Then Scoring modal should open with default values to the checkbox after adding multiple options
      Then Scoring modal should open with default values to the radio button after adding option using copy
      Then Scoring modal should open with default values to the checkbox after adding multiple options

   Scenario: 2.Test cases to be executed for RAIN-1087 Scoring Dialogue - Reset questions
      When Reset button should be disabled by default and get enabled when enable scoring checkbox is checked
      Then Should verify functionality of Reset button on scoring modal
      

   Scenario: 3.RAIN-955- Current Score
      When Should verify current score is 0 if scoring is not enable
      Then Should verify current score is 100 if user fill all ans correct
      Then Should verify current score is getting updated after changing the ans option
      Then Correct current score and percentage should get calculated for elements

   Scenario: 4.RAIN-955- NA option selection and current points
      When If there is NA, After selecting NA question should get removed from calculation multiple add- radio
      Then If there is NA, After selecting NA question should get removed from calculation - radio

   Scenario: 5.Test cases for RAIN-958
      Then Scorable checkbox should be disabled by default and should get enabled if enable scoring checkbox is checked
      

   Scenario: 6.Test cases for RAIN-1643 Mandatory representation
      Then Count asterisk(*) on scoring modal
      
      
