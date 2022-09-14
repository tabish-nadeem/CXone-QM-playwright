import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
import { Utils } from '../../../../common/utils';
import { AccountUtils } from '../../../../common/AccountUtils';
import { GlobalTenantUtils } from "../../../../common/globalTenantUtils";
import { CommonQMNoUIUtils } from "../../../../common/CommonQMNoUIUtils"
import { CommonUIUtils } from "cxone-playwright-test-utils";
import { LoginPage } from "../../../../common/login";
import { ModuleExports } from "../../../../common/qmDefaultData";
import { OmnibarPO } from "../../../../pageObjects/omnibar.po";
import { ManageFormsPO } from "../../../../pageObjects/manage-forms.po";
import { RenameFormModalPO } from '../../../../pageObjects/rename-form-modal.po';
import { OnPrepare } from "../../../../playwright.config";

let browser: any,
    utils: any,
    omnibarPO: any,
    manageFormsPO:any,
    renameFormModalPO: any,
    newOnPrepare:any,
    loginPage: any,
    userDetails: any,
    formDetails: any,
    userToken: any,
    sampleFormData: any;
let page: Page;
let context: BrowserContext;
let newGlobalTenantUtils = new GlobalTenantUtils();

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
    manageFormsPO = new ManageFormsPO(page);
    renameFormModalPO = new RenameFormModalPO();
    omnibarPO = new OmnibarPO(page);
    userDetails = await newGlobalTenantUtils.getDefaultTenantCredentials();
    utils = new Utils(page);
    newOnPrepare = new OnPrepare();
    sampleFormData = ModuleExports.getFormData();
    await newOnPrepare.OnStart(userDetails);
    loginPage = new LoginPage(page);
    console.log('Form Names used :', formNames);
    userToken = await loginPage.login(userDetails.email, userDetails.password);
    await CommonQMNoUIUtils.createForm(currForm, userToken);
    await newOnPrepare.toggleFeatureToggle(FEATURE_TOGGLES.navigation_redesign, true, userDetails.orgName, userToken)
    await manageFormsPO.navigate();
})

AfterAll({ timeout: 60 * 1000 }, async () => {
    await browser.close();
});

Given("should open the rename form modal and verify the components on the modal :P1", { timeout: 60 * 1000 }, async () => {
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
    await manageFormsPO.searchFormInGrid(formNames.formOne);
        let menuItem = await manageFormsPO.getHamburgerMenuItem(formNames.formOne, 'Rename');
        await menuItem.click();
        await browser.wait(page.locator('cxone-modal').isVisible(), 20000);
        expect(await renameFormModalPO.verifyRenameModalHeaderText()).toEqual(utils.getExpectedString('renameFormModal.header'));
        expect(await renameFormModalPO.verifyRenameModalSubHeading()).toEqual(utils.getExpectedString('renameFormModal.subHeading'));
        expect(await renameFormModalPO.verifyTextBox()).toBeTruthy();
        expect(await renameFormModalPO.checkChangeBtn()).toBeTruthy();
        expect(await renameFormModalPO.checkCancelBtn()).toBeTruthy();
        expect(await renameFormModalPO.checkCloseBtn()).toBeTruthy();
        await renameFormModalPO.clickCancelBtn();
        await manageFormsPO.searchFormInGrid(formNames.formOne);
        menuItem = await manageFormsPO.getHamburgerMenuItem(formNames.formOne, 'Rename');
        await menuItem.click();
        await browser.wait(page.locator('cxone-modal').isVisible(), 20000);
        await renameFormModalPO.clickChangeBtn();
        await CommonUIUtils.waitUntilIconLoaderDone(page);
        await renameFormModalPO.clickCancelBtn();
        await manageFormsPO.searchFormInGrid(formNames.formOne);
        expect(await omnibarPO.getItemCountLabel()).toEqual(['1 form']);
});

When("should give a new name and save the form, rename it again : P1", { timeout: 180 * 1000 }, async () => {
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

Then("should verify that the rename option is not present for Published/Unpublished Form : P1", { timeout: 180 * 1000 }, async () => {
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

Then("should verify form name field validation : P3", { timeout: 180 * 1000 }, async () => {
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
