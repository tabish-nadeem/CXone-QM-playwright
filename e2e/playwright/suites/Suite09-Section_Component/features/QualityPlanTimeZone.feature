Feature: Quality Plan - TimeZone Test Scenarios

   Scenario: 1.Timezone scenarios for Draft, Active, Expired and Inactive Plans
      Given STEP-1: should open new plan,open the timezone dropdown and verify clients current timezone is selected
      When STEP-2: should select new timezone from dropdown, save plan as draft and verify selected timezone is retained
      Then STEP-3: should activate plan and verify timezone is non-editable for active plan
      Then STEP-4: should duplicate an active plan and verify timezone is retained
      Then STEP-5: should verify timezone is non-editable for inactive plan
      Then STEP-6: should verify timezone is non-editable for expired plan
      Then STEP-7: should verify onetime plan range is not changed when timezone FT is On
      Then STEP-8: should verify user is able to navigate to desired page without warning modal when timezone is selected by default
      Then STEP-9: should verify user prompted with a warning modal when timezone is manually selected
      Then STEP-10: should verify timezone dropdown is not visible when FT is off for active plan
      Then STEP-11: should verify timezone dropdown is not visible when FT is off for expired plan
      Then STEP-12: should verify timezone dropdown is not visible when FT is off for new plan
      Then STEP-13: should verify timezone dropdown is not visible when FT is off for new plan
      Then STEP-14: should verify older plans created with FT off have default timezone selected as UTC

   