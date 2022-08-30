Feature: Verification of performance and plan monitoring screen for acknowledge type of workflow

    Scenario: Scenario-1 Collaborative Evaluation Sanity Tests
        Given Step-1: should submit the one side evaluation from manager side
        When Step-2: should submit the one side evaluation from agent side
        Then Step-3: should verify statuses correctly updating in performance monitoring
        Then Step-4: should submit evaluations to complete collaborative evaluation flow
        Then Step-5: should create data and submit evaluations for expiring the collaborative evaluations
        Then Step-6: should verify data in plan monitoring
        Then Step-7: should verify all statuses in performance monitoring
        Then Step-8: should verify data in performance monitoring for expired collaborative evaluations
        

