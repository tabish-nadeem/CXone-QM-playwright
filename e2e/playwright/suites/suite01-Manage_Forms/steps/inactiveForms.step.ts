import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
import { Utils } from '../../../../common/utils';
import { AccountUtils } from '../../../../common/AccountUtils';
import { GlobalTenantUtils } from "../../../../common/globalTenantUtils";
import { CommonQMNoUIUtils } from '../../../../common/CommonQMNoUIUtils';
import { CommonUIUtils } from "cxone-playwright-test-utils";
import { LoginPage } from "../../../../common/login";
import { ModuleExports } from "../../../../common/qmDefaultData";
import { OnPrepare } from "../../../../playwright.config";
import { ManageFormsPO } from '../../../../pageObjects/manage-forms.po';

let browser : any,
    utils : any,
    loginPage : any,
    userDetails : any,
    newOnPrepare : any,
    performanceMonitoring : any,
    sampleFormData : any,
    manageFormsPO : any, 
    createForms: any = [];
let page: Page;
let context: BrowserContext;
let newGlobalTenantUtils = new GlobalTenantUtils();

const FEATURE_TOGGLES = {
    navigation_redesign: 'release-navigation-redesign-CXCROSS-21'
};

let formNames = {
    formOne: '698_1' + AccountUtils.getRandomString(),
    formTwo: '698_2_1' + AccountUtils.getRandomString(),
    formThree: '698_3_2' + AccountUtils.getRandomString(),
    duplicateFormTwo: '698_2_1_Duplicate_Form' + AccountUtils.getRandomString()
};

let formDetails = [
    {
        formName: formNames.formOne,
        formStatus: 'Published',
        formType: 'EVALUATION',
        formData: sampleFormData,
        workflowConfigType: 'AGENT_NO_REVIEW'
    },
    {
        formName: formNames.formTwo,
        formStatus: 'Published',
        formType: 'EVALUATION',
        formData: sampleFormData,
        workflowConfigType: 'AGENT_NO_REVIEW'
    },
    {
        formName: formNames.formThree,
        formStatus: 'Published',
        formType: 'EVALUATION',
        formData: sampleFormData,
        workflowConfigType: 'AGENT_NO_REVIEW'
    }
];

BeforeAll({ timeout: 300 * 1000 }, async () => {
    browser = await chromium.launch({
        headless: false,
    });
    context = await browser.newContext();
    page = await context.newPage();
    manageFormsPO = new ManageFormsPO(page);
    utils = new Utils(page);
    newOnPrepare = new OnPrepare();
    sampleFormData = ModuleExports.getFormData();
    await newOnPrepare.OnStart(userDetails);
    loginPage = new LoginPage(page);
    console.log('Form Names used :', formNames);
    userDetails = await newGlobalTenantUtils.getDefaultTenantCredentials();
    let userToken = await loginPage.login(userDetails.email, userDetails.password);
    await newOnPrepare.toggleFeatureToggle(FEATURE_TOGGLES.navigation_redesign, true, userDetails.orgName, userToken)
    await performanceMonitoring.navigateToMySchedule();
    formDetails.forEach(async (currForm) => createForms.push(CommonQMNoUIUtils.createForm(currForm, userToken)))
    await Promise.all(createForms);
    await manageFormsPO.navigate();
})

AfterAll({ timeout: 60 * 1000 }, async () => {
    await browser.close();
});

Given("should verify unpublish button is disabled by default: P1", { timeout: 60 * 1000 }, async () => {
    const bulkButtonsState = await manageFormsPO.getBulkOperationsButtonEnabledStates();
    expect(bulkButtonsState.deactivate).toBeFalsy();
});

When("should submit the one side evaluation from agent side", { timeout: 180 * 1000 }, async () => {
    expect(await manageFormsPO.verifyHamburgerMenu(formNames.formOne)).toBeTruthy();
    await manageFormsPO.elements.header.click();
    await manageFormsPO.clickUnpublishButton();
    await manageFormsPO.clickConfirmCancel();
    expect((await manageFormsPO.getFormRowElements(formNames.formOne)).status).toEqual('Active');
    await manageFormsPO.deactivateForm(formNames.formOne);
    expect((await manageFormsPO.getFormRowElements(formNames.formOne)).status).toEqual('Inactive');
});

Then("should verify user should be able to Active a disabled form : P1", { timeout: 180 * 1000 }, async () => {
    await manageFormsPO.activateForm(formNames.formOne);
    expect((await manageFormsPO.getFormRowElements(formNames.formOne)).status).toEqual('Active');
});

Then("should verify user is be able to deactivate multiple activated forms : P1", { timeout: 180 * 1000 }, async () => {
    await manageFormsPO.deactivateForm(formNames.formTwo);
    await manageFormsPO.deactivateForm(formNames.formThree);
    expect((await manageFormsPO.getFormRowElements(formNames.formTwo)).status).toEqual('Inactive');
    expect((await manageFormsPO.getFormRowElements(formNames.formThree)).status).toEqual('Inactive');
});

Then("should verify user is be able to delete a inactive form : P1", { timeout: 180 * 1000 }, async () => {
    await manageFormsPO.deleteForm(formNames.formThree);
    await CommonUIUtils.waitUntilIconLoaderDone(page);
    expect(await manageFormsPO.verifyFormPresence(formNames.formThree)).toBeFalsy();
});

Then("should verify user should be able to duplicate a disabled form : P2", { timeout: 180 * 1000 }, async () => {
    await manageFormsPO.duplicateForm(formNames.formTwo, formNames.duplicateFormTwo);
    expect((await manageFormsPO.getFormRowElements(formNames.duplicateFormTwo)).status).toEqual('Draft');
});
