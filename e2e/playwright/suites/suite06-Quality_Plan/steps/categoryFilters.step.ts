import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
import {QualityPlanManagerPO} from "../../../../pageObjects/quality-plan-manager.po"
import {QualityPlanDetailsPO} from "../../../../pageObjects/quality-plan-details.po"
import { CommonNoUIUtils } from '../../../../common/CommonNoUIUtils';
import { OnPrepare } from '../../../../playwright.config';
import { LoginPage } from "../../../../common/login";
import { FEATURE_TOGGLES } from "../../../../common/uiConstants";
import { FeatureToggleUtils } from '../../../../common/FeatureToggleUtils';
import {CategoriesPO} from "../../../../pageObjects/categories.po"
import { DataCreator } from '../../../../../tests/protractor/common/data-creator';
import {SELECTORS} from "../../../../playwright.helpers"

let page: Page;
let browser: any;
let context: BrowserContext;
let newOnPrepare:any;
let loginPage:any;
let userDetails:any;
let userToken:any;
let tmToken:any;

const qualityPlanDetailsPO = new QualityPlanDetailsPO();
const categoriesPO = new CategoriesPO();
const qualityPlanManagerPO = new QualityPlanManagerPO();

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

    userDetails = await DataCreator.createRandomAccountWithLicenses('FirstName', 'LastName', ['QMA', 'WFM', 'RECORDING', 'ACD']);
    userToken = await CommonNoUIUtils.login(userDetails.adminCreds.email, userDetails.adminCreds.password,true);
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.MOCK_CATEGORIES, userDetails.orgName, userToken);
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);
    await qualityPlanDetailsPO.navigate();
});

AfterAll({ timeout: 60 * 1000 }, async () => {
    await qualityPlanManagerPO.navigate();
    console.log('Deleting created plans...');
    await qualityPlanManagerPO.deleteAllPlans();
    await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);
    await loginPage.logout();
    await browser.close();
});

Given("Step-1: should be able to see category filter", { timeout: 60 * 1000 }, async () => {

    expect(await categoriesPO.isFilterPresent()).toBeTruthy();
});

When("Step-2: should be able to set and delete individual category, and clear all categories", { timeout: 60 * 1000 }, async () => {

    await categoriesPO.openCategoryModal();
    await categoriesPO.selectCategories(['Agent Curses', 'Agent Polite', 'Contacted Multiple Times']);
    await categoriesPO.submitAndCloseModal();
    expect(await categoriesPO.getTotalSelectedCategories()).toEqual('Selected Categories (3)');
    await categoriesPO.deleteCategory('Agent Curses');
    expect(await categoriesPO.getTotalSelectedCategories()).toEqual('Selected Categories (2)');
    await categoriesPO.clearFilter();
    expect(await categoriesPO.getTotalSelectedCategories()).toEqual('Selected Categories (0)');
});

Then("Step-3: should be able to create new draft plan with category filters and should reopen and verify the saved filter", { timeout: 60 * 1000 }, async () => {

    await qualityPlanDetailsPO.enterPlanName('Category Plan');
    await qualityPlanDetailsPO.enterPlanDescription('This is a sample description');
    await categoriesPO.openCategoryModal();
    await categoriesPO.selectCategories(['Agent Curses', 'Agent Polite', 'Contacted Multiple Times']);
    await categoriesPO.submitAndCloseModal();
    expect(await categoriesPO.getTotalSelectedCategories()).toEqual('Selected Categories (3)');
    await qualityPlanDetailsPO.saveAsDraft();
    await qualityPlanManagerPO.refresh();
    expect(await qualityPlanManagerPO.verifyPlanPresence('Category Plan')).toBeTruthy();
    await qualityPlanManagerPO.openQualityPlanByName('Category Plan');
    const planName = await browser.executeScript('return arguments[0].value;', qualityPlanDetailsPO.ancestor.page.locator('#planName input'));
    const planDesc = await browser.executeScript('return arguments[0].value;', qualityPlanDetailsPO.ancestor.page.locator('#planDescription input'));
    expect(planName).toEqual('Category Plan');
    expect(planDesc).toEqual('This is a sample description');
    expect(await categoriesPO.getTotalSelectedCategories()).toEqual('Selected Categories (3)');
});


Then("Step-4: should not be able to see category filter when tenant has no QMA license", { timeout: 60 * 1000 }, async () => {

    tmToken = await CommonNoUIUtils.login(SELECTORS.TM_LOGIN_EMAIL_ADDRESS, SELECTORS.TM_LOGIN_PASSWORD,true);
    await protractorConfig.tmUtils.updateTenantLicenses(userDetails.orgName, ['QM', 'ACD', 'WFM', 'RECORDING'], tmToken);
    await qualityPlanDetailsPO.refresh();
    expect(await categoriesPO.isFilterPresent()).toBeFalsy();
    
});

