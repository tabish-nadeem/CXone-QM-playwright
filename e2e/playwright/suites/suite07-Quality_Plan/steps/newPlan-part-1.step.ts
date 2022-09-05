import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
// import { FEATURE_TOGGLES } from '../../../assets/CONSTANTS';
import { Utils } from '../../../../common/utils';
import { CommonNoUIUtils } from '../../../../common/CommonNoUIUtils';
import { GlobalTenantUtils } from '../../../../common/globalTenantUtils';
import { LoginPage } from "../../../../common/login";
import { FEATURE_TOGGLES } from "../../../../common/uiConstants";
import { FeatureToggleUtils } from '../../../../common/FeatureToggleUtils';
import {QualityPlanManagerPO} from "../../../../pageObjects/quality-plan-manager.po"
import {QualityPlanDetailsPO} from "../../../../pageObjects/quality-plan-details.po"
import {PlanSummaryPO} from '../../../../pageObjects/plan-summary.po'
import {PlanDurationPO} from '../../../../pageObjects/plan-duration.po'
import {SamplingPO}  from '../../../../pageObjects/sampling.po';

import { LocalizationNoUI } from '../../../../common/LocalizationNoUI';
import { Credentials } from "../../../../common/support";
import { CommonUIUtils } from "cxone-playwright-test-utils";
import { AdminUtilsNoUI } from '../../../../common/AdminUtilsNoUI';
import { UserDefaultPermissions } from '../../../../common/userDefaultPermissions';
import { TeamsAndGroupsPO } from '../quality-plan-details/teams-and-groups/teams-and-groups.po';
// import { IntegrationTestData } from "../../../../common/integrationTestData";
// import { PerformanceMonitoringPo } from '../../../../pageObjects/performanceMonitoringPO';
// import { PerformanceDetailsPO } from '../../../../pageObjects/performanceDetailsPO';
// import { PlansMonitoringPagePO } from '../../../../pageObjects/plansMonitoringPO';
import { OnPrepare } from '../../../../playwright.config';
import { Helpers } from '../../../../playwright.helpers';
import * as moment from 'moment';
import * as _ from 'lodash';
import { DataCreator } from "../../../../common/DataCreator";




let browser: any;
let context: BrowserContext;
let performanceMonitoring: any;
let newGlobalTenantUtils = new GlobalTenantUtils();
let USER_TOKEN: string;
let page: Page;

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
// let data: any;
// let responseCreatePlan: any;
// let response: any;
// let response2: any;
// let response3: any;
// let response4: any;
// let response5: any;
// let newOnPrepare: any;
// let getElementLists: any;
// let responseManager: any;
// let baseUrl: any;
// let rowElements1: any;
// let responseEvaluator: any;
// let rowElements2: any;
// let rowColumnValues1: any;
// let rowColumnValues2: any;

const qualityPlanDetailsPO = new QualityPlanDetailsPO();
const qualityPlanManagerPO = new QualityPlanManagerPO();
const teamsAndGroupsPO = new TeamsAndGroupsPO();
const planSummaryPO = new PlanSummaryPO(); 
const samplingPO = new SamplingPO();
const planDurationPO = new PlanDurationPO();




BeforeAll({ timeout: 300 * 1000 }, async () => {
    browser = await chromium.launch({
        headless: false,
        args: ['--window-position=-8,0']
    });
    context = await browser.newContext();
    page = await context.newPage();
    userDetails = await newGlobalTenantUtils.getDefaultTenantCredentials(); //!
    console.log("userDetails.email", userDetails.email + "userDetails.password", userDetails.password);
    USER_TOKEN = await CommonNoUIUtils.login(userDetails.email, userDetails.password, true);
    console.log("Response login", USER_TOKEN);
    //! DataCreator.setToken(USER_TOKEN); // not got file
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SUMMER21, userDetails.orgName, USER_TOKEN);
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.RELEASE_NAVIGATION_REDESIGN, userDetails.orgName, USER_TOKEN);
    await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.FT_EXCLUDE_INACTIVE_USERS, userDetails.orgName, testDataUsed.adminUser.USER_TOKEN);
    await CommonUIUtils.maximizeBrowserWindow();
    await prepareData();
});


    async function prepareData() {
        const form = {
            formId: '',
            formName: 'SAMPLE_FORM' + moment(),
            formStatus: 'Published',
            formType: 'EVALUATION',
            workflowConfigType: 'AGENT_NO_REVIEW'
        };
        const groups = await DataCreator.createRandomGroups(2, 'qp');
        const teams = await DataCreator.createRandomTeams(3, 'qp');
        const userData = [
            {
                email: 'ptor1' + AdminUtilsNoUI.getRandomEmail(2),
                teamId: teams[0].id,
                groupIds: [groups[0].groupId]
            },
            {
                email: 'ptor2' + AdminUtilsNoUI.getRandomEmail(2),
                teamId: teams[1].id,
                groupIds: [groups[0].groupId, groups[1].groupId]
            },
            {
                email: 'ptor3' + AdminUtilsNoUI.getRandomEmail(2),
                teamId: '',
                groupIds: []
            }
        ];
        await DataCreator.createUser(userData[0].email, userData[0]);
        await DataCreator.createUser(userData[1].email, userData[1]);
        const formId = await DataCreator.createForm(form.formName, form.formStatus, form.formType, form.workflowConfigType);
        form.formId = formId;
        await protractorConfig.tmUtils.updateTenantLicenses((teams[2].id, teams[2].name, teams[2].description, '', 'INACTIVE', USER_TOKEN);
       
    }



    // const beforeEachFunction = async () => {
    //     await formDesignerPage.navigateTo();
    //     await Utils.waitUntilVisible(await formArea.getFormArea());
    // };
    // const onEnd = async () => {
    //     await removeFeatureToggle(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);

    //     await CommonNoUIUtils.logout(true, 120000, userDetails.orgName, userToken);
    //     //! logOUT // not found
    // };
   

    Given("Step 1: should click on save and activate and verify the error message that one team needs to be selected", { timeout: 60 * 1000 }, async () => {
        await qualityPlanDetailsPO.navigate(true);
        await qualityPlanDetailsPO.saveAndActivate();
        expect(await teamsAndGroupsPO.getErrorMessage()).toEqual('You must select atleast one team');

    });

    When("Step-2: should verify user is able to successfully select specific teams and groups from dropdowns, and the intersection count of agents should be correct", { timeout: 180 * 1000 }, async () => {
        await teamsAndGroupsPO.selectTeams([teams[0].name, teams[1].name]);
        await teamsAndGroupsPO.selectGroups([groups[0].groupName, groups[1].groupName]);
        expect(await teamsAndGroupsPO.getSelectedTeams()).toEqual(`${teams[0].name}, ${teams[1].name}`);
        expect(await teamsAndGroupsPO.getSelectedGroups()).toEqual(`${groups[0].groupName}, ${groups[1].groupName}`);
        expect(await teamsAndGroupsPO.getUsersCount()).toEqual(2);
        await teamsAndGroupsPO.deselectGroups([groups[0].groupName]);
        expect(await teamsAndGroupsPO.getUsersCount()).toEqual(1);
        expect(await planSummaryPO.getInteractionsPerAgent()).toEqual('2');
    });

    Then("STEP-3: should be able to save teams and groups data and verify after opening draft plan", { timeout: 180 * 1000 }, async () => {
        await qualityPlanDetailsPO.refresh();
        await teamsAndGroupsPO.waitUntilVisible();
        await qualityPlanDetailsPO.enterPlanName('Teams and Groups Draft Plan');
        await teamsAndGroupsPO.selectTeams([teams[0].name, teams[1].name]);
        await teamsAndGroupsPO.selectGroups([groups[0].groupName, groups[1].groupName]);
        await qualityPlanDetailsPO.saveAsDraft();
        await qualityPlanManagerPO.openQualityPlanByName('Teams and Groups Draft Plan');
        await Utils.waitForSpinnerToDisappear();
        expect(await teamsAndGroupsPO.getSelectedTeams()).toEqual(`${teams[0].name}, ${teams[1].name}`);
        expect(await teamsAndGroupsPO.getSelectedGroups()).toEqual(`${groups[0].groupName}, ${groups[1].groupName}`);
        expect(await teamsAndGroupsPO.getUsersCount()).toEqual(2);
    });


    Given("STEP-8: Sampling and Evaluation Type Tests", { timeout: 180 * 1000 }, async () => {
      
        await performanceMonitoring.navigateTo(true);
        await qualityPlanDetailsPO.saveAndActivate();
    });

    Then("STEP-9: should have the default values and states for a new plan", { timeout: 180 * 1000 }, async () => {
        expect(await samplingPO.getNumberOfInteractionsPerAgent()).toEqual('2');
        expect(await samplingPO.isIncludeInteractionsFromLastChecked()).toBeFalsy();
        expect(await samplingPO.getIncludeInteractionsFromLastValue()).toEqual('2');
        expect(await evaluationTypePO.getSelectedEvaluationType()).toEqual('Standard');
        expect(await samplingPO.isIncludeInteractionsFromLastDropdownEnabled()).toBeFalsy();
    
});
Then("STEP-10: should check that info message popup if max-days-back value is greater than 7 and the Occurrence date change from month to weekly", { timeout: 180 * 1000 }, async () => {
    await samplingPO.toggleIncludeInteractionsFromLast();
await samplingPO.setIncludeInteractionsFromLastValue('10');
await planDurationPO.setRecurringType('Weekly');
expect(await samplingPO.getErrorMessage()).toEqual('Plan duration is 7 days. Select from 1 to 6 days.');
});
Then("STEP-11: should be able to save as draft plan and verify sampling after opening the plan'", { timeout: 180 * 1000 }, async () => {
    await qualityPlanDetailsPO.refresh();
    await qualityPlanDetailsPO.enterPlanName('Sampling Draft Plan');
    await evaluationTypePO.setCollaborativeEvaluationType();
    await samplingPO.toggleIncludeInteractionsFromLast();
    await samplingPO.setIncludeInteractionsFromLastValue('10');
    await samplingPO.setNumberOfInteractionsPerAgent('4');
    await qualityPlanDetailsPO.saveAsDraft();
    await qualityPlanManagerPO.openQualityPlanByName('Sampling Draft Plan');
    expect(await samplingPO.getNumberOfInteractionsPerAgent()).toEqual('4');
    expect(await samplingPO.getIncludeInteractionsFromLastValue()).toEqual('10');
    expect(await evaluationTypePO.getSelectedEvaluationType()).toEqual('Collaborative');
});
Given("STEP-12: Plan Duration Tests", { timeout: 180 * 1000 }, async () => {
    
    await performanceMonitoring.navigateTo(true);
    await qualityPlanDetailsPO.saveAndActivate();
});
Then("STEP-13: should have the default values and states for a new plan", { timeout: 180 * 1000 }, async () => {
    const startDate = moment().format('MMM D, YYYY');
    const endDate = moment().add(1, 'month').format('MMM D, YYYY');
    expect(await planDurationPO.isOneTimeSelected()).toBeFalsy();
    expect(await planDurationPO.isRecurringSelected()).toBeTruthy();
    expect(await planDurationPO.getRecurringTypeSelected()).toEqual('Monthly');
    expect(await planDurationPO.getStartDate()).toEqual(startDate);
    expect(await planDurationPO.getEndDate()).toEqual(endDate);
    expect(await evaluationFormPO.getEvaluationFormSelected()).toEqual('Select a form');
    expect(await planDurationPO.isStartDateEnabled()).toBeFalsy();
    expect(await planDurationPO.isEndDateEnabled()).toBeFalsy();
});

Then("STEP-14: should reset start date to equal end date if start date is greater than end date", { timeout: 180 * 1000 }, async () => {
    await planDurationPO.setOneTime();
    await planDurationPO.setStartDate(new Date(2021, 0, 15, 0, 0, 0, 0));
    await planDurationPO.setEndDate(new Date(2021, 0, 10, 0, 0, 0, 0));
    await Utils.click(qualityPlanDetailsPO.getPlanNamePageTitleElement());
    expect(await planDurationPO.getStartDate()).toEqual('Jan 15, 2021');
    expect(await planDurationPO.getEndDate()).toEqual('Jan 15, 2021');
});

Then("STEP-15: should be able to save as draft a recurring weekly plan'", { timeout: 180 * 1000 }, async () => {
    await qualityPlanDetailsPO.enterPlanName('Plan Duration Recurring Weekly Draft Plan');
    await planDurationPO.setRecurring();
    await planDurationPO.setRecurringType('Weekly');
    await evaluationFormPO.setEvaluationForm(form.formName);
    await qualityPlanDetailsPO.saveAsDraft();
    await qualityPlanManagerPO.openQualityPlanByName('Plan Duration Recurring Weekly Draft Plan');
    expect(await planDurationPO.getRecurringTypeSelected()).toEqual('Weekly');
    expect(await evaluationFormPO.getEvaluationFormSelected()).toEqual(form.formName);
});

Then("STEP-15: should be able to save as draft a one time plan", { timeout: 180 * 1000 }, async () => {
    await qualityPlanDetailsPO.refresh();
    await qualityPlanDetailsPO.enterPlanName('Plan Duration One Time Draft Plan');
    await planDurationPO.setOneTime();
    await planDurationPO.setStartDate(new Date(2021, 0, 5, 0, 0, 0, 0));
    await planDurationPO.setEndDate(new Date(2021, 0, 10, 0, 0, 0, 0));

    await evaluationFormPO.setEvaluationForm(form.formName);
    await qualityPlanDetailsPO.saveAsDraft();
    await qualityPlanManagerPO.openQualityPlanByName('Plan Duration One Time Draft Plan');
    expect(await planDurationPO.isOneTimeSelected()).toBeTruthy();
    expect(await planDurationPO.isRecurringSelected()).toBeFalsy();
    expect(await planDurationPO.getStartDate()).toEqual('Jan 5, 2021');
    expect(await planDurationPO.getEndDate()).toEqual('Jan 10, 2021');
    expect(await evaluationFormPO.getEvaluationFormSelected()).toEqual(form.formName);
});

