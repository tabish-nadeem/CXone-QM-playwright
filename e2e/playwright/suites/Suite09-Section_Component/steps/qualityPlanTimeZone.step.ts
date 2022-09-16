import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
import { OnPrepare } from '../../../../playwright.config';
import { LoginPage } from "../../../../common/login";
import { GlobalTenantUtils } from '../../../../common/globalTenantUtils';
import {QualityPlanDetailsPO} from '../../../../pageObjects/AualityPlanDetailsPO';
import {QualityPlanManagerPO} from '../../../../pageObjects/AualityPlanManagerPO';
import {TeamsAndGroupsPO} from '../../../../pageObjects/TeamsAndGroupsPO';
import moment from 'moment';
import {EvaluationFormPO} from '../../../../pageObjects/EvaluationFormPO';
import {EvaluatorsPO} from '../../../../pageObjects/EvaluatorsPO';
import * as userDefaultPermissions from '../../../../../tests/protractor/common/userDefaultPermissions';
import {PlanDurationPO} from "../../../../pageObjects/PlanDurationPO"
import {TimezoneSelectionPO} from '../../../../pageObjects/TimezoneSelectionPO';
import {WarningModalComponentPo} from '../../../../pageObjects/WarningModalComponentPO';
import { CommonNoUIUtils } from '../../../../common/CommonNoUIUtils';
import { FEATURE_TOGGLES } from "../../../../common/uiConstants";
import { FeatureToggleUtils } from '../../../../common/FeatureToggleUtils';
import {DataCreator} from '../../../../../tests/protractor/common/data-creator';
import {AccountUtils} from "../../../../common/AccountUtils";
import {CommonQMNoUIUtils} from "../../../../common/CommonQMNoUIUtils"
import {fdUtils} from "../../../../common/FdUtils";
import {Utils} from "../../../../common/utils"

let page: Page;
let browser: any;
let context: BrowserContext;
let newOnPrepare:any;
let loginPage:any;
let userToken:any;
let userDetails:any;
let newGlobalTenantUtils:any;


const qualityPlanDetailsPO = new QualityPlanDetailsPO();
const qualityPlanManagerPO = new QualityPlanManagerPO();
const evaluationFormPO = new EvaluationFormPO();
const teamsAndGroupsPO = new TeamsAndGroupsPO();
const evaluatorsPO = new EvaluatorsPO();
const planDurationPO = new PlanDurationPO();
const timezoneSelectionPO = new TimezoneSelectionPO();
newGlobalTenantUtils = new GlobalTenantUtils();
const warningPageModalPO = new WarningModalComponentPo();

const evaluators: {
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    password: string;
}[] = [];
const forms: {
    formId: any;
    formName: string;
    formStatus: string;
}[] = [];



BeforeAll({ timeout: 400 * 1000 }, async () => {
    browser = await chromium.launch({
        headless: false,
        args: ['--window-position=-8,0']
    });
    context = await browser.newContext();
    page = await context.newPage();
    newOnPrepare = new OnPrepare();
    await newOnPrepare.OnStart(userDetails);
    loginPage = new LoginPage(page);

    userDetails = newGlobalTenantUtils.getDefaultTenantCredentials();

    userToken = await CommonNoUIUtils.login(userDetails.adminCreds.email, userDetails.adminCreds.password,true);
    DataCreator.setToken(userToken);
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.RELEASE_NAVIGATION_REDESIGN, userDetails.orgName, userToken);
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.QP_TIMEZONE_HANDLING_FT, userDetails.orgName, userToken);
    await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.ENHANCED_EVALUATOR_MODAL_FT, userDetails.orgName, userToken);
    await prepareData();

    async function prepareData() {
        const roleName = (await CommonNoUIUtils.createNewRoleByPermissions('customEvaluator' + moment(), 'Custom Evaluator 1', userDefaultPermissions.getUserDefaultApplications('evaluator2'),userToken)).roleName;
        evaluators.push({
            firstName: 'Timezone Evaluator',
            lastName: 'One',
            role: roleName,
            email: `ptor.1${new Date().getTime()}@wfosaas.com`,
            password: 'Password1'
        });
        evaluators.map(async (evaluator) => {
            await AccountUtils.createAndActivateUser(evaluator.email, evaluator.password, evaluator, userDetails.adminCreds.email, userDetails.orgName,userToken,userDetails.accountName);
        });
        forms.push({
            formId: null,
            formName: `QPTimezone Test Form ${new Date().getTime()}`,
            formStatus: 'Published'
        });
    
        forms[0].formId = await DataCreator.createForm(forms[0].formName, forms[0].formStatus);
    }
    
});

AfterAll({ timeout: 60 * 1000 }, async () => {
    await qualityPlanManagerPO.navigate();
    await qualityPlanManagerPO.deleteAllPlans();
    await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);
    await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.QP_TIMEZONE_HANDLING_FT, userDetails.orgName, userToken);
    await loginPage.logout(true, 120000, userDetails.orgName, userToken);
    await browser.close();
});

Given("Step-1: should open new plan,open the timezone dropdown and verify clients current timezone is selected", { timeout: 60 * 1000 }, async () => {

    await qualityPlanDetailsPO.navigate();
    await qualityPlanDetailsPO.enterPlanName('QP Timezone Plan');
    await evaluatorsPO.addEvaluators([`${evaluators[0].firstName} ${evaluators[0].lastName}`]);
    await evaluationFormPO.setEvaluationForm(forms[0].formName);
    await teamsAndGroupsPO.selectTeams(['DefaultTeam']);
    expect(await timezoneSelectionPO.getSelectedTimezone()).toContain('Jerusalem');
    await qualityPlanDetailsPO.saveAsDraft();
    await qualityPlanManagerPO.openQualityPlanByName('QP Timezone Plan');
    expect(await timezoneSelectionPO.getSelectedTimezone()).toContain('Jerusalem');

});

When("Step-2: should select new timezone from dropdown, save plan as draft and verify selected timezone is retained", { timeout: 60 * 1000 }, async () => {

    await timezoneSelectionPO.setTimezoneValue('(UTC+05:30)  Chennai, Kolkata, Mumbai, New Delhi');
    await qualityPlanDetailsPO.saveAsDraft();
    await qualityPlanManagerPO.openQualityPlanByName('QP Timezone Plan');
    expect(await timezoneSelectionPO.isTimezoneDropdownPresent()).toBeTruthy();
    expect(await timezoneSelectionPO.getSelectedTimezone()).toEqual('(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi');
    expect(await timezoneSelectionPO.isTimezoneFieldEnabled()).toBeTruthy();
    await qualityPlanDetailsPO.cancel('Yes');

});

Then("Step-3: should select new timezone from dropdown, save plan as draft and verify selected timezone is retained", { timeout: 60 * 1000 }, async () => {

    await qualityPlanManagerPO.openQualityPlanByName('QP Timezone Plan');
    expect(await timezoneSelectionPO.isTimezoneDropdownPresent()).toBeTruthy();
    expect(await timezoneSelectionPO.getSelectedTimezone()).toEqual('(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi');
    await qualityPlanDetailsPO.saveAndActivate();
    qualityPlanManagerPO.waitForPageToLoad();
    await qualityPlanManagerPO.openQualityPlanByName('QP Timezone Plan');
    expect(await timezoneSelectionPO.isTimezoneFieldEnabled()).toBeFalsy();
    await qualityPlanDetailsPO.cancel('Yes');

});

Then("Step-4: should duplicate an active plan and verify timezone is retained", { timeout: 60 * 1000 }, async () => {

    const duplicatePlanName = 'QP Timezone Plan Duplicate';
    await qualityPlanManagerPO.navigate();
    expect(await qualityPlanManagerPO.verifyPlanPresence('QP Timezone Plan')).toBeTruthy();
    await qualityPlanManagerPO.duplicatePlan('QP Timezone Plan', duplicatePlanName);
    await qualityPlanManagerPO.openQualityPlanByName(duplicatePlanName);
    expect(await qualityPlanDetailsPO.getPlanName()).toEqual(duplicatePlanName);
    expect(await timezoneSelectionPO.isTimezoneDropdownPresent()).toBeTruthy();
    expect(await timezoneSelectionPO.getSelectedTimezone()).toEqual('(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi');
    await qualityPlanDetailsPO.cancel('Yes');

});

Then("Step-5: should verify timezone is non-editable for inactive plan", { timeout: 60 * 1000 }, async () => {

    await qualityPlanManagerPO.deactivatePlan('QP Timezone Plan');
    await qualityPlanManagerPO.openQualityPlanByName('QP Timezone Plan');
    expect(await timezoneSelectionPO.isTimezoneDropdownPresent()).toBeTruthy();
    expect(await timezoneSelectionPO.getSelectedTimezone()).toEqual('(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi');
    expect(await timezoneSelectionPO.isTimezoneFieldEnabled()).toBeFalsy();
    await qualityPlanDetailsPO.cancel();

});

Then("Step-6: should verify timezone is non-editable for expired plan", { timeout: 60 * 1000 }, async () => {

    await qualityPlanDetailsPO.navigate();
    await qualityPlanDetailsPO.enterPlanName('QP Timezone Expired Plan');
    await evaluatorsPO.addEvaluators([`${evaluators[0].firstName} ${evaluators[0].lastName}`]);
    await evaluationFormPO.setEvaluationForm(forms[0].formName);
    await teamsAndGroupsPO.selectTeams(['DefaultTeam']);
    await planDurationPO.setOneTime();
    await planDurationPO.setStartDate(new Date(2021, 0, 5, 0, 0, 0, 0));
    await planDurationPO.setEndDate(new Date(2021, 0, 10, 0, 0, 0, 0));
    expect(await timezoneSelectionPO.isTimezoneDropdownPresent()).toBeTruthy();
    await timezoneSelectionPO.setTimezoneValue('(UTC+00:00) Azores');
    await qualityPlanDetailsPO.saveAndActivate();
    qualityPlanManagerPO.waitForPageToLoad();
    await CommonQMNoUIUtils.distributeInteractions(moment.utc().format('YYYY-MM-DD') + 'T00:00', userToken,userDetails.tenantName);
    await fdUtils.waitABit(10000);
    await qualityPlanManagerPO.refresh();
    await qualityPlanManagerPO.openQualityPlanByName('QP Timezone Expired Plan');
    expect(await timezoneSelectionPO.isTimezoneDropdownPresent()).toBeTruthy();
    expect(await timezoneSelectionPO.isTimezoneFieldEnabled()).toBeFalsy();
    Utils.click(page.locator('qpPlanManager'));
    expect(await browser.getTitle()).toEqual('Quality Planner');

});

Then("Step-7: should verify onetime plan range is not changed when timezone FT is On", { timeout: 60 * 1000 }, async () => {

    await qualityPlanDetailsPO.navigate();
    await qualityPlanDetailsPO.enterPlanName('QP Timezone Onetime Plan');
    await planDurationPO.setOneTime();
    await planDurationPO.setStartDate(new Date(2021, 0, 5, 0, 0, 0, 0));
    await planDurationPO.setEndDate(new Date(2021, 0, 10, 0, 0, 0, 0));
    await timezoneSelectionPO.setTimezoneValue('(UTC+04:00) Baku');
    await evaluationFormPO.setEvaluationForm(forms[0].formName);
    await qualityPlanDetailsPO.saveAsDraft();
    await qualityPlanManagerPO.openQualityPlanByName('QP Timezone Onetime Plan');
    expect(await planDurationPO.isOneTimeSelected()).toBeTruthy();
    expect(await planDurationPO.isRecurringSelected()).toBeFalsy();
    expect(await planDurationPO.getStartDate()).toEqual('Jan 5, 2021');
    expect(await planDurationPO.getEndDate()).toEqual('Jan 10, 2021');
    expect(await evaluationFormPO.getEvaluationFormSelected()).toEqual(forms[0].formName);
    await qualityPlanDetailsPO.cancel('Yes');

});

Then("Step-8: should verify onetime plan range is not changed when timezone FT is On", { timeout: 60 * 1000 }, async () => {

    await qualityPlanDetailsPO.navigate();
    Utils.click(page.locator('manageForms'));
    expect(await warningPageModalPO.isVisible()).toBeFalsy();

});

Then("Step-9: should verify onetime plan range is not changed when timezone FT is On", { timeout: 60 * 1000 }, async () => {

    await qualityPlanDetailsPO.navigate();
    await timezoneSelectionPO.setTimezoneValue('(UTC+05:45) Kathmandu');
    Utils.click(page.locator('manageForms'));
    expect(await warningPageModalPO.isVisible()).toBeTruthy();
    await warningPageModalPO.clickYesButton();
    expect(await browser.getTitle()).toEqual('Form Manager');

});

Then("Step-10: should verify timezone dropdown is not visible when FT is off for active plan", { timeout: 60 * 1000 }, async () => {

    await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.QP_TIMEZONE_HANDLING_FT, userDetails.orgName, userToken);
    await qualityPlanManagerPO.navigate();
    await qualityPlanManagerPO.refresh();
    expect(await browser.getTitle()).toEqual('Quality Planner');
    await qualityPlanManagerPO.openQualityPlanByName('QP Timezone Plan');
    expect(await timezoneSelectionPO.isTimezoneDropdownPresent()).toBeFalsy();

    await qualityPlanDetailsPO.navigate();
    await qualityPlanDetailsPO.enterPlanName('QP Timezone FT OFF DRAFT');
    await qualityPlanDetailsPO.saveAsDraft();

    await qualityPlanDetailsPO.navigate();
    await qualityPlanDetailsPO.enterPlanName('QP Timezone FT OFF ACTIVE');
    await evaluatorsPO.addEvaluators([`${evaluators[0].firstName} ${evaluators[0].lastName}`]);
    await evaluationFormPO.setEvaluationForm(forms[0].formName);
    await teamsAndGroupsPO.selectTeams(['DefaultTeam']);
    await planDurationPO.setOneTime();
    await planDurationPO.setStartDate(new Date(2022, 1, 5, 0, 0, 0, 0));
    await planDurationPO.setEndDate(new Date(2022, 1, 10, 0, 0, 0, 0));
    await qualityPlanDetailsPO.saveAndActivate();

});

Then("Step-11: should verify timezone dropdown is not visible when FT is off for expired plan", { timeout: 60 * 1000 }, async () => {

    await qualityPlanManagerPO.navigate();
    await qualityPlanManagerPO.openQualityPlanByName('QP Timezone Expired Plan');
    expect(await timezoneSelectionPO.isTimezoneDropdownPresent()).toBeFalsy();

});

Then("Step-12: should verify timezone dropdown is not visible when FT is off for new plan", { timeout: 60 * 1000 }, async () => {

    await qualityPlanDetailsPO.navigate();
    expect(await timezoneSelectionPO.isTimezoneDropdownPresent()).toBeFalsy();
    await qualityPlanDetailsPO.cancel();

});

Then("Step-13: should verify timezone dropdown is not visible when FT is off for new plan", { timeout: 60 * 1000 }, async () => {
    
    await qualityPlanDetailsPO.navigate();
    expect(await timezoneSelectionPO.isTimezoneDropdownPresent()).toBeFalsy();
    await qualityPlanDetailsPO.cancel();

});

Then("Step-14: should verify older plans created with FT off have default timezone selected as UTC", { timeout: 60 * 1000 }, async () => {
    
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.QP_TIMEZONE_HANDLING_FT, userDetails.orgName, userToken);
    await fdUtils.waitABit(10000);
    await qualityPlanManagerPO.navigate();
    await qualityPlanManagerPO.waitForPageToLoad();
    await qualityPlanManagerPO.openQualityPlanByName('QP Timezone FT OFF ACTIVE');
    expect(await timezoneSelectionPO.isTimezoneDropdownPresent()).toBeTruthy();
    expect(await timezoneSelectionPO.isTimezoneFieldEnabled()).toBeFalsy();
    expect(await timezoneSelectionPO.getSelectedTimezone()).toEqual('(UTC+00:00) Greenwich Mean Time');
    await qualityPlanDetailsPO.cancel('Yes');

    await qualityPlanManagerPO.navigate();
    await qualityPlanManagerPO.openQualityPlanByName('QP Timezone FT OFF DRAFT');
    expect(await timezoneSelectionPO.isTimezoneDropdownPresent()).toBeTruthy();
    expect(await timezoneSelectionPO.isTimezoneFieldEnabled()).toBeTruthy();
    expect(await timezoneSelectionPO.getSelectedTimezone()).toEqual('(UTC+00:00) Greenwich Mean Time');
    await qualityPlanDetailsPO.cancel('Yes');

});