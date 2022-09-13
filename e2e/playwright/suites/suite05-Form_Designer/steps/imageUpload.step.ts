import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
import { GlobalTenantUtils } from "../../../../common/globalTenantUtils";
import { CommonUIUtils } from "cxone-playwright-test-utils";
import { CommonNoUIUtils } from "../../../../common/CommonNoUIUtils";
import { LoginPage } from "../../../../common/login";
import { FEATURE_TOGGLES } from "../../../../common/uiConstants"
import { FormAreaComponentPo } from "../../../../pageObjects/form-area.component.po";
import { DesignerToolbarComponentPO } from '../../../../pageObjects/designer-toolbar.component.po';
import { ManageFormsPO } from "../../../../pageObjects/manage-forms.po";
import FormDesignerPagePO from '../../../../pageObjects/form-designer-page.po';
import { ElementAttributesComponentPo } from '../../../../pageObjects/element-attributes.component.po'
import { OnPrepare } from "../../../../playwright.config";
import * as moment from 'moment';

let browser: any,
    page: Page,
    userDetails: any,
    userToken: any,
    formDesignerPage: any,
    formArea: any,
    designerToolbar: any,
    manageFormsPO: any,
    elementAttributesComponentPo: any,
    fileToUpload: any,
    loginPage: any,
    newOnPrepare: any;
let newGlobalTenantUtils = new GlobalTenantUtils();
let context: BrowserContext;
let formNames = [
    'ImageUpload_1' + moment(),
    'ImageUpload_2' + moment()
];

BeforeAll({ timeout: 300 * 1000 }, async () => {
    browser = await chromium.launch({
        channel: "chrome",
        headless: true,
        args: ['--window-position=-8,0']
    });
    context = await browser.newContext();
    page = await context.newPage();
    userDetails = await newGlobalTenantUtils.getDefaultTenantCredentials();
    newOnPrepare = new OnPrepare();
    await newOnPrepare.OnStart(userDetails);
    userToken = await CommonNoUIUtils.login(userDetails.email, userDetails.password, false);
    console.log('Form Names used :', formNames);
    await newOnPrepare.toggleFeatureToggle(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, true, userDetails.orgName, userToken)
    await newOnPrepare.toggleFeatureToggle(FEATURE_TOGGLES.RELEASE_NAVIGATION_REDESIGN, true, userDetails.orgName, userToken)
    manageFormsPO = new ManageFormsPO(page);
    formDesignerPage = new FormDesignerPagePO();
    formArea = new FormAreaComponentPo();
    designerToolbar = new DesignerToolbarComponentPO();
    elementAttributesComponentPo = new ElementAttributesComponentPo();
    loginPage = new LoginPage(page);
    fileToUpload = './src/assets/img/icon_logoNICE.png';
    await manageFormsPO.navigate();
})

AfterAll({ timeout: 60 * 1000 }, async () => {
    await browser.close();
});

Given("should verify form logo,  select logo, check file name, save form and verify all the changes are saved and delete logo", { timeout: 60 * 1000 }, async () => {
    await formDesignerPage.navigate();
    await elementAttributesComponentPo.imageUploadComponentPo.uploadRequiredFile(fileToUpload);
    expect(await elementAttributesComponentPo.imageUploadComponentPo.getFileName()).toEqual('icon_logoNICE.png');
    await formArea.dragElementToFormArea('yesno');
    await formDesignerPage.saveAndActivateForm(formNames[0], true);
    await CommonUIUtils.waitUntilIconLoaderDone(page);
    await manageFormsPO.searchFormInGrid(formNames[0]);
    await manageFormsPO.openParticularForm(formNames[0]);
    expect(await elementAttributesComponentPo.imageUploadComponentPo.getFileName()).toEqual('icon_logoNICE.png');
});

When("should be able to cancel duplicate form creation : P2", { timeout: 180 * 1000 }, async () => {
    await elementAttributesComponentPo.imageUploadComponentPo.clickDeleteUploadedFile();
    await designerToolbar.undo(1);
    expect(await elementAttributesComponentPo.imageUploadComponentPo.getFileName()).toEqual('icon_logoNICE.png');
    await designerToolbar.redo(1);
    expect(await elementAttributesComponentPo.imageUploadComponentPo.getFileName()).toEqual('DefaultLogo.png');
});