
import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
import { AccountUtils } from '../../../../common/AccountUtils';
import { Utils } from '../../../../common/utils';
import { CommonNoUIUtils } from '../../../../common/CommonNoUIUtils';
import { GlobalTenantUtils } from '../../../../common/globalTenantUtils';
import { LoginPage } from "../../../../common/login";
import { FEATURE_TOGGLES } from "../../../../common/uiConstants";
import { FeatureToggleUtils } from '../../../../common/FeatureToggleUtils';
import { CommonQMNoUIUtils } from '../../../../common/CommonQMNoUIUtils';
import { LocalizationNoUI } from '../../../../common/LocalizationNoUI';
import { Credentials } from "../../../../common/support";
import { AdminUtilsNoUI } from '../../../../common/AdminUtilsNoUI';
import { UserDefaultPermissions } from '../../../../common/userDefaultPermissions';
import { IntegrationTestData } from "../../../../common/integrationTestData";
import { PerformanceMonitoringPo } from '../../../../pageObjects/performanceMonitoringPO';
import { PerformanceDetailsPO } from '../../../../pageObjects/performanceDetailsPO';
import { PlansMonitoringPagePO } from '../../../../pageObjects/plansMonitoringPO';
import { OnPrepare } from '../../../../playwright.config';
import { Helpers } from '../../../../playwright.helpers';
import * as moment from 'moment';
import * as _ from 'lodash';
import { CommonUIUtils } from "cxone-playwright-test-utils";

//let _ = require('lodash');


let page: Page;
let browser: any;
let context: BrowserContext;
let loginPage: any;
let responseDisInt: any;
let responsePlanOcc: any;
let utils: any;
let plansMonitoringPO: any;
let performanceMonitoring: any;
let performanceDetails: any;
let getAllTeams1: any;
let newGlobalTenantUtils = new GlobalTenantUtils();
let userDefaultPermissions = new UserDefaultPermissions();
let integrationTestData = new IntegrationTestData();



let localeString = 'en-US',
    dateFormat: any = {};

let testDataUsed: any = {
    adminUser: {},
    agentUser: {},
    managerUser: {},
    evaluatorUser: {},
    tenantId: '',
    agentToken: '',
    formData: {},
    userGroup: {
        name: 'GROUP_1',
        groupId: '',
        employees: []
    },
    planData: {
        name: '',
        description: '',
        state: 'Active',
        numDaysBackDistribution: -1,
        planDuration: {
            oneTimeDateRange: {
                startDate: '',
                endDate: ''
            }
        },
        filters: [
            {
                name: 'QpMediaTypeMapper',
                value: '',
                operation: 'Equal', //We are creating QP with old payload with equal operation on purpose. Do no change in QP payload
                active: false
            },
            {
                name: 'DirectionType',
                value: 'IN_BOUND',
                operation: 'Equal',
                active: false
            },
            {
                name: 'CallDuration',
                value: 30,
                value2: 360,
                operation: 'Greater',
                active: true,
                valid: true
            }
        ]
    },
    team: [],
    task: {}
};

let userDetails: any = {};
let data: any;
let responseCreatePlan: any;
let response: any;
let response2: any;
let response3: any;
let response4: any;
let response5: any;
let newOnPrepare: any;
let getElementLists: any;
let responseManager: any;
let baseUrl : any;
let rowElements1 : any;
let responseEvaluator : any;
let rowElements2 : any;
let rowColumnValues1 : any;
let rowColumnValues2 : any;

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

const createGroup = async (token: any) => {
    data = await CommonQMNoUIUtils.createGroup(testDataUsed.userGroup.name, token);
    console.log("data---", data);
    testDataUsed.userGroup.groupId = data.groupId;
    console.log("testDataUsed.userGroup.groupId---", testDataUsed.userGroup.groupId);
};

const createUsers = async (token: any) => {
    let createAllUsers = [];
    userDetails.employeeCreds.groupIds = [testDataUsed.userGroup.groupId];
    createAllUsers.push(
        await AccountUtils.createAndActivateUser(
            userDetails.managerCreds.email,
            Credentials.validPassword,
            userDetails.managerCreds,
            userDetails.email,
            userDetails.orgName,
            token),
        await AccountUtils.createAndActivateUser(
            userDetails.evaluatorCreds.email,
            Credentials.validPassword,
            userDetails.evaluatorCreds,
            userDetails.email,
            userDetails.orgName,
            token),
        await AccountUtils.createAndActivateUser(
            userDetails.employeeCreds.email,
            Credentials.validPassword,
            userDetails.employeeCreds,
            userDetails.email,
            userDetails.orgName,
            token)
    );

    await Promise.all(createAllUsers);
};

const createUserRole = async (token: any) => {
    let response = await CommonNoUIUtils.createNewRoleByPermissions('customEmployee',
        'Custom Employee', await userDefaultPermissions.getUserDefaultApplications('employee'), token);
    userDetails.employeeCreds.role = response.roleName;
    response = await CommonNoUIUtils.createNewRoleByPermissions('customManager',
        'Custom Manager', await userDefaultPermissions.getUserDefaultApplications('manager'), token);
    userDetails.managerCreds.role = response.roleName;
    response = await CommonNoUIUtils.createNewRoleByPermissions('customEvaluator',
        'Custom Evaluator', await userDefaultPermissions.getUserDefaultApplications('evaluator'), token);
    userDetails.evaluatorCreds.role = response.roleName;
};

const createUsersAndGetDetails = async (token: any) => {
    await createUserRole(token);
    await createUsers(token);
    let allUsers = await CommonNoUIUtils.getUsers(token);
    allUsers.users.forEach(user => {
        switch (user.emailAddress) {
            case userDetails.employeeCreds.email:
                testDataUsed.agentUser = user;
                break;
            case userDetails.managerCreds.email:
                testDataUsed.managerUser = user;
                break;
            case userDetails.evaluatorCreds.email:
                testDataUsed.evaluatorUser = user;
                break;
        }
    });
    testDataUsed.userGroup.employees.push({
        firstName: testDataUsed.agentUser.firstName,
        lastName: testDataUsed.agentUser.lastName,
        fullName: testDataUsed.agentUser.firstName + ' ' + testDataUsed.agentUser.lastName,
        groupIds: [testDataUsed.userGroup.groupId],
        email: testDataUsed.agentUser.email
    });
};

const getEndToEndFormDetails = () => {
    return {
        formId: '',
        formStatus: 'Published',
        workflowConfigType: 'AGENT_CAN_REQUEST_REVIEW',
        formName: 'standardEvaluationForm',
        formData: '{"currentScore":0,"themeId":"","formTitle":"","rules":{},"isFormScoringEnabled":true,"rulesAssociation":{},"elements":[{"elementData":{"attributes":{"numbering":1,"showNumbering":true,"visible":true,"question":"Agent Name","fontStyling":{"underline":{"isLabelUnderline":"false","textDecoration":"none"},"fontIndent":"left","fontSize":"14","bold":{"isLabelBold":"true","fontWeight":"bold"},"italic":{"isLabelItalic":"false","fontStyle":"normal"},"fontColor":"#000000","font":"OpenSans"},"questionHTML":"<p style=\\"text-align:left;\\"><strong><span style=\\"font-family:OpenSans;color:#000000;font-size:14px;\\">Agent Name</span></strong></p>","showNumberingDot":true,"required":true,"prePopulatedHintText":"","isScorable":true,"answer":"","showErrorMsg":false,"appliedRuleCount":0}},"id":1024543639315,"type":"text","$$hashKey":"object:2301","uuid":"4e58d6b8-f4a7-442a-8a50-11607bbb154a"},{"elementData":{"attributes":{"numbering":2,"showNumbering":true,"visible":true,"question":"Agent Address","fontStyling":{"underline":{"isLabelUnderline":"false","textDecoration":"none"},"fontIndent":"left","fontSize":"14","bold":{"isLabelBold":"true","fontWeight":"bold"},"italic":{"isLabelItalic":"false","fontStyle":"normal"},"fontColor":"#000000","font":"OpenSans"},"questionHTML":"<p style=\\"text-align:left;\\"><strong><span style=\\"font-family:OpenSans;color:#000000;font-size:14px;\\">Agent Address</span></strong></p>","showNumberingDot":true,"subText":"","required":true,"prePopulatedHintText":"","isScorable":false,"answer":"","limitCharactersText":130,"showErrorMsg":false,"limitCharacters":true,"appliedRuleCount":0}},"id":1055237171643,"type":"textarea","$$hashKey":"object:2302","uuid":"5c699fef-a8df-4416-8b33-6fbd5a1be313"},{"elementData":{"attributes":{"numbering":3,"showNumbering":true,"visible":true,"question":"Gender","isScoringEnabledForQuestion":true,"fontStyling":{"underline":{"isLabelUnderline":"false","textDecoration":"none"},"fontIndent":"left","fontSize":"14","bold":{"isLabelBold":"true","fontWeight":"bold"},"italic":{"isLabelItalic":"false","fontStyle":"normal"},"fontColor":"#000000","font":"OpenSans"},"questionHTML":"<p style=\\"text-align:left;\\"><strong><span style=\\"font-family:OpenSans;color:#000000;font-size:14px;\\">Gender</span></strong></p>","maxScore":1,"showNumberingDot":true,"subText":"","required":true,"layout":"vertical","isScorable":true,"answer":"","choiceList":[{"score":1,"criticalQuestionCorrectChoice":true,"label":"Male","$$hashKey":"object:2399","value":"1"},{"score":1,"criticalQuestionCorrectChoice":true,"label":"Female","$$hashKey":"object:2400","value":"2"}],"showErrorMsg":false,"isCritical":false,"appliedRuleCount":0,"logic":true,"elementType":"radio"}},"id":1002268031633,"type":"radio","$$hashKey":"object:2303","uuid":"ff375791-e066-4b89-bf04-0f83aee6e8a9"},{"elementData":{"attributes":{"numbering":4,"showNumbering":true,"visible":true,"question":"Agent focus area?","isScoringEnabledForQuestion":true,"fontStyling":{"underline":{"isLabelUnderline":"false","textDecoration":"none"},"fontIndent":"left","fontSize":"14","bold":{"isLabelBold":"true","fontWeight":"bold"},"italic":{"isLabelItalic":"false","fontStyle":"normal"},"fontColor":"#000000","font":"OpenSans"},"questionHTML":"<p style=\\"text-align:left;\\"><strong><span style=\\"font-family:OpenSans;color:#000000;font-size:14px;\\">Agent focus area?</span></strong></p>","maxScore":2,"showNumberingDot":true,"subText":"","required":true,"layout":"vertical","isScorable":true,"answer":[],"choiceList":[{"score":1,"criticalQuestionCorrectChoice":true,"label":"Front End","$$hashKey":"object:2413","value":"1","selected":false},{"score":1,"criticalQuestionCorrectChoice":true,"label":"Back End","$$hashKey":"object:2414","value":"2","selected":false}],"showErrorMsg":false,"isCritical":false,"appliedRuleCount":0,"logic":true,"elementType":"checkbox"}},"id":1028890092462,"type":"checkbox","$$hashKey":"object:2304","uuid":"fe7c37f6-b787-4072-bdd9-012889fba7bc"},{"elementData":{"attributes":{"numbering":5,"showNumbering":true,"isNAChecked":true,"visible":true,"question":"Passed?","isScoringEnabledForQuestion":true,"fontStyling":{"underline":{"isLabelUnderline":"false","textDecoration":"none"},"fontIndent":"left","fontSize":"14","bold":{"isLabelBold":"true","fontWeight":"bold"},"italic":{"isLabelItalic":"false","fontStyle":"normal"},"fontColor":"#000000","font":"OpenSans"},"questionHTML":"<p style=\\"text-align:left;\\"><strong><span style=\\"font-family:OpenSans;color:#000000;font-size:14px;\\">Passed?</span></strong></p>","maxScore":1,"showNumberingDot":true,"subText":"","required":true,"layout":"vertical","isScorable":true,"answer":"","choiceList":[{"score":1,"criticalQuestionCorrectChoice":true,"label":"Yes","$$hashKey":"object:2421","value":"1"},{"score":0,"criticalQuestionCorrectChoice":true,"label":"No","$$hashKey":"object:2422","value":"2"},{"score":0,"label":"N/A","naElement":true,"$$hashKey":"object:2423","value":"na"}],"showErrorMsg":false,"isCritical":false,"appliedRuleCount":0,"logic":true,"elementType":"yes/no"}},"id":1083621467974,"type":"yesno","$$hashKey":"object:2305","uuid":"a31a80ec-458d-4a11-9f42-2c9c7d840fad"},{"elementData":{"attributes":{"numbering":6,"showNumbering":true,"visible":true,"question":"Reason code","fontStyling":{"underline":{"isLabelUnderline":"false","textDecoration":"none"},"fontIndent":"left","fontSize":"14","bold":{"isLabelBold":"true","fontWeight":"bold"},"italic":{"isLabelItalic":"false","fontStyle":"normal"},"fontColor":"#000000","font":"OpenSans"},"questionHTML":"<p style=\\"text-align:left;\\"><strong><span style=\\"font-family:OpenSans;color:#000000;font-size:14px;\\">Reason code</span></strong></p>","showNumberingDot":true,"required":false,"prePopulatedHintText":"","isScorable":false,"answer":"","showErrorMsg":false,"appliedRuleCount":0}},"id":1030535457369,"type":"text","$$hashKey":"object:2306","uuid":"8ef0eed9-0bac-4724-b889-fd7a5cadd77a"}],"formMaxScore":4,"percentage":0,"theme":{"themeLogo":"","themeName":"","isDefault":true,"themeData":{"imgWidth":243,"logoAspectRatio":8.1,"bgColor":"#ffffff","subTitle":{"fontStyling":{"underline":{"isLabelUnderline":false,"textDecoration":"none"},"bold":{"isLabelBold":false,"fontWeight":"normal"},"italic":{"isLabelItalic":false,"fontStyle":"normal"},"fontColor":"#707070"},"fontSize":14,"text":"","font":"OpenSans"},"isAspectRatioChecked":true,"imgHeight":30,"numberingEnabled":true,"title":{"fontStyling":{"underline":{"isLabelUnderline":false,"textDecoration":"none"},"bold":{"isLabelBold":true,"fontWeight":"bold"},"italic":{"isLabelItalic":false,"fontStyle":"normal"},"fontColor":"#2e2e2e"},"fontSize":18,"text":"","font":"OpenSans"}},"themeId":""},"ranking":{"totalCoverage":101,"ranges":[{"coverage":51,"displayText":"Failed","from":"0%","to":"50%"},{"coverage":50,"displayText":"Passed","from":"51%","to":"100%"}]},"elementCount":6,"headerFields":[{"id":1,"text":"Agent Name","present":true,"headerFieldName":"AgentName","selected":true},{"id":2,"text":"Interaction Date","present":true,"headerFieldName":"InteractionDate","selected":true},{"id":3,"text":"Interaction Duration","present":true,"headerFieldName":"Duration","selected":true},{"id":4,"text":"Evaluation Start Date","present":true,"headerFieldName":"StartDate","selected":true},{"id":5,"text":"Review Date","present":true,"headerFieldName":"ReviewDate","selected":true}],"workflowConfigurationId":"11eb403c-bfa2-43f0-8ab4-0242ac110005"}',
        formType: 'EVALUATION'
    };
};

const createAndActivateEvaluationForm = async (token: any) => {
    testDataUsed.formData = await CommonQMNoUIUtils.createForm(getEndToEndFormDetails(), token);
    console.log("testDataUsed.formData-->",testDataUsed.formData);
};

 
// const createQualityPlan = async (planName: string, evaluationType: string) => {
//     //We are creating QP with old payload with equal operation on purpose. Do no change in QP payload
//     testDataUsed.planData.evaluationType = evaluationType;
//     testDataUsed.planData.createdBy = testDataUsed.managerUser.id;
//     testDataUsed.planData.evaluators = [testDataUsed.evaluatorUser.id, testDataUsed.managerUser.id];
//     testDataUsed.planData.groups = [testDataUsed.userGroup.groupId];
//     testDataUsed.planData.teams = [testDataUsed.team.id];
//     testDataUsed.planData.name = planName;
//     testDataUsed.planData.formId = testDataUsed.formData.id;
//     testDataUsed.planData.numSegmentsPerAgent = 2;
//     testDataUsed.planData.planDuration.oneTimeDateRange.startDate = moment.utc().subtract(4, 'day').toJSON();
//     testDataUsed.planData.planDuration.oneTimeDateRange.endDate = moment.utc().endOf('day').toJSON();
//     responseCreatePlan = await CommonQMNoUIUtils.createPlan(testDataUsed.planData, testDataUsed.adminUser.userToken);
//     console.log("response--", responseCreatePlan);
//     testDataUsed.planData.id = responseCreatePlan.planUuid;
//     console.log('Quality Plan created with name ', testDataUsed.planData.name);
//     responseDisInt = await CommonQMNoUIUtils.distributeInteractions(undefined, testDataUsed.adminUser.userToken, '');
//     console.log('No of interactions distributed is ', responseDisInt);
//     if (responseDisInt === 0) {
//         console.log('Distribution failed, Failing test case');
//         process.exit(1);
//     }
//     responsePlanOcc = await CommonQMNoUIUtils.getPlanOccurrences(testDataUsed.planData.id, testDataUsed.adminUser.userToken);
//     testDataUsed.planData.planOccurrenceId = responsePlanOcc.planOccurrences[0].planOccurrenceId;
//     console.log("responsePlanOcc", responsePlanOcc);
//     console.log("testDataUsed.planData.planOccurrenceId", testDataUsed.planData.planOccurrenceId);

// };

// ! new functions added
const startCollaborativeWorkflow = async (workflowConfigUUID: any , segment: { segmentId: any; segmentContactId: any; acdContactId: any; startTime: any; segmentContactStartTime: any; endTime: any; }, agentUserUuid: any,
    evaluatorUuid: any, agentName: any, evaluatorName: any, teamId: any,
    segmentStartTime: any, segmentEndTime: any, planUuid: any, dueDate: any,
    createdByUuid: any, formName: any, token: any) => {
    let payload = {
        workflowMetadata: JSON.stringify({
            interactionId: segment.segmentId,
            segmentId: segment.segmentId,
            segmentContactId: segment.segmentContactId,
            agentName: agentName,
            formName: formName,
            acdContactId: segment.acdContactId,
            agentUserUuid: agentUserUuid,
            evaluatorUuid: evaluatorUuid,
            assignmentDate: '2019-07-03T08:21:09.464Z',
            userName: agentName,
            evaluatorName: evaluatorName,
            teamId: teamId,
            mediaLocation: 'https://s3-us-west-2.amazonaws.com/engage-recording-qm-rainbow-poc/TestData_E2E_1_6358696359093141966_2_99.mp4',
            directionType: 'OUT_BOUND',
            channelType: 'CHAT',
            segmentMediaTypes: 'CHAT',
            segmentStartTime: segment.startTime,
            segmentContactStartTime: segment.segmentContactStartTime,
            segmentEndTime: segment.endTime,
            segmentDuration: '40',
            planUuid: planUuid,
            planOccurrenceId: '11e98400-4b78-1c60-a236-0242ac110003',
            dueDate: dueDate,
            createdBy: createdByUuid
        }),
        wfVersion: '1.0',
        workflowConfigUUID: workflowConfigUUID,
        startToCloseTimeoutSeconds: 5187600
    };
    return await CommonQMNoUIUtils.startCollaborativeWorkflow(payload, token);
};
//! new functions 
const createCollaborativeWorkflowConfiguration = async (formId: any, formVersion: any, token: any) => {
    let requestPayload = {
        workflowType: 'COLLABORATIVE_EVALUATION',
        configuration: JSON.stringify({ formId: formId, formVersion: formVersion })
    };
  
    await CommonQMNoUIUtils.createCollaborativeWorkflowConfiguration(requestPayload, token)
};
//! new functions 
const createQualityPlan = async (planName : any, evaluationType : any, evaluatorId : any, distribute : any) => {
    testDataUsed.planData.evaluationType = evaluationType;
    testDataUsed.planData.createdBy = testDataUsed.managerUser.id;
    testDataUsed.planData.evaluators = [evaluatorId];
    testDataUsed.planData.groups = [testDataUsed.userGroup.groupId];
    testDataUsed.planData.teams = [testDataUsed.team.id];
    testDataUsed.planData.name = planName;
    testDataUsed.planData.formId = testDataUsed.formData.id;
    testDataUsed.planData.numSegmentsPerAgent = 2;
    testDataUsed.planData.planDuration.oneTimeDateRange.startDate = moment.utc().subtract(4, 'day').toJSON();
    testDataUsed.planData.planDuration.oneTimeDateRange.endDate = moment.utc().endOf('day').toJSON();
    response = await CommonQMNoUIUtils.createPlan(testDataUsed.planData, testDataUsed.adminUser.userToken);
    testDataUsed.planData.id = response.planUuid;
    console.log('Quality Plan created with name ', testDataUsed.planData.name);
    console.log('Quality Plan created with name ', testDataUsed.planData.id);
    if (distribute) {
        let res = await CommonQMNoUIUtils.distributeInteractions(undefined, testDataUsed.adminUser.userToken, '');
        console.log('No of interactions distributed is ', res);
        if (res === 0) {
            console.log('Distribution failed, Failing test case');
            process.exit(1);
        }
        response = await CommonQMNoUIUtils.getPlanOccurrences(testDataUsed.planData.id, testDataUsed.adminUser.userToken);
        
        testDataUsed.planData.planOccurrenceId = response.planOccurrences[0].planOccurrenceId;
    }
};

const pushInteractionData = async (agentList: any[], minDateTime: any, maxDateTime: any, noOfSegmentsToPush: number, token: any) => {
    let segmentDetails = {
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


BeforeAll({ timeout: 300 * 1000 }, async () => {
    browser = await chromium.launch({
        headless: false,
        args: ['--window-position=-8,0']
    });
    context = await browser.newContext();
    page = await context.newPage();
    userDetails = await newGlobalTenantUtils.getDefaultTenantCredentials();
    newOnPrepare = new OnPrepare();
    await newOnPrepare.OnStart(userDetails);
    loginPage = new LoginPage(page);
    console.log('Global Tenant Created', userDetails);

    userDetails.managerCreds = {
        firstName: 'Manager',
        lastName: 'User 1',
        role: '',
        email: 'ptor.' + 'man' + (new Date().getTime()) + '@wfosaas.com'
    };
    
    userDetails.employeeCreds = {
        firstName: 'Agent',
        lastName: 'User',
        role: '',
        email: 'ptor.' + 'emp' + (new Date().getTime()) + '@wfosaas.com',
        groupIds: []
    };
    console.log("userDetails.managerCreds", userDetails.managerCreds + "userDetails.employeeCreds", userDetails.employeeCreds);
    response = await CommonNoUIUtils.login(userDetails.email, userDetails.password, true);
    console.log("Response login", response);
    testDataUsed.adminUser = response.user;
    testDataUsed.tenantId = response.tenantId;
    testDataUsed.adminUser.userToken = response.token;
    testDataUsed.adminUser.password = userDetails.password;
    console.log("testDataUsed.adminUser", testDataUsed.adminUser + "testDataUsed.tenantId", testDataUsed.tenantId + "testDataUsed.adminUser.userToken", testDataUsed.adminUser.userToken + "testDataUsed.adminUser.password", testDataUsed.adminUser.password);
    getElementLists = getElementList();
    await CommonQMNoUIUtils.addElementToBank(getElementLists, testDataUsed.adminUser.userToken);
    await createGroup(testDataUsed.adminUser.userToken);
    await createUsersAndGetDetails(testDataUsed.adminUser.userToken);
    await createAndActivateEvaluationForm(testDataUsed.adminUser.userToken);
    getAllTeams1 = await AdminUtilsNoUI.getAllTeams(testDataUsed.adminUser.userToken)
    testDataUsed.team = getAllTeams1.teams[0];
    console.log("testDataUsed.team", testDataUsed.team);
    responseManager = await CommonNoUIUtils.login(testDataUsed.managerUser.emailAddress,
        Credentials.validPassword, true);
    console.log("testDataUsed.managerUser.userToken", responseManager.token);
    testDataUsed.managerUser.userToken = responseManager.token;
    baseUrl = await Helpers.getBaseUrl();
    await page.goto(baseUrl, { timeout: 30000, waitUntil: "load" });
    await loginPage.login(testDataUsed.managerUser.emailAddress,Credentials.validPassword);
    await pushInteractionData([testDataUsed.agentUser.id], moment().utc().subtract(1, 'day'), moment().utc(),
        16, testDataUsed.adminUser.userToken);
    dateFormat = await LocalizationNoUI.getDateStringFormat(localeString);
    console.log('DateTime formats to use', dateFormat);
    await createQualityPlan('QPOne', 'Standard');
    //! await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SUMMER21, userDetails.orgName, testDataUsed.adminUser.userToken);
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.FT_EMPLOYEE_EVALUATION, userDetails.orgName, testDataUsed.adminUser.userToken);
    await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.FT_EXCLUDE_INACTIVE_USERS, userDetails.orgName, testDataUsed.adminUser.userToken);
    //! doubt
    utils = new Utils(page);
    performanceMonitoring = new PerformanceMonitoringPo(page);
    performanceDetails = new PerformanceDetailsPO(page);
    plansMonitoringPO = new PlansMonitoringPagePO(page);
});

AfterAll({ timeout: 60 * 1000 }, async () => {
    await browser.close();
});


//! new one step 1
Given("Step-1: should submit the one side evaluation from manager side", { timeout: 60 * 1000 }, async () => {
    await performanceMonitoring.navigate();
    response = await CommonQMNoUIUtils.getAllTasks(testDataUsed.managerUser.userToken, false);
    let task = response.tasks[0];
    console.log('Submitting evaluation for Waiting For Agent status , workflowinstance id: ', task.referenceId);
    console.log('Segment Id', task.segmentId);
    testDataUsed.agentUser.agentSegmentData.splice(testDataUsed.agentUser.agentSegmentData.findIndex((item:any) => {
        return item.segmentId === task.segmentId;
    }), 1);
    testDataUsed.segmentIds[0] = task.segmentId;
    await CommonQMNoUIUtils.submitEvaluation(task.referenceId, testDataUsed.formData.id,
        '66.67', integrationTestData.suite06.evaluationOne.formAnswersManager, 'CompleteNoReview', 0, 3, false,
        '', [], testDataUsed.managerUser.userToken);
    await performanceMonitoring.navigate();
    await performanceMonitoring.selectAllSelectedTeams();
    await performanceMonitoring.selectAllSelectedGroups();
    await performanceMonitoring.setFromDate(moment().subtract(1, 'day').format(dateFormat.shortDateFormat));
    await performanceMonitoring.setToDate(moment().format(dateFormat.shortDateFormat));
    rowElements1 = await performanceMonitoring.getPerfMonitoringRowElements(testDataUsed.agentUser.fullName);
    await performanceMonitoring.startEmployeeEvaluation();
    await performanceMonitoring.setEmployee(testDataUsed.managerUser.fullName);
    console.log("Selected " + testDataUsed.managerUser.fullName);
    await performanceMonitoring.setEvaluator(testDataUsed.evaluatorUser.fullName);
    console.log("Selected " + testDataUsed.evaluatorUser.fullName);
    expect(rowElements1.avgScore).toEqual('66.67');
    expect(rowElements1.teams).toEqual('DefaultTeam');
    expect(rowElements1.groups).toEqual('GROUP_1');
    expect(rowElements1.noOfEvaluations).toEqual('1');
    await loginPage.logout();
    await CommonUIUtils.waitUntilIconLoaderDone(page);
});

When("Step-2: should submit the one side evaluation from agent side", { timeout: 180 * 1000 }, async () => {
    testDataUsed.agentUser.userToken = await CommonNoUIUtils.login(testDataUsed.agentUser.emailAddress,
    	Credentials.validPassword, false);
    await loginPage.login(testDataUsed.agentUser.emailAddress, Credentials.validPassword);
    await performanceMonitoring.navigateToMySchedule();
    response4 = await CommonQMNoUIUtils.getEvaluations(testDataUsed.agentUser.userToken, false);
    let evaluation : any = response4.evaluations[0].segmentId !== testDataUsed.segmentIds[0] ? response4.evaluations[0] : response4.evaluations[1];
    testDataUsed.agentUser.agentSegmentData.splice(testDataUsed.agentUser.agentSegmentData.findIndex((item:any) => {
        return item.segmentId === evaluation.segmentId;
    }), 1);
    testDataUsed.segmentIds[1] = evaluation.segmentId;
    console.log('Submitting evaluation for Waiting For Evaluator status , workflowinstance id: ', evaluation.referenceId);
    console.log('Segment Id', evaluation.segmentId);
    await CommonQMNoUIUtils.submitEvaluation(evaluation.referenceId, testDataUsed.formData.id,
        '66.67', integrationTestData.suite06.evaluationTwo.formAnswersAgent, 'Self-Assessment-Completed', 0, 3,
        false, '', [], testDataUsed.agentUser.userToken);
    await loginPage.logout();
    await CommonUIUtils.waitUntilIconLoaderDone(page);
});

Then("Step-3: should verify statuses correctly updating in performance monitoring",{timeout: 180 * 1000}, async () => {
    await CommonNoUIUtils.login(testDataUsed.managerUser.emailAddress,Credentials.validPassword,
        true);
        await utils.delay(5000);
        await performanceMonitoring.setFromDate(moment().subtract(1, 'day').format(dateFormat.shortDateFormat));
        await performanceMonitoring.setToDate(moment().format(dateFormat.shortDateFormat));
        rowElements1 = await performanceMonitoring.getPerfMonitoringRowElements(testDataUsed.agentUser.fullName);
        expect(rowElements1.teams).toEqual('DefaultTeam');
        expect(rowElements1.groups).toEqual('GROUP_1');
        expect(rowElements1.avgScore).toEqual('66.67');
        expect(rowElements1.noOfEvaluations).toEqual('2');
        expect(await performanceMonitoring.getAvgScore()).toEqual('66.67');
        await performanceMonitoring.clickRowByAgentName(testDataUsed.agentUser.fullName);
        await performanceDetails.waitForDetailsPage();
        rowColumnValues1 = await performanceDetails.getRowDetails('score', '66.67|---');
        expect(rowColumnValues1.planName).toEqual(testDataUsed.planData.name);
        expect(rowColumnValues1.workflowType).toEqual('Collaborative');
        expect(rowColumnValues1.score).toEqual('66.67|---');
        expect(rowColumnValues1.workflowStatus).toEqual('Waiting for agent');
        rowColumnValues2 = await performanceDetails.getRowDetails('score', '66.67|---');
        expect(rowColumnValues2.planName).toEqual(testDataUsed.planData.name);
        expect(rowColumnValues2.score).toEqual('---|66.67');
        expect(rowColumnValues2.workflowStatus).toEqual('Waiting for evaluator');
        
});

Then("Step-4: should submit evaluations to complete collaborative evaluation flow", { timeout: 180 * 1000 }, async () =>{

    response4 = await CommonQMNoUIUtils.getAllTasks(testDataUsed.managerUser.userToken,false); // passing false as bodyJSON
    let task = _.filter(response4.tasks, (taskObj:any) => {
        return taskObj.segmentId === testDataUsed.segmentIds[1];
    });
    console.log('Submitting evaluation from Manager side for Completed status , workflowinstance id: ', task[0].referenceId);
    console.log('Segment ID', task[0].segmentId);
    await CommonQMNoUIUtils.submitEvaluation(task[0].referenceId, testDataUsed.formData.id,
        '75.00', integrationTestData.suite06.evaluationTwo.formAnswersManager,'CompleteNoReview',0,4,false,'',[],testDataUsed.managerUser.userToken );
    response4 = await CommonQMNoUIUtils.getEvaluations(testDataUsed.agentUser.userToken,false);
    let evaluation = _.filter(response4.evaluations, (evaluationObj:any) => {
        return evaluationObj.segmentId === testDataUsed.segmentIds[0];
    })
    console.log('Submitting evaluation from Agent side for Completed status, workflowinstance id: ', evaluation[0].referenceId);
    console.log('Segment ID', evaluation[0].segmentId);
    await CommonQMNoUIUtils.submitEvaluation(evaluation[0].referenceId, testDataUsed.formData.id,
        '75.00',integrationTestData.suite06.evaluationOne.formAnswersAgent, 'Self-Assessment-Completed',0, 4,
        false, '', [], testDataUsed.agentUser.userToken);
})

Then("Step-5: should create data and submit evaluations for expiring the collaborative evaluations", { timeout: 180 * 1000 }, async () => {
    await pushInteractionData([testDataUsed.agentUser.id], moment().utc().subtract(1, 'day'), moment().utc(),
        8, testDataUsed.adminUser.userToken);
    await createQualityPlan('CollaborativePlanForExpiry', 'Collaborative', testDataUsed.managerUser.id, false);
    let workflowConfigResponse:any = await createCollaborativeWorkflowConfiguration(testDataUsed.formData.id,
        '0', testDataUsed.adminUser.userToken);
        await startCollaborativeWorkflow(
            workflowConfigResponse.workflowConfigurationUUID,
            testDataUsed.agentUser.agentSegmentData[0], testDataUsed.agentUser.id, testDataUsed.managerUser.id,
            testDataUsed.agentUser.fullName, testDataUsed.managerUser.fullName,
            testDataUsed.team.id, testDataUsed.agentUser.agentSegmentData[0].segmentStartTime,
            testDataUsed.agentUser.agentSegmentData[0].segmentEndTime, testDataUsed.planData.id,
            moment().add(32, 'minutes').toJSON(),
            testDataUsed.managerUser.id, 'collaborativeEvaluationForm', testDataUsed.adminUser.userToken);
        await startCollaborativeWorkflow(
            workflowConfigResponse.workflowConfigurationUUID,
            testDataUsed.agentUser.agentSegmentData[1], testDataUsed.agentUser.id, testDataUsed.managerUser.id,
            testDataUsed.agentUser.fullName, testDataUsed.managerUser.fullName,
            testDataUsed.team.id, testDataUsed.agentUser.agentSegmentData[1].segmentStartTime,
            testDataUsed.agentUser.agentSegmentData[1].segmentEndTime, testDataUsed.planData.id,
            moment().add(32, 'minutes').toJSON(),
            testDataUsed.managerUser.id, 'collaborativeEvaluationForm', testDataUsed.adminUser.userToken);
        await performanceMonitoring.navigate();
        await performanceMonitoring.navigateToMySchedule();
        response = await CommonQMNoUIUtils.getAllTasks(testDataUsed.managerUser.userToken, false);
        expect(response.tasks.length).toEqual(2);
        let task = response.tasks[0];
        console.log('Submitting evaluation from Manager side for Partially Completed status with workflowinstanceid: ', task.referenceId, ' and segment id: ', task.segmentId);
        testDataUsed.segmentIds[2] = task.segmentId;
        await CommonQMNoUIUtils.submitEvaluation(task.referenceId, testDataUsed.formData.id,
            '66.67', integrationTestData.suite06.evaluationOne.formAnswersManager, 'CompleteNoReview', 0, 3, false,
            '', [], testDataUsed.managerUser.userToken);
});

Then("Step-6: should verify data in plan monitoring", { timeout: 180 * 1000 }, async () => {
    await plansMonitoringPO.navigate();
    let rowData = await plansMonitoringPO.getPlanRowDetails('CollaborativePlan');
    expect(rowData.planOccurence).toEqual(moment().subtract(4, 'day').format(dateFormat.shortDateFormat) + ' - ' + moment().add(1, 'day').format(dateFormat.shortDateFormat));
    expect(rowData.distributionRate).toEqual('100% (2/2)');
    expect(rowData.consumptionRate).toEqual('100% (2/2)');
    expect(rowData.avgEvalPerDay).toEqual('0.50');
    expect(rowData.remainingDays).toEqual('2d');
    expect(rowData.status).toEqual('On Track');
    await plansMonitoringPO.openPlanDetails('CollaborativePlan');
    expect(await plansMonitoringPO.verifyPlanStat('distribution-rate')).toEqual('100% (2/2)');
    expect(await plansMonitoringPO.verifyPlanStat('plan-details-consumption-rate')).toEqual('100% (2/2)');
    let rowElements = await plansMonitoringPO.getPlanSummaryDetails();
    expect(rowElements.planOccurance).toEqual(moment().subtract(4, 'day').format(dateFormat.shortDateFormat) + ' - ' + moment().add(1, 'day').format(dateFormat.shortDateFormat));
    expect(rowElements.evaluationInPlan).toEqual('NO. OF EVALUATORS: 1');
    expect(rowElements.agentsInPlan).toEqual('NO. OF AGENTS: 1');
    expect(rowElements.interactionPerAgent).toEqual('NO. OF INTERACTIONS / AGENTS: 2');

});

Then("Step-7: should verify all statuses in performance monitoring", { timeout: 180 * 1000 }, async () => {
    await performanceMonitoring.navigate();
    await performanceMonitoring.navigateToMySchedule();
    rowElements1 = await performanceMonitoring.getPerfMonitoringRowElements(testDataUsed.agentUser.fullName);
    expect(rowElements1.avgScore).toEqual('69.45');
    expect(rowElements1.teams).toEqual('DefaultTeam');
    expect(rowElements1.groups).toEqual('GROUP_1');
    expect(rowElements1.noOfEvaluations).toEqual('3');
    await performanceMonitoring.clickRowByAgentName(testDataUsed.agentUser.fullName);
    await performanceMonitoring.waitForDetailsPage();
    rowColumnValues1 = await performanceDetails.getRowDetails('score', '66.67|75.00');
    expect(rowColumnValues1.planName).toEqual('CollaborativePlan');
    expect(rowColumnValues1.workflowType).toEqual('Collaborative');
    expect(rowColumnValues1.score).toEqual('66.67|75.00');
    expect(rowColumnValues1.workflowStatus).toEqual('Completed');
    rowColumnValues1 = await performanceDetails.getRowDetails('score', '66.67|75.00');
    expect(rowColumnValues1.planName).toEqual('CollaborativePlan');
    expect(rowColumnValues1.workflowType).toEqual('Collaborative');
    expect(rowColumnValues1.score).toEqual('75.00|66.67');
    expect(rowColumnValues1.workflowStatus).toEqual('Completed');
});

Then("Step-8: should verify data in performance monitoring for expired collaborative evaluations ", { timeout: 180 * 1000 }, async () => {
    let rowColumnValues: any ;
    await browser.sleep(10000);
    for (let i = 1; i <= 3; i++) {
        await performanceMonitoring.navigate();
        await performanceMonitoring.navigateToMySchedule();
        let rowElements = await performanceMonitoring.getPerfMonitoringRowElements(testDataUsed.agentUser.fullName);
        expect(rowElements.avgScore).toEqual('69.45');
        expect(rowElements.teams).toEqual('DefaultTeam');
        expect(rowElements.groups).toEqual('GROUP_1');
        expect(rowElements.noOfEvaluations).toEqual('3');
        await performanceMonitoring.clickRowByAgentName(testDataUsed.agentUser.fullName);
        await utils.delay(2000);
        rowColumnValues = await performanceDetails.getRowDetails('score', '66.67|---');
        if (rowColumnValues.workflowStatus !== 'Partially Completed') {
            console.log(`Expected Status not found: Status: ${rowColumnValues.workflowStatus}`);
            await browser.sleep(20000);
            continue;
        } else {
            break;
        }
    }
    expect(rowColumnValues.planName).toEqual('CollaborativePlanForExpiry');
    expect(rowColumnValues.workflowType).toEqual('Collaborative');
    expect(rowColumnValues.score).toEqual('66.67|---');
    expect(rowColumnValues.workflowStatus).toEqual('Partially Completed');
});
