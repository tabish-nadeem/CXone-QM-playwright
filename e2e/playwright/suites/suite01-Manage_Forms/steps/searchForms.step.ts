import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
import { OmnibarPO } from "../../../../pageObjects/OmnibarPO";
import { ManageFormsPO } from "../../../../pageObjects/ManageFormsPO";
import { Utils } from '../../../../common/utils';
import { AccountUtils } from '../../../../common/AccountUtils';
import { CommonQMNoUIUtils } from '../../../../common/CommonQMNoUIUtils';
import { GlobalTenantUtils } from '../../../../common/globalTenantUtils';
import { FeatureToggleUtils } from '../../../../common/FeatureToggleUtils';
import { LoginPage } from "../../../../common/login";
import { ModuleExports } from "../../../../common/qmDefaultData";
import { OnPrepare } from '../../../../playwright.config';

let browser: any,
    userToken:any,
    userDetails:any,
    loginPage: any,
    sampleFormData: any,
    newOnPrepare:any,
    formDetails:any,
    utils:any,
    manageFormsPO: any,
    omnibarPO: any,
    formNames: any = {},
    createForms :any= []
let page: Page;
let context: BrowserContext;
let newGlobalTenantUtils = new GlobalTenantUtils();

const FEATURE_TOGGLES = {
    navigation_redesign: 'release-navigation-redesign-CXCROSS-21'
};

console.log('ANGULAR8: MANAGE FORMS SEARCH FORMS TESTS');

formNames = {
    basicForm: 'Basic_form1' +  AccountUtils.getRandomString(),
    formOne: 'Form11' + AccountUtils.getRandomString(),
    formTwo: 'Form12' + AccountUtils.getRandomString(),
    formThree: '4621_1' + AccountUtils.getRandomString(),
    formFour: '4621_2' + AccountUtils.getRandomString(),
    specialCharacterFormName: '_-' + AccountUtils.getRandomString()
}

BeforeAll({ timeout: 400 * 1000 }, async () => {
    browser = await chromium.launch({
        headless: false,
        args: ['--window-position=-8,0']
    });
    context = await browser.newContext();
    page = await context.newPage();
    manageFormsPO = new ManageFormsPO(page);
    omnibarPO = new OmnibarPO(page);
    userDetails = await newGlobalTenantUtils.getDefaultTenantCredentials();
    utils = new Utils(page);
    newOnPrepare = new OnPrepare();
    sampleFormData = ModuleExports.getFormData();
    await newOnPrepare.OnStart(userDetails);
    loginPage = new LoginPage(page);
    console.log('Form Names used :', formNames);
    userToken = await loginPage.login(userDetails.email, userDetails.password);
    await  FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.navigation_redesign, userDetails.orgName, userToken);
});

AfterAll({ timeout: 60 * 1000 }, async () => {
        await browser.close();
});

Given("Should create multiple forms and search form by numbers on grid : P1", { timeout: 60 * 1000 }, async () => {

        formDetails = [
            {
                formName: formNames.basicForm,
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
                formName: formNames.formOne,
                formStatus: 'Draft',
                formType: 'EVALUATION',
                formData: sampleFormData,
                workflowConfigType: 'AGENT_CAN_ACKNOWLEDGE'
            },
            {
                formName: formNames.formTwo,
                formStatus: 'Draft',
                formType: 'EVALUATION',
                formData: sampleFormData,
                workflowConfigType: 'AGENT_CAN_ACKNOWLEDGE'
            },
            {
                formName: formNames.specialCharacterFormName,
                formStatus: 'Draft',
                formType: 'EVALUATION',
                formData: sampleFormData,
                workflowConfigType: 'AGENT_CAN_ACKNOWLEDGE'
            }];
        formDetails.forEach(async(currForm : any) => {
            let form : any = await CommonQMNoUIUtils.createForm(currForm, userToken);
            createForms.push(form);
        })
        await Promise.all(createForms);
        await manageFormsPO.navigate();
        await manageFormsPO.searchFormInGrid(formNames.formFour);
        expect(await manageFormsPO.verifyFormPresence(formNames.formThree, false)).toBeFalsy();
        expect(await manageFormsPO.verifyFormPresence(formNames.formFour, false)).toBeTruthy();
        expect(await omnibarPO.getItemCountLabel()).toEqual([await manageFormsPO.getNumberOfRows() + ' form']);
});

When("Should create multiple forms and search form by alphabets on grid : P1" , { timeout: 60 * 1000 }, async () => {
    await manageFormsPO.searchFormInGrid('Form1');
    expect(await omnibarPO.getItemCountLabel()).toEqual([await manageFormsPO.getNumberOfRows() + ' forms']);
})

Then("Should  verify that appropriate message should be displayed on grid if no matches found to user for his search string : P1" ,{ timeout: 60 * 1000 }, async () => {
    await manageFormsPO.searchFormInGrid('Forms');
    expect(await manageFormsPO.getNoMatchFoundMsg()).toEqual(utils.getExpectedString('manageFormsPage.noItemsOverlay'));
})
