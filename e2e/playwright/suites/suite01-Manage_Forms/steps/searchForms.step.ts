import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
import { GlobalTenantUtils } from '../../../../common/globalTenantUtils';
import { AccountUtils } from '../../../../common/AccountUtils';
import { CommonNoUIUtils } from '../../../../common/CommonNoUIUtils';
import { LoginPage } from "../../../../common/login";
import { FeatureToggleUtils } from '../../../../common/FeatureToggleUtils';
import { FEATURE_TOGGLES } from "../../../../common/uiConstants";
import { OnPrepare } from '../../../../playwright.config';
import { CommonQMNoUIUtils } from '../../../../common/CommonQMNoUIUtils';
import { Utils } from '../../../../common/utils';

let page: Page;
let browser: any;
let context: BrowserContext;
let userToken:any;
let userDetails:any;
let formNames:any={};
let sampleFormData:any;
let newOnPrepare:any;
let loginPage:any;
let utils:any;

let newGlobalTenantUtils = new GlobalTenantUtils();
utils = new Utils(page);


console.log('ANGULAR8: MANAGE FORMS SEARCH FORMS TESTS');
const manageFormsPO = new ManageFormsPO(element(by.id('ng2-manage-forms-page')));
const omnibarPO = new OmnibarPO(element(by.tagName('cxone-omnibar')));
userDetails = await newGlobalTenantUtils.getDefaultTenantCredentials();
formNames = {
    basicForm: 'Basic_form1' +  AccountUtils.getRandomString(),
    formOne: 'Form11' + AccountUtils.getRandomString(),
            formTwo: 'Form12' + AccountUtils.getRandomString(),
            formThree: '4621_1' + AccountUtils.getRandomString(),
            formFour: '4621_2' + AccountUtils.getRandomString(),
            specialCharacterFormName: '_-' + AccountUtils.getRandomString()
}
// sampleFormData = JSON.stringify(protractorConfig.formsMockService.getSampleFormData());



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
    console.log('Form Names used :', formNames);
    userToken = await CommonNoUIUtils.login(userDetails.adminCreds.email,userDetails.adminCreds.password,true);
    await  FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SUMMER21, userDetails.orgName, userToken);
});

AfterAll({ timeout: 60 * 1000 }, async () => {
        await browser.close();
});

Given("Step-1: should create multiple forms and search form by numbers on grid : P1", { timeout: 60 * 1000 }, async () => {

    let onStart = async () => {
        let createForms :any= [];
        let formDetails:any = [
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
        formDetails.forEach(async(currForm) => {
            let form:any = await CommonQMNoUIUtils.createForm(currForm, userToken);
            createForms.push(form);
        })
        await Promise.all(createForms);
        await manageFormsPO.navigateTo();
    
    };

    const verifyFormRowsAfterSearchByNumbers = async () => {
        await manageFormsPO.searchFormInGrid(formNames.formFour);
        expect(await manageFormsPO.verifyFormPresence(formNames.formThree, false)).toBeFalsy();
        expect(await manageFormsPO.verifyFormPresence(formNames.formFour, false)).toBeTruthy();
        expect(await omnibarPO.getItemCountLabel()).toEqual([await manageFormsPO.getNumberOfRows() + ' form']);
    };

});

When("step-2: should create multiple forms and search form by alphabets on grid : P1" , { timeout: 60 * 1000 }, async () => {

    await manageFormsPO.searchFormInGrid('Form1');
    expect(await omnibarPO.getItemCountLabel()).toEqual([await manageFormsPO.getNumberOfRows() + ' forms']);

})

Then("step-3: should  verify that appropriate message should be displayed on grid if no matches found to user for his search string : P1" ,{ timeout: 60 * 1000 }, async () => {

    await manageFormsPO.searchFormInGrid('Forms');
    expect(await manageFormsPO.getNoMatchFoundMsg()).toEqual(utils.getExpectedString('manageFormsPage.noItemsOverlay'));
    
})