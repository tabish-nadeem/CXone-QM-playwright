export const FEATURE_TOGGLES = {
    MOCK_CATEGORIES: 'utility-QM-mockCategories-QM-6872',
    ANGULAR8_MIGRATION_SPRING20: 'utility-QM-angular8Upgrade-CXQM-12535',
    ANGULAR8_MIGRATION_SUMMER21: 'utility-QM-angular8Upgrade-CXQM-14354',
    RELEASE_NAVIGATION_REDESIGN :  'release-navigation-redesign-CXCROSS-21',
    FT_EMPLOYEE_EVALUATION: 'release-QM-employee-evaluation-CXQM-18534',
    FT_EDIT_EVALUATOR: 'release-QM-QP-Edit-Evaluator-CXQM-18068',
    FT_QP_TIMEZONE_HANDLING: 'release-QM-QP-Timezone-handling-CXQM-18543',
    RBAC_PERFMONITORING_TEAMLIST: 'release-rbac-evaluation-CXQM-19735',
    FT_EXCLUDE_INACTIVE_USERS: 'release-QM-exclude-inactive-user-planMonitoringUI-CXQM-17187'
};

export const FORM_STATES = {
    DRAFT: 'Draft',
    PUBLISHED: 'Published',
    DELETED: 'Deleted',
    DISABLED: 'Disabled'
};

export const FORM_TYPES = {
    EVALUATION: 'EVALUATION',
    COACHING: 'COACHING'
};

export const PLAN_STATES = {
    DRAFT: 'Draft',
    ACTIVE: 'Active',
    INACTIVE: 'Paused',
    EXPIRED: 'Expired',
    DELETED: 'Deleted',
    RUNNING: 'Running'
};

export const USER_STATES = {
    ACTIVE: 'ACTIVE'
};

export const TEAM_STATES = {
    ACTIVE: 'ACTIVE'
};

export const LOCAL_STORAGE_KEY_PREFIX = 'wfo_saas.';

export const ELEMENT_TYPES = {
    SHORT_TEXT: 'text',
    LONG_TEXT: 'textarea',
    DROPDOWN: 'dropdown',
    HYPERLINK: 'hyperlink',
    LABEL: 'label',
    CHECKBOX: 'checkbox',
    ATTACHMENT: 'attachment',
    INTERACTIONS: 'interaction',
    DATETIME: 'datetime',
    YESNO: 'yesno',
    SECTION: 'section',
    RADIO: 'radio'
};

export const SELF_ASSESSMENT_STATES = {
    OPEN: 'OPEN',
    CLOSED: 'CLOSED',
    EXPIRED: 'TIMED_OUT'
};

export const DATE_FORMATS = {
    ISO_OFFSET_DATE_TIME: 'YYYY-MM-DDTHH:mm:ssZ',
    ISO_DATE_TIME: 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]',
    ISO_DATE_TIME_NO_Z: 'YYYY-MM-DD[T]HH:mm:ss.SSS',
    TIME_24: 'HH:mm',
    TIME_NO_LEADING_ZERO_HOUR: 'H:mm',
    US_DATETIME_24: 'MM/dd/yyyy HH:mm',
    DEFAULT_DATE: 'MMM-DD-YYYY',
    SHORT_DATE: 'MMM D, YYYY',
    DEFAULT_DATE_24: 'MMM-DD-YYYY HH:mm',
    ISO_DATE_NO_TIME: 'YYYY-MM-DD',
    DATE_NO_TIME: 'MMM DD, YYYY'
};

export const Evaluation_Subject = {
    SEGMENT: 'SEGMENT',
    EMPLOYEE: 'EMPLOYEE'
};

export const EVALUATOR_STATUS = {
    1: 'Active',
    2: 'New',
    3: 'Removed'
};

export class UIConstants {
    constants = {
        groupName: 'QM_Execution',
        formName: ['SELF_ASSESSMENT_FORM'],
        groupId: '',
        completed: 'Completed',
        completedSelfAssessment: 'Completed Self Assessment',
        expiredSelfAssessment: 'Expired Self Assessment',
        selfAssessmentType: 'SELF_ASSESSMENT_REVIEW',
        selfAssessmentState: ['TIMED_OUT', 'CLOSED']
    }
    url = `https://na1.dev.nice-incontact.com/login/#/`;
    usernameAdmin = `venusadmin@wfosaas.com`;
    passwordAdmin = `Password1`;
    userManager = `venus_manager@nice.com`;
    passwordManager = `Pass1234`;
    userAgent = `agent_manjiree@nice.com`;
    passwordAgent = `Password1`;
    URLS = {
        LOCALHOST: 'http://na1.dev.localhost:8088',
        DEV: 'https://na1.dev.nice-incontact.com',
        TEST: 'https://na1.test.nice-incontact.com',
        STAGING: 'https://na1.staging.nice-incontact.com',
        SELFASSESSMENT: 'https://na1.dev.nice-incontact.com/qm/monitoring/#/selfAssessments',
        SEARCH: 'https://na1.dev.nice-incontact.com/search/#/search',
        MYSCHEDULE: 'https://na1.dev.nice-incontact.com/wfm/myschedule/#/mySchedule'
    }
    deletePopupText = `You are about to delete this assessment. This action cannot be undone. Continue?`;
    firstName = `venus`;
    lastName = `admin`;
    selfAssessment = {
        title: "Self Assessments",
        items: "Self Assessments",
        noItemsOverlay: "There are no self assessments initiated",
        initiateSelfAssessmentMsg: "Self-Assessment initiated",
        gridColumnsHeaders: {
            agentName: "AGENT NAME",
            initiatedBy: "INITIATED BY",
            interactionDate: "INTERACTION DATE",
            duration: "DURATION",
            formName: "FORM NAME",
            remainingDays: "REMAINING DAYS",
            score: "SCORE",
            status: "STATUS"
        },
        selfAssessmentToast: "Self-Assessment initiated",
        completeSelfAssessmentMsg: "Self-Assessment completed successfully.",
        saveDraftSelfAssessmentMsg: "Self-Assessment saved as draft successfully.",
        assessmentDeletedSuccessMsg: "Assessment deleted successfully.",
        cannotDeleteAwaitingAssessments: `Awaiting assessment cannot be deleted`,
        deleteSelfAssessmentWarning: "This self-assessment was initiated by another user and cannot be deleted."
    }
    myTasksPage: {
        agentSearchPlaceholder: "Search for agent",
        deleteWarning: "Are you sure you want to delete this evaluation task?",
        deletedTaskSuccess: "Evaluation task was deleted successfully.",
        deleteEvaluationTaskModalHeader: "Delete Task",
        deleteEvaluationTaskModalTitle: "REASON *",
        remainingCharactersText: "50 characters remaining",
        replaceEvaluationTaskModalHeader: "Replace Task",
        replaceEvaluationTaskModalTitle: "REASON *",
        replaceTaskSuccess: "Interaction will be replaced shortly."
    }
    evaluationsPage: {
        waitingForEvaluatorStatus: "Waiting for evaluator",
        waitingForAgentStatus: "Waiting for agent",
        completedStatus: "Completed",
        partiallyCompleted: "Partially Completed",
        expiredStatus: 'Expired',
        completed: 'Completed',
        autoAcknowledgeStatus: 'Auto-acknowledged',
        newStatus: 'New',
        draftStatus: 'Draft',
        challengedStatus: 'Challenged',
        reviewCompleted: 'Review Completed'
    }
}