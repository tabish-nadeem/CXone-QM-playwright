import * as protHelper from '../../../../playwright.helpers';
import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
//import { FEATURE_TOGGLES } from '../../../src/ng2/assets/CONSTANTS';
//import { enablingFeatureToggle, removeFeatureToggle } from '../../../tests/protractor/common/prots-utils';
import { PlansMonitoringPagePO } from '../../../../pageObjects';
import { AccountUtils } from '../../../../common/AccountUtils';
import { Strings } from '../../../../common/strings_en_US';
import { Utils } from '../../../../common/utils';
import * as moment from 'moment';
import { CommonNoUIUtils } from '../../../../common/CommonNoUIUtils';
import { GlobalTenantUtils } from '../../../../common/globalTenantUtils';
import { LoginPage } from "../../../../common/login";
import { UIConstants, FEATURE_TOGGLES } from "../../../../common/uiConstants";
import { FeatureToggleUtils } from '../../../../common/FeatureToggleUtils';
import { CommonQMNoUIUtils } from '../../../../common/CommonQMNoUIUtils';
import { LocalizationNoUI } from '../../../../common/LocalizationNoUI';
import { Helpers } from '../../../../playwright.helpers';
import { Credentials } from "../../../../common/support";
import { AdminUtilsNoUI } from '../../../../common/AdminUtilsNoUI';
import { OnPrepare } from '../../../../playwright.config';
import * as _ from 'lodash';
import { CommonUIUtils } from "cxone-playwright-test-utils";
import { URLs } from '../../../../common/pageIdentifierURLs';
//let _ = require('lodash');

let page: Page;
let browser: any;
let context: BrowserContext;
let loginPage: any;

let newGlobalTenantUtils: any;
let plansMonitoringPO: any;
let strings = new Strings();
let utils = new Utils(page);
let uiConstants = new UIConstants();

let localeString = 'en-US',
    dateFormat: any = {};
//let moment : any;
let teamInfo: any = [];
let userValues: any;
let formDetails: any;

let agentsEmailId: any;
let adminUser: any = {};
let agentUser: any = {};
let userDetails: any;
let groupName = 'QM_Execution_Weekly';
let monthlyPlanConsumptionDateRange: any;
let weeklyPlanConsumptionDateRange: any;
let planStatus: any = {};
let dateTimeFormat: any;
let dateFormatDDMMYYYYSpace: any;
let dateFormatYYYYMMDD: any;
let dateFormatDDMMM: any;
let dateFormatDD: any;
let dateFormatMMMMYYYY: any;
let res: any;
let resForm: any;
let data: any;

teamInfo = [
    {
        name: 'Team' + AccountUtils.getFullRandomString(5), // With Users
        teamId: ''
    }
],
    userValues = {
        firstName: 'Recurring',
        lastName: 'Plan Employee',
        role: 'Employee',
        groupIds: []
    },
    formDetails = {
        formName: 'EVOLVE_HISTORY_PLAN',
        formStatus: 'Published',
        formType: 'EVALUATION',
        formData: strings.sampleFormData,
        workflowConfigType: 'AGENT_NO_REVIEW',
        dispute_resoluter: 'SELF'
    },
    agentsEmailId = 'ptor.' + AccountUtils.getRandomEmail(5).replace('mailinator', 'wfosaas'),
    adminUser = {},
    agentUser = {},
    userDetails,
    groupName = 'QM_Execution_Weekly',
    monthlyPlanConsumptionDateRange,
    weeklyPlanConsumptionDateRange,
    planStatus = {
        distributionRate100Percent: '300% (3/1)',
        consumptionRate0Percent: '0% (0/3)',
        recurringMonthly: 'Recurring Monthly',
        recurringWeekly: 'Recurring Weekly',
        noOfEvaluators: 'NO. OF EVALUATORS: ',
        noOfAgents: 'NO. OF AGENTS: ',
        noOfInteractionsPerAgent: 'NO. OF INTERACTIONS / AGENTS: '
    };
dateTimeFormat = 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]';
dateFormatDDMMYYYYSpace = 'DD MMM YYYY';
dateFormatYYYYMMDD = 'YYYY-MM-DD';
dateFormatDDMMM = 'DD MMM';
dateFormatDD = 'DD';
dateFormatMMMMYYYY = 'MMMM YYYY';
let monthlyPlansDateRange = prepareMonthlyDates();
let monthlyPlanName = formDetails.formName + '_MONTHLY';
let weeklyPlansDateRange = prepareWeeklyDates();
let weeklyPlanName = formDetails.formName + '_WEEKLY';

function prepareMonthlyDates() {
    let dataToPush = [];
    let date: any;
    for (let i = 11; i >= 0; i--) {
        date = moment().subtract(i, 'month');
        dataToPush.push({
            begin: date.format('YYYY-MM-01[T]HH:mm:ss.SSS[Z]'),
            end: date.endOf('Month').subtract(2, 'days').format(dateTimeFormat),
            display: date.format(dateFormatMMMMYYYY) + (i === 0 ? ' (current)' : ''),
            distributionDate: date.endOf('Month').format(dateFormatYYYYMMDD) + 'T23:55:00'
        });
    }
    console.log("dataToPush---",dataToPush);
    return dataToPush;
}


function prepareWeeklyDates() {
    let dataToPush = [];
    let date: any;
    for (let i = 4; i >= 0; i--) {
        date = moment().subtract(i, 'week');
        if (date.startOf('week').get('month') === date.endOf('week').get('month')) {
            dataToPush.push({
                begin: date.startOf('week').format(dateTimeFormat),
                end: date.endOf('week').subtract(2, 'days').format(dateTimeFormat),
                display: (i === 0) ? date.startOf('week').format(dateFormatDD) + ' - ' + date.endOf('week').format(dateFormatDDMMYYYYSpace) + ' (current)' :
                    date.startOf('week').format(dateFormatDD) + ' - ' + date.endOf('week').format(dateFormatDDMMYYYYSpace),
                distributionDate: date.endOf('week').format(dateFormatYYYYMMDD) + 'T23:55:00'
            });
        } else if (date.startOf('week').get('year') === date.endOf('week').get('year')) {
            dataToPush.push({
                begin: date.startOf('week').format(dateTimeFormat),
                end: date.endOf('week').subtract(2, 'days').format(dateTimeFormat),
                display: (i === 0) ? date.startOf('week').format(dateFormatDDMMM) + ' - ' + date.endOf('week').format(dateFormatDDMMYYYYSpace) + ' (current)' :
                    date.startOf('week').format(dateFormatDDMMM) + ' - ' + date.endOf('week').format(dateFormatDDMMYYYYSpace),
                distributionDate: date.endOf('week').format(dateFormatYYYYMMDD) + 'T23:55:00'
            });

        }
        else {
            dataToPush.push({
                begin: date.startOf('week').format(dateTimeFormat),
                end: date.endOf('week').subtract(2, 'days').format(dateTimeFormat),
                display: (i === 0) ? date.startOf('week').format(dateFormatMMMMYYYY) + ' (current)' :
                    date.startOf('week').format(dateFormatDDMMYYYYSpace) + ' - ' + date.endOf('week').format(dateFormatDDMMYYYYSpace),
                distributionDate: date.endOf('week').format(dateFormatYYYYMMDD) + 'T23:55:00'
            });
        }
    }
    console.log("dataToPush--weekly-",dataToPush);
    return dataToPush;
}

const createTeams = async (teams: any, adminId: any, token: any) => {
    console.log("Came inside Create Teams-->");
    let allTeamsCreated: any = [];
    _.forEach(teams, (teamName) => {
        allTeamsCreated.push(AdminUtilsNoUI.createTeam(teamName.name, 'Team Description', adminId, token));
    });
    let createTeamsResponse = await Promise.all(allTeamsCreated);
    _.forEach(createTeamsResponse, teamObject => {
        for (let ii = 0; ii < teamInfo.length; ii++) {
            if (teamInfo[ii].name === teamObject.team.name) {
                teamInfo[ii].teamId = teamObject.team.id;
                console.log('Created team ' + teamInfo[ii].name + ' with teamId ' + teamInfo[ii].teamId);
            }
        }
    });
    return await Promise.resolve(teamInfo);
};

const pushInteractionData = async (plansDateRange, noOfSegmentsToPush, token, agentIds) => {
    console.log("plansDateRange--",plansDateRange);
    let segmentDetails = {};
    let allInteractions = [];
    _.forEach(plansDateRange, (date) => {
        segmentDetails = {
            minDateTime: date.begin,
            maxDateTime: date.end,
            noOfSegmentsPerAgent: noOfSegmentsToPush,
            agentIds: agentIds,
            durationRange: {
                start: '30',
                end: '400'
            },
            mediaTypes: ['VOICE'],
            directionTypes: ['IN_BOUND']
        };
        allInteractions.push(CommonQMNoUIUtils.pushMultipleTypeInteractions(
            segmentDetails, false, false, false, token, true));
    });
    let response = await Promise.all(allInteractions);
    if (response.length === 0) {
        console.log('Unable to push interactions, Response from service is ', response);
        process.exit(1);
    }
    return await Promise.resolve(response);
};

let planData : any = {};

const createRecurringPlan = async (planOccurrence, planName) => {
    planData = strings.qualityPlanData;
    console.log("Plan data-->",planData);
    planData.name = planName;
    planData.evaluators = [adminUser.id];
    planData.groups = userValues.groupIds;
    planData.teams = [teamInfo[0].teamId];
    planData.formId = formDetails.id;
    console.log("[teamInfo[0].teamId]--",[teamInfo[0].teamId]);
    //console.log("planData.teams--",planData.teams + "[teamInfo[0].teamId]--",[teamInfo[0].teamId]);
    planData.planDuration.recurring = planOccurrence;
    planData.planDuration.oneTimeDateRange = null;
    planData.state = 'Active';
    planData.filters[3].active = false;
    let resp = await CommonQMNoUIUtils.createPlan(planData, adminUser.userToken);
    console.log("Resp-->",resp);
    return await Promise.resolve(resp);
};

const navigate = async () => {
    await page.waitForLoadState('load');
    let baseUrl = await Helpers.getBaseUrl();
    await page.goto(baseUrl + URLs.myZone.planMonitoring, { timeout: 20000, waitUntil: "load" });
    CommonUIUtils.waitUntilIconLoaderDone(page);
    await page.waitForSelector(`div[id="plans-monitoring-grid-container"]`);
    await utils.delay(4000);
};

const distributeAll = async (plansDateRange) => {
    console.log("plansDateRange--",plansDateRange);
    let distributeForAll: any = [];
    await utils.delay(3000);
    plansDateRange.forEach(date => {
        console.log("Date of dis date",date.distributionDate);
        distributeForAll.push(CommonQMNoUIUtils.distributeInteractions(date.distributionDate, adminUser.userToken, ''));
    });
    //console.log("Date of dis date",date.distributionDate +"admin user token" ,adminUser.userToken+ "admin user tenantid", adminUser.tenantId);
    let distributeResponse = await Promise.all(distributeForAll);
    console.log('No of interactions distributed is ', distributeResponse.join());
    const expectedDistributionCount = '1';
    if (distributeResponse[0] !== expectedDistributionCount) {
        console.log('Distribution failed, Failing test case');
        process.exit(1);
    }
    return await Promise.resolve(distributeResponse);
};

BeforeAll({ timeout: 300 * 1000 }, async () => {
    browser = await chromium.launch({
        headless: false,
        args: ['--window-position=-8,0']
    });
    context = await browser.newContext();
    page = await context.newPage();
    newGlobalTenantUtils = new GlobalTenantUtils();
    plansMonitoringPO = new PlansMonitoringPagePO(page);
    loginPage = new LoginPage(page);
    userDetails = await newGlobalTenantUtils.getDefaultTenantCredentials();
    let newOnPrepare = new OnPrepare();
    await newOnPrepare.OnStart(userDetails);
    console.log('Global Tenant Created', userDetails);

    let response = await CommonNoUIUtils.login(userDetails.email, userDetails.password, true);
    console.log("User details-->", response);
    adminUser = response.user;
    adminUser.userToken = response.token;
    adminUser.password = userDetails.password;
    adminUser.tenantId = response.tenantId;
    console.log("Admin user-->", adminUser + "User token-->", adminUser.userToken + "User password-->", adminUser.password + "Tenant id", adminUser.tenantId);
    await page.goto(uiConstants.url, { timeout: 20000, waitUntil: "load" });
    await loginPage.login(adminUser.emailAddress, adminUser.password);
    //await plansMonitoringPO.navigate();
    //await navigate();
    data = await CommonQMNoUIUtils.createGroup(groupName, adminUser.userToken);
    console.log("data-->", data);
    userValues.groupIds.push(data.groupId);
    await AccountUtils.createAndActivateUser(agentsEmailId, Credentials.validPassword, userValues,
        adminUser.emailAddress, adminUser.organizationName, adminUser.userToken);
    let allUsers = await CommonNoUIUtils.getUsers(adminUser.userToken);
    console.log("All users-->", allUsers);
    agentUser = _.find(allUsers.users, { role: 'Employee' });
    console.log("Agent user-->", agentUser);
    formDetails.formName = formDetails.formName + new Date().getTime();
    console.log("Formdetails formname-->", formDetails.formName);
    res = await CommonQMNoUIUtils.createForm(formDetails, adminUser.userToken);
    formDetails.id = res.id;
    resForm = await CommonQMNoUIUtils.getFormDetails(formDetails.id, adminUser.userToken);
    const formDataObj = JSON.parse(resForm.elementData[0].formData);
    formDetails.workflowConfigurationID = formDataObj.workflowConfigurationId;
    console.log("Formdetails wfid-->", formDetails.workflowConfigurationID);
    await CommonQMNoUIUtils.updateWorkflowConfig(formDetails.workflowConfigurationID, 'activity_timeout', 1800, 'Evaluate', adminUser.userToken);
    console.log("Completed updateWorkflowConfig->");
    console.log("Teamsinfo-->",teamInfo + "Adminuserid-->", adminUser.id);
    await createTeams(teamInfo, adminUser.id, adminUser.userToken);
    console.log("Teamsinfo-->",teamInfo);
    console.log("Completed createTeams->");
    console.log("1--", teamInfo[0].teamId + "2--", [agentUser.id] + "3--", adminUser.userToken);
    //await AdminUtilsNoUI.assignUsersToTeam(teamInfo[0].teamId, [adminData.userGroup1.employees[0].id, adminData.userGroup1.employees[1].id], adminUser.userToken);
    await CommonQMNoUIUtils.assignUsersToTeam(teamInfo[0].teamId, [agentUser.id], adminUser.userToken);
    //console.log("Completed assignUsersToTeam->");
    dateFormat = await LocalizationNoUI.getDateStringFormat(localeString);
    console.log("dateFormat-->", dateFormat);
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SUMMER21, userDetails.orgName, adminUser.userToken);
    await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.FT_EXCLUDE_INACTIVE_USERS, userDetails.orgName, adminUser.userToken);
});

// AfterAll({ timeout: 60 * 1000 }, async () => {
//     //await utils.removeFeatureToggle(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SUMMER21, userDetails.orgName, adminUser.userToken);
//     await loginPage.logout();
//     await CommonUIUtils.waitUntilIconLoaderDone(page);
//     await browser.close();
// });

Given("Step-1: Starts", { timeout: 60 * 1000 }, async () => {
    console.log("Step1 Starts");
});

When("Step-2: Distributing For Previous 12 Months", { timeout: 300 * 1000 }, async () => {
    console.log("Scenario 1-step2 Starts");
    console.log("monthlyPlansDateRange--", monthlyPlansDateRange);
    console.log("monthlyPlanName--",monthlyPlanName);
    let promiseArray = [
        pushInteractionData(monthlyPlansDateRange, 1, adminUser.userToken, [agentUser.id])
    ];
    await Promise.all(promiseArray);
    console.log("Passed till here");
    await utils.delay(4000);
    await createRecurringPlan('Monthly', monthlyPlanName);
    await distributeAll(monthlyPlansDateRange);
    await plansMonitoringPO.navigate();
    await plansMonitoringPO.openPlanDetails(monthlyPlanName);
    // let dropdownValues = await plansMonitoringPO.openAndFetchDropDownValues();
    // console.log("dropdownValues--",dropdownValues);
    // _.forEach(monthlyPlansDateRange, (dates) => {
    //     expect(dropdownValues).toContain(dates.display);
    // });
    // await plansMonitoringPO.closeDropDown();
    monthlyPlanConsumptionDateRange = moment().startOf('month').format(dateFormat.shortDateFormat).toUpperCase() + ' - ' + moment().endOf('month').format(dateFormat.shortDateFormat).toUpperCase();
    console.log("monthlyPlanConsumptionDateRange--",monthlyPlanConsumptionDateRange);
    let getConsumptionTrend = await plansMonitoringPO.getConsumptionTrend();
    expect(getConsumptionTrend).toContain(monthlyPlanConsumptionDateRange);
    let verifyPlanStatDistribution = await plansMonitoringPO.verifyPlanStat('distribution-rate')
    expect(verifyPlanStatDistribution).toEqual(planStatus.distributionRate100Percent);
    expect(await plansMonitoringPO.verifyPlanStat('plan-details-consumption-rate')).toEqual(planStatus.consumptionRate0Percent);
    let rowElements = await plansMonitoringPO.getPlanSummaryDetails();
    console.log("rowElements--",rowElements);
    expect(rowElements.planOccurance).toEqual(planStatus.recurringMonthly);
    expect(rowElements.evaluationInPlan).toEqual(planStatus.noOfEvaluators + '1');
    expect(rowElements.agentsInPlan).toEqual(planStatus.noOfAgents + '1');
    expect(rowElements.interactionPerAgent).toEqual(planStatus.noOfInteractionsPerAgent + '1');
});

Then("Step-3: Distributing For Previous 5 weeks Months", { timeout: 180 * 1000 }, async () => {
    console.log("weeklyPlansDateRange--",weeklyPlansDateRange);
    console.log("weeklyPlanName--",weeklyPlanName);
    let promiseArray = [
        pushInteractionData(weeklyPlansDateRange, 1, adminUser.userToken, [agentUser.id]),
        createRecurringPlan('Weekly', weeklyPlanName)
    ];
    await Promise.all(promiseArray);
    await distributeAll(weeklyPlansDateRange);
    await plansMonitoringPO.navigate();
    await plansMonitoringPO.openPlanDetails(weeklyPlanName);
    let dropdownValues = await plansMonitoringPO.openAndFetchDropDownValues();
    console.log("dropdownValues--",dropdownValues);
    _.forEach(weeklyPlansDateRange, dates => {
        expect(dropdownValues).toContain(dates.display);
    });
    await plansMonitoringPO.closeDropDown();
    weeklyPlanConsumptionDateRange = moment().startOf('week').format(dateFormat.shortDateFormat).toUpperCase() + ' - ' + moment().endOf('week').format(dateFormat.shortDateFormat).toUpperCase();
    console.log("weeklyPlanConsumptionDateRange--",weeklyPlanConsumptionDateRange);
    expect(plansMonitoringPO.getConsumptionTrend()).toContain(weeklyPlanConsumptionDateRange.toUpperCase());
    expect(await plansMonitoringPO.verifyPlanStat('distribution-rate')).toEqual(planStatus.distributionRate100Percent);
    expect(await plansMonitoringPO.verifyPlanStat('plan-details-consumption-rate')).toEqual(planStatus.consumptionRate0Percent);
    let rowElements = await plansMonitoringPO.getPlanSummaryDetails();
    console.log("rowElements--",rowElements);
    expect(rowElements.planOccurance).toEqual(planStatus.recurringWeekly);
    expect(rowElements.evaluationInPlan).toEqual(planStatus.noOfEvaluators + '1');
    expect(rowElements.agentsInPlan).toEqual(planStatus.noOfAgents + '1');
    expect(rowElements.interactionPerAgent).toEqual(planStatus.noOfInteractionsPerAgent + '1');
});


