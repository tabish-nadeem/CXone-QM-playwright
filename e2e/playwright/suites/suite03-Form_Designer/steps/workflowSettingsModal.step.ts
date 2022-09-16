import { Utils } from '../../../../common/utils';
import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
// import { FEATURE_TOGGLES } from '../../../assets/CONSTANTS';
import { CommonNoUIUtils } from '../../../../common/CommonNoUIUtils';
import { GlobalTenantUtils } from '../../../../common/globalTenantUtils';
import { FEATURE_TOGGLES } from "../../../../common/uiConstants";
import { FeatureToggleUtils } from '../../../../common/FeatureToggleUtils';
import { OnPrepare } from '../../../../playwright.config';
import * as moment from 'moment';
import * as _ from 'lodash';
import FormDesignerPagePO from "../../../../pageObjects/FormDesignerPagePO";
import { FormAreaComponentPo } from "../../../../pageObjects/FormAreaComponentPO";
import { ManageFormsPO } from '../../../../pageObjects/ManageFormsPO';
import { ModuleExports } from '../../../../common/qmDefaultData';
import { DesignerToolbarComponentPO } from '../../../../pageObjects/DesignerToolbarComponentPO';
import { WorkflowSettingsModalComponentPo } from '../../../../pageObjects/WorkflowSettingsModalComponentPO';


let browser: any;
let newGlobalTenantUtils = new GlobalTenantUtils();
let USER_TOKEN: string;
let userDetails: any = {}
let newOnPrepare: any;
let calibrationPO: any;
let getElementLists: any;
let page: Page;
let context: BrowserContext;

const formNames = [
     'WorkFlowSettings_form_1' + moment(),
     'WorkFlowSettings_form_2' + moment(),
     'WorkFlowSettings_form_3' + moment(),
     'WorkFlowSettings_form_4' + moment(),
     'WorkFlowSettings_form_5' + moment(),
     'WorkFlowSettings_form_6' + moment(),
     'WorkFlowSettings_form_7' + moment(),
     'WorkFlowSettings_form_8' + moment(),
     'WorkFlowSettings_form_9' + moment()
];

const getElementList = () => {
     return [
          {
               elementType: 'text',
               elementTitle: 'Agent Name',
               elementJson: '{"type":"text","elementData":{"attributes":{"question":"Agent Name","answer":"","required":true,"visible":true,"prePopulatedHintText":""}}}'
          },
          {
               elementType: 'textarea',
               elementTitle: 'Agent Address',
               elementJson: '{"type":"textarea","elementData":{"attributes":{"question":"Agent Address","answer":"","required":true,"visible":true,"subText":"","prePopulatedHintText":"","limitCharacters":true,"limitCharactersText":"130"}}}'
          },
          {
               elementType: 'radio',
               elementTitle: 'Gender',
               elementJson: '{"type":"radio","elementData":{"attributes":{"question":"Gender","answer":"","required":true,"layout":"vertical","visible":true,"subText":"","choiceList":[{"label":"Male","value":"1","score":1,"$$hashKey":"object:510"},{"label":"Female","value":"2","score":1,"$$hashKey":"object:511"}],"elementType":"radio"}}}'
          },
          {
               elementType: 'checkbox',
               elementTitle: 'Agent focus area?',
               elementJson: '{"type":"checkbox","elementData":{"attributes":{"question":"Agent focus area?","answer":[],"required":true,"layout":"vertical","visible":true,"subText":"","choiceList":[{"label":"Front End","value":"1","score":1,"selected":false,"$$hashKey":"object:823"},{"label":"Back End","value":"2","score":1,"selected":false,"$$hashKey":"object:824"}],"elementType":"checkbox"}}}'
          },
          {
               elementType: 'yesno',
               elementTitle: 'Passed?',
               elementJson: '{"type":"yesno","elementData":{"attributes":{"question":"Passed?","answer":"","required":true,"layout":"vertical","visible":true,"subText":"","choiceList":[{"label":"Yes","value":"1","score":1,"$$hashKey":"object:1148"},{"label":"No","value":"2","score":0,"$$hashKey":"object:1149"},{"label":"N/A","value":"na","naElement":true,"score":0,"$$hashKey":"object:1185"}],"elementType":"yes/no","isNAChecked":true}}}'
          },
          {
               elementType: 'text',
               elementTitle: 'Reason code',
               elementJson: '{"type":"text","elementData":{"attributes":{"question":"Reason code","answer":"","required":false,"visible":true,"prePopulatedHintText":""}}}'
          },
          {
               elementType: 'dropdown',
               elementTitle: 'Multi Dropdown Outside Section',
               elementJson: '{"type":"dropdown","elementData":{"attributes":{"question":"Multi Dropdown","answer":[],"required":true,"visible":true,"subText":"","elementType":"dropdown","itemList":[{"id":"ABCD","label":"ABCD","value":"ABCD"},{"id":"EFGH","label":"EFGH","value":"EFGH"},{"id":"IJKL","label":"IJKL","value":"IJKL"},{"id":"MNOP","label":"MNOP","value":"MNOP"},{"id":"QRST","label":"QRST","value":"QRST"},{"id":"UVWX","label":"UVWX","value":"UVWX"}],"dropdownType":"multiple"}}}'
          },
          {
               elementType: 'checkbox',
               elementTitle: 'Checkbox1',
               elementJson: '{"type":"checkbox","elementData":{"attributes":{"question":"Checkbox1","answer":[],"required":true,"layout":"vertical","visible":true,"subText":"","choiceList":[{"label":"Choice 1","value":"1","score":1,"selected":false,"$$hashKey":"object:983"},{"label":"Choice 2","value":"2","score":1,"selected":false,"$$hashKey":"object:984"},{"label":"CBValue1","value":"3","selected":false,"score":1,"$$hashKey":"object:985"}],"elementType":"checkbox"}}}'
          },
          {
               elementType: 'dropdown',
               elementTitle: 'Multi Dropdown Inside Section',
               elementJson: '{"type":"dropdown","elementData":{"attributes":{"question":"Multi Dropdown Inside Section","answer":[],"required":true,"visible":true,"subText":"","elementType":"dropdown","itemList":[{"id":"ABCDInside Section","label":"ABCDInside Section","value":"ABCDInside Section"},{"id":"EFGHInside Section","label":"EFGHInside Section","value":"EFGHInside Section"},{"id":"IJKLInside Section","label":"IJKLInside Section","value":"IJKLInside Section"},{"id":"MNOPInside Section","label":"MNOPInside Section","value":"MNOPInside Section"},{"id":"QRSTInside Section","label":"QRSTInside Section","value":"QRSTInside Section"},{"id":"UVWXInside Section","label":"UVWXInside Section","value":"UVWXInside Section"}],"dropdownType":"multiple"}}}'
          },
          {
               elementType: 'checkbox',
               elementTitle: 'CheckboxInsideSection',
               elementJson: '{"type":"checkbox","elementData":{"attributes":{"question":"CheckboxInsideSection","answer":[],"required":true,"layout":"vertical","visible":true,"subText":"","choiceList":[{"label":"Choice 1","value":"1","score":1,"selected":false,"$$hashKey":"object:1033"},{"label":"Choice 2","value":"2","score":1,"selected":false,"$$hashKey":"object:1034"},{"label":"CBValue1InsideSection","value":"3","selected":false,"score":1,"$$hashKey":"object:1035"}],"elementType":"checkbox"}}}'
          },
          {
               elementType: 'dropdown',
               elementTitle: 'Single Dropdown',
               elementJson: '{"type":"dropdown","elementData":{"attributes":{"question":"Single Dropdown","answer":[],"required":true,"visible":true,"subText":"","elementType":"dropdown","itemList":[{"id":"ABCD Single","label":"ABCD Single","value":"ABCD Single"},{"id":"EFGH Signle","label":"EFGH Signle","value":"EFGH Signle"},{"id":"IJKL Signle","label":"IJKL Signle","value":"IJKL Signle"},{"id":"MNOP Single","label":"MNOP Single","value":"MNOP Single"},{"id":"QRST Single","label":"QRST Single","value":"QRST Single"},{"id":"UVWX Single","label":"UVWX Single","value":"UVWX Single"}],"dropdownType":"single"}}}'
          }
     ];
};

const formDesignerPage = new FormDesignerPagePO();
const formArea = new FormAreaComponentPo();
const designerToolbar = new DesignerToolbarComponentPO();
const workflowModal = new WorkflowSettingsModalComponentPo();
const manageFormsPO = new ManageFormsPO(page);



BeforeAll({ timeout: 300 * 1000 }, async () => {
     browser = await chromium.launch({
          headless: false,
          args: ['--window-position=-8,0']
     });
     context = await browser.newContext();
     page = await context.newPage();
     // const protractorConfig = ModuleExports.getFormData();
     userDetails = await newGlobalTenantUtils.getDefaultTenantCredentials();
     const manageFormsPO = new ManageFormsPO(page.locator(('ng2-manage-forms-page')));
     newOnPrepare = new OnPrepare();
     await newOnPrepare.OnStart();
     USER_TOKEN = await CommonNoUIUtils.login(userDetails.adminCreds.email, userDetails.adminCreds.password, true);
     await newOnPrepare.toggleFeatureToggle(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, true, userDetails.orgName, USER_TOKEN)
     await newOnPrepare.toggleFeatureToggle(FEATURE_TOGGLES.RELEASE_NAVIGATION_REDESIGN, true, userDetails.orgName, USER_TOKEN)
     await manageFormsPO.navigateTo();
     await formDesignerPage.navigate();
     await Utils.waitUntilVisible(await formArea.getFormArea());

});

AfterAll({ timeout: 60 * 1000 }, async () => {
     await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, USER_TOKEN);
     await browser.close();
});

Given("Step 1: Should able to change and cancel the workflow settings", { timeout: 60 * 1000 }, async () => {
     await designerToolbar.clickOnWorkFlowSettingsButton();
     await workflowModal.clickAgentCanReviewCheckBox();
     expect(Utils.isSelected(workflowModal.getAgentCanReviewCheckBox())).toBeFalsy();
     await workflowModal.clickCancelButton();
     await workflowModal.clickPopOverNo();
     expect(workflowModal.getModalWrapper().isDisplayed()).toBeTruthy();
     await workflowModal.clickCancelButton();
     await workflowModal.clickPopOverYes();
     await designerToolbar.clickOnWorkFlowSettingsButton();
     expect(workflowModal.getAgentCanReviewCheckBox().isSelected()).toBeTruthy();
 
 });
 When("Step-2: Should able to save the form along with workflow settings", { timeout: 180 * 1000 }, async () => {
     await formArea.dragElementToFormArea('text');
     await designerToolbar.clickOnWorkFlowSettingsButton();
     await workflowModal.clickagentCanRequestReviewCheckbox();
     expect(Utils.isSelected(workflowModal.getAgentCanAcknowledgeCheckbox())).toBeTruthy();
     expect(Utils.isSelected(workflowModal.getagentCanRequestReviewCheckbox())).toBeTruthy();
     expect(Utils.isSelected(workflowModal.getAssignedEvaluatorRadio())).toBeTruthy();
     await workflowModal.clickSaveButton();
     await formDesignerPage.saveFormAsDraft(formNames[1], true);
     await manageFormsPO.navigateTo();
     await manageFormsPO.searchFormInGrid(formNames[1]);
     await manageFormsPO.openParticularForm(formNames[1]);
     await manageFormsPO.waitForSpinnerToDisappear();
     await Utils.waitUntilVisible(formDesignerPage.elements.sectionFormElement);
     await designerToolbar.clickOnWorkFlowSettingsButton();
     expect(Utils.isSelected(workflowModal.getAgentCanAcknowledgeCheckbox())).toBeTruthy();
     expect(Utils.isSelected(workflowModal.getagentCanRequestReviewCheckbox())).toBeTruthy();
     expect(Utils.isSelected(workflowModal.getAssignedEvaluatorRadio())).toBeTruthy();
 });

 Then("STEP-3:Should verify that the workflow settings are maintained when form is duplicated", { timeout: 180 * 1000 }, async () => {
     await manageFormsPO.navigateTo();
     await manageFormsPO.duplicateForm(formNames[1], formNames[2]);
     await manageFormsPO.searchFormInGrid(formNames[2]);
     await manageFormsPO.openParticularForm(formNames[2]);
     await manageFormsPO.waitForSpinnerToDisappear();
     await Utils.waitUntilVisible(formDesignerPage.elements.sectionFormElement);
     await designerToolbar.clickOnWorkFlowSettingsButton();
     await manageFormsPO.waitForSpinnerToDisappear();
     expect(Utils.isSelected(workflowModal.getAgentCanAcknowledgeCheckbox())).toBeTruthy();
     expect(Utils.isSelected(workflowModal.getagentCanRequestReviewCheckbox())).toBeTruthy();
     expect(Utils.isSelected(workflowModal.getAssignedEvaluatorRadio())).toBeTruthy();
 });
 
 Then("STEP-4:Verify that the workflow settings are disabled once the form is activated using Activate button", { timeout: 180 * 1000 }, async () => {
     await manageFormsPO.navigateTo();
     await manageFormsPO.searchFormInGrid(formNames[2]);
     await manageFormsPO.openParticularForm(formNames[2]);
     await manageFormsPO.waitForSpinnerToDisappear();
     await formDesignerPage.saveAndActivateForm();
     await manageFormsPO.waitForSpinnerToDisappear();
     await manageFormsPO.searchFormInGrid(formNames[2]);
     await manageFormsPO.openParticularForm(formNames[2]);
     await designerToolbar.clickOnWorkFlowSettingsButton();
     expect(Utils.isEnabled(workflowModal.getAgentCanAcknowledgeCheckbox())).toBeFalsy();
     expect(Utils.isEnabled(workflowModal.getagentCanRequestReviewCheckbox())).toBeFalsy();
     expect(Utils.isEnabled(workflowModal.getAssignedEvaluatorRadio())).toBeFalsy();;
 });

 Then("STEP-5:Verify that the workflow settings are disabled once the form is activated from more menu", { timeout: 180 * 1000 }, async () => {
     await manageFormsPO.navigateTo();
     await manageFormsPO.activateForm(formNames[1]);
     await manageFormsPO.waitForSpinnerToDisappear();
     await manageFormsPO.searchFormInGrid(formNames[1]);
     expect((await manageFormsPO.getFormRowElements(formNames[1])).status).toEqual('Active');
     await manageFormsPO.searchFormInGrid(formNames[1]);
     await manageFormsPO.openParticularForm(formNames[1]);
     await manageFormsPO.waitForSpinnerToDisappear();
     await Utils.waitUntilVisible(formDesignerPage.elements.sectionFormElement);
     await designerToolbar.clickOnWorkFlowSettingsButton();
     expect(Utils.isEnabled(workflowModal.getAgentCanAcknowledgeCheckbox())).toBeFalsy();
     expect(Utils.isEnabled(workflowModal.getagentCanRequestReviewCheckbox())).toBeFalsy();
     expect(Utils.isEnabled(workflowModal.getAssignedEvaluatorRadio())).toBeFalsy();
 });
 Then("STEP-6:Verify that the workflow settings are disabled for inactivated form", { timeout: 180 * 1000 }, async () => {
     await manageFormsPO.navigateTo();
     await manageFormsPO.deactivateForm(formNames[2]);
     await manageFormsPO.searchFormInGrid(formNames[2]);
     expect((await manageFormsPO.getFormRowElements(formNames[2])).status).toEqual('Inactive');
     await manageFormsPO.openParticularForm(formNames[2]);
     await manageFormsPO.waitForSpinnerToDisappear();
     await Utils.waitUntilVisible(formDesignerPage.elements.sectionFormElement);
     await designerToolbar.clickOnWorkFlowSettingsButton();
     expect(Utils.isEnabled(workflowModal.getAgentCanAcknowledgeCheckbox())).toBeFalsy();
     expect(Utils.isEnabled(workflowModal.getAgentCanAcknowledgeCheckbox())).toBeFalsy();
     expect(Utils.isEnabled(workflowModal.getagentCanRequestReviewCheckbox())).toBeFalsy();
     await workflowModal.clickCancelButton();
 });
