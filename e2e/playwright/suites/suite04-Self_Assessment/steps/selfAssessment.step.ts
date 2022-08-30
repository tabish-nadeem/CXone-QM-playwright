import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
import { SearchPO, SelfAssessmentPO, SelfAssessmentModalPO } from "../../../../pageObjects";
import { LoginPage } from "../../../../common/login";
import { Utils } from "../../../../common/utils";
import { UIConstants } from "../../../../common/uiConstants";
import { Credentials } from "../../../../common/support";
import { AccountUtils } from "../../../../common/AccountUtils";
import { GlobalTenantUtils } from "../../../../common/globalTenantUtils";
import { CommonNoUIUtils } from "../../../../common/CommonNoUIUtils";
import { CommonQMNoUIUtils } from "../../../../common/CommonQMNoUIUtils";
import { LocalizationNoUI } from '../../../../common/LocalizationNoUI';
import { IntegrationTestData } from '../../../../common/integrationTestData';
import { UserDefaultPermissions } from '../../../../common/userDefaultPermissions';
import { OnPrepare } from "../../../../playwright.config";
import * as moment from "moment";
import * as uuidv4 from "uuid4";
import { CommonUIUtils } from "cxone-playwright-test-utils";
//import {PageObjects} from "cxone-playwright-test-utils";

let newGlobalTenantUtils = new GlobalTenantUtils();
let userDefaultPermissions = new UserDefaultPermissions();
let integrationTestData = new IntegrationTestData();
let uiConstants = new UIConstants();

let selfAssessmentPO: any;
let selfAssessmentModalPO: any;
let searchPO: any;
let utils: any;
let loginPage: any;
let browser: any;
let context: BrowserContext;
let page: Page;
let userDetails: any = {};
let localeString = 'en-US',
    dateFormat: any = {};
let response1: any;
let response2: any;

let testDataUsed: any = {
    adminUser: {},
    agentUser1: {},
    managerUser: {},
    managerUser2: {},
    tenantId: '',
    agentToken: '',
    formData: {}
};

const getElementList = () => {
    return [
        {
            elementType: 'text',
            elementTitle: 'Agent Name',
            elementJson: '{"type":"text","elementData":{"attributes":{"question":"Agent Name","answer":"","required":true,"visible":true,"prePopulatedHintText":""}}}'
        },
        {
            elementType: 'textarea',
            elementTitle: 'Agent Address',
            elementJson: '{"type":"textarea","elementData":{"attributes":{"question":"Agent Address","answer":"","required":true,"visible":true,"subText":"","prePopulatedHintText":"","limitCharacters":true,"limitCharactersText":"130"}}}'
        },
        {
            elementType: 'radio',
            elementTitle: 'Gender',
            elementJson: '{"type":"radio","elementData":{"attributes":{"question":"Gender","answer":"","required":true,"layout":"vertical","visible":true,"subText":"","choiceList":[{"label":"Male","value":"1","score":1,"$$hashKey":"object:510"},{"label":"Female","value":"2","score":1,"$$hashKey":"object:511"}],"elementType":"radio"}}}'
        },
        {
            elementType: 'checkbox',
            elementTitle: 'Agent focus area?',
            elementJson: '{"type":"checkbox","elementData":{"attributes":{"question":"Agent focus area?","answer":[],"required":true,"layout":"vertical","visible":true,"subText":"","choiceList":[{"label":"Front End","value":"1","score":1,"selected":false,"$$hashKey":"object:823"},{"label":"Back End","value":"2","score":1,"selected":false,"$$hashKey":"object:824"}],"elementType":"checkbox"}}}'
        },
        {
            elementType: 'yesno',
            elementTitle: 'Passed?',
            elementJson: '{"type":"yesno","elementData":{"attributes":{"question":"Passed?","answer":"","required":true,"layout":"vertical","visible":true,"subText":"","choiceList":[{"label":"Yes","value":"1","score":1,"$$hashKey":"object:1148"},{"label":"No","value":"2","score":0,"$$hashKey":"object:1149"},{"label":"N/A","value":"na","naElement":true,"score":0,"$$hashKey":"object:1185"}],"elementType":"yes/no","isNAChecked":true}}}'
        },
        {
            elementType: 'text',
            elementTitle: 'Reason code',
            elementJson: '{"type":"text","elementData":{"attributes":{"question":"Reason code","answer":"","required":false,"visible":true,"prePopulatedHintText":""}}}'
        },
        {
            elementType: 'dropdown',
            elementTitle: 'Multi Dropdown Outside Section',
            elementJson: '{"type":"dropdown","elementData":{"attributes":{"question":"Multi Dropdown","answer":[],"required":true,"visible":true,"subText":"","elementType":"dropdown","itemList":[{"id":"ABCD","label":"ABCD","value":"ABCD"},{"id":"EFGH","label":"EFGH","value":"EFGH"},{"id":"IJKL","label":"IJKL","value":"IJKL"},{"id":"MNOP","label":"MNOP","value":"MNOP"},{"id":"QRST","label":"QRST","value":"QRST"},{"id":"UVWX","label":"UVWX","value":"UVWX"}],"dropdownType":"multiple"}}}'
        },
        {
            elementType: 'checkbox',
            elementTitle: 'Checkbox1',
            elementJson: '{"type":"checkbox","elementData":{"attributes":{"question":"Checkbox1","answer":[],"required":true,"layout":"vertical","visible":true,"subText":"","choiceList":[{"label":"Choice 1","value":"1","score":1,"selected":false,"$$hashKey":"object:983"},{"label":"Choice 2","value":"2","score":1,"selected":false,"$$hashKey":"object:984"},{"label":"CBValue1","value":"3","selected":false,"score":1,"$$hashKey":"object:985"}],"elementType":"checkbox"}}}'
        },
        {
            elementType: 'dropdown',
            elementTitle: 'Multi Dropdown Inside Section',
            elementJson: '{"type":"dropdown","elementData":{"attributes":{"question":"Multi Dropdown Inside Section","answer":[],"required":true,"visible":true,"subText":"","elementType":"dropdown","itemList":[{"id":"ABCDInside Section","label":"ABCDInside Section","value":"ABCDInside Section"},{"id":"EFGHInside Section","label":"EFGHInside Section","value":"EFGHInside Section"},{"id":"IJKLInside Section","label":"IJKLInside Section","value":"IJKLInside Section"},{"id":"MNOPInside Section","label":"MNOPInside Section","value":"MNOPInside Section"},{"id":"QRSTInside Section","label":"QRSTInside Section","value":"QRSTInside Section"},{"id":"UVWXInside Section","label":"UVWXInside Section","value":"UVWXInside Section"}],"dropdownType":"multiple"}}}'
        },
        {
            elementType: 'checkbox',
            elementTitle: 'CheckboxInsideSection',
            elementJson: '{"type":"checkbox","elementData":{"attributes":{"question":"CheckboxInsideSection","answer":[],"required":true,"layout":"vertical","visible":true,"subText":"","choiceList":[{"label":"Choice 1","value":"1","score":1,"selected":false,"$$hashKey":"object:1033"},{"label":"Choice 2","value":"2","score":1,"selected":false,"$$hashKey":"object:1034"},{"label":"CBValue1InsideSection","value":"3","selected":false,"score":1,"$$hashKey":"object:1035"}],"elementType":"checkbox"}}}'
        },
        {
            elementType: 'dropdown',
            elementTitle: 'Single Dropdown',
            elementJson: '{"type":"dropdown","elementData":{"attributes":{"question":"Single Dropdown","answer":[],"required":true,"visible":true,"subText":"","elementType":"dropdown","itemList":[{"id":"ABCD Single","label":"ABCD Single","value":"ABCD Single"},{"id":"EFGH Signle","label":"EFGH Signle","value":"EFGH Signle"},{"id":"IJKL Signle","label":"IJKL Signle","value":"IJKL Signle"},{"id":"MNOP Single","label":"MNOP Single","value":"MNOP Single"},{"id":"QRST Single","label":"QRST Single","value":"QRST Single"},{"id":"UVWX Single","label":"UVWX Single","value":"UVWX Single"}],"dropdownType":"single"}}}'
        }
    ];
};

const pushInteractionData = async (agentList: any[], minDateTime: any, maxDateTime: any, noOfSegmentsToPush: number, token: any) => {
    let segmentDetails: any = {
        minDateTime: minDateTime,
        maxDateTime: maxDateTime,
        noOfSegmentsPerAgent: noOfSegmentsToPush,
        agentIds: agentList,
        durationRange: {
            start: '30',
            end: '400'
        },
        mediaTypes: ['VOICE'],
        directionTypes: ['IN_BOUND']
    };
    await CommonQMNoUIUtils.pushMultipleTypeInteractions(segmentDetails, false, false, false, token, false);
};

const createUsers = async (token: any) => {
    let createAllUsers: any = [];
    createAllUsers.push(
        AccountUtils.createAndActivateUser(
            userDetails.managerCreds.email,
            Credentials.validPassword,
            userDetails.managerCreds,
            userDetails.email,
            userDetails.orgName,
            token),
        AccountUtils.createAndActivateUser(
            userDetails.managerCreds2.email,
            Credentials.validPassword,
            userDetails.managerCreds2,
            userDetails.email,
            userDetails.orgName,
            token),
        AccountUtils.createAndActivateUser(
            userDetails.employee1Creds.email,
            Credentials.validPassword,
            userDetails.employee1Creds,
            userDetails.email,
            userDetails.orgName,
            token)
    );

    await Promise.all(createAllUsers);
};
const createUserRole = async (token: any) => {
    let response = await CommonNoUIUtils.createNewRoleByPermissions('customEmployee',
        'Custom Employee 1', await userDefaultPermissions.getUserDefaultApplications('employee'), token);
    userDetails.employee1Creds.role = response.roleName;
    response = await CommonNoUIUtils.createNewRoleByPermissions('customManager',
        'Custom Manager 1', await userDefaultPermissions.getUserDefaultApplications('manager'), token);
    userDetails.managerCreds.role = response.roleName;
    userDetails.managerCreds2.role = response.roleName;
};

const createUsersAndGetDetails = async (token: any) => {
    await createUserRole(token);
    await createUsers(token);
    let allUsers = await CommonNoUIUtils.getUsers(testDataUsed.adminUser.userToken);
    allUsers.users.forEach(function (user: { emailAddress: any; }) {
        switch (user.emailAddress) {
            case userDetails.employee1Creds.email:
                testDataUsed.agentUser1 = user;
                break;
            case userDetails.managerCreds.email:
                testDataUsed.managerUser = user;
                break;
            case userDetails.managerCreds2.email:
                testDataUsed.managerUser2 = user;
                break;
        }
    });
};

const createAndActivateEvaluationForm = async (token: any) => {
    testDataUsed.formData = await CommonQMNoUIUtils.createForm(await getEndToEndFormDetails(), token);
    await searchPO.openSelfAssessmentModal('Agent User');
};

const getEndToEndFormDetails = async () => {
    return {
        formId: '',
        formStatus: 'Published',
        workflowConfigType: 'AGENT_CAN_ACKNOWLEDGE',
        formName: 'evaluationForm',
        formData: '{"currentScore":0,"themeId":"","formTitle":"","rules":{},"isFormScoringEnabled":true,"rulesAssociation":{},"elements":[{"elementData":{"attributes":{"numbering":1,"showNumbering":true,"visible":true,"question":"Agent Name","fontStyling":{"underline":{"isLabelUnderline":"false","textDecoration":"none"},"fontIndent":"left","fontSize":"14","bold":{"isLabelBold":"true","fontWeight":"bold"},"italic":{"isLabelItalic":"false","fontStyle":"normal"},"fontColor":"#000000","font":"OpenSans"},"questionHTML":"<p style=\\"text-align:left;\\"><strong><span style=\\"font-family:OpenSans;color:#000000;font-size:14px;\\">Agent Name<\\/span><\\/strong><\\/p>","showNumberingDot":true,"required":true,"prePopulatedHintText":"","isScorable":true,"answer":"","showErrorMsg":false,"appliedRuleCount":0}},"id":1002932853190,"type":"text","$$hashKey":"object:2301","uuid":"15ccf3b1-e21b-4b3d-8d57-11d1f70be60c"},{"elementData":{"attributes":{"numbering":2,"showNumbering":true,"visible":true,"question":"Agent Address","fontStyling":{"underline":{"isLabelUnderline":"false","textDecoration":"none"},"fontIndent":"left","fontSize":"14","bold":{"isLabelBold":"true","fontWeight":"bold"},"italic":{"isLabelItalic":"false","fontStyle":"normal"},"fontColor":"#000000","font":"OpenSans"},"questionHTML":"<p style=\\"text-align:left;\\"><strong><span style=\\"font-family:OpenSans;color:#000000;font-size:14px;\\">Agent Address<\\/span><\\/strong><\\/p>","showNumberingDot":true,"subText":"","required":true,"prePopulatedHintText":"","isScorable":false,"answer":"","limitCharactersText":130,"showErrorMsg":false,"limitCharacters":true,"appliedRuleCount":0}},"id":1021690904633,"type":"textarea","$$hashKey":"object:2302","uuid":"fd9e899e-9e2d-4c8e-acb6-e39e11e7c420"},{"elementData":{"attributes":{"numbering":3,"showNumbering":true,"visible":true,"question":"Gender","isScoringEnabledForQuestion":true,"fontStyling":{"underline":{"isLabelUnderline":"false","textDecoration":"none"},"fontIndent":"left","fontSize":"14","bold":{"isLabelBold":"true","fontWeight":"bold"},"italic":{"isLabelItalic":"false","fontStyle":"normal"},"fontColor":"#000000","font":"OpenSans"},"questionHTML":"<p style=\\"text-align:left;\\"><strong><span style=\\"font-family:OpenSans;color:#000000;font-size:14px;\\">Gender<\\/span><\\/strong><\\/p>","maxScore":1,"showNumberingDot":true,"subText":"","required":true,"layout":"vertical","isScorable":true,"answer":"","choiceList":[{"score":1,"criticalQuestionCorrectChoice":true,"label":"Male","$$hashKey":"object:2399","value":"1"},{"score":1,"criticalQuestionCorrectChoice":true,"label":"Female","$$hashKey":"object:2400","value":"2"}],"showErrorMsg":false,"isCritical":false,"appliedRuleCount":0,"logic":true,"elementType":"radio"}},"id":1040795801065,"type":"radio","$$hashKey":"object:2303","uuid":"09cf0a5e-402d-4be9-9d46-3e9800c2fd47"},{"elementData":{"attributes":{"numbering":4,"showNumbering":true,"visible":true,"question":"Agent focus area?","isScoringEnabledForQuestion":true,"fontStyling":{"underline":{"isLabelUnderline":"false","textDecoration":"none"},"fontIndent":"left","fontSize":"14","bold":{"isLabelBold":"true","fontWeight":"bold"},"italic":{"isLabelItalic":"false","fontStyle":"normal"},"fontColor":"#000000","font":"OpenSans"},"questionHTML":"<p style=\\"text-align:left;\\"><strong><span style=\\"font-family:OpenSans;color:#000000;font-size:14px;\\">Agent focus area?<\\/span><\\/strong><\\/p>","maxScore":2,"showNumberingDot":true,"subText":"","required":true,"layout":"vertical","isScorable":true,"answer":[],"choiceList":[{"score":1,"criticalQuestionCorrectChoice":true,"label":"Front End","$$hashKey":"object:2413","value":"1","selected":false},{"score":1,"criticalQuestionCorrectChoice":true,"label":"Back End","$$hashKey":"object:2414","value":"2","selected":false}],"showErrorMsg":false,"isCritical":false,"appliedRuleCount":0,"logic":true,"elementType":"checkbox"}},"id":1088848277763,"type":"checkbox","$$hashKey":"object:2304","uuid":"ed264620-51f9-4ded-8003-2180bed2784d"},{"elementData":{"attributes":{"numbering":5,"showNumbering":true,"isNAChecked":true,"visible":true,"question":"Passed?","isScoringEnabledForQuestion":true,"fontStyling":{"underline":{"isLabelUnderline":"false","textDecoration":"none"},"fontIndent":"left","fontSize":"14","bold":{"isLabelBold":"true","fontWeight":"bold"},"italic":{"isLabelItalic":"false","fontStyle":"normal"},"fontColor":"#000000","font":"OpenSans"},"questionHTML":"<p style=\\"text-align:left;\\"><strong><span style=\\"font-family:OpenSans;color:#000000;font-size:14px;\\">Passed?<\\/span><\\/strong><\\/p>","maxScore":1,"showNumberingDot":true,"subText":"","required":true,"layout":"vertical","isScorable":true,"answer":"","choiceList":[{"score":1,"criticalQuestionCorrectChoice":true,"label":"Yes","$$hashKey":"object:2421","value":"1"},{"score":0,"criticalQuestionCorrectChoice":true,"label":"No","$$hashKey":"object:2422","value":"2"},{"score":0,"label":"N/A","naElement":true,"$$hashKey":"object:2423","value":"na"}],"showErrorMsg":false,"isCritical":false,"appliedRuleCount":0,"logic":true,"elementType":"yes/no"}},"id":1072686966033,"type":"yesno","$$hashKey":"object:2305","uuid":"d8afdea6-303d-4fa5-82f5-ac8ad220448c"},{"elementData":{"attributes":{"numbering":6,"showNumbering":true,"visible":true,"question":"Reason code","fontStyling":{"underline":{"isLabelUnderline":"false","textDecoration":"none"},"fontIndent":"left","fontSize":"14","bold":{"isLabelBold":"true","fontWeight":"bold"},"italic":{"isLabelItalic":"false","fontStyle":"normal"},"fontColor":"#000000","font":"OpenSans"},"questionHTML":"<p style=\\"text-align:left;\\"><strong><span style=\\"font-family:OpenSans;color:#000000;font-size:14px;\\">Reason code<\\/span><\\/strong><\\/p>","showNumberingDot":true,"required":false,"prePopulatedHintText":"","isScorable":false,"answer":"","showErrorMsg":false,"appliedRuleCount":0}},"id":1016007253078,"type":"text","$$hashKey":"object:2306","uuid":"d33d52dd-f58f-49c5-b2ef-5e59f7422acd"}],"formMaxScore":4,"percentage":0,"theme":{"themeLogo":"","themeName":"","isDefault":true,"themeData":{"imgWidth":243,"logoAspectRatio":8.1,"bgColor":"#ffffff","subTitle":{"fontStyling":{"underline":{"isLabelUnderline":false,"textDecoration":"none"},"bold":{"isLabelBold":false,"fontWeight":"normal"},"italic":{"isLabelItalic":false,"fontStyle":"normal"},"fontColor":"#707070"},"fontSize":14,"text":"","font":"OpenSans"},"isAspectRatioChecked":true,"imgHeight":30,"numberingEnabled":true,"title":{"fontStyling":{"underline":{"isLabelUnderline":false,"textDecoration":"none"},"bold":{"isLabelBold":true,"fontWeight":"bold"},"italic":{"isLabelItalic":false,"fontStyle":"normal"},"fontColor":"#2e2e2e"},"fontSize":18,"text":"","font":"OpenSans"}},"themeId":""},"ranking":{"totalCoverage":101,"ranges":[{"coverage":51,"displayText":"Failed","from":"0%","to":"50%"},{"coverage":50,"displayText":"Passed","from":"51%","to":"100%"}]},"elementCount":6,"headerFields":[{"id":1,"text":"Agent Name","present":true,"headerFieldName":"AgentName","selected":true},{"id":2,"text":"Interaction Date","present":true,"headerFieldName":"InteractionDate","selected":true},{"id":3,"text":"Interaction Duration","present":true,"headerFieldName":"Duration","selected":true},{"id":4,"text":"Evaluation Start Date","present":true,"headerFieldName":"StartDate","selected":true},{"id":5,"text":"Review Date","present":true,"headerFieldName":"ReviewDate","selected":true}],"workflowConfigurationId":"11eb3a18-405b-b470-8ab4-0242ac110005"}',
        formType: 'EVALUATION'
    };
};

const createSelfAssessmentTasks = async (type: any, numberOfEntries: number, assignedUserId: any, state: any, status: any, agentName: any, evaluatorId: any, adminToken: any) => {
    let allTasks = [];
    for (let index = 0; index < numberOfEntries; index++) {
        let task = {
            id: null,
            type: type, // mandatory - EVALUATION_REVIEW or SELF_ASSESSMENT_EVALUATION
            assignedUserId: assignedUserId, // mandatory - agentId
            referenceId: uuidv4(),
            formId: uuidv4(),
            formName: 'formname',
            formVersion: 0,
            assignmentDate: '2019-03-11T23:59:59.000+05:30',
            submissionDate: '2019-03-11T23:59:59.000+05:30',
            dueDate: '2019-03-11T23:59:59.000+05:30',
            state: state, // mandatory - OPEN, CLOSED
            status: status, // mandatory -
            score: AccountUtils.randomInt(50, 10), // mandatory
            segmentId: uuidv4(),
            segmentStartTime: '2019-03-11T23:59:59.000+05:30',
            segmentDuration: 90,
            segmentMediaTypes: 'EMAIL',
            segmentChannelType: 'TEXT',
            agentId: assignedUserId, // mandatory - agentId
            agentName: agentName, // mandatory
            initiatorId: assignedUserId, // mandatory
            initiatorName: 'Mars Demo', // mandatory
            createdBy: 'QM-WORKER', // mandatory
            createdDateTime: '2019-03-11T23:59:59.000+05:30',
            lastModifiedBy: 'QM-WORKER',
            lastModifiedDateTime: '2019-03-11T23:59:59.000+05:30',
            mediaLocation: 'mediaLocation',
            rankingResult: 'Pass'
        };

        if (index === 0) {
            task.state = uiConstants.constants.selfAssessmentState[1];
            task.status = uiConstants.constants.completedSelfAssessment;
        }
        allTasks.push(task);
    }
    let request = { tasks: allTasks };
    await CommonQMNoUIUtils.createBulkSelfAssessmentTasks(request, adminToken);
};

const FEATURE_TOGGLES = {
    navigation_redesign: 'release-navigation-redesign-CXCROSS-21'
};


BeforeAll({ timeout: 300 * 1000 }, async () => {
    browser = await chromium.launch({
        headless: false,
        args: ['--window-position=-8,0']
    });
    context = await browser.newContext();
    page = await context.newPage();
    userDetails = await newGlobalTenantUtils.getDefaultTenantCredentials();
    let newOnPrepare = new OnPrepare();
    await newOnPrepare.OnStart(userDetails);
    console.log('Global Tenant Created', userDetails);
    userDetails.managerCreds = {
        firstName: 'Manager',
        lastName: 'User 1',
        role: '',
        email: 'ptor.' + 'man' + (new Date().getTime()) + '@wfosaas.com'
    };
    userDetails.managerCreds2 = {
        firstName: 'Manager',
        lastName: 'User 2',
        role: '',
        email: 'ptor.' + 'man2' + (new Date().getTime()) + '@wfosaas.com'
    };
    userDetails.employee1Creds = {
        firstName: 'Agent',
        lastName: 'User',
        role: '',
        email: 'ptor.' + 'emp' + (new Date().getTime()) + '@wfosaas.com',
        groupIds: []
    };
    let response = await CommonNoUIUtils.login(userDetails.email, userDetails.password, true);
    testDataUsed.adminUser = response.user;
    testDataUsed.tenantId = response.tenantId;
    testDataUsed.adminUser.userToken = response.token;
    testDataUsed.adminUser.password = userDetails.password;
    await newOnPrepare.toggleFeatureToggle(FEATURE_TOGGLES.navigation_redesign, true, userDetails.orgName, testDataUsed.adminUser.userToken);
    await CommonQMNoUIUtils.addElementToBank(getElementList(), testDataUsed.adminUser.userToken);
    await createUsersAndGetDetails(testDataUsed.adminUser.userToken);
    await pushInteractionData([testDataUsed.agentUser1.id], moment().utc(), moment().utc().add(1, 'day'),
        16, testDataUsed.adminUser.userToken);
    dateFormat = await LocalizationNoUI.getDateStringFormat(localeString);
    selfAssessmentPO = new SelfAssessmentPO(page);
    selfAssessmentModalPO = new SelfAssessmentModalPO(page);
    searchPO = new SearchPO(page);
    utils = new Utils(page);
    loginPage = new LoginPage(page);
});

AfterAll({ timeout: 60 * 1000 }, async () => {
    await browser.close();
});

Given("Step-1: Should launch incontact center URL", { timeout: 60 * 1000 }, async () => {
    await page.goto(uiConstants.url);
    //await loginPage.open();
});

When("Step-2: Should enter the Username and Password as Manager1 and click on next button", { timeout: 60 * 1000 }, async () => {
    await loginPage.login(testDataUsed.managerUser.emailAddress, uiConstants.passwordManager);
    await CommonUIUtils.waitUntilIconLoaderDone(page);
    console.log("Logged in successfully---Scenario 1 Starts");
});

Then("Step-3: Should navigate to Self Assessments Page and verifying New Self Assessment button", { timeout: 120 * 1000 }, async () => {
    await selfAssessmentPO.navigate();
    let selfAssessmentButton = await selfAssessmentPO.createNewSelfAssessmentButtonElement()
    expect(selfAssessmentButton).toBeVisible();
    await createAndActivateEvaluationForm(testDataUsed.adminUser.userToken);
    let modalContainer = await selfAssessmentModalPO.getModalContainer();
    expect(modalContainer).toBeVisible();
});

Then("Step-4: Should verify Create New Self Assessment Modal label text", { timeout: 60 * 1000 }, async () => {
    expect(await selfAssessmentModalPO.getModalTitle()).toEqual('Create New Self-Assessment');
    expect(await selfAssessmentModalPO.getModalSubtext()).toContain('This interaction will be sent to');
    expect(await selfAssessmentModalPO.getSelectFormDropdownLabel()).toEqual('EVALUATION FORM');
    expect(await selfAssessmentModalPO.getDueDateFieldLabel()).toEqual('DUE DATE');
});

Then("Step-5: Should Initiate a Self Assessment", { timeout: 60 * 1000 }, async () => {
    await selfAssessmentModalPO.clickCreateButton();
    let selfAssessmentSuccessToast = await selfAssessmentPO.getSelfAssessmentToastMsg();
    expect(selfAssessmentSuccessToast).toContain(uiConstants.selfAssessment.initiateSelfAssessmentMsg);
    console.log("Created self assessment successfully");
});

Then("Step-6: Should verify Initiated Self Assessment", { timeout: 120 * 1000 }, async () => {
    await selfAssessmentPO.navigate();
    expect(await selfAssessmentPO.getPageTitleElement()).toEqual(`Self Assessments`);
    expect(await selfAssessmentPO.getItemCountLabel()).toContain(`1 Self Assessments`);
    let rowData = await selfAssessmentPO.getRowElementsByAgentName('Agent User');
    expect(rowData.initiatorName).toContain(testDataUsed.managerUser.firstName + ' ' + testDataUsed.managerUser.lastName);
    expect(rowData.formName).toContain('evaluationForm');
    expect(rowData.segmentStartTime).toContain(moment().format(dateFormat.shortDateFormat));
    expect(rowData.remainingDays).toEqual('1d');
    expect(rowData.score).toEqual('-');
    expect(rowData.status).toEqual('Awaiting');
    expect(await selfAssessmentPO.getDeletePopoverMsg('Agent User')).toEqual(uiConstants.selfAssessment.cannotDeleteAwaitingAssessments);
    console.log("Self Assessment verified");
});

Then("Step-7: Should verify Interaction player Popup URL", { timeout: 60 * 1000 }, async () => {
    await selfAssessmentPO.openSelfAssessment('status', 'Awaiting');
    await utils.delay(3000);
    let count = context.pages();
    expect(count.length).toEqual(2);
    expect(await selfAssessmentPO.getPopupUrl()).toContain(`player`);
});

Then("Step-8: Should logout from application for Manager1 user", { timeout: 60 * 1000 }, async () => {
    await loginPage.logout();
    await CommonUIUtils.waitUntilIconLoaderDone(page);
});

When("Step-1: Should enter the Username and Password as Manager2 and click on next button", { timeout: 60 * 1000 }, async () => {
    await loginPage.login(testDataUsed.managerUser2.emailAddress, uiConstants.passwordManager);
    await CommonUIUtils.waitUntilIconLoaderDone(page);
    console.log("Logged in successfully with Manager 2 credentials---Scenario 2 Starts");
});

Then("Step-2: Should verify Self Assessment Data Initiated by Manager1", { timeout: 60 * 1000 }, async () => {
    await selfAssessmentPO.navigate();
    expect(await selfAssessmentPO.getPageTitleElement()).toEqual(`Self Assessments`);
    expect(await selfAssessmentPO.getDeletePopoverMsg('Agent User')).toEqual(uiConstants.selfAssessment.deleteSelfAssessmentWarning);
});

Then("Step-3: Should logout from application for Manager2 user", { timeout: 60 * 1000 }, async () => {
    await loginPage.logout();
    await CommonUIUtils.waitUntilIconLoaderDone(page);
});

When("Step-1: Should enter the Username and Password as Agent User1 and click on next button", { timeout: 80 * 1000 }, async () => {
    testDataUsed.agentToken = await CommonNoUIUtils.login(testDataUsed.agentUser1.emailAddress, uiConstants.passwordManager, false);
    await loginPage.login(testDataUsed.agentUser1.emailAddress, uiConstants.passwordManager);
    await CommonUIUtils.waitUntilIconLoaderDone(page);
    console.log("Logged in with Agent User1 successfully-----Scenario 3 Starts");
});

Then("Step-2: Should submit Evaluation", { timeout: 60 * 1000 }, async () => {
    response1 = await CommonQMNoUIUtils.getEvaluations(testDataUsed.agentToken, false);
    console.log('Completing self assessment task for workflow instance id: ', response1.evaluations[0].referenceId);
    await CommonQMNoUIUtils.submitEvaluation(response1.evaluations[0].referenceId, testDataUsed.formData.id, '75.00',
        integrationTestData.suite04.selfAssessment1.formAnswers, 'Self-Assessment-Completed', 0, 4, false, '', [], testDataUsed.agentToken);
});

Then("Step-3: Should logout from application for Agent User1 user", { timeout: 60 * 1000 }, async () => {
    await loginPage.logout();
    await CommonUIUtils.waitUntilIconLoaderDone(page);
});

When("Step-1: Should enter the Username and Password as Manager1 and click on next button", { timeout: 60 * 1000 }, async () => {
    await loginPage.login(testDataUsed.managerUser.emailAddress, uiConstants.passwordManager);
    await CommonUIUtils.waitUntilIconLoaderDone(page);
    console.log("Logged in with Manager1 successfully------Scenario 4 Starts");
});

Then("Step-2: Should verify Self Assessment Grid", { timeout: 60 * 1000 }, async () => {
    await selfAssessmentPO.navigate();
    await utils.delay(3000);
    let rowData = await selfAssessmentPO.getRowElementsByAgentName('Agent User');
    expect(rowData.segmentStartTime).toContain(moment().format(dateFormat.shortDateFormat));
    expect(rowData.score).toEqual('75.00');
    expect(rowData.status).toEqual('Completed');
    console.log("Verified Self Assessment grid");
});

Then("Step-3: Should verify verify Cancel Delete Operation", { timeout: 60 * 1000 }, async () => {
    await selfAssessmentPO.deleteSelfAssessment('Agent User');
    await selfAssessmentPO.clickDeletePopoverButton('cancel');
    expect(await selfAssessmentPO.isSelfAssessmentPresent('Agent User')).toBeTruthy();
    console.log("Verified cancel delete operation successfully");
});

Then("Step-4: Should verify delete operation for completed self assessment", { timeout: 60 * 1000 }, async () => {
    await selfAssessmentPO.deleteSelfAssessment('Agent User');
    await selfAssessmentPO.clickDeletePopoverButton('single-delete');
    let deleteToast = await selfAssessmentPO.getSelfAssessmentToastMsg();
    expect(deleteToast).toContain(uiConstants.selfAssessment.assessmentDeletedSuccessMsg);
    await utils.delay(2000);
    expect(await selfAssessmentPO.isSelfAssessmentPresent('Agent User')).toBeFalsy();
    console.log("Verified delete operation successfully");
});

Then("Step-5: Should logout from application for Manager1 user", { timeout: 60 * 1000 }, async () => {
    await loginPage.logout();
    await CommonUIUtils.waitUntilIconLoaderDone(page);
});

Then("Step-1: Should verify self assessment at agent side", { timeout: 60 * 1000 }, async () => {
    console.log("Logged in with Agent User1 successfully------Scenario 5 Starts");
    response2 = await CommonQMNoUIUtils.getEvaluations(testDataUsed.agentToken, false);
    console.log(new Date(response2.evaluations[0].submissionDate).toDateString(), 'Submission Date');
    expect(response2.evaluations[0].score).toEqual('75.00');
    expect(response2.evaluations[0].state).toEqual('CLOSED');
    expect(moment(response2.evaluations[0].submissionDate).format(dateFormat.shortDateFormat)).toEqual(moment().format(dateFormat.shortDateFormat));
});

When("Step-1: Should enter the Username and Password for Admin User and click on next button", { timeout: 60 * 1000 }, async () => {
    await loginPage.login(testDataUsed.adminUser.emailAddress, testDataUsed.adminUser.password);
    await CommonUIUtils.waitUntilIconLoaderDone(page);
    console.log("Logged in with Admin User successfully------Scenario 6 Starts");
});

Then("Step-2: Should verify Create Self Assessment Tasks", { timeout: 60 * 1000 }, async () => {
    await createSelfAssessmentTasks(uiConstants.constants.selfAssessmentType, 3, testDataUsed.agentUser1.id, uiConstants.constants.selfAssessmentState[0],
        uiConstants.constants.expiredSelfAssessment, testDataUsed.agentUser1.fullName, testDataUsed.adminUser.id, testDataUsed.adminUser.userToken);
    await selfAssessmentPO.verifySelfAssessmentRows();
});

Then("Step-3: Should Verify Filter", { timeout: 60 * 1000 }, async () => {
    let status = uiConstants.constants.completed;
    await selfAssessmentPO.applyFilter(status);
    await utils.delay(3000);
    let value = await selfAssessmentPO.getItemCountLabel();
    expect(value).toEqual('1 Self Assessments');
});

Then("Step-4: Should Verify Column Sorting", { timeout: 60 * 1000 }, async () => {
    await selfAssessmentPO.clickClearAllFilters();
    await CommonUIUtils.waitUntilIconLoaderDone(page);
    await selfAssessmentPO.sortOnSelfAssessmentColumnHeader(6, 'ASC');
    await selfAssessmentPO.columnSort();
    let value = await selfAssessmentPO.getItemCountLabel();
    expect(value).toEqual('3 Self Assessments');
});