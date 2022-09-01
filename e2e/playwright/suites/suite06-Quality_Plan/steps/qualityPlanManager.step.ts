import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
import {QualityPlanManagerPO} from "../../../../pageObjects/quality-plan-manager.po"
import {QualityPlanDetailsPO} from "../../../../pageObjects/quality-plan-details.po"
import {OmnibarPO} from 'cxone-components/omnibar.po';
import { GlobalTenantUtils } from '../../../../common/globalTenantUtils';
import { CommonNoUIUtils } from '../../../../common/CommonNoUIUtils';
import { OnPrepare } from '../../../../playwright.config';
import { LoginPage } from "../../../../common/login";
import { FEATURE_TOGGLES } from "../../../../common/uiConstants";
import { FeatureToggleUtils } from '../../../../common/FeatureToggleUtils';
import { CommonUIUtils } from "cxone-playwright-test-utils";
import { CommonQMNoUIUtils } from '../../../../common/CommonQMNoUIUtils';
import { LocalizationNoUI } from '../../../../common/LocalizationNoUI';
import { Utils } from '../../../../common/utils';
import { AdminUtilsNoUI } from '../../../../common/AdminUtilsNoUI';
import { AccountUtils } from "../../../../common/AccountUtils";

const qualityPlanDetailsPO = new QualityPlanDetailsPO();
const planManagerPO = new QualityPlanManagerPO(Page.locator('ng2-quality-plan-manager-page'));
let newGlobalTenantUtils = new GlobalTenantUtils();



let page: Page;
let browser: any;
let context: BrowserContext;
let newOnPrepare:any;
let loginPage:any;
let userToken:any;
let dateFormat:any;
let localString='en-US';
let adminDetails:any;
let responseForm:any;
let utils:any;
let response:any;
let team:any;
let group:any;

let planNames = {
    one: 'Draft_Valid_Plan',
    two: 'Active_Valid_Plan',
    three: 'Draft_Invalid_Plan',
    four: 'Draft_Valid_Plan_Dup'
};

const omnibarPO = new OmnibarPO(page.locator('cxone-omnibar'));
let userDetails = await newGlobalTenantUtils.getDefaultTenantCredentials();
utils = new Utils(page);
// let sampleFormData = JSON.stringify(protractorConfig.formsMockService.getSampleFormData());

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

    const currForm = {
        formName: 'EvaluationForm',
        formStatus: 'Published',
        formType: 'EVALUATION',
        formData: sampleFormData,
        workflowConfigType: 'AGENT_NO_REVIEW'
    };

    userToken = await CommonNoUIUtils.login(userDetails.email, userDetails.password,true);
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SUMMER21, userDetails.orgName, userToken);
    await CommonUIUtils.waitUntilIconLoaderDone(page);
    responseForm = await CommonQMNoUIUtils.createForm(currForm, userToken);
    await planManagerPO.navigate();
    await LocalizationNoUI.getDateStringFormat(localString);
    console.log('DateTime formats to use', dateFormat, responseForm.id);

});

AfterAll({ timeout: 60 * 1000 }, async () => {
    await browser.close();
});

Given("Step-1: Should verify page title, plan count and overlay text", { timeout: 60 * 1000 }, async () => {

    expect(await planManagerPO.getHeaderText()).toEqual(utils.getExpectedString('qualityPlaner.qualityPlanerPage.pageTitle'));
        response = await CommonQMNoUIUtils.getAllPlans(undefined, userToken);
        expect(await omnibarPO.getItemCountLabel()).toEqual([response.length + ' plans']);
        expect(await planManagerPO.getNewPlanButton().getText()).toEqual(utils.getExpectedString('qualityPlaner.qualityPlanerPage.newPlanButton'));
});

Then("Step-2: Should be able to navigate to new plan page", { timeout: 180 * 1000 }, async () => {

    await planManagerPO.getNewPlanButton().click();
    const navigatedUrl = await browser.getCurrentUrl();
    await planManagerPO.clickBreadCrumbLink();
    await utils.delay(5000);
    expect(navigatedUrl).toContain(page);
});

When("Step-1: Should check actions available on a particular plan", { timeout: 60 * 1000 }, async () => {

    response = await await AdminUtilsNoUI.getAllTeams(userToken);
    team = response.teams.find((item:any) => item.name === 'DefaultTeam');
    group = await await CommonQMNoUIUtils.createGroup('User Group1', userToken);
    let agentDetails = {
        firstName: 'Alfred',
        lastName: 'Penny',
        email: 'ptor' + AccountUtils.getRandomEmail(2),
        password: 'Password1',
        role: 'Agent',
        groupIds: [group.groupId]
    };

    await AccountUtils.createAndActivateUser(
        agentDetails.email,
        agentDetails.password,
        agentDetails,
        userDetails.email,
        userDetails.orgName,
        userToken);

    let allUsers = await CommonNoUIUtils.getUsers(userToken);
    allUsers.users.forEach((user:any) => {
        switch (user.role) {
            case 'Administrator':
                adminDetails = user;
                break;
            case 'Agent':
                agentDetails = user;
                break;
            default:
                break;
        }
    });
    await CommonQMNoUIUtils.createPlan(protractorConfig.plansMockService.getStandardPlanData(planNames.one, adminDetails.id, adminDetails.id, responseForm.id, team.id, 'Draft'), userToken);
    await CommonQMNoUIUtils.createPlan(protractorConfig.plansMockService.getStandardPlanData(planNames.two, adminDetails.id, adminDetails.id, responseForm.id, team.id, 'Active'), userToken);
    await CommonQMNoUIUtils.createPlan(protractorConfig.plansMockService.getStandardPlanData(planNames.three, adminDetails.id, adminDetails.id, '', team.id, 'Draft'), userToken);

    await planManagerPO.navigate(true);
    let row = await planManagerPO.getPlanRowElements(planNames.one);
    expect(row.evaluationType).toEqual('Standard');
    expect(row.planOccurence).toEqual('Monthly Recurring Plan');
    expect(row.status).toEqual('Draft');
    let actions = await planManagerPO.verifyHamburgerMenuOptions(planNames.one);
    expect(actions).toEqual({activate: true, duplicate: true, deactivate: false});
    actions = await planManagerPO.verifyHamburgerMenuOptions(planNames.two);
    expect(actions).toEqual({activate: false, duplicate: true, deactivate: true});
    expect(planManagerPO.verifyDeleteOption(planNames.one)).toBeTruthy();
});

Then("Step-2: Should verify if plan can be duplicated", { timeout: 180 * 1000 }, async () => {

    await planManagerPO.duplicatePlan(planNames.two, planNames.four);
    await omnibarPO.typeSearchQuery(planNames.four);
    expect(await planManagerPO.getNumberOfRows()).toEqual(1);
});

Then("Step-3: Should verify plan can be activated", { timeout: 180 * 1000 }, async () => {

    await planManagerPO.activatePlan(planNames.one);
    let row = await planManagerPO.getPlanRowElements(planNames.one);
    expect(row.status).toEqual('Active');    
});

Then("Step-4: Should verify plan can be deactivated", { timeout: 180 * 1000 }, async () => {

    await planManagerPO.deactivatePlan(planNames.one);
    let row = await planManagerPO.getPlanRowElements(planNames.one);
    expect(row.status).toEqual('Inactive');
    let actions = await planManagerPO.verifyHamburgerMenuOptions(planNames.one);
    expect(actions).toEqual({activate: true, duplicate: true, deactivate: false});
});

Then("Step-5: Should verify plan can be deleted", { timeout: 180 * 1000 }, async () => {

    await planManagerPO.deletePlan(planNames.one);
    expect(await omnibarPO.getItemCountLabel()).toEqual(['3 plans']);
});

Then("Step-6: Should verify invalid plan cannot be activated", { timeout: 180 * 1000 }, async () => {
    
    await omnibarPO.typeSearchQuery(planNames.three);
    await planManagerPO.waitForSpinnerToDisappear();
    const menuItem = await planManagerPO.getHamburgerMenuItem(planNames.three, 'Activate');
    await menuItem.click();
    await planManagerPO.waitForSpinnerToDisappear();
    const msg = utils.getExpectedString('qualityPlaner.qualityPlanerPage.popovers.activatePlan.msg1') + ' ' +
        utils.getExpectedString('qualityPlaner.qualityPlanerPage.popovers.activatePlan.msg2');
    expect(await planManagerPO.getErrorWarning()).toEqual(msg);
    await planManagerPO.clickConfirmBtn('edit-plan');
    const navigatedUrl = await browser.getCurrentUrl();
    expect(navigatedUrl).toContain(page);
});



