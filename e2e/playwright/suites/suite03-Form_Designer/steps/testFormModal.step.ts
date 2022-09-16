import { Utils } from "../../../../common/utils";
import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
// import { FEATURE_TOGGLES } from '../../../assets/CONSTANTS';
import { CommonNoUIUtils } from "../../../../common/CommonNoUIUtils";
import { GlobalTenantUtils } from "../../../../common/globalTenantUtils";
import {
     
     FEATURE_TOGGLES,
} from "../../../../common/uiConstants";
import { FeatureToggleUtils } from "../../../../common/FeatureToggleUtils";
import { OnPrepare } from "../../../../playwright.config";
import * as moment from "moment";
import * as _ from "lodash";
//po
import { FormAreaComponentPo } from "../../../../pageObjects/FormAreaComponentPO";
import { DesignerToolbarComponentPO } from "../../../../pageObjects/DesignerToolbarComponentPO";
import { TestFormModalComponentPo } from "../../../../pageObjects/TestFormModalComponentPO";
import { ManageFormsPO } from "../../../../pageObjects/ManageFormsPO";
import FormDesignerPagePO from "../../../../pageObjects/FormDesignerPagePO";
//
import { DisableProtUtils } from "../../../../common/disableProtUtil";
import { ModuleExports } from "../../../../common/qmDefaultData";

let browser: any;
let newGlobalTenantUtils = new GlobalTenantUtils();
// let userToken: string;
let userDetails: any = {};
let newOnPrepare: any;
let calibrationPO: any;
let getElementLists: any;
let USER_TOKEN: string;
let page: Page;
let context: BrowserContext;

const formDesignerPage = new FormDesignerPagePO();
const formArea = new FormAreaComponentPo();
const designerToolbar = new DesignerToolbarComponentPO();
const testFormModalPo = new TestFormModalComponentPo();
const manageFormsPO = new ManageFormsPO(page.locator(('#ng2-manage-forms-page')));

let newDisableProtUtils = new DisableProtUtils();

let formNames = [
     'TestForm0_' + moment(),
     'TestForm1_' + + moment()
];

let formDetails: any;

BeforeAll({ timeout: 300 * 1000 }, async () => {
     browser = await chromium.launch({
          headless: false,
          args: ['--window-position=-8,0']
     });
     context = await browser.newContext();
     page = await context.newPage();
     // const protractorConfig = ModuleExports.getFormData();
     userDetails = await newGlobalTenantUtils.getDefaultTenantCredentials();
     
     USER_TOKEN = await CommonNoUIUtils.login(userDetails.adminCreds.email, userDetails.adminCreds.password, true);
     await newOnPrepare.toggleFeatureToggle(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, true, userDetails.orgName, USER_TOKEN)
     await newOnPrepare.toggleFeatureToggle(FEATURE_TOGGLES.RELEASE_NAVIGATION_REDESIGN, true, userDetails.orgName, USER_TOKEN)
});


//! need to ask
AfterAll({ timeout: 60 * 1000 }, async () => {
     await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, USER_TOKEN);
     await browser.close();
});

Given(
     "Step 1: should validate required field and scoring within a section and outside section",
     { timeout: 60 * 1000 },
     async () => {
          formDetails = {
               formName: formNames[0],
               formStatus: 'Draft',
               formType: 'EVALUATION',
               formData: JSON.stringify({ currentScore: 0, themeId: '', formTitle: '', rules: {}, isFormScoringEnabled: true, rulesAssociation: {}, rulesAssociationV2: {}, elements: [{ id: 1063544029989, uuid: '2846136e-fc1d-4c9b-9a99-dc4c25b9e7bd', type: 'text', elementData: { attributes: { visible: true, appliedRuleCount: 0, question: 'Agent Name', fontStyling: { font: 'OpenSans', fontSize: 14, fontColor: '#000000', fontIndent: 'left', bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } }, isScorable: false, answer: '', required: true, prePopulatedHintText: '', showErrorMsg: false, bankId: '11e9d863-f280-a5b0-8228-0242ac110002', questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:14px;color:#000000;">Agent Name</span></strong></p>', numbering: 1, showNumbering: true, showNumberingDot: true } }, $$hashKey: 'object:2562' }, { id: 1083965811226, uuid: '7e3d94c0-19b4-4d71-8ea6-1b20f6ca5004', type: 'textarea', elementData: { attributes: { visible: true, appliedRuleCount: 0, question: 'Agent Address', fontStyling: { font: 'OpenSans', fontSize: 14, fontColor: '#000000', fontIndent: 'left', bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } }, isScorable: false, answer: '', required: true, prePopulatedHintText: '', showErrorMsg: false, subText: '', limitCharacters: true, limitCharactersText: '130', bankId: '11e9d863-f312-8570-8228-0242ac110002', questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:14px;color:#000000;">Agent Address</span></strong></p>', numbering: 2, showNumbering: true, showNumberingDot: true } }, $$hashKey: 'object:2563' }, { id: 1086708736081, uuid: 'acb01575-0fb8-4bf0-8b24-da7c2453763d', type: 'checkbox', elementData: { attributes: { visible: true, question: 'Agent focus area?', fontStyling: { font: 'OpenSans', fontSize: 14, fontColor: '#000000', fontIndent: 'left', bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } }, isScorable: true, appliedRuleCount: 0, elementType: 'checkbox', maxScore: 2, answer: [], required: true, layout: 'vertical', showErrorMsg: false, logic: true, subText: '', choiceList: [{ label: 'Front End', value: '1', criticalQuestionCorrectChoice: true, score: 1, selected: false, $$hashKey: 'object:2622' }, { label: 'Back End', value: '2', criticalQuestionCorrectChoice: true, score: 1, selected: false, $$hashKey: 'object:2623' }], isCritical: false, isScoringEnabledForQuestion: true, bankId: '11e9d863-f4ae-d050-8228-0242ac110002', questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:14px;color:#000000;">Agent focus area?</span></strong></p>', numbering: 3, showNumbering: true, showNumberingDot: true } }, $$hashKey: 'object:2564' }, { id: 1031595323114, uuid: 'ad58af55-5232-464b-a697-8c6f81868ad5', type: 'text', elementData: { attributes: { visible: true, appliedRuleCount: 0, question: 'Reason code', fontStyling: { font: 'OpenSans', fontSize: 14, fontColor: '#000000', fontIndent: 'left', bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } }, isScorable: false, answer: '', required: false, prePopulatedHintText: '', showErrorMsg: false, bankId: '11e9d863-f5a6-ebf0-8228-0242ac110002', questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:14px;color:#000000;">Reason code</span></strong></p>', numbering: 4, showNumbering: true, showNumberingDot: true } }, $$hashKey: 'object:2565' }, { id: 1047609272135, uuid: '399af435-0cfe-4512-9add-1b1ff5f37547', type: 'radio', elementData: { attributes: { visible: true, question: 'Gender', fontStyling: { font: 'OpenSans', fontSize: 14, fontColor: '#000000', fontIndent: 'left', bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } }, isScorable: true, appliedRuleCount: 0, elementType: 'radio', maxScore: 1, answer: '', required: true, layout: 'vertical', showErrorMsg: false, logic: true, subText: '', choiceList: [{ label: 'Male', value: '1', criticalQuestionCorrectChoice: true, score: 1, $$hashKey: 'object:2626' }, { label: 'Female', value: '2', criticalQuestionCorrectChoice: true, score: 1, $$hashKey: 'object:2627' }], isCritical: false, isScoringEnabledForQuestion: true, bankId: '11e9d863-f427-c600-9368-0242ac110007', questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:14px;color:#000000;">Gender</span></strong></p>', numbering: 5, showNumbering: true, showNumberingDot: true } }, $$hashKey: 'object:2566' }, { id: 1058635458547, uuid: 'c91e7518-19b3-4c95-9c90-05db6e3669f5', type: 'yesno', elementData: { attributes: { visible: true, question: 'Passed?', fontStyling: { font: 'OpenSans', fontSize: 14, fontColor: '#000000', fontIndent: 'left', bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } }, isScorable: true, appliedRuleCount: 0, elementType: 'yes/no', maxScore: 1, answer: '', required: true, layout: 'vertical', showErrorMsg: false, logic: true, subText: '', choiceList: [{ label: 'Yes', value: '1', criticalQuestionCorrectChoice: true, score: 1, $$hashKey: 'object:2630' }, { label: 'No', value: '2', criticalQuestionCorrectChoice: true, score: 0, $$hashKey: 'object:2631' }, { label: 'N/A', value: 'na', naElement: true, score: 0, $$hashKey: 'object:2632' }], isCritical: false, isScoringEnabledForQuestion: true, isNAChecked: true, bankId: '11e9d863-f525-38d0-9368-0242ac110007', questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:14px;color:#000000;">Passed?</span></strong></p>', numbering: 6, showNumbering: true, showNumberingDot: true } }, $$hashKey: 'object:2567' }], formMaxScore: 4, percentage: 0, theme: { themeId: '', themeName: '', isDefault: true, themeLogo: '', themeData: { imgWidth: 243, imgHeight: 30, isAspectRatioChecked: true, logoAspectRatio: 8.1, bgColor: '#ffffff', numberingEnabled: true, title: { text: '', font: 'OpenSans', fontSize: 18, fontStyling: { fontColor: '#2e2e2e', italic: { isLabelItalic: false, fontStyle: 'normal' }, bold: { isLabelBold: true, fontWeight: 'bold' }, underline: { isLabelUnderline: false, textDecoration: 'none' } } }, subTitle: { text: '', font: 'OpenSans', fontSize: 14, fontStyling: { fontColor: '#707070', italic: { isLabelItalic: false, fontStyle: 'normal' }, bold: { isLabelBold: false, fontWeight: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } } } } }, ranking: { isRankingEnabled: false, totalCoverage: 101, ranges: [{ from: '0%', to: '50%', coverage: 51, displayText: 'Failed' }, { from: '51%', to: '100%', coverage: 50, displayText: 'Passed' }] }, elementCount: 6, headerFields: [{ id: 1, headerFieldName: 'AgentName', text: 'Agent Name', present: true, selected: true }, { id: 2, headerFieldName: 'InteractionDate', text: 'Interaction Date', present: true, selected: true }, { id: 3, headerFieldName: 'Duration', text: 'Interaction Duration', present: true, selected: true }, { id: 4, headerFieldName: 'StartDate', text: 'Evaluation Start Date', present: true, selected: true }, { id: 5, headerFieldName: 'ReviewDate', text: 'Review Date', present: true, selected: true }], workflowConfigurationId: '11e9d865-7976-3fc0-b36a-0242ac110007' })
          };
          await CommonNoUIUtils.createForm(formDetails, USER_TOKEN);
          await manageFormsPO.navigateTo();
          await manageFormsPO.searchFormInGrid(formNames[0]);
          await manageFormsPO.openParticularForm(formNames[0]);
          await manageFormsPO.waitForSpinnerToDisappear();
          await Utils.waitUntilVisible(formDesignerPage.elements.sectionFormElement);
          await designerToolbar.clickOnTestFormButton();
          const formHeaders = await testFormModalPo.getHeaders();
          expect(formHeaders).toContain('Agent Name:N/A');
          expect(formHeaders).toContain('Interaction Date:N/A');
          expect(formHeaders).toContain('Interaction Duration:N/A');
          expect(formHeaders).toContain('Evaluation Start Date:N/A');
          expect(formHeaders).toContain('Review Date:N/A');
          await testFormModalPo.clickOnValidateButton();
          expect(await testFormModalPo.getErrorMessage('1. Agent Name')).toEqual('This field is required.');
          expect(await testFormModalPo.getErrorMessage('2. Agent Address')).toEqual('This field is required.');
          expect(await testFormModalPo.getErrorMessage('3. Agent focus area?')).toEqual('This field is required.');
          expect(await testFormModalPo.getErrorMessage('5. Gender')).toEqual('This field is required.');
          expect(await testFormModalPo.getErrorMessage('6. Passed?')).toEqual('This field is required.');
          await testFormModalPo.enterShortText('1. Agent Name', 'Agent Name');
          await testFormModalPo.selectChoices('6. Passed?', 0);
          expect(await testFormModalPo.getScore()).toEqual('25.00');
          await testFormModalPo.selectChoices('3. Agent focus area?', 0);
          expect(await testFormModalPo.getScore()).toEqual('50.00');
          await testFormModalPo.selectChoices('5. Gender', 0);
          expect(await testFormModalPo.getScore()).toEqual('75.00');
          await testFormModalPo.enterTextArea('2. Agent Address', 'Address field in the executor form filling with char limit of 130 characto. Checking the max size is should not extends the maximum field.');
          await testFormModalPo.clickOnValidateButton();
          expect(Utils.isPresent(testFormModalPo.getTestFormModal())).toBeFalsy();

     }
);

When("Step-2: should create form with logic", { timeout: 180 * 1000 }, async () => {
     formDetails = {
          formName: formNames[1],
          formStatus: 'Draft',
          formType: 'EVALUATION',
          formId: '',
          workflowType: 'EVALUATIONS',
          formData: JSON.stringify({ formTitle: '', themeId: '', theme: { themeId: '', themeName: '', isDefault: true, themeLogo: '', themeData: { imgWidth: 243, imgHeight: 30, isAspectRatioChecked: true, logoAspectRatio: 8.1, bgColor: '#ffffff', numberingEnabled: true, title: { text: '', font: 'OpenSans', fontSize: 18, fontIndent: 'left', fontStyling: { fontColor: '#2e2e2e', italic: { isLabelItalic: false, fontStyle: 'normal' }, bold: { isLabelBold: true, fontWeight: 'bold' }, underline: { isLabelUnderline: false, textDecoration: 'none' } } }, subTitle: { text: '', font: 'OpenSans', fontSize: 13, fontIndent: 'left', fontStyling: { fontColor: '#707070', italic: { isLabelItalic: false, fontStyle: 'normal' }, bold: { isLabelBold: false, fontWeight: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } } } } }, elementCount: 2, elements: [{ id: 1002311186047, uuid: 'f1dacf5a-6c1b-4e6e-97f8-7206d9f5309c', type: 'yesno', elementData: { attributes: { visible: true, question: 'Set question', isScorable: true, appliedRuleCount: 0, elementType: 'yes/no', maxScore: 1, answer: '', required: false, layout: 'vertical', showErrorMsg: false, logic: true, subText: '', choiceList: [{ label: 'Yes', value: '1', criticalQuestionCorrectChoice: true, score: 1 }, { label: 'No', value: '2', criticalQuestionCorrectChoice: true, score: 0 }], isCritical: false, isScoringEnabledForQuestion: true, questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:13px;color:#000000;">Set question</span></strong></p>', numbering: 1, showNumbering: true, showNumberingDot: true } } }, { id: 1066226264646, uuid: '024bfea2-3a4d-4e7f-88b5-e18348a2e1e5', type: 'yesno', elementData: { attributes: { visible: true, question: 'Set question', isScorable: true, appliedRuleCount: 0, elementType: 'yes/no', maxScore: 1, answer: '', required: false, layout: 'vertical', showErrorMsg: false, logic: true, subText: '', choiceList: [{ label: 'Yes', value: '1', criticalQuestionCorrectChoice: true, score: 1 }, { label: 'No', value: '2', criticalQuestionCorrectChoice: true, score: 0 }], isCritical: false, isScoringEnabledForQuestion: true, questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:13px;color:#000000;">Set question</span></strong></p>', numbering: 2, showNumbering: true, showNumberingDot: true } } }], rules: { 16043426739050: { questionId: 1002311186047, questionUUID: 'f1dacf5a-6c1b-4e6e-97f8-7206d9f5309c', isApplied: false, operationToPerform: 'Hide', resultQuestion: { element: { id: 1066226264646, uuid: '024bfea2-3a4d-4e7f-88b5-e18348a2e1e5', type: 'yesno', elementData: { attributes: { visible: true, question: 'Set question', isScorable: true, appliedRuleCount: 0, elementType: 'yes/no', maxScore: 1, answer: '', required: false, layout: 'vertical', showErrorMsg: false, logic: true, subText: '', choiceList: [{ label: 'Yes', value: '1', criticalQuestionCorrectChoice: true, score: 1 }, { label: 'No', value: '2', criticalQuestionCorrectChoice: true, score: 0 }], isCritical: false, isScoringEnabledForQuestion: true, questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:13px;color:#000000;">Set question</span></strong></p>', numbering: 2, showNumbering: true, showNumberingDot: true } } }, label: '2. Set question' }, conditionList: [{ operation: { label: 'is', value: '===' }, choice: { choice: { label: 'Yes', value: '1', criticalQuestionCorrectChoice: true, score: 1 }, label: 'Yes' } }], ruleExpression: 'element.elementData.attributes.answer === "1" && element.elementData.attributes.answer !== ""' } }, rulesAssociation: { 1066226264646: { rulesToApply: [], rulesForResult: ['16043426739050'] }, 1002311186047: { rulesToApply: ['16043426739050'], rulesForResult: [] } }, headerFields: [], ranking: { isRankingEnabled: false, totalCoverage: 101, ranges: [{ from: '0%', to: '50%', coverage: 51, displayText: 'Failed' }, { from: '51%', to: '100%', coverage: 50, displayText: 'Passed' }] }, formMaxScore: 0, currentScore: 0, percentage: null })
     };
     await CommonNoUIUtils.createForm(formDetails, USER_TOKEN);
     await manageFormsPO.navigateTo();
     await manageFormsPO.searchFormInGrid(formNames[1]);
     await manageFormsPO.openParticularForm(formNames[1]);
     await manageFormsPO.waitForSpinnerToDisappear();
     await Utils.waitUntilVisible(formDesignerPage.elements.sectionFormElement);
     await designerToolbar.clickOnTestFormButton();
     await testFormModalPo.selectChoices('1. Set question', 0);
     expect((await testFormModalPo.getQuestionElement('2. Set question'))).not.toBeDefined();
});

Then("Step-3: should verify froala changes on test form modal", { timeout: 180 * 1000 }, async () => {
     await formDesignerPage.navigate();
     await Utils.waitUntilVisible(await formArea.getFormArea());
     await formArea.dragElementToFormArea('yesno');
     await formArea.froalaSetFontColor('1. Set question', 'yesno', '#B8312F');
     await formArea.froalaSetBold('1. Set question', 'yesno');
     await formArea.froalaSetItalic('1. Set question', 'yesno');
     await formArea.froalaSetUnderLine('1. Set question', 'yesno');
     await formArea.froalaSetFontSize('1. Set question', 'yesno', '30');
     await formArea.froalaSetFontFamily('1. Set question', 'yesno', 'Impact');
     await formArea.froalaSetFontAlignment('1. Set question', 'yesno', 'Align Right');
     await designerToolbar.clickOnTestFormButton();
     let cssProperties = await testFormModalPo.getElementCssProperties('1. Set question');
     expect(cssProperties.alignment).toEqual('right');
     expect(cssProperties.fontFamily).toContain('Impact');
     expect(cssProperties.fontSize).toEqual('30px');
     expect(cssProperties.color).toEqual('rgba(184, 49, 47, 1)');
     expect(cssProperties.isBold).toBeFalsy();
     expect(cssProperties.isItalic).toBeTruthy();
     expect(cssProperties.isUnderlined).toBeTruthy();

});