Feature: Verification of quality plan filter

   Scenario: 1.Call Duration filter tests
      Given STEP-1: Should verify default values for call duration
      When STEP-2: Should verify default values when call duration selector is Less than
      Then STEP-3: Should verify default values when call duration selector is Between
      Then STEP-4: Should show error message when call start is greater than call end
      Then STEP-5: Should show error message when call length selector is Less than and value is 0
      Then STEP-6: Should verify that call duration selector dropdown is disabled when the filter is unselected

   Scenario: 2.Interaction Button filter tests
      When STEP-1: Should verify With Screen interaction button is selected by default
      Then STEP-2: Should verify all the different types of interaction buttons can be selected

   Scenario: 3.Interaction Button filter tests
      When STEP-1: Should check that none of the channel type filters should be selected by default
      Then STEP-2: Should check that none of the direction type filters should be selected by default
      Then STEP-3: Should be able to set and clear channel type filters
      Then STEP-4: Should be able to set and clear direction type filters

   Scenario: 4.Feedback score filter tests
      When STEP-1: Should check that csat score checkbox should not be selected by default
      Then STEP-2: Should be able to select feedback score ranges

   Scenario: 5.Sentiment Filter tests
      When STEP-1: Should verify that none of the sentiment filters are selected by default
      Then STEP-2: Should be able to set and clear sentiment filters

   Scenario: 6.Agent behavior Filter tests
      When STEP-1: Should verify that none of the agent behavior filters are selected by default
      Then STEP-2: Should be able to set and clear agent behaviour filters

   Scenario: 7.Save as Draft and Duplicate use cases for filters
      When STEP-1: Should be able to save plan as draft and verify filters are retained
      Then STEP-2: Should be able to duplicate saved plan and verify the filters are retained
      Then STEP-3: Should be able to change filters for a draft form and verify that the filters are retained

   Scenario: 8.Engage Recording filter test
      Then STEP-1: Should display interaction button filters and hide acd(email,chat) and voice channel filters when engage recording license is enabled
   
   Scenario: 9.License checks
      When STEP-1: Should be showing only voice filter checkbox
      Then STEP-2: Should be showing only chat and email filter checkbox
   
      