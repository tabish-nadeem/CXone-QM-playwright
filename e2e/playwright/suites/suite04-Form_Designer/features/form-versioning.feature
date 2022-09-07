Feature: Verification of performance and plan monitoring screen for acknowledge type of workflow

     Scenario: Scenario-1 Form Version Tests'
          Given Step-1: should verify new version
          When Step-2: should verify editing and saving draft does not change version
          Then Step-3: should verify activating a draft form does not change version
          Then Step-3: should verify editing an active form increments draft version
          Then Step-4: should verify editing an inactive form increments draft version
          Then Step-5: should verify editing an inactive form increments draft version
          Then Step-5: should verify for version is 0 if new form created with a deleted form\ s name


