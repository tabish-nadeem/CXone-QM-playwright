import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
import * as userPermissions from '../../../../../tests/protractor/common/userDefaultPermissions.js';
import {CategoryManagerPO} from 'cxone-qm-library/category-manager.po';
import {AccountUtils} from "../../../../common/AccountUtils"
import { FEATURE_TOGGLES } from "../../../../common/uiConstants";
import { OnPrepare } from '../../../../playwright.config';
import { LoginPage } from "../../../../common/login";
import { GlobalTenantUtils } from '../../../../common/globalTenantUtils';
import { CommonNoUIUtils } from '../../../../common/CommonNoUIUtils';
import {SELECTORS} from "../../../../playwright.helpers";
import { TmUtils } from 'cxone-playwright-test-utils';
import {fdUtils} from "../../../../common/FdUtils";
import { Utils } from '../../../../common/utils';
import { FeatureToggleUtils } from '../../../../common/FeatureToggleUtils';


let page: Page;
let browser: any;
let context: BrowserContext;
let newOnPrepare:any;
let loginPage:any;
let userDetails:any;
let userDefaultPermissions: userPermissions;
let tmToken:any;
let userToken:any;
let newGlobalTenantUtils:any;
let tmUtils:any;
let utils:any;

const categoryManager = new CategoryManagerPO(page.locator('categoryManagerPage'));
newGlobalTenantUtils = new GlobalTenantUtils();
tmUtils = new TmUtils();
utils = new Utils(page);

userDetails = {
    adminCreds: {
        email: 'adminptor.' + AccountUtils.getRandomEmail(0),
        password: 'Password1'
    },
    managerCreds: {
        firstName: 'Manager',
        lastName: 'User',
        role: '',
        email: 'ptor.' + AccountUtils.getRandomEmail(0),
        password: 'Password1'
    }
};
const categories = {
    customCategories: 'Custom Categories',
    qualityManagement: 'Quality Management',
    cxone: 'CXone',
    agentPerformance: 'Agent Performance'
};

const setFeatureToggleForMockCategories = async () => {
    return await protractor.featureToggleTestUtils.turnOnFeatureToggleForTenant(FEATURE_TOGGLES.MOCK_CATEGORIES, userDetails.orgName, userDetails.adminCreds.token);
};

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

    userDetails.adminCreds = newGlobalTenantUtils.getDefaultTenantCredentials().adminCreds;
    userDetails.orgName = newGlobalTenantUtils.getDefaultTenantCredentials().orgName;
    tmToken = await CommonNoUIUtils.login(SELECTORS.TM_LOGIN_EMAIL_ADDRESS, SELECTORS.TM_LOGIN_PASSWORD,true);
    await tmUtils.updateTenantLicenses(userDetails.orgName, ['QMA', 'WFM'], tmToken);
    userDetails.adminCreds.token = await CommonNoUIUtils.login(userDetails.adminCreds.email, userDetails.adminCreds.password,true);
    await setFeatureToggleForMockCategories();
    let response = await CommonNoUIUtils.createNewRoleByPermissions('customManager', 'Custom Manager 1', userDefaultPermissions.getUserDefaultApplications('manager'), userDetails.adminCreds.token);
    userDetails.managerCreds.role = response.roleName;
    await AccountUtils.createAndActivateUser(
        userDetails.managerCreds.email,
        userDetails.managerCreds.password,
        userDetails.managerCreds,
        userDetails.adminCreds.email,
        userDetails.orgName,
        userDetails.adminCreds.token);
    await loginPage.logout(true, 120000, userDetails.orgName, userDetails.adminCreds.token);
    userToken = await CommonNoUIUtils.login(userDetails.managerCreds.email, userDetails.managerCreds.password, fdUtils.getPageIdentifierUrls('categoryManager.categoryManager'));
    return await categoryManager.navigateTo(fdUtils.getPageIdentifierUrls('categoryManager.categoryManager'), page.locator('.cat-category-list__header'));
});

AfterAll({ timeout: 60 * 1000 }, async () => {
    await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.MOCK_CATEGORIES, userDetails.orgName, userDetails.adminCreds.token);
    await loginPage.logout(true, 120000, userDetails.orgName, userToken);
    await browser.close();
});

Given("Step-1: should check if Category Manager has loaded successfully", { timeout: 60 * 1000 }, async () => {

    let currentElement:any;
    currentElement = categoryManager.getCategoryFolder(categories.customCategories);
    page.waitForSelector(currentElement.title);
    currentElement = categoryManager.getCategoryFolder(categories.customCategories);
    expect(await categoryManager.isElementVisible(currentElement.title)).toBeTruthy();
    await currentElement.title.click();
    expect(await categoryManager.isElementVisible(categoryManager.getCategory(categories.cxone).title)).toBeTruthy();
    currentElement = categoryManager.getCategoryFolder(categories.qualityManagement);
    expect(await categoryManager.isElementVisible(currentElement.title)).toBeTruthy();
    await currentElement.title.click();
    expect(await categoryManager.isElementVisible(categoryManager.getCategoryFolder(categories.agentPerformance).title)).toBeTruthy();

})

When("Step-2: should be able to create a new category under Custom Categories Group", { timeout: 60 * 1000 }, async () => {

    let data = {
        categoryName: 'My Custom Category',
        rules: ['Rule1']
    };
    await categoryManager.getSearchInputField().clear();
    let customCategoriesFolder = categoryManager.getCategoryFolder(categories.customCategories);
    await categoryManager.addCustomCategory(data.categoryName, data.rules, customCategoriesFolder);
    await categoryManager.getSearchInputField().clear();
    await categoryManager.getSearchInputField().sendKeys(data.categoryName);
    expect(await categoryManager.isElementVisible(categoryManager.getCategory(data.categoryName).title)).toBeTruthy();

});

Then("Step-3: should be able to edit a category under Custom Categories Group", { timeout: 60 * 1000 }, async () => {

    let data = {
        oldCategoryName: 'My Custom Category',
        oldRules: ['Rule1'],
        newCategoryName: 'My New Category',
        newRules: ['Rule1']
    };
    await categoryManager.getSearchInputField().clear();
    await categoryManager.getSearchInputField().sendKeys(data.oldCategoryName);
    let myCustomCategoryEdit = categoryManager.getCategory(data.oldCategoryName);
    await categoryManager.updateCustomCategory(data.newCategoryName, data.newRules, myCustomCategoryEdit);
    await categoryManager.getSearchInputField().clear();
    await categoryManager.getSearchInputField().sendKeys(data.newCategoryName);
    expect(await categoryManager.isElementVisible(categoryManager.getCategory(data.newCategoryName).title)).toBeTruthy();
    await categoryManager.getSearchInputField().clear();
    await categoryManager.getCategoryFolder(categories.customCategories).title.click();

});

Then("Step-4: should be able to delete a category under Custom Categories", { timeout: 60 * 1000 }, async () => {

    let data = {
        categoryName: 'My New Category',
        rules: ['Rule1']
    };
    await categoryManager.getSearchInputField().clear();
    await categoryManager.getSearchInputField().sendKeys(data.categoryName);
    let myCustomCategory = categoryManager.getCategory(data.categoryName);
    await categoryManager.deleteCustomCategory(myCustomCategory);
    await categoryManager.getSearchInputField().clear();
    await categoryManager.getSearchInputField().sendKeys(data.categoryName);
    expect(await categoryManager.isElementVisible(categoryManager.getCategoryFolder(data.categoryName).title)).toBeFalsy();
    let value = categoryManager.getCategory(data.categoryName);
    expect(await value.title.isPresent()).toBeFalsy();

});

Then("Step-5: should be able to create a new category folder under Custom Categories Group", { timeout: 60 * 1000 }, async () => {

    await CategoryManagerPO.navigateQuicklyTo(fdUtils.getPageIdentifierUrls('categoryManager.categoryManager'), page.locator('.nice-cat-category-list'));
    let data = {
        folderName: 'My Custom Folder'
    };
    let customCategoriesFolder = categoryManager.getCategoryFolder(categories.customCategories);
    await categoryManager.getSearchInputField().clear();
    await categoryManager.addCustomFolder(data.folderName, customCategoriesFolder);
    await categoryManager.getSearchInputField().clear();
    await categoryManager.getSearchInputField().sendKeys(data.folderName);
    expect(await categoryManager.isElementVisible(categoryManager.getCategoryFolder(data.folderName).title)).toBeTruthy();
    await categoryManager.getSearchInputField().clear();
    await categoryManager.getCategoryFolder(categories.customCategories).title.click();

});

Then("Step-6: should be able to edit a category group under Custom Categories Group", { timeout: 60 * 1000 }, async () => {

    let data = {
        oldFolderName: 'My Custom Folder',
        newFolderName: 'My New Custom Folder'
    };
    await categoryManager.getSearchInputField().clear();
    await categoryManager.getSearchInputField().sendKeys(data.oldFolderName);
    let myCustomFolderEdit = categoryManager.getCategoryFolder(data.oldFolderName);
    await categoryManager.updateCustomCategoryFolder(data.newFolderName, myCustomFolderEdit);
    await categoryManager.getSearchInputField().clear();
    await categoryManager.getSearchInputField().sendKeys(data.newFolderName);
    expect(await categoryManager.isElementVisible(categoryManager.getCategoryFolder(data.newFolderName).title)).toBeTruthy();
    await categoryManager.getSearchInputField().clear();
    let currentElement = categoryManager.getCategoryFolder(categories.customCategories);
    await currentElement.title.click();

});

Then("Step-7: should be able to delete a category folder", { timeout: 60 * 1000 }, async () => {

    let data = {
        folderName: 'My New Custom Folder'
    };
    await categoryManager.getSearchInputField().clear();
    await categoryManager.getSearchInputField().sendKeys(data.folderName);
    let myCustomCategoryFolder = categoryManager.getCategoryFolder(data.folderName);
    await categoryManager.deleteCustomCategory(myCustomCategoryFolder);
    await categoryManager.getSearchInputField().clear();
    await categoryManager.getSearchInputField().sendKeys(data.folderName);
    expect(await categoryManager.isElementVisible(categoryManager.getCategoryFolder(data.folderName).title)).toBeFalsy();
    let value = categoryManager.getCategory(data.folderName);
    expect(await value.title.isPresent()).toBeFalsy();
    
});