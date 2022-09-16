import { Utils } from '../../../../common/utils';
import { fdUtils } from '../../../../common/FdUtils';
import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
import { CommonNoUIUtils } from '../../../../common/CommonNoUIUtils';
import { GlobalTenantUtils } from '../../../../common/globalTenantUtils';
import { FEATURE_TOGGLES } from "../../../../common/uiConstants";
import { FeatureToggleUtils } from '../../../../common/FeatureToggleUtils';
import { QualityPlanManagerPO } from "../../../../pageObjects/AualityPlanManagerPO"
import { QualityPlanDetailsPO } from "../../../../pageObjects/AualityPlanDetailsPO"
import { PlanSummaryPO } from '../../../../pageObjects/PlanSummaryPO'
import { PlanDurationPO } from '../../../../pageObjects/PlanDurationPO'
import { SamplingPO } from '../../../../pageObjects/sampling.po';
import { AdminUtilsNoUI } from '../../../../common/AdminUtilsNoUI';
import { TeamsAndGroupsPO } from '../../../../pageObjects/TeamsAndGroupsPO';
import * as moment from 'moment';
import * as _ from 'lodash';
import { DataCreator, DCGroup, DCTeam } from "../../../../common/DataCreator";
import FormDesignerPagePO from "../../../../pageObjects/FormDesignerPagePO";
import { FormAreaComponentPo } from "../../../../pageObjects/FormAreaComponentPO";
import { WarningModalComponentPo } from '../../../../pageObjects/WarningModalComponentPO';
import { EnhancedEvaluatorsPO } from '../../../../pageObjects/EnhancedEvaluatorsPO';
import { EvaluatorsPO } from '../../../../pageObjects/EvaluatorsPO';
import { EvaluationFormPO } from '../../../../pageObjects/EvaluationFormPO';
import { EvaluationTypePO } from '../../../../pageObjects/evaluation-type.po';
import {CallDurationPO} from '../../../../pageObjects/CallDurationPO'
import { LoginPage } from '../../../../common/login';

let browser: any;
let context: BrowserContext;
let performanceMonitoring: any;
let newGlobalTenantUtils = new GlobalTenantUtils();
let USER_TOKEN: string;
let page: Page;
let login:LoginPage

const evaluators: {
     firstName: string;
     lastName: string;
     role: string;
     email: string;
     password: string;
}[] = [];
const forms: {
     formId: string;
     formName: string;
     formStatus: string;
}[] = [];
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

let userDetails: any = {}
let planSummaryPO = new PlanSummaryPO();
let qualityPlanDetailsPO = new QualityPlanDetailsPO();
let qualityPlanManagerPO = new QualityPlanManagerPO();
let teamsAndGroupsPO = new TeamsAndGroupsPO();
let samplingPO = new SamplingPO();
let planDurationPO = new PlanDurationPO();
let formDesignerPage = new FormDesignerPagePO();
let enhancedEvaluatorsPO = new EnhancedEvaluatorsPO();
let formArea = new FormAreaComponentPo();
let warningPageModalPO = new WarningModalComponentPo();
let evaluatorsPO = new EvaluatorsPO();
const evaluationFormPO = new EvaluationFormPO();
const evaluationTypePO = new EvaluationTypePO()
const callDurationPO = new CallDurationPO();


BeforeAll({ timeout: 300 * 1000 }, async () => {
     browser = await chromium.launch({
          headless: false,
          args: ['--window-position=-8,0']
     });
     context = await browser.newContext();
     page = await context.newPage();
     userDetails = await newGlobalTenantUtils.getDefaultTenantCredentials();
     USER_TOKEN = await CommonNoUIUtils.login(userDetails.email, userDetails.password, true);
     console.log("Response login", USER_TOKEN);
     await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, USER_TOKEN);
     await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.RELEASE_NAVIGATION_REDESIGN, userDetails.orgName, USER_TOKEN);
     await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.FT_EXCLUDE_INACTIVE_USERS, userDetails.orgName, testDataUsed.adminUser.USER_TOKEN);
     await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.ENHANCED_EVALUATOR_MODAL_FT, userDetails.orgName, USER_TOKEN);
     await prepareData();

});


AfterAll({ timeout: 60 * 1000 }, async () => {
     await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.ENHANCED_EVALUATOR_MODAL_FT, userDetails.orgName, USER_TOKEN);
     await qualityPlanDetailsPO.navigate();
     await  login.logout()
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
     await AdminUtilsNoUI.createForm((teams[2].id, teams[2].name, teams[2].description, '', 'INACTIVE', USER_TOKEN));

}

Given("Step 1: should verify default values", { timeout: 60 * 1000 }, async () => {
     await qualityPlanDetailsPO.navigate();
     expect(await planSummaryPO.getTotalEvaluationsInPlan()).toEqual('--');
     expect(await planSummaryPO.getEvaluationsPerEvaluator()).toEqual('--');
     expect(await planSummaryPO.getTotalDaysInPlan()).toEqual('30');
     expect(await planSummaryPO.getInteractionsPerAgent()).toEqual('2');

});

When("Step-2: should verify plan days and interactions per agent", { timeout: 180 * 1000 }, async () => {
     await qualityPlanDetailsPO.enterPlanName('Plan Summary 1');
     await samplingPO.setNumberOfInteractionsPerAgent('99');
     expect(await planSummaryPO.getInteractionsPerAgent()).toEqual('99');
     await planDurationPO.setRecurring();
     await planDurationPO.setRecurringType('Weekly');
     expect(await planSummaryPO.getTotalDaysInPlan()).toEqual('7');
     await planDurationPO.setOneTime();
     const currentDate = moment();
     await planDurationPO.setStartDate(currentDate.add(1, 'days').toDate());
     await planDurationPO.setEndDate(currentDate.add(5, 'days').toDate());
     expect(await planSummaryPO.getTotalDaysInPlan()).toEqual('6');
     await qualityPlanDetailsPO.saveAsDraft();
     await qualityPlanManagerPO.openQualityPlanByName('Plan Summary 1');
     expect(await planSummaryPO.getTotalDaysInPlan()).toEqual('6');
     expect(await planSummaryPO.getInteractionsPerAgent()).toEqual('99');
});

Then("Step-3: should verify total interactions and interactions per day per evaluator", { timeout: 180 * 1000 }, async () => {
     await qualityPlanDetailsPO.navigate();
     await qualityPlanDetailsPO.enterPlanName('Plan Summary 2');
     await teamsAndGroupsPO.selectTeams(['DefaultTeam']);
     await Utils.waitForSpinnerToDisappear();
     expect(await planSummaryPO.getTotalEvaluationsInPlan()).toEqual('8');
     await evaluatorsPO.addEvaluators([evaluators[0].firstName]);
     await Utils.waitForSpinnerToDisappear();
     expect(await planSummaryPO.getEvaluationsPerEvaluator()).toEqual('0.27');
     await qualityPlanDetailsPO.saveAsDraft();
     await qualityPlanManagerPO.waitForPageToLoad();
     await qualityPlanManagerPO.openQualityPlanByName('Plan Summary 2');
     await Utils.waitForSpinnerToDisappear();
     expect(await planSummaryPO.getTotalDaysInPlan()).toEqual('30');
     expect(await planSummaryPO.getInteractionsPerAgent()).toEqual('2');
     expect(await planSummaryPO.getTotalEvaluationsInPlan()).toEqual('8');
     expect(await planSummaryPO.getEvaluationsPerEvaluator()).toEqual('0.27');
     await evaluationFormPO.setEvaluationForm(forms[0].formName);
     await qualityPlanDetailsPO.saveAndActivate();
     await qualityPlanManagerPO.waitForPageToLoad();
     await qualityPlanManagerPO.openQualityPlanByName('Plan Summary 2');
     await Utils.waitForSpinnerToDisappear();
     expect(await planSummaryPO.getTotalDaysInPlan()).toEqual('30');
     expect(await planSummaryPO.getInteractionsPerAgent()).toEqual('2');
     expect(await planSummaryPO.getTotalEvaluationsInPlan()).toEqual('8');
     expect(await planSummaryPO.getEvaluationsPerEvaluator()).toEqual('0.27');
});

When("Step-4: should open new plan and verify that no evaluators are selected by default", { timeout: 180 * 1000 }, async () => {
     await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.ENHANCED_EVALUATOR_MODAL_FT, userDetails.orgName, USER_TOKEN);
     await qualityPlanDetailsPO.navigate();
     expect(await evaluatorsPO.getSelectedEvaluatorsCount()).toEqual(0);
});

Then("Step-5 should be able to add evaluators and save plan, and then update the plan", { timeout: 180 * 1000 }, async () => {
     await qualityPlanDetailsPO.enterPlanName('Evaluator Plan 1');
     await evaluatorsPO.addEvaluators([`${evaluators[0].firstName} ${evaluators[0].lastName}`, `${evaluators[1].firstName} ${evaluators[1].lastName}`]);
     expect(await evaluatorsPO.getSelectedEvaluators()).toEqual([`${evaluators[0].firstName} ${evaluators[0].lastName}`, `${evaluators[1].firstName} ${evaluators[1].lastName}`]);
     await evaluationFormPO.setEvaluationForm(forms[0].formName);
     await teamsAndGroupsPO.selectTeams(['DefaultTeam']);
     await qualityPlanDetailsPO.saveAsDraft();
     await qualityPlanManagerPO.openQualityPlanByName('Evaluator Plan 1');
     expect(await evaluatorsPO.getSelectedEvaluatorsCount()).toEqual(2);
     expect(await evaluatorsPO.getSelectedEvaluators()).toEqual([`${evaluators[0].firstName} ${evaluators[0].lastName}`, `${evaluators[1].firstName} ${evaluators[1].lastName}`]);
     await evaluatorsPO.deleteEvaluator(`${evaluators[0].firstName} ${evaluators[0].lastName}`);
     expect(await evaluatorsPO.getSelectedEvaluators()).toEqual([`${evaluators[1].firstName} ${evaluators[1].lastName}`]);
     expect(await evaluatorsPO.getSelectedEvaluatorsCount()).toEqual(1);
     await qualityPlanDetailsPO.saveAndActivate();
     await qualityPlanManagerPO.waitForPageToLoad();
     await qualityPlanManagerPO.openQualityPlanByName('Evaluator Plan 1');
     expect(await evaluatorsPO.getSelectedEvaluators()).toEqual([`${evaluators[1].firstName} ${evaluators[1].lastName}`]);
     expect(await evaluatorsPO.getSelectedEvaluatorsCount()).toEqual(1);
});

Then("Step-6 should not be able to add or delete evaluators for activated plan", { timeout: 180 * 1000 }, async () => {
     expect(await evaluatorsPO.isAddEvaluatorsButtonEnabled()).toBeFalsy();
     expect(await evaluatorsPO.isDeleteEvaluatorButtonVisible(`${evaluators[1].firstName} ${evaluators[1].lastName}`)).toBeFalsy();
});
When("Step-7: should open new plan and verify that no evaluators are selected by default'", { timeout: 180 * 1000 }, async () => {
     await Utils.enablingFeatureToggle(FEATURE_TOGGLES.ENHANCED_EVALUATOR_MODAL_FT, userDetails.orgName, USER_TOKEN);
     await qualityPlanDetailsPO.navigate();
     expect(await enhancedEvaluatorsPO.getSelectedEvaluatorsCount()).toEqual(0);
});

Then("Step-7 should open enhanced evaluator modal to add evaluators", { timeout: 180 * 1000 }, async () => {
     expect(await enhancedEvaluatorsPO.verifyEnhancedModal()).toEqual(true);
     await enhancedEvaluatorsPO.modalCancel();
});
Then("Step-8 should be able to add evaluators , save plan as draft and verify evaluators", { timeout: 180 * 1000 }, async () => {
     await qualityPlanDetailsPO.enterPlanName('EnhancedEvaluatorPlan1');
     await enhancedEvaluatorsPO.addEvaluators([`${evaluators[0].firstName} ${evaluators[0].lastName}`, `${evaluators[1].firstName} ${evaluators[1].lastName}`]);
     expect(await enhancedEvaluatorsPO.getSelectedEvaluators()).toEqual([`${evaluators[0].firstName} ${evaluators[0].lastName}`, `${evaluators[1].firstName} ${evaluators[1].lastName}`]);
     await evaluationFormPO.setEvaluationForm(forms[0].formName);
     await teamsAndGroupsPO.selectTeams(['DefaultTeam']);
     await qualityPlanDetailsPO.saveAsDraft();
     await qualityPlanManagerPO.openQualityPlanByName('EnhancedEvaluatorPlan1');
     await Utils.waitForTime(3000);
     expect(await enhancedEvaluatorsPO.getSelectedEvaluatorsCount()).toEqual(2);
     expect(await enhancedEvaluatorsPO.getSelectedEvaluators()).toEqual([`${evaluators[0].firstName} ${evaluators[0].lastName}`, `${evaluators[1].firstName} ${evaluators[1].lastName}`]);
});

Then("Step-9 should be able to remove evaluators from draft plan, activate plan and verify the changes", { timeout: 180 * 1000 }, async () => {
     await enhancedEvaluatorsPO.deleteEvaluator(`${evaluators[0].firstName} ${evaluators[0].lastName}`);
     expect(await enhancedEvaluatorsPO.getSelectedEvaluators()).toEqual([`${evaluators[1].firstName} ${evaluators[1].lastName}`]);
     expect(await enhancedEvaluatorsPO.getSelectedEvaluatorsCount()).toEqual(1);
     await qualityPlanDetailsPO.saveAndActivate();
     await qualityPlanManagerPO.waitForPageToLoad();
     await qualityPlanManagerPO.openQualityPlanByName('EnhancedEvaluatorPlan1');
     await Utils.waitForTime(3000);
     expect(await enhancedEvaluatorsPO.getSelectedEvaluators()).toEqual([`${evaluators[1].firstName} ${evaluators[1].lastName}`]);
     expect(await enhancedEvaluatorsPO.getSelectedEvaluatorsCount()).toEqual(1);
});

Then("Step-10 should not be able to add or delete evaluators for activated plan", { timeout: 180 * 1000 }, async () => {
     expect(await enhancedEvaluatorsPO.isAddEvaluatorsButtonEnabled()).toBeFalsy();
     expect(await enhancedEvaluatorsPO.isDeleteEvaluatorButtonVisible(`${evaluators[1].firstName} ${evaluators[1].lastName}`)).toBeFalsy();
});

When("Step-11: should open active plan and verify that add-evaluator button is enabled'", { timeout: 180 * 1000 }, async () => {
     await Utils.enablingFeatureToggle(FEATURE_TOGGLES.QP_EDIT_EVALUATOR_FT, userDetails.orgName, USER_TOKEN);
     await qualityPlanDetailsPO.navigate();
     await qualityPlanDetailsPO.enterPlanName('Edit-Evaluator-Active-Plan');
     await evaluatorsPO.addEvaluators([`${evaluators[0].firstName} ${evaluators[0].lastName}`]);
     await evaluationFormPO.setEvaluationForm(forms[0].formName);
     await teamsAndGroupsPO.selectTeams(['DefaultTeam']);
     await qualityPlanDetailsPO.saveAndActivate();
     await qualityPlanManagerPO.waitForPageToLoad();

     await qualityPlanDetailsPO.navigate();
     await qualityPlanDetailsPO.enterPlanName('Edit-Evaluator-Draft-Plan');
     await evaluatorsPO.addEvaluators([`${evaluators[0].firstName} ${evaluators[0].lastName}`]);
     await evaluationFormPO.setEvaluationForm(forms[0].formName);
     await teamsAndGroupsPO.selectTeams(['DefaultTeam']);
     await qualityPlanDetailsPO.saveAsDraft();
     await qualityPlanManagerPO.waitForPageToLoad();
     await qualityPlanManagerPO.openQualityPlanByName('Edit-Evaluator-Active-Plan');
     expect(await evaluatorsPO.isAddEvaluatorsButtonEnabled()).toBeTruthy();
     expect(await evaluatorsPO.isDeleteEvaluatorButtonVisible(`${evaluators[0].firstName} ${evaluators[0].lastName}`)).toBeTruthy();

});

Then("Step-12 should open active plan and verify that edit-evaluator info icon is visible with tooltip", { timeout: 180 * 1000 }, async () => {
     expect(await evaluatorsPO.isEditEvaluatorInfoIconVisible()).toBeTruthy();
     await evaluatorsPO.clickEditEvaluatorInfoIcon();
     const editEvaluatorInfoIconText = await evaluatorsPO.getEditEvaluatorInfoIconTooltipText();
     expect(editEvaluatorInfoIconText).toContain('Changes to the evaluators affect the plan distribution');
});

Then("Step-13 should be able to add evaluators to active plan and save plan", { timeout: 180 * 1000 }, async () => {
     await evaluatorsPO.addEvaluators([`${evaluators[1].firstName} ${evaluators[1].lastName}`]);
     expect(await evaluatorsPO.getSelectedEvaluators()).toEqual([`${evaluators[1].firstName} ${evaluators[1].lastName}`, `${evaluators[0].firstName} ${evaluators[0].lastName}`]);
     expect(await evaluatorsPO.getSelectedEvaluatorsCount()).toEqual(2);
     await qualityPlanDetailsPO.saveAndActivate();
     await qualityPlanManagerPO.waitForPageToLoad();
     await qualityPlanManagerPO.openQualityPlanByName('Edit-Evaluator-Active-Plan');
     expect(await evaluatorsPO.getSelectedEvaluatorsCount()).toEqual(2);
     expect(await evaluatorsPO.getSelectedEvaluators()).toEqual([`${evaluators[0].firstName} ${evaluators[0].lastName}`, `${evaluators[1].firstName} ${evaluators[1].lastName}`]);
});


Then("Step-14 should be able to remove evaluators from active plan and save plan", { timeout: 180 * 1000 }, async () => {
     await evaluatorsPO.deleteEvaluator(`${evaluators[0].firstName} ${evaluators[0].lastName}`);
     expect(await evaluatorsPO.getSelectedEvaluators()).toEqual([`${evaluators[1].firstName} ${evaluators[1].lastName}`]);
     expect(await evaluatorsPO.getSelectedEvaluatorsCount()).toEqual(1);
     await qualityPlanDetailsPO.saveAndActivate();
     await qualityPlanManagerPO.waitForPageToLoad();
     await qualityPlanManagerPO.openQualityPlanByName('Edit-Evaluator-Active-Plan');
     expect(await evaluatorsPO.getSelectedEvaluators()).toEqual([`${evaluators[1].firstName} ${evaluators[1].lastName}`]);
     expect(await evaluatorsPO.getSelectedEvaluatorsCount()).toEqual(1);
     await qualityPlanDetailsPO.cancel();
     await qualityPlanManagerPO.waitForPageToLoad();
});
Then("Step-15 should open draft plan and verify that add-evaluator button is enabled and edit-evaluator info icon is not visible", { timeout: 180 * 1000 }, async () => {
     await qualityPlanManagerPO.openQualityPlanByName('Edit-Evaluator-Draft-Plan');
     expect(await evaluatorsPO.isAddEvaluatorsButtonEnabled()).toBeTruthy();
     expect(await evaluatorsPO.isEditEvaluatorInfoIconVisible()).toBeFalsy();
     expect(await evaluatorsPO.isDeleteEvaluatorButtonVisible(`${evaluators[0].firstName} ${evaluators[0].lastName}`)).toBeTruthy();
     await qualityPlanDetailsPO.cancel();
     await qualityPlanManagerPO.waitForPageToLoad();
});

Then("Step-16 should open inactive plan and verify that add-evaluator button is disabled, edit-evaluator info icon and delete evaluator button is not visible", { timeout: 180 * 1000 }, async () => {
     await qualityPlanManagerPO.deactivatePlan('Edit-Evaluator-Active-Plan');
     await qualityPlanManagerPO.openQualityPlanByName('Edit-Evaluator-Active-Plan');
     expect(await evaluatorsPO.isAddEvaluatorsButtonEnabled()).toBeFalsy();
     expect(await evaluatorsPO.isEditEvaluatorInfoIconVisible()).toBeFalsy();
     expect(await evaluatorsPO.isDeleteEvaluatorButtonVisible(`${evaluators[1].firstName} ${evaluators[1].lastName}`)).toBeFalsy();
     await qualityPlanDetailsPO.cancel();
     await qualityPlanManagerPO.waitForPageToLoad();
     await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.QP_EDIT_EVALUATOR_FT, userDetails.orgName, USER_TOKEN);
});

When("Step-17: should open new plan, press cancel, press Yes, and check that plan does not exist", { timeout: 180 * 1000 }, async () => {
     await qualityPlanDetailsPO.enterPlanName('Scenario Plan 1');
     await qualityPlanDetailsPO.cancel('Yes');
     await qualityPlanManagerPO.searchPlan('Scenario Plan 1');
     expect(await qualityPlanManagerPO.verifyPlanPresence('Scenario Plan 1')).toBeFalsy();

});
Then("Step-18 should open new plan, press cancel, Press  and check that the page was not closed", { timeout: 180 * 1000 }, async () => {
     await qualityPlanDetailsPO.navigate();
     await qualityPlanDetailsPO.enterPlanDescription('Plan 1 Description');
     await qualityPlanDetailsPO.cancel('No');
     expect(await browser.getCurrentUrl()).toEqual(page.baseUrl + fdUtils.getPageIdentifierUrls('qp.qpPlanDetails'));
});
Then("Step-19 should open new plan, press cancel without changing any plan details and check that we return to plan manager", { timeout: 180 * 1000 }, async () => {
     await qualityPlanDetailsPO.navigate();
     await qualityPlanDetailsPO.cancel();
     expect(await browser.getCurrentUrl()).toEqual(page.baseUrl + fdUtils.getPageIdentifierUrls('qp.qpPlanManager'));
});

Then("Step-20 should open a new plan, press Save as Draft and then press Save and Activate, check nothing happens till plan name is edited", { timeout: 180 * 1000 }, async () => {
     await qualityPlanDetailsPO.navigate();
     await qualityPlanDetailsPO.saveAsDraft();
     await qualityPlanDetailsPO.saveAndActivate();
     expect(await qualityPlanDetailsPO.getPlanNameErrorMessage()).toEqual('This field is required.');
     expect(await browser.getCurrentUrl()).toEqual(page.baseUrl + fdUtils.getPageIdentifierUrls('qp.qpPlanDetails'));
     await qualityPlanDetailsPO.enterPlanName('Plan 1#$#$');
     expect(await qualityPlanDetailsPO.getPlanNameErrorMessage()).toEqual('Oops, you can’t use \\ / ! + < > ? # & , % "');
     await qualityPlanDetailsPO.enterPlanName('Scenario Plan 2');
     await qualityPlanDetailsPO.saveAsDraft();
     expect(await qualityPlanManagerPO.verifyPlanPresence('Scenario Plan 2')).toBeTruthy();
});

Then("Step-21 should verify QP Details page state for an active plan", { timeout: 180 * 1000 }, async () => {
     await qualityPlanDetailsPO.navigate();
     await qualityPlanDetailsPO.enterPlanName('Activated Plan');
     await evaluatorsPO.addEvaluators([`${evaluators[0].firstName} ${evaluators[0].lastName}`, `${evaluators[1].firstName} ${evaluators[1].lastName}`]);
     expect(await evaluatorsPO.getSelectedEvaluators()).toEqual([`${evaluators[0].firstName} ${evaluators[0].lastName}`, `${evaluators[1].firstName} ${evaluators[1].lastName}`]);
     await evaluationFormPO.setEvaluationForm(forms[0].formName);
     await teamsAndGroupsPO.selectTeams(['DefaultTeam']);
     await qualityPlanDetailsPO.saveAndActivate();
     await qualityPlanManagerPO.waitForPageToLoad();
     await qualityPlanManagerPO.openQualityPlanByName('Activated Plan');
     expect(await qualityPlanDetailsPO.isPlanNameEnabled()).toBeTruthy();
     expect(await qualityPlanDetailsPO.isPlanDescriptionEnabled()).toBeTruthy();
     expect(await evaluationTypePO.isEnabled()).toBeFalsy();
     expect(await planDurationPO.isRecurringRadioEnabled()).toBeFalsy();
     expect(await planDurationPO.isOneTimeRadioEnabled()).toBeFalsy();
     expect(await planDurationPO.isStartDateEnabled()).toBeFalsy();
     expect(await planDurationPO.isEndDateEnabled()).toBeFalsy();
     expect(await samplingPO.isIncludeInteractionsFromLastCheckboxEnabled()).toBeFalsy();
     expect(await samplingPO.isIncludeInteractionsFromLastDropdownEnabled()).toBeFalsy();
     expect(await samplingPO.isInteractionsPerAgentDropdownEnabled()).toBeFalsy();
     expect(await evaluationFormPO.isEnabled()).toBeTruthy();
     expect(await teamsAndGroupsPO.isTeamsDropdownEnabled()).toBeFalsy();
     expect(await teamsAndGroupsPO.isGroupsDropdownEnabled()).toBeFalsy();
     expect(await evaluatorsPO.isAddEvaluatorsButtonEnabled()).toBeFalsy();
     expect(await callDurationPO.isFilterChecked()).toBeTruthy();
});

When("Step-22: should verify if user lands on desired page after clicking YES on warning modal", { timeout: 180 * 1000 }, async () => {
     await qualityPlanDetailsPO.enterPlanName('Plan 1');
     await Utils.click(page.locator(('manageForms')));
     await Utils.waitUntilVisible(warningPageModalPO.getModal());
     expect(await warningPageModalPO.isVisible()).toBeTruthy();
     await warningPageModalPO.clickYesButton();
     expect(await browser.getTitle()).toEqual('Form Manager');

});

Then("Step-20 should verify that user is able to continue on page after clicking NO button on warning pop up", { timeout: 180 * 1000 }, async () => {
     await qualityPlanDetailsPO.navigate();
     await qualityPlanDetailsPO.enterPlanName('Plan 1');
     await qualityPlanDetailsPO.enterPlanDescription('Plan 1 Description');
     await Utils.click(page.locator(('manageForms')));
     await Utils.waitUntilVisible(warningPageModalPO.getModal());
     expect(await warningPageModalPO.isVisible()).toBeTruthy();
     await warningPageModalPO.clickNoButton();
     expect(await browser.getTitle()).toEqual('Quality Planner')
});





