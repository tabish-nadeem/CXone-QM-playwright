import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
import { AccountUtils } from '../../../../common/AccountUtils';
import { Utils } from "../../../../common/utils";
import { ManageFormsPO } from "../../../../pageObjects/manager-form.po";
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
let newOnPrepare:any;
let loginPage: any;
let userDetails: any;
let formDetails: any;
let userToken: any, dateFormat: any, localeString = 'en-US';
let newGlobalTenantUtils = new GlobalTenantUtils();
let createForms: any = [];
let sampleFormData:any; // in prot file, let sampleFormData = JSON.stringify(protractorConfig.formsMockService.getSampleFormData());

const FEATURE_TOGGLES = {
    navigation_redesign: 'release-navigation-redesign-CXCROSS-21'
};

let formNames = {
    formOne: 'Basic_form' + AccountUtils.getRandomString(),
    formTwo: '1085_1p' + AccountUtils.getRandomString(),
    formThree: '1085_2p' + AccountUtils.getRandomString(),
    formFour: '1085_3dp' + AccountUtils.getRandomString(),
    formFive: '464_1' + AccountUtils.getRandomString(),
    formSix: '465_4p' + AccountUtils.getRandomString(),
    formSeven: '465_5d' + AccountUtils.getRandomString(),
    formEight: '465_6d' + AccountUtils.getRandomString(),
    formNine: '465_1d' + AccountUtils.getRandomString()
};

const currForm = {
    formName: formNames.formOne,
    formStatus: 'Draft',
    formType: 'EVALUATION',
    formData: sampleFormData,
    workflowConfigType: 'AGENT_NO_REVIEW'
};

const getCurrentUserName = async () => {
    let button = await page.locator('.user-panel');
    await button.click();
    let profile = await page.locator('#myProfile');
    await profile.click();
    return await page.locator('.first-last-name').getText();
};

BeforeAll({ timeout: 300 * 1000 }, async () => {
    browser = await chromium.launch({
        headless: false,
    });
    context = await browser.newContext();
    page = await context.newPage();
    manageFormsPO = new ManageFormsPO(page.locator(`#ng2-manage-forms-page`));
    userDetails = await newGlobalTenantUtils.getDefaultTenantCredentials();
    utils = new Utils(page);
    newOnPrepare = new OnPrepare();
    await newOnPrepare.OnStart(userDetails);
    loginPage = new LoginPage(page);
    console.log('Form Names used :', formNames);
    userToken = await loginPage.login(userDetails.email, userDetails.password);
    await newOnPrepare.toggleFeatureToggle(FEATURE_TOGGLES.navigation_redesign, true, userDetails.orgName, userToken)
    await CommonQMNoUIUtils.createForm(currForm, userToken);
    await manageFormsPO.navigateTo();
    dateFormat = await LocalizationNoUI.getDateStringFormat(localeString, userToken, userDetails.orgName);
    console.log('DateTime formats to use', dateFormat);
})

AfterAll({ timeout: 60 * 1000 }, async () => {
    await browser.close();
});

Given("Step-1: P2: verify page title, form count and create form button", { timeout: 60 * 1000 }, async () => {
    expect(await manageFormsPO.getHeaderText()).toEqual(utils.getExpectedString('manageFormsPage.pageTitle')); // mention page title
    let attributes = {
        formType: 'EVALUATION',
        wd: false
    };
    let response:any = await CommonQMNoUIUtils.getForms(attributes, userToken);
    expect(await manageFormsPO.getItemCountLabel()).toEqual([response.length + ' form']);
    expect(await manageFormsPO.getNewFormButton().getText()).toEqual(utils.getExpectedString('manageFormsPage.createForm'));
});

When("Step-2: P1: should reflect timestamp and user name for last modification", { timeout: 180 * 1000 }, async () => {
    const userName = await getCurrentUserName();
    const profile = await page.locator('.close-button');
    await profile.click();
    await manageFormsPO.searchFormInGrid(formNames.formOne);
    let rowElements = await manageFormsPO.getGridRowTexts(0);
    expect(rowElements.status).toEqual(utils.getExpectedString('formManager.formStatus.draft'));
    expect(rowElements.lastModified).toEqual(manageFormsPO.getTodaysDate(dateFormat.shortDateFormat));
    expect(userName.toLowerCase()).toEqual(rowElements.modifiedBy);
    await manageFormsPO.searchFormInGrid('');
});

Given("Step-1: P3: Activate button should be disabled by defaultorm button", { timeout: 60 * 1000 }, async () => {
    formDetails = [
        {
            formName: formNames.formTwo,
            formStatus: 'Draft',
            formType: 'EVALUATION',
            formData: sampleFormData,
            workflowConfigType: 'AGENT_NO_REVIEW'
        },
        {
            formName: formNames.formThree,
            formStatus: 'Draft',
            formType: 'EVALUATION',
            formData: sampleFormData,
            workflowConfigType: 'AGENT_NO_REVIEW'
        },
        {
            formName: formNames.formFour,
            formStatus: 'Draft',
            formType: 'EVALUATION',
            formData: sampleFormData,
            workflowConfigType: 'AGENT_NO_REVIEW'
        },
        {
            formName: formNames.formFive,
            formStatus: 'Draft',
            formType: 'EVALUATION',
            formData: sampleFormData,
            workflowConfigType: 'AGENT_NO_REVIEW'
        }
    ];
    formDetails.forEach(async (currForm:any) => createForms.push(CommonQMNoUIUtils.createForm(currForm, userToken)))
    await Promise.all(createForms);
    await manageFormsPO.refresh();
    const bulkOperationsState = await manageFormsPO.getBulkOperationsButtonEnabledStates();
    expect(bulkOperationsState.activate).toBeFalsy();
});

When("Step-2: P1: should activate multiple forms", { timeout: 180 * 1000 }, async () => {
    await manageFormsPO.bulkActivateForms([formNames.formTwo, formNames.formThree]);
    expect((await manageFormsPO.getFormRowElements(formNames.formTwo)).status).toEqual(utils.getExpectedString('formManager.formStatus.published'));
    expect((await manageFormsPO.getFormRowElements(formNames.formThree)).status).toEqual(utils.getExpectedString('formManager.formStatus.published'));
});

Then("step-3: P1: should activate only draft forms and should neglect already activated(earlier published) ones", { timeout: 180 * 1000 }, async () => {
    await manageFormsPO.bulkActivateForms([formNames.formThree, formNames.formFour]);
    expect((await manageFormsPO.getFormRowElements(formNames.formFour)).status).toEqual(utils.getExpectedString('formManager.formStatus.published'));
});

Given("Step-1: P1: should publish a single form using a more menu", { timeout: 60 * 1000 }, async () => {
    await manageFormsPO.refresh();
    expect(await manageFormsPO.verifyHamburgerMenu(formNames.formFive)).toBeTruthy();
    expect(await manageFormsPO.verifyDeleteOption(formNames.formFive)).toBeTruthy();
    await manageFormsPO.activateForm(formNames.formFive);
    const row = await manageFormsPO.getFormRowElements(formNames.formFive);
    expect(row.status).toEqual(utils.getExpectedString('formManager.formStatus.published'));
});

When("Step-2: P2: Activate option should not be present for already activated form in more menu", { timeout: 180 * 1000 }, async () => {
    expect((await manageFormsPO.verifyHamburgerMenuOptions(formNames.formFive)).activate).toBeFalsy();
});

Given("Step-1: P1: should show popover message if mouse over on delete icon of published form", { timeout: 60 * 1000 }, async () => {
    formDetails = [
        {
            formName: formNames.formSix,
            formStatus: 'Draft',
            formType: 'EVALUATION',
            formData: sampleFormData,
            workflowConfigType: 'AGENT_NO_REVIEW'
        },
        {
            formName: formNames.formSeven,
            formStatus: 'Draft',
            formType: 'EVALUATION',
            formData: sampleFormData,
            workflowConfigType: 'AGENT_NO_REVIEW'
        },
        {
            formName: formNames.formEight,
            formStatus: 'Draft',
            formType: 'EVALUATION',
            formData: sampleFormData,
            workflowConfigType: 'AGENT_NO_REVIEW'
        },
        {
            formName: formNames.formNine,
            formStatus: 'Draft',
            formType: 'EVALUATION',
            formData: sampleFormData,
            workflowConfigType: 'AGENT_NO_REVIEW'
    }];
    formDetails.forEach(async (currForm:any) => createForms.push(CommonQMNoUIUtils.createForm(currForm, userToken)))
    await Promise.all(createForms);
    await manageFormsPO.refresh();
    await manageFormsPO.activateForm(formNames.formSix);
    expect(await manageFormsPO.verifyMessageMouseHoverDelOfPublishedForm(formNames.formSix)).toEqual(utils.getExpectedString('popover.deleteActivatedFormMessage'));
});

When("Step-2: P2: should not delete forms if user will try to delete two forms having status as one is draft and other is activated", { timeout: 180 * 1000 }, async () => {
    await manageFormsPO.searchFormInGrid('');
    await manageFormsPO.bulkDeleteForms([formNames.formSix, formNames.formSeven]);
    let result = await manageFormsPO.verifyFormPresence(formNames.formSix);
    expect(result).toBeTruthy();
    result = await manageFormsPO.verifyFormPresence(formNames.formSeven);
    expect(result).toBeTruthy();
});

Then("step-3: P1: should delete multiple draft forms by selecting checkboxes and clicking on delete button in upper tool bar", { timeout: 180 * 1000 }, async () => {
    await manageFormsPO.searchFormInGrid('465');
    await manageFormsPO.bulkDeleteForms([formNames.formEight, formNames.formNine]);
    let results = await Promise.all([
        manageFormsPO.verifyFormPresence(formNames.formEight),
        manageFormsPO.verifyFormPresence(formNames.formNine)
    ]);
    expect(results[0]).toBeFalsy();
    expect(results[1]).toBeFalsy();
});

Then("step-4: P1: should delete a single draft form using delete icon", { timeout: 180 * 1000 }, async () => {
    await manageFormsPO.deleteForm(formNames.formSeven);
    expect(await manageFormsPO.verifyFormPresence(formNames.formSeven)).toBeFalsy();
});