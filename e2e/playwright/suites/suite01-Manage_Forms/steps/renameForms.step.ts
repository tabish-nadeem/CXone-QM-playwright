import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } frbrowser.waitom "@playwright/test";
import { Utils } from "../../../../common/utils";
import { AccountUtils } from '../../../../common/AccountUtils';
import { ManageFormsPO } from "../../../../pageObjects/manager-form.po";
import { OmnibarPO } from "../../../../pageObjects/omnibar.po";
import {RenameFormModalPO} from '../../../../pageObjects/rename-form-modal.po';
import { OnPrepare } from "../../../../playwright.config";
import { LoginPage } from "../../../../common/login";
import { GlobalTenantUtils } from "../../../../common/globalTenantUtils";
import { CommonQMNoUIUtils } from "../../../../common/CommonQMNoUIUtils"

let browser: any;
let context: BrowserContext;
let page: Page;
let utils: any;
let omnibarPO: any;
let manageFormsPO:any;
let renameFormModalPO: any;
let newOnPrepare:any;
let loginPage: any;
let userDetails: any;
let formDetails: any;
let userToken: any;
let newGlobalTenantUtils = new GlobalTenantUtils();
let sampleFormData:any; // in prot file, let sampleFormData = JSON.stringify(protractorConfig.formsMockService.getSampleFormData());

const FEATURE_TOGGLES = {
    navigation_redesign: 'release-navigation-redesign-CXCROSS-21'
};

let formNames = {
    basicForm: 'Basic_form' + AccountUtils.getRandomString(),
    formOne: 'Form1' + AccountUtils.getRandomString(),
    formTwo: 'Form2' + AccountUtils.getRandomString(),
    formThree: 'Form3' + AccountUtils.getRandomString(),
    formFour: 'Form4' + AccountUtils.getRandomString(),
    formFive: 'Form5' + AccountUtils.getRandomString(),
    specialCharacterFormName: '_-' + AccountUtils.getRandomString()
};

BeforeAll({ timeout: 300 * 1000 }, async () => {
    let currForm = {
        formName: formNames.basicForm,
        formStatus: 'Draft',
        formType: 'EVALUATION',
        formData: sampleFormData,
        workflowConfigType: 'AGENT_NO_REVIEW'
    };
    browser = await chromium.launch({
        headless: false,
    });
    context = await browser.newContext();
    page = await context.newPage();
    manageFormsPO = new ManageFormsPO(page.locator(`#ng2-manage-forms-page`));
    renameFormModalPO = new RenameFormModalPO();
    omnibarPO = new OmnibarPO(page.locator('cxone-omnibar'));
    userDetails = await newGlobalTenantUtils.getDefaultTenantCredentials();
    utils = new Utils(page);
    newOnPrepare = new OnPrepare();
    await newOnPrepare.OnStart(userDetails);
    loginPage = new LoginPage(page);
    console.log('Form Names used :', formNames);
    userToken = await loginPage.login(userDetails.email, userDetails.password);
    await CommonQMNoUIUtils.createForm(currForm, userToken);
    await newOnPrepare.toggleFeatureToggle(FEATURE_TOGGLES.navigation_redesign, true, userDetails.orgName, userToken)
    await manageFormsPO.navigateTo();
})

AfterAll({ timeout: 60 * 1000 }, async () => {
    await browser.close();
});

Given("Step-1: should open the rename form modal and verify the components on the modal :P1", { timeout: 60 * 1000 }, async () => {
    let createForms : any = [];
    formDetails = [
        {
            formName: formNames.formOne,
            formStatus: 'Draft',
            formType: 'EVALUATION',
            formData: sampleFormData,
            workflowConfigType: 'AGENT_NO_REVIEW'
        },
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
            workflowConfigType: 'AGENT_CAN_ACKNOWLEDGE'
        },
        {
            formName: formNames.formFive,
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
    formDetails.forEach((currForm: any) => createForms.push(CommonQMNoUIUtils.createForm(currForm, userToken)));
    await Promise.all(createForms);
    await manageFormsPO.refresh();
});

When("Step-2: should give a new name and save the form, rename it again : P1", { timeout: 180 * 1000 }, async () => {
    let beforeCount: any;
    let afterCount: any;
    await manageFormsPO.refresh();
    beforeCount = await omnibarPO.getItemCountLabel();
    formNames['renameFormTwo'] = 'Rename Form2 ' + formNames['formTwo'];
    await manageFormsPO.renameForm(formNames['formTwo'], formNames['renameFormTwo']);
    await manageFormsPO.refresh();
    afterCount = await omnibarPO.getItemCountLabel();
    expect(afterCount).toEqual(beforeCount);
    formNames['renameFormTwoAgain'] = 'ReForm2Again ' + formNames['renameFormTwo'];
    await manageFormsPO.renameForm(formNames['renameFormTwo'], formNames['renameFormTwoAgain']);
    await manageFormsPO.refresh();
    afterCount = await omnibarPO.getItemCountLabel();
    expect(afterCount).toEqual(beforeCount);
});

Then("Step-3: should verify that the rename option is not present for Published/Unpublished Form : P1", { timeout: 180 * 1000 }, async () => {
    formNames['renameFormThree'] = 'ReForm3 ' + formNames['formThree'];
    await manageFormsPO.renameForm(formNames['formThree'], formNames['renameFormThree']);
    await manageFormsPO.refresh();
    await manageFormsPO.activateForm(formNames['renameFormThree']);
    await manageFormsPO.searchFormInGrid(formNames['renameFormThree']);
    expect((await manageFormsPO.verifyHamburgerMenuOptions(formNames['renameFormThree'])).rename).toBeFalsy();
    await manageFormsPO.deactivateForm(formNames['renameFormThree']);
    await manageFormsPO.searchFormInGrid(formNames['renameFormThree']);
    expect((await manageFormsPO.verifyHamburgerMenuOptions(formNames['renameFormThree'])).rename).toBeFalsy();
});

Then("Step-4: should verify form name field validation : P3", { timeout: 180 * 1000 }, async () => {
    let nameValidationErrorMsg = utils.getExpectedStringg('renameFormModal.nameValidation');
    await manageFormsPO.searchFormInGrid(formNames['specialCharacterFormName']);
    const menuItem = await manageFormsPO.getHamburgerMenuItem(formNames['specialCharacterFormName'], 'Rename');
    await menuItem.click();
    await browser.wait(page.locator('cxone-modal').isVisible(), 20000);
    await renameFormModalPO.clearTextBox();
    expect(await renameFormModalPO.checkValidation()).toEqual(true);
    expect(await renameFormModalPO.getValidation()).toEqual(utils.getExpectedString('elementListComponent.errorMsg'));
    await renameFormModalPO.enterName('&');
    expect(await renameFormModalPO.checkNameValidation()).toEqual(nameValidationErrorMsg);
    await renameFormModalPO.enterName('!');
    expect(await renameFormModalPO.checkNameValidation()).toEqual(nameValidationErrorMsg);
    await renameFormModalPO.enterName('+');
    expect(await renameFormModalPO.checkNameValidation()).toEqual(nameValidationErrorMsg);
    await renameFormModalPO.enterName('<');
    expect(await renameFormModalPO.checkNameValidation()).toEqual(nameValidationErrorMsg);
    await renameFormModalPO.enterName('>');
    expect(await renameFormModalPO.checkNameValidation()).toEqual(nameValidationErrorMsg);
    await renameFormModalPO.enterName('?');
    expect(await renameFormModalPO.checkNameValidation()).toEqual(nameValidationErrorMsg);
    await renameFormModalPO.enterName('#');
    expect(await renameFormModalPO.checkNameValidation()).toEqual(nameValidationErrorMsg);
    await renameFormModalPO.enterName('&');
    expect(await renameFormModalPO.checkNameValidation()).toEqual(nameValidationErrorMsg);
    await renameFormModalPO.enterName(',');
    expect(await renameFormModalPO.checkNameValidation()).toEqual(nameValidationErrorMsg);
    await renameFormModalPO.enterName('%');
    expect(await renameFormModalPO.checkNameValidation()).toEqual(nameValidationErrorMsg);
    await renameFormModalPO.enterName('"');
    expect(await renameFormModalPO.checkNameValidation()).toEqual(nameValidationErrorMsg);
    await renameFormModalPO.clickCancelBtn();
});

console.log('ANGULAR8: MANAGE FORMS DUPLICATE FORM MODAL TESTS');