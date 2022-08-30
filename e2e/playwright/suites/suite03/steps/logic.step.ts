import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
import {CalibrationPO, CalibrationModalPO, CalibrationScoreModalPO, SearchPO} from "../../../../pageObjects";
import { UIConstants } from "../../../../common/uiConstants";
import { GlobalTenantUtils } from "../../../../common/globalTenantUtils";
import { CommonNoUIUtils } from "../../../../common/CommonNoUIUtils";
import { LocalizationNoUI } from "../../../../common/LocalizationNoUI";
import { LoginPage } from "../../../../common/login";
import { Utils } from "../../../../common/utils";
import { CommonQMNoUIUtils } from "../../../../common/CommonQMNoUIUtils";
import { AccountUtils } from "../../../../common/AccountUtils";
import { UserDefaultPermissions } from "../../../../common/userDefaultPermissions";
import { IntegrationTestData } from "../../../../common/integrationTestData";
import { OnPrepare } from "../../../../playwright.config";
import * as moment from "moment";
import { CommonUIUtils } from "cxone-playwright-test-utils";

let integrationTestData = new IntegrationTestData();
let UsersDefaultPermissions = new UserDefaultPermissions();
let calibrationPO: any;
let calibrationModalPO: any;
let calibrationScoreModalPO: any;
let uiConstants = new UIConstants();
let page: Page;
let browser: any;
let context: BrowserContext;
let userDetails: any;
let newGlobalTenantUtils = new GlobalTenantUtils();
let localeString = 'en-US',
    dateFormat: any = {};
let searchPO: any;
let utils: any;
let response_getTeamID: any;
let loginPage: any;
let response1: any;
let response2: any;
let response3: any;
let customManagerRoleName: any;
let managerDetails: any;
let response4: any;
let managerToken: any;
let segmentResponse: any;
let dateTimeFormat = 'YYYY-MM-DDTHH:mm:ss.000+00:00';
let workflowConfigurationId: any;
let employeeDetails1: any;
let employeeDetails2: any;
let employeeDetails3: any;
let users: any[];
let segmentDetails: any;
let formId: any;
let createForm_response: any;
let response5: any;
let dueDate_sce_4: any;
let workflowConfigResponse_sce_4: any;
let managerToken_new: any;
let formId_1: any;
let calibrationName: any;
let segmentId: any;
let agentId: any;
let closeTimeoutDate: any;
let masterEvaluationId: any;
let masterEvaluationScore: any;
let assignmentDate: any;
let calibratorId: any;
let dateParam: any;
let dateParam_2: any;
let newOnPrepare: any;

const FEATURE_TOGGLES = {
    navigation_redesign: 'release-navigation-redesign-CXCROSS-21'
};

let testDataUsed: any = {
    adminUserDetails: {
        firstName: 'Admin',
        lastName: 'Calibration',
        fullName: 'Admin Calibration',
        id: '',
        emailAddress: ''
    },
    adminUser: {},
    agentUser1: {},
    agentUser2: {},
    agentUser3: {},
    managerUser: {},
    managerUser2: {},
    teamName: 'DefaultTeam',
    tenantId: '',
    agentToken: '',
    managerDetails: [],
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
        }
    ];
};

const getTeamID = async (teamName: any, token: any) => {
    response_getTeamID = await CommonQMNoUIUtils.getAllTeams(token);
    return response_getTeamID.teams.find((team: { name: any; }) => team.name === teamName).id;
}

const getEndToEndFormDetails = () => {
    return {
        formId: '',
        formStatus: 'Published',
        workflowConfigType: 'AGENT_CAN_ACKNOWLEDGE',
        formName: 'evaluationForm',
        formData: '{"formTitle":"","elements":[{"id":7608661536860,"uuid":"f5279427-01e1-4b4d-bd95-fbce54902142","type":"text","elementData":{"attributes":{"isScorable":false,"question":"Agent Name","answer":"","required":true,"prePopulatedHintText":"","showErrorMsg":false,"fontStyling":{"font":"OpenSans","fontSize":14,"fontColor":"#000000","fontIndent":"left","bold":{"isLabelBold":true,"fontWeight":"bold"},"italic":{"isLabelItalic":false,"fontStyle":"normal"},"underline":{"isLabelUnderline":false,"textDecoration":"none"}},"visible":true,"appliedRuleCount":0,"numbering":1,"showNumbering":true,"showNumberingDot":true}},"$$hashKey":"object:2301"},{"id":12173858470680,"uuid":"84e5367e-ee43-4332-92e5-97ac9b1caa2b","type":"textarea","elementData":{"attributes":{"isScorable":false,"question":"Agent Address","answer":"","required":true,"showErrorMsg":false,"fontStyling":{"font":"OpenSans","fontSize":14,"fontColor":"#000000","fontIndent":"left","bold":{"isLabelBold":true,"fontWeight":"bold"},"italic":{"isLabelItalic":false,"fontStyle":"normal"},"underline":{"isLabelUnderline":false,"textDecoration":"none"}},"visible":true,"appliedRuleCount":0,"subText":"","prePopulatedHintText":"","limitCharacters":true,"limitCharactersText":"130","numbering":2,"showNumbering":true,"showNumberingDot":true}},"$$hashKey":"object:2302"},{"id":12173858691624,"uuid":"53d9aa08-537b-4f6d-bfda-d766eba7fc74","type":"radio","elementData":{"attributes":{"elementType":"radio","maxScore":1,"isScorable":true,"isScoringEnabledForQuestion":true,"question":"Gender","answer":"","layout":"vertical","required":true,"showErrorMsg":false,"fontStyling":{"font":"OpenSans","fontSize":14,"fontColor":"#000000","fontIndent":"left","bold":{"isLabelBold":true,"fontWeight":"bold"},"italic":{"isLabelItalic":false,"fontStyle":"normal"},"underline":{"isLabelUnderline":false,"textDecoration":"none"}},"visible":true,"appliedRuleCount":0,"logic":true,"isCritical":false,"subText":"","choiceList":[{"label":"Male","value":"1","criticalQuestionCorrectChoice":true,"score":1,"$$hashKey":"object:2399"},{"label":"Female","value":"2","criticalQuestionCorrectChoice":true,"score":1,"$$hashKey":"object:2400"}],"numbering":3,"showNumbering":true,"showNumberingDot":true}},"$$hashKey":"object:2303"},{"id":12173858727360,"uuid":"7edab9af-fcbd-4511-83f1-3eec170dea31","type":"checkbox","elementData":{"attributes":{"elementType":"checkbox","maxScore":2,"isScorable":true,"isScoringEnabledForQuestion":true,"question":"Agent focus area?","answer":[],"layout":"vertical","required":true,"showErrorMsg":false,"fontStyling":{"font":"OpenSans","fontSize":14,"fontColor":"#000000","fontIndent":"left","bold":{"isLabelBold":true,"fontWeight":"bold"},"italic":{"isLabelItalic":false,"fontStyle":"normal"},"underline":{"isLabelUnderline":false,"textDecoration":"none"}},"visible":true,"appliedRuleCount":0,"logic":true,"isCritical":false,"subText":"","choiceList":[{"label":"Front End","value":"1","criticalQuestionCorrectChoice":true,"score":1,"selected":false,"$$hashKey":"object:2413"},{"label":"Back End","value":"2","criticalQuestionCorrectChoice":true,"score":1,"selected":false,"$$hashKey":"object:2414"}],"numbering":4,"showNumbering":true,"showNumberingDot":true}},"$$hashKey":"object:2304"},{"id":1521732347835,"uuid":"2afafafe-c3df-481c-baf2-8cce52c22562","type":"yesno","elementData":{"attributes":{"elementType":"yes/no","maxScore":1,"question":"Passed?","answer":"","required":true,"layout":"vertical","showErrorMsg":false,"fontStyling":{"font":"OpenSans","fontSize":14,"fontColor":"#000000","fontIndent":"left","bold":{"isLabelBold":true,"fontWeight":"bold"},"italic":{"isLabelItalic":false,"fontStyle":"normal"},"underline":{"isLabelUnderline":false,"textDecoration":"none"}},"visible":true,"appliedRuleCount":0,"logic":true,"subText":"","choiceList":[{"label":"Yes","value":"1","criticalQuestionCorrectChoice":true,"score":1,"$$hashKey":"object:2421"},{"label":"No","value":"2","criticalQuestionCorrectChoice":true,"score":0,"$$hashKey":"object:2422"},{"label":"N/A","value":"na","naElement":true,"score":0,"$$hashKey":"object:2423"}],"isScorable":true,"isCritical":false,"isScoringEnabledForQuestion":true,"isNAChecked":true,"numbering":5,"showNumbering":true,"showNumberingDot":true}},"$$hashKey":"object:2305"},{"id":4565197059156,"uuid":"6ebef9d7-8dbc-44bb-b30e-899aadfef262","type":"text","elementData":{"attributes":{"isScorable":false,"question":"Reason code","answer":"","required":false,"prePopulatedHintText":"","showErrorMsg":false,"fontStyling":{"font":"OpenSans","fontSize":14,"fontColor":"#000000","fontIndent":"left","bold":{"isLabelBold":true,"fontWeight":"bold"},"italic":{"isLabelItalic":false,"fontStyle":"normal"},"underline":{"isLabelUnderline":false,"textDecoration":"none"}},"visible":true,"appliedRuleCount":0,"numbering":6,"showNumbering":true,"showNumberingDot":true}},"$$hashKey":"object:2306"}],"theme":{"themeId":"","themeName":"","isDefault":true,"themeLogo":"","themeData":{"imgWidth":243,"imgHeight":30,"isAspectRatioChecked":true,"logoAspectRatio":8.1,"bgColor":"#ffffff","numberingEnabled":true,"title":{"text":"","font":"OpenSans","fontSize":18,"fontStyling":{"fontColor":"#2e2e2e","italic":{"isLabelItalic":false,"fontStyle":"normal"},"bold":{"isLabelBold":true,"fontWeight":"bold"},"underline":{"isLabelUnderline":false,"textDecoration":"none"}}},"subTitle":{"text":"","font":"OpenSans","fontSize":14,"fontStyling":{"fontColor":"#707070","italic":{"isLabelItalic":false,"fontStyle":"normal"},"bold":{"isLabelBold":false,"fontWeight":"normal"},"underline":{"isLabelUnderline":false,"textDecoration":"none"}}}}},"ranking":{"totalCoverage":101,"ranges":[{"from":"0%","to":"50%","coverage":51,"displayText":"Failed"},{"from":"51%","to":"100%","coverage":50,"displayText":"Passed"}]},"themeId":"","elementCount":6,"rules":{},"rulesAssociation":{},"headerFields":[{"id":1,"headerFieldName":"AgentName","text":"Agent Name","present":true,"selected":true},{"id":2,"headerFieldName":"InteractionDate","text":"Interaction Date","present":true,"selected":true},{"id":3,"headerFieldName":"Duration","text":"Interaction Duration","present":true,"selected":true},{"id":4,"headerFieldName":"StartDate","text":"Evaluation Start Date","present":true,"selected":true},{"id":5,"headerFieldName":"ReviewDate","text":"Review Date","present":true,"selected":true}],"currentScore":0,"formMaxScore":4,"isFormScoringEnabled":true,"percentage":0}',
        formType: 'EVALUATION'
    };
};

const pushInteractionData = async (agentList: any[], minDateTime: any, maxDateTime: any, noOfSegmentsToPush: number, token: any) => {
    segmentDetails = {
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
    return await CommonQMNoUIUtils.pushMultipleTypeInteractions(segmentDetails, false, false, false, token, false);
};

BeforeAll({ timeout: 300 * 1000 }, async () => {
    browser = await chromium.launch({
        headless: false,
    });
    context = await browser.newContext();
    page = await context.newPage();
    calibrationPO = new CalibrationPO(page);
    calibrationModalPO = new CalibrationModalPO(page);
    calibrationScoreModalPO = new CalibrationScoreModalPO(page);
    searchPO = new SearchPO(page);
    utils = new Utils(page);
    loginPage = new LoginPage(page);
    userDetails = await newGlobalTenantUtils.getDefaultTenantCredentials();
    newOnPrepare = new OnPrepare();
    await newOnPrepare.OnStart(userDetails);
    testDataUsed.organizationName = userDetails.orgName;
    let response = await CommonNoUIUtils.login(userDetails.email, userDetails.password, true);
    testDataUsed.adminUser.userToken = response.token;
    await newOnPrepare.toggleFeatureToggle(FEATURE_TOGGLES.navigation_redesign, true, userDetails.orgName, testDataUsed.adminUser.userToken);
    testDataUsed.adminUserDetails = response.user;
    testDataUsed.globalPassword = userDetails.password;
    testDataUsed.adminUserDetails.firstName = 'Admin';
    testDataUsed.adminUserDetails.lastName = 'Calibration';
    testDataUsed.adminUserDetails.fullName = 'Admin Calibration';
    await CommonNoUIUtils.updateUser(testDataUsed.adminUserDetails, 'canBeCoachedOrEvaluated', testDataUsed.adminUser.userToken);
    dateFormat = await LocalizationNoUI.getDateStringFormat(localeString);
    createForm_response = await CommonQMNoUIUtils.createForm(getEndToEndFormDetails(), testDataUsed.adminUser.userToken);
    formId = createForm_response.id;
});

AfterAll({ timeout: 60 * 1000 }, async () => {
    await browser.close();
});

Given("STEP-1: Should add multiple elements to bank", { timeout: 300 * 1000 }, async () => {
    let listOfElement = getElementList();
    await CommonQMNoUIUtils.addElementToBank(listOfElement, testDataUsed.adminUser.userToken);
});

Then("STEP-2: Should create Group", { timeout: 300 * 1000 }, async () => {
    testDataUsed.groupId = await CommonQMNoUIUtils.createGroup('executorProtractor', testDataUsed.adminUser.userToken);
});

Then("STEP-3: Should create Agent and merging with the group Id", { timeout: 300 * 1000 }, async () => {
    customManagerRoleName = await CommonNoUIUtils.createNewRoleByPermissions('customManager', 'Custom Manager 1', await UsersDefaultPermissions.getUserDefaultApplications('manager'), testDataUsed.adminUser.userToken);
    employeeDetails1 = {
        employeeEmailAddress: 'ptor' + AccountUtils.getRandomEmail(2),
        role: 'Employee',
        firstName: 'E2E',
        lastName: 'Test 2',
        password: testDataUsed.globalPassword,
        groupIds: [testDataUsed.groupId]
    };
    employeeDetails2 = {
        employeeEmailAddress: 'ptor' + AccountUtils.getRandomEmail(2),
        role: 'Employee',
        firstName: 'E2E',
        lastName: 'Test 3',
        password: testDataUsed.globalPassword,
        groupIds: [testDataUsed.groupId]
    };
    employeeDetails3 = {
        employeeEmailAddress: 'ptor' + AccountUtils.getRandomEmail(2),
        role: 'Employee',
        firstName: 'E2E',
        lastName: 'Test 4',
        password: testDataUsed.globalPassword,
        groupIds: [testDataUsed.groupId]
    };
    managerDetails = {
        managerEmailAddress: 'ptor' + AccountUtils.getRandomEmail(2),
        role: customManagerRoleName.displayName,
        firstName: 'Calibration',
        lastName: 'Manager2',
        password: testDataUsed.globalPassword
    };
    await Promise.all([
        AccountUtils.createAndActivateUser(employeeDetails1.employeeEmailAddress, testDataUsed.globalPassword, employeeDetails1, userDetails.email, testDataUsed.organizationName, testDataUsed.adminUser.userToken),
        AccountUtils.createAndActivateUser(employeeDetails2.employeeEmailAddress, testDataUsed.globalPassword, employeeDetails2, userDetails.email, testDataUsed.organizationName, testDataUsed.adminUser.userToken),
        AccountUtils.createAndActivateUser(employeeDetails3.employeeEmailAddress, testDataUsed.globalPassword, employeeDetails3, userDetails.email, testDataUsed.organizationName, testDataUsed.adminUser.userToken),
        AccountUtils.createAndActivateUser(managerDetails.managerEmailAddress, testDataUsed.globalPassword, managerDetails, managerDetails.managerEmailAddress, testDataUsed.organizationName, testDataUsed.adminUser.userToken)
    ]);
    const allUsers = await CommonNoUIUtils.getUsers(testDataUsed.adminUser.userToken);
    allUsers.users.forEach((item: any) => {
        switch (item.lastName) {
            case 'Test 2':
                testDataUsed.employeeUser1 = item;
                break;
            case 'Test 3':
                testDataUsed.employeeUser2 = item;
                break;
            case 'Test 4':
                testDataUsed.employeeUser3 = item;
                break;
            case 'Manager2':
                testDataUsed.managerDetails = item;
                break;
        }
    });
});

Then("STEP-4: Should push Data For Agents", { timeout: 300 * 1000 }, async () => {
    testDataUsed.teamUUID = await getTeamID(testDataUsed.teamName, testDataUsed.adminUser.userToken);
    await Promise.all([
        pushInteractionData([testDataUsed.employeeUser1.id], moment().utc(), moment().utc().add(1, 'day'), 1, testDataUsed.adminUser.userToken),
        pushInteractionData([testDataUsed.employeeUser2.id], moment().utc(), moment().utc().add(1, 'day'), 1, testDataUsed.adminUser.userToken),
        pushInteractionData([testDataUsed.employeeUser3.id], moment().utc(), moment().utc().add(1, 'day'), 1, testDataUsed.adminUser.userToken)
    ]);
});

When("STEP-1: Should initiate Calibration 1 with one evaluator and one active form with due date as 10 days ahead", { timeout: 300 * 1000 }, async () => {
    await page.goto(uiConstants.url);
    await loginPage.login(userDetails.email, uiConstants.passwordManager);
    await calibrationPO.navigate();
    await calibrationPO.clickNewCalibration();
    await searchPO.searchByAgentName('E2E Test 2');
    await searchPO.startCalibration(0, false);
    await calibrationModalPO.enterCalibrationName('Calibration 1');
    await calibrationModalPO.selectEvaluators('Admin Calibration');
    dateParam = moment().add(10, 'day').format(dateFormat.shortDateFormat).replace('-0', '-');
    await calibrationModalPO.enterDueDate(dateParam);
    await calibrationModalPO.clickCalibrateButton(false);
    expect(await utils.getToastMessage()).toContain('Calibration initiated');
});

Then("STEP-2: Verify Calibration 1 not completed on calibrations page", { timeout: 300 * 1000 }, async () => {
    await calibrationPO.navigate();
    await utils.delay(6000);
    const rowData = await calibrationPO.getRowElementsByCalibrationName();
    expect(rowData.agentName).toEqual('E2E Test 2');
    expect(rowData.calibrationForm).toEqual('evaluationForm');
    expect(rowData.originalScore).toEqual('NA');
    expect(rowData.calibrationScore).toEqual('NA');
    expect(rowData.remainingDays).toEqual('11d');
    expect(rowData.completionRate).toEqual('0/1');
    let getActiveCalibrationDeleteButtonValue = await calibrationPO.getActiveCalibrationDeleteButton('Calibration 1');
    expect(getActiveCalibrationDeleteButtonValue.isVisible()).toBeTruthy();
});

Then("STEP-3: Should submit the Calibration 1 from my Tasks", { timeout: 300 * 1000 }, async () => {
    response1 = await CommonQMNoUIUtils.getAllTasks(testDataUsed.adminUser.userToken, false);
    await CommonQMNoUIUtils.submitEvaluation(response1.tasks[0].referenceId, response1.tasks[0].formId, '75.00', integrationTestData.suite03.calibration1.formAnswers, 'CompleteNoReview', 0, 4, false, '', [], testDataUsed.adminUser.userToken);
});

When("STEP-4: Verify Calibration 1 completed on calibrations page", { timeout: 900 * 100 }, async () => {
    await calibrationPO.navigate();
    await calibrationPO.waitAndGetCalibrationData('Calibration 1', '1/1');
    const rowData_1 = await calibrationPO.getRowElementsByCalibrationNameValue('Calibration 1');
    expect(rowData_1.originalScore).toEqual('NA');
    expect(rowData_1.calibrationScore).toEqual('75.00');
    expect(rowData_1.remainingDays).toEqual('11d');
    expect(rowData_1.completionRate).toEqual('1/1');
});

Then("STEP-5: Verify is able to delete a completed calibration", { timeout: 300 * 100 }, async () => {
    await calibrationPO.deleteCalibration('Calibration 1');
    await calibrationPO.clickDeletePopoverBtn('single-delete');
});

When("STEP-1: Should initiate Calibration 2 with already evaluated form and one evaluator and due date as 9 days ahead", { timeout: 200 * 1000 }, async () => {
    await calibrationPO.clickNewCalibration();
    await searchPO.searchByAgentName('E2E Test 2');
    await searchPO.startCalibration(0, false);
    dateParam_2 = moment().add(9, 'day').format(dateFormat.shortDateFormat).replace('-0', '-');
    await calibrationModalPO.enterDueDate(dateParam_2);
    await calibrationModalPO.enterCalibrationName('Calibration 2');
    await calibrationModalPO.selectEvaluators('Admin Calibration');
    await calibrationModalPO.clickCalibrateButton();
    let toastCheck = await utils.getToastMessage();
    expect(toastCheck).toContain('Calibration initiated');
    await utils.delay(4000);
});

Then("STEP-2: Should save as draft Calibration 2 and verify Calibration 2 in Calibrations screen", { timeout: 200 * 1000 }, async () => {
    response2 = await CommonQMNoUIUtils.getAllTasks(testDataUsed.adminUser.userToken, false);
    await CommonQMNoUIUtils.submitEvaluation(response2.tasks[0].referenceId, response2.tasks[0].formId, '0.00', integrationTestData.suite03.calibration2.formAnswers, 'InProgress', 0, 4, false, '', [], testDataUsed.adminUser.userToken);
    await calibrationPO.navigate();
    await calibrationPO.waitAndGetCalibrationData('Calibration 2', '0/1');
    const rowData_2 = await calibrationPO.getRowElementsByCalibrationRowData();
    expect(rowData_2.originalScore).toEqual('75.00');
    expect(rowData_2.calibrationScore).toEqual('NA');
    expect(rowData_2.remainingDays).toEqual('10d');
    expect(rowData_2.completionRate).toEqual('0/1');
});

Then("STEP-3: Should submit Calibration 2 which was saved as draft and validate Score in Calibrations", { timeout: 200 * 1000 }, async () => {
    response3 = await CommonQMNoUIUtils.getAllTasks(testDataUsed.adminUser.userToken, false);
    expect(response3.tasks[0].status).toEqual('In Progress');
    await CommonQMNoUIUtils.submitEvaluation(response3.tasks[0].referenceId, response3.tasks[0].formId, '75.00', integrationTestData.suite03.calibration1.formAnswers, 'CompleteNoReview', 0, 4, false, '', [], testDataUsed.adminUser.userToken);
    await calibrationPO.navigate();
    await calibrationPO.waitAndGetCalibrationData('Calibration 2', '1/1');
    await calibrationPO.waitAndGetCalibrationData('Calibration 2', '75.00');
    const rowData_3 = await calibrationPO.getRowElementsByCalibrationNameValue('Calibration 2');
    expect(rowData_3.originalScore).toEqual('75.00');
    expect(rowData_3.calibrationScore).toEqual('75.00');
    expect(rowData_3.remainingDays).toEqual('10d');
    expect(rowData_3.completionRate).toEqual('1/1');
});

When("STEP-1: Should initiate Calibration 4 with two Evaluators with due date as 7 days ahead", { timeout: 300 * 1000 }, async () => {
    managerToken = (await CommonNoUIUtils.login(managerDetails.managerEmailAddress, uiConstants.passwordManager, true)).token;
    let fromDate = moment().subtract(1, 'days').format('YYYY-MM-DD') + 'T00:00:00.000Z';
    let toDate = moment().format('YYYY-MM-DD') + 'T23:59:59.000Z';
    segmentResponse = await CommonQMNoUIUtils.getSegmentFromSearch('E2E Test 2', fromDate, toDate, testDataUsed.adminUser.userToken);
    formId_1 = segmentResponse.results[0].qualityManagement[0].formId;
    dueDate_sce_4 = moment().add(7, 'day').endOf('day').format(dateTimeFormat);
    workflowConfigResponse_sce_4 = await CommonQMNoUIUtils.createCalibrationWorkflowConfiguration([testDataUsed.adminUserDetails.id, testDataUsed.managerDetails.id], formId_1, dueDate_sce_4, managerToken);
    workflowConfigurationId = workflowConfigResponse_sce_4.workflowConfigurationUUID;
    calibrationName = 'Calibration 4';
    segmentId = segmentResponse.results[0].segmentId;
    agentId = segmentResponse.results[0].agentIds[0];
    closeTimeoutDate = moment().add(7, 'day').format('YYYY-MM-DD') + 'T01:00:00.000+00:00';
    masterEvaluationId = segmentResponse.results[0].qualityManagement[0].workflowInstanceId;
    masterEvaluationScore = segmentResponse.results[0].qualityManagement[0].score;
    assignmentDate = moment().toJSON();
    calibratorId = testDataUsed.managerDetails.id;
    await CommonQMNoUIUtils.startCalibrationWorkflow(workflowConfigurationId, calibrationName, segmentId, agentId, closeTimeoutDate, masterEvaluationId, masterEvaluationScore, assignmentDate, calibratorId, formId_1, managerToken);
    await loginPage.logout();
    await CommonUIUtils.waitUntilIconLoaderDone(page);
});

Then("STEP-2: Should submit the Calibration 4 in my task by manager", { timeout: 200 * 1000 }, async () => {
    managerToken_new = (await CommonNoUIUtils.login(managerDetails.managerEmailAddress, uiConstants.passwordManager, true)).token;
    response4 = await CommonQMNoUIUtils.getAllTasks(managerToken_new, false);
    await page.goto(uiConstants.url);
    await loginPage.login(managerDetails.managerEmailAddress, uiConstants.passwordManager);
    await CommonUIUtils.waitUntilIconLoaderDone(page);
    await CommonQMNoUIUtils.submitEvaluation(response4.tasks[0].referenceId, response4.tasks[0].formId, '66.67', integrationTestData.suite03.calibration4.formAnswersManager, 'CompleteNoReview', 0, 3, false, '', [], testDataUsed.adminUser.userToken);
});

When("STEP-3: Should complete Calibration 4 with Admin and verify in calibrations page", { timeout: 300 * 1000 }, async () => {
    response5 = await CommonQMNoUIUtils.getAllTasks(testDataUsed.adminUser.userToken, false);
    await CommonQMNoUIUtils.submitEvaluation(response5.tasks[0].referenceId, response5.tasks[0].formId, '75.00', integrationTestData.suite03.calibration4.formAnswersAdmin, 'CompleteNoReview', 0, 4, false, '', [], testDataUsed.adminUser.userToken);
    await calibrationPO.navigate();
    await calibrationPO.waitAndGetCalibrationData('Calibration 4', '2/2');
    const rowData_4 = await calibrationPO.getRowElementsByCalibrationNameValue('Calibration 4');
    expect(rowData_4.originalScore).toEqual('75.00');
    expect(rowData_4.calibrationScore).toEqual('70.83');
    expect(rowData_4.remainingDays).toEqual('8d');
    expect(rowData_4.completionRate).toEqual('2/2');
});

Then("STEP-4: Click on score link and verify questions on calibration score modal", { timeout: 300 * 1000 }, async () => {
    await calibrationPO.clickOnCalibrationScore('Calibration 4');
    await utils.delay(5000);
    let rowData5 = await calibrationScoreModalPO.getScoreRowElements('3. Gender');
    expect(rowData5.maxScore).toEqual('1.00');
    expect(rowData5.originalScore).toEqual('1.00');
    expect(rowData5.calibrationScore).toContain('1.00');
    expect(rowData5.variance).toEqual('NA');
    let rowData6 = await calibrationScoreModalPO.getScoreRowElements('4. Agent focus area?');
    expect(rowData6.maxScore).toEqual('2.00');
    expect(rowData6.originalScore).toEqual('1.00');
    expect(rowData6.calibrationScore).toContain('1.00');
    expect(rowData6.variance).toEqual('NA');
    let rowData7 = await calibrationScoreModalPO.getScoreRowElements('5. Passed?');
    expect(rowData7.maxScore).toEqual('1.00');
    expect(rowData7.originalScore).toEqual('1.00');
    expect(rowData7.calibrationScore).toContain('1.00');
    expect(rowData7.variance).toEqual('NA');
});