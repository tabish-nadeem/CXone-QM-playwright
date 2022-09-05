import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
import { Utils } from "../../../../common/utils";
import { ManageFormsPO } from "../../../../pageObjects/manager-form.po";
import { DuplicateFormModalPO } from '../../../../pageObjects/duplicate-form-modal.po';
import { OnPrepare } from "../../../../playwright.config";
import { LoginPage } from "../../../../common/login";
import { GlobalTenantUtils } from "../../../../common/globalTenantUtils";
import { CommonQMNoUIUtils } from "../../../../common/CommonQMNoUIUtils"
import { LocalizationNoUI } from "../../../../common/LocalizationNoUI";


let browser: any;
let context: BrowserContext;
let page: Page;
let utils: any;
let manageFormsPO:any;
let duplicateFormModalPO: any;
let newOnPrepare:any;
let loginPage: any;
let userDetails: any;
let userToken: any, dateFormat: any, localeString = 'en-US';
let newGlobalTenantUtils = new GlobalTenantUtils();
let sampleFormData:any; // in prot file, let sampleFormData = JSON.stringify(protractorConfig.formsMockService.getSampleFormData());

const FEATURE_TOGGLES = {
    navigation_redesign: 'release-navigation-redesign-CXCROSS-21'
};

let formNames = {
    formOne: 'Test Form 11576492943254',
    formTwo: 'Test Form 21576492943254',
    duplicateFormOne: 'Duplicate Form 11576492943254',
    duplicateFormTwo: 'Duplicate Form 21576492943254',
    secondDuplicateFormOne: 'Dup of Dup form 11576492943254',
    duplicateActiveFormTwo: 'Duplicate Form 51576492943254'
};

let currForm = {
    formName: formNames.formOne,
    formStatus: 'Published',
    formType: 'EVALUATION',
    formData: sampleFormData,
    workflowConfigType: 'AGENT_NO_REVIEW'
};

console.log('ANGULAR8: MANAGE FORMS DUPLICATE FORM MODAL TESTS');

BeforeAll({ timeout: 300 * 1000 }, async () => {
    browser = await chromium.launch({
        headless: false,
    });
    context = await browser.newContext();
    page = await context.newPage();
    manageFormsPO = new ManageFormsPO(page.locator(`#ng2-manage-forms-page`));
    duplicateFormModalPO = new DuplicateFormModalPO();
    userDetails = await newGlobalTenantUtils.getDefaultTenantCredentials();
    utils = new Utils(page);
    newOnPrepare = new OnPrepare();
    await newOnPrepare.OnStart(userDetails);
    loginPage = new LoginPage(page);
    console.log('Form Names used :', formNames);
    userToken = await loginPage.login(userDetails.email, userDetails.password);
    await newOnPrepare.toggleFeatureToggle(FEATURE_TOGGLES.navigation_redesign, true, userDetails.orgName, userToken)
    await manageFormsPO.navigateTo();
    await CommonQMNoUIUtils.createForm(currForm, userToken);
    await manageFormsPO.navigateTo();
    dateFormat = await LocalizationNoUI.getDateStringFormat(localeString, userToken, userDetails.orgName);
    console.log('DateTime formats to use', dateFormat);
    await CommonQMNoUIUtils.createForm(currForm, userToken);
    currForm.formName = formNames.formTwo;
    await CommonQMNoUIUtils.createForm(currForm, userToken);

})

AfterAll({ timeout: 60 * 1000 }, async () => {
    await browser.close();
});

Given("Step-1: should create a duplicate form of existing form;Also should verify if existing name is specified while duplicating form", { timeout: 60 * 1000 }, async () => {
    await manageFormsPO.refresh();
    const menuItem = await manageFormsPO.getHamburgerMenuItem(formNames.formOne, 'Duplicate');
    await menuItem.click();
    await browser.wait(page.locator('cxone-modal').isVisible(), 20000);
    expect(await duplicateFormModalPO.checkSaveModalHeaderText()).toBe(true);
    expect(await duplicateFormModalPO.checkFormNameTextBox()).toBe(true);
    await duplicateFormModalPO.enterFormName('');
    await duplicateFormModalPO.clickSaveButton();
    expect(await duplicateFormModalPO.verifySaveErrorMsg()).toEqual('This field is required.');
    await duplicateFormModalPO.enterFormName(formNames.duplicateFormOne);
    expect(await duplicateFormModalPO.checkSaveButton()).toBe(true);
    await duplicateFormModalPO.clickSaveButton();
    await manageFormsPO.waitForSpinnerToDisappear();
    expect(await manageFormsPO.verifyFormPresence(formNames.duplicateFormOne)).toBeTruthy();
    expect((await manageFormsPO.getFormRowElements(formNames.duplicateFormOne)).status).toEqual('Draft');
});

When("Step-2: should be able to cancel duplicate form creation : P2", { timeout: 180 * 1000 }, async () => {
    await manageFormsPO.searchFormInGrid(formNames.formOne);
    const menuItem = await manageFormsPO.getHamburgerMenuItem(formNames.formOne, 'Duplicate');
    await menuItem.click();
    await browser.wait(page.locator('cxone-modal').isVisible(), 20000);
    await duplicateFormModalPO.enterFormName(formNames.duplicateFormTwo);
    expect(await duplicateFormModalPO.checkCancelButton()).toBe(true);
    await duplicateFormModalPO.clickCancelButton();
    expect(await manageFormsPO.verifyFormPresence(formNames.duplicateFormTwo)).toBeFalsy();
});

Then("Step-3: should be able to create a duplicate form of already duplicated form : P2", { timeout: 180 * 1000 }, async () => {
    await manageFormsPO.duplicateForm(formNames.formOne, formNames.secondDuplicateFormOne);
    expect(await manageFormsPO.verifyFormPresence(formNames.secondDuplicateFormOne)).toBeTruthy();
});

Then("Step-4: should create a duplicate form from active form and duplicated form status should be draft :P2", { timeout: 180 * 1000 }, async () => {
    await manageFormsPO.duplicateForm(formNames.formTwo, formNames.duplicateActiveFormTwo);
    expect(await manageFormsPO.verifyFormPresence(formNames.duplicateActiveFormTwo)).toBeTruthy();
    expect((await manageFormsPO.getFormRowElements(formNames.duplicateActiveFormTwo)).status).toEqual('Draft');
});

Then('Step-5: should verify that user is not able to save a form with special characters except "-" and "_" :P1', { timeout: 180 * 1000 }, async () => {
    let errorMsg = utils.getExpectedString('duplicateFormModal.nameFieldValidation');
    await manageFormsPO.searchFormInGrid(formNames.duplicateActiveFormTwo);
    const item = await manageFormsPO.getHamburgerMenuItem(formNames.duplicateActiveFormTwo, 'Duplicate');
    await item.click();
    await browser.wait(page.locator('cxone-modal').isVisible(), 20000);
    await duplicateFormModalPO.enterFormName('&');
    expect(await duplicateFormModalPO.verifySaveErrorMsg()).toEqual(errorMsg);
    await duplicateFormModalPO.enterFormName('!');
    expect(await duplicateFormModalPO.verifySaveErrorMsg()).toEqual(errorMsg);
    await duplicateFormModalPO.enterFormName('+');
    expect(await duplicateFormModalPO.verifySaveErrorMsg()).toEqual(errorMsg);
    await duplicateFormModalPO.enterFormName('<');
    expect(await duplicateFormModalPO.verifySaveErrorMsg()).toEqual(errorMsg);
    await duplicateFormModalPO.enterFormName('>');
    expect(await duplicateFormModalPO.verifySaveErrorMsg()).toEqual(errorMsg);
    await duplicateFormModalPO.enterFormName('?');
    expect(await duplicateFormModalPO.verifySaveErrorMsg()).toEqual(errorMsg);
    await duplicateFormModalPO.enterFormName('#');
    expect(await duplicateFormModalPO.verifySaveErrorMsg()).toEqual(errorMsg);
    await duplicateFormModalPO.enterFormName('&');
    expect(await duplicateFormModalPO.verifySaveErrorMsg()).toEqual(errorMsg);
    await duplicateFormModalPO.enterFormName(',');
    expect(await duplicateFormModalPO.verifySaveErrorMsg()).toEqual(errorMsg);
    await duplicateFormModalPO.enterFormName('%');
    expect(await duplicateFormModalPO.verifySaveErrorMsg()).toEqual(errorMsg);
    await duplicateFormModalPO.enterFormName('"');
    expect(await duplicateFormModalPO.verifySaveErrorMsg()).toEqual(errorMsg);
});