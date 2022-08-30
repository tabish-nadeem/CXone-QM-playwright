Feature: Verification of form and evaluation calibration

   Scenario: 1.Setting up required data for test cases
      Given STEP-1: Should add multiple elements to bank
      When STEP-2: Should create Group
      Then STEP-3: Should create Agent and merging with the group Id
      Then STEP-4: Should push Data For Agents

   Scenario: 2.Starts Calibration with 1 form and Evaluator
      When STEP-1: Should initiate Calibration 1 with one evaluator and one active form with due date as 10 days ahead
      Then STEP-2: Verify Calibration 1 not completed on calibrations page
      Then STEP-3: Should submit the Calibration 1 from my Tasks
      When STEP-4: Verify Calibration 1 completed on calibrations page
      Then STEP-5: Verify is able to delete a completed calibration

   Scenario: 3.Setting up required data for test cases
      When STEP-1: Should initiate Calibration 2 with already evaluated form and one evaluator and due date as 9 days ahead
      Then STEP-2: Should save as draft Calibration 2 and verify Calibration 2 in Calibrations screen
      Then STEP-3: Should submit Calibration 2 which was saved as draft and validate Score in Calibrations

   Scenario: 4.Starts Calibration with 1 form and Evaluator
      When STEP-1: Should initiate Calibration 4 with two Evaluators with due date as 7 days ahead
      Then STEP-2: Should submit the Calibration 4 in my task by manager
      When STEP-3: Should complete Calibration 4 with Admin and verify in calibrations page
      Then STEP-4: Click on score link and verify questions on calibration score modal
