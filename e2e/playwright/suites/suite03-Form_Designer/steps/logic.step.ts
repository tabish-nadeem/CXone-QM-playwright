import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
import { FormAreaComponentPo } from '../../../../pageObjects/FormAreaComponentPO';
import { CreateEditRuleModalComponentPo } from '../../../../pageObjects/CreateEditRuleModalComponentPO';
import { ElementAttributesComponentPo } from '../../../../pageObjects/ElementAttributesComponentPO';
import  FormDesignerPagePO  from '../../../../pageObjects/FormDesignerPagePO';
import { OnPrepare } from '../../../../playwright.config';
import { LoginPage } from "../../../../common/login";
import { GlobalTenantUtils } from '../../../../common/globalTenantUtils';
import { ManageFormsPO } from '../../../../pageObjects/ManageFormsPO';
import moment from 'moment';
import { CommonNoUIUtils } from "../../../../common/CommonNoUIUtils";
import { FeatureToggleUtils } from "../../../../common/FeatureToggleUtils";
import { FEATURE_TOGGLES } from "../../../../common/uiConstants";
import { CommonQMNoUIUtils } from "../../../../common/CommonQMNoUIUtils";
import {Utils} from "../../../../common/utils";


let page: Page;
let browser: any;
let context: BrowserContext;
let newOnPrepare:any;
let loginPage:any;
let userDetails:any;
let userToken:any;
let newGlobalTenantUtils:any;
let login:LoginPage
let formDetails: { formName: any; formStatus: any; formType: any; formData: any; formId?: string ; workflowConfigType?: any; dispute_resoluter?: any; };


const formDesignerPage = new FormDesignerPagePO();
const formArea = new FormAreaComponentPo();
const createEditRuleModal = new CreateEditRuleModalComponentPo();
const elementAttributes = new ElementAttributesComponentPo();
let manageFormsPO = new ManageFormsPO(page.locator('#ng2-manage-forms-page'));
newGlobalTenantUtils = new GlobalTenantUtils();

const formNames = [
    'FormForRuleCheck' + moment(),
    'Logic_form_1' + moment(),
    'Logic_form_2' + moment(),
    'Logic_form_3' + moment(),
    'Logic_form_4' + moment(),
    'Logic_form_5' + moment(),
    'Logic_form_6' + moment(),
    'Logic_form_7' + moment(),
    'Logic_form_8' + moment()
];
let formName1 = 'logicProtForm_1';
 
formDetails = {
    formName: formName1,
    formStatus: 'Published',
    formType: 'EVALUATION',
    formData: JSON.stringify({ formTitle: '', themeId: '', theme: { themeId: '', themeName: '', isDefault: true, themeLogo: '', themeData: { imgWidth: 243, imgHeight: 30, isAspectRatioChecked: true, logoAspectRatio: 8.1, bgColor: '#ffffff', numberingEnabled: true, title: { text: '', font: 'OpenSans', fontSize: 18, fontIndent: 'left', fontStyling: { fontColor: '#2e2e2e', italic: { isLabelItalic: false, fontStyle: 'normal' }, bold: { isLabelBold: true, fontWeight: 'bold' }, underline: { isLabelUnderline: false, textDecoration: 'none' } } }, subTitle: { text: '', font: 'OpenSans', fontSize: 13, fontIndent: 'left', fontStyling: { fontColor: '#707070', italic: { isLabelItalic: false, fontStyle: 'normal' }, bold: { isLabelBold: false, fontWeight: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } } } } }, elementCount: 11, elements: [{ id: 1007671790468, uuid: '950544e6-a75f-4e05-a73b-44e344610cfc', type: 'section', elementData: { sectionElementData: [], attributes: { isScorable: false, question: 'Set Title', backgroundColor: '#ffffff', visible: true, appliedRuleCount: 0, questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:18px;color:#5b788e;">Set Title</span><strong></p>', numbering: 1, showNumbering: true, showNumberingDot: true } } }, { id: 1002534595182, uuid: 'fef28647-7f1d-4183-8d4e-fb93d6216fcb', type: 'yesno', elementData: { attributes: { visible: true, question: 'Set question', isScorable: true, appliedRuleCount: 0, elementType: 'yes/no', maxScore: 1, answer: '', required: false, layout: 'vertical', showErrorMsg: false, logic: true, subText: '', choiceList: [{ label: 'Yes', value: '1', criticalQuestionCorrectChoice: true, score: 1 }, { label: 'No', value: '2', criticalQuestionCorrectChoice: true, score: 0 }], isCritical: false, isScoringEnabledForQuestion: true, questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:13px;color:#000000;">Set question</span></strong></p>', numbering: 2, showNumbering: true, showNumberingDot: true } } }, { id: 1032685724194, uuid: 'ed4e342a-455b-4c9b-a8fa-b4c863f2e5de', type: 'radio', elementData: { attributes: { visible: true, question: 'Set question', isScorable: true, appliedRuleCount: 0, elementType: 'radio', maxScore: 1, answer: '', required: false, layout: 'vertical', showErrorMsg: false, logic: true, subText: '', choiceList: [{ label: 'Choice 1', value: '1', criticalQuestionCorrectChoice: true, score: 1 }, { label: 'Choice 2', value: '2', criticalQuestionCorrectChoice: true, score: 1 }], isCritical: false, isScoringEnabledForQuestion: true, questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:13px;color:#000000;">Set question</span></strong></p>', numbering: 3, showNumbering: true, showNumberingDot: true } } }, { id: 1085066169482, uuid: 'b14f1806-464c-4e44-b06e-19315f2aed3e', type: 'checkbox', elementData: { attributes: { visible: true, question: 'Set question', isScorable: true, appliedRuleCount: 0, elementType: 'checkbox', maxScore: 2, answer: [], required: false, layout: 'vertical', showErrorMsg: false, logic: true, subText: '', choiceList: [{ label: 'Choice 1', value: '1', criticalQuestionCorrectChoice: true, score: 1, selected: false }, { label: 'Choice 2', value: '2', criticalQuestionCorrectChoice: true, score: 1, selected: false }], isCritical: false, isScoringEnabledForQuestion: true, questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:13px;color:#000000;">Set question</span></strong></p>', numbering: 4, showNumbering: true, showNumberingDot: true } } }, { id: 1056164074881, uuid: 'd31d4884-d8aa-4da5-a008-a75fccb4628d', type: 'datetime', elementData: { attributes: { visible: true, appliedRuleCount: 0, logic: true, dateAttributes: { elementType: 'date', question: 'Set question', visible: true, required: false, showErrorMsg: false, subText: '', isScorable: false, answer: 1603655990000, useCurrentDate: false, dateFormats: ['dd-MMM-yyyy', 'MMM-dd-yyyy', 'yyyy-MMM-dd'], dateFormat: 'dd-MMM-yyyy', questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:13px;color:#000000;">Set question</span></strong></p>' }, timeAttributes: { elementType: 'time', question: 'Set question', visible: false, required: false, showErrorMsg: false, subText: '', isScorable: false, answer: 1603655990000, useCurrentTime: false, timeFormats: ['12H', '24H'], questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:13px;color:#000000;">Set question</span></strong></p>' }, numbering: 5, showNumbering: true, showNumberingDot: true } } }, { id: 1078720878664, uuid: '26c47612-97fd-4374-b9db-58d0711de170', type: 'dropdown', elementData: { attributes: { visible: true, question: 'Set question', isScorable: false, appliedRuleCount: 0, elementType: 'dropdown', answer: [], required: false, showErrorMsg: false, logic: true, subText: '', dropdownType: 'single', itemList: [{ id: 'Choice 1', label: 'Choice 1', value: 'Choice 1' }, { id: 'Choice 2', label: 'Choice 2', value: 'Choice 2' }], questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:13px;color:#000000;">Set question</span></strong></p>', numbering: 6, showNumbering: true, showNumberingDot: true } } }, { id: 1077330334758, uuid: '54925390-4cba-4ea4-ab87-7a52fca63316', type: 'hyperlink', elementData: { attributes: { visible: true, appliedRuleCount: 0, question: 'Enter Text', isScorable: false, url: 'http://', questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:13px;color:#007cbe;">Enter Text</span></strong></p>' } } }, { id: 1061672146352, uuid: 'e0378a06-3c85-400a-9f44-10e4f1e01584', type: 'label', elementData: { attributes: { visible: true, appliedRuleCount: 0, question: 'Set Title', isScorable: false, questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:13px;color:#000000;">Set Title</span></strong></p>' } } }, { id: 1045840485910, uuid: '4b168e87-caa7-46f7-8f5a-acbf55e1ed89', type: 'text', elementData: { attributes: { visible: true, appliedRuleCount: 0, question: 'Set question', isScorable: false, answer: '', required: false, prePopulatedHintText: '', showErrorMsg: false, questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:13px;color:#000000;">Set question</span></strong></p>', numbering: 7, showNumbering: true, showNumberingDot: true } } }, { id: 1079146084996, uuid: 'f49b2265-ff40-41bf-8b38-52171bfeb5b9', type: 'textarea', elementData: { attributes: { visible: true, appliedRuleCount: 0, question: 'Set question', isScorable: false, answer: '', required: false, prePopulatedHintText: '', showErrorMsg: false, subText: '', limitCharacters: false, limitCharactersText: 250, questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:13px;color:#000000;">Set question</span></strong></p>', numbering: 8, showNumbering: true, showNumberingDot: true } } }, { id: 1079659574704, uuid: '6bd0d30c-145c-43ea-830f-2ece0e81697d', type: 'yesno', elementData: { attributes: { visible: true, question: 'Set question', isScorable: true, appliedRuleCount: 0, elementType: 'yes/no', maxScore: 1, answer: '', required: false, layout: 'vertical', showErrorMsg: false, logic: true, subText: '', choiceList: [{ label: 'Yes', value: '1', criticalQuestionCorrectChoice: true, score: 1 }, { label: 'No', value: '2', criticalQuestionCorrectChoice: true, score: 0 }], isCritical: false, isScoringEnabledForQuestion: true, questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:13px;color:#000000;">Set question</span></strong></p>', numbering: 9, showNumbering: true, showNumberingDot: true } } }], rules: {}, rulesAssociation: {}, headerFields: [], ranking: { isRankingEnabled: false, totalCoverage: 101, ranges: [{ from: '0%', to: '50%', coverage: 51, displayText: 'Failed' }, { from: '51%', to: '100%', coverage: 50, displayText: 'Passed' }] }, formMaxScore: 0, currentScore: 0, percentage: null })
};

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

    userDetails = newGlobalTenantUtils.getDefaultTenantCredentials();
    userToken = await CommonNoUIUtils.login(userDetails.adminCreds.email, userDetails.adminCreds.password,true);
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.RELEASE_NAVIGATION_REDESIGN, userDetails.orgName, userToken);
});

AfterAll({ timeout: 60 * 1000 }, async () => {
    
    await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);
    await loginPage.logout(true, 120000, userDetails.orgName, userToken);
   
});

Given("Step-1: Logic icon should be visible for radio,yesNo,checkbox, dropdown with choices and DateTime elements only", { timeout: 60 * 1000 }, async () => {


   
    await CommonQMNoUIUtils.createForm(formDetails, userToken);
    await manageFormsPO.navigateTo();
    await manageFormsPO.searchFormInGrid(formName1);
    await manageFormsPO.openParticularForm(formName1);
    await manageFormsPO.waitForSpinnerToDisappear();
    await page.waitForSelector(formDesignerPage.elements.sectionFormElement);
    await formArea.clickElementOnFormArea('1. Set Title', 'section');
    expect(Utils.isPresent(await formArea.getAddRulesIcon('1. Set Title', 'section'))).toBeFalsy();
    await formArea.clickElementOnFormArea('2. Set question', 'yesno');
    expect(Utils.isPresent(await formArea.getAddRulesIcon('2. Set question', 'yesno'))).toBeTruthy();
    await formArea.clickElementOnFormArea('3. Set question', 'radio');
    expect(Utils.isPresent(await formArea.getAddRulesIcon('3. Set question', 'radio'))).toBeTruthy();
    await formArea.clickElementOnFormArea('4. Set question', 'checkbox');
    expect(Utils.isPresent(await formArea.getAddRulesIcon('4. Set question', 'checkbox'))).toBeTruthy();
    await formArea.clickElementOnFormArea('5. Set question', 'datetime');
    expect(Utils.isPresent(await formArea.getAddRulesIcon('5. Set question', 'datetime'))).toBeTruthy();
    await formArea.clickElementOnFormArea('6. Set question', 'dropdown');
    expect(Utils.isPresent(await formArea.getAddRulesIcon('6. Set question', 'dropdown'))).toBeTruthy();
    await formArea.clickElementOnFormArea('Enter Text', 'hyperlink');
    expect(Utils.isPresent(await formArea.getAddRulesIcon('Enter Text', 'hyperlink'))).toBeFalsy();
    await formArea.clickElementOnFormArea('Set Title', 'label');
    expect(Utils.isPresent(await formArea.getAddRulesIcon('Set Title', 'label'))).toBeFalsy();
    await formArea.clickElementOnFormArea('7. Set question', 'text');
    expect(Utils.isPresent(await formArea.getAddRulesIcon('7. Set question', 'text'))).toBeFalsy();
    await formArea.clickElementOnFormArea('8. Set question', 'textArea');
    expect(Utils.isPresent(await formArea.getAddRulesIcon('8. Set question', 'textArea'))).toBeFalsy();
    await formArea.clickElementOnFormArea('9. Set question', 'yesno');
    expect(Utils.isPresent(await formArea.getAddRulesIcon('9. Set question', 'yesno'))).toBeFalsy();

});

When("Step-2: Add rule button should not be visible if there is only one element in the form body", { timeout: 60 * 1000 }, async () => {

    await formDesignerPage.navigate();
    await page.waitForSelector(await formArea.getFormArea());
    await formArea.dragElementToFormArea('yesno');
    expect(Utils.isPresent(await formArea.getAddRulesIcon('1. Set question', 'yesno'))).toBeFalsy();
});

Then("Step-3: add rule to question in a published form and verify if the rules can be deleted", { timeout: 60 * 1000 }, async () => {

    let formDetails = {
        formName: formNames[1],
        formStatus: 'Published',
        formType: 'EVALUATION',
        formData: JSON.stringify({ formTitle: '', elements: [{ id: 1036010157057, uuid: 'd8ed55e2-ebc5-44fe-b8f2-f3ad0a9ffac3', type: 'label', elementData: { attributes: { isScorable: false, question: 'Label1', fontStyling: { font: 'OpenSans', fontSize: 14, fontColor: '#000000', fontIndent: 'left', bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } }, visible: true, appliedRuleCount: 0, questionHTML: 'PHA+PHN0cm9uZz5MYWJlbDE8L3N0cm9uZz48L3A+' } }, $$hashKey: 'object:782' }, { id: 1080902954940, uuid: '8912e43d-244f-4afc-b956-ec3f5658dacb', type: 'radio', elementData: { attributes: { elementType: 'radio', maxScore: 1, isScorable: true, isScoringEnabledForQuestion: true, question: 'Radio1', answer: '', layout: 'vertical', required: false, showErrorMsg: false, fontStyling: { font: 'OpenSans', fontSize: 14, fontColor: '#000000', fontIndent: 'left', bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } }, visible: true, appliedRuleCount: 0, logic: true, isCritical: false, subText: '', choiceList: [{ label: 'Choice 1', value: '1', criticalQuestionCorrectChoice: true, score: 1, $$hashKey: 'object:975' }, { label: 'Choice 2', value: '2', criticalQuestionCorrectChoice: true, score: 1, $$hashKey: 'object:976' }], questionHTML: 'PHA+PHN0cm9uZz5SYWRpbzE8L3N0cm9uZz48L3A+', numbering: 1, showNumbering: true, showNumberingDot: true } }, $$hashKey: 'object:961' }, { id: 1063146551078, uuid: '74e7867f-90a3-4e93-80c0-1c8ee735aec7', type: 'yesno', elementData: { attributes: { elementType: 'yes/no', maxScore: 1, question: 'YesNo1', answer: '', required: false, layout: 'vertical', showErrorMsg: false, fontStyling: { font: 'OpenSans', fontSize: 14, fontColor: '#000000', fontIndent: 'left', bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } }, visible: true, appliedRuleCount: 0, logic: true, subText: '', choiceList: [{ label: 'Yes', value: '1', criticalQuestionCorrectChoice: true, score: 1, $$hashKey: 'object:1101' }, { label: 'No', value: '2', criticalQuestionCorrectChoice: true, score: 0, $$hashKey: 'object:1102' }], isScorable: true, isCritical: false, isScoringEnabledForQuestion: true, questionHTML: 'PHA+PHN0cm9uZz5ZZXNObzE8L3N0cm9uZz48L3A+', numbering: 2, showNumbering: true, showNumberingDot: true } }, $$hashKey: 'object:1084' }, { id: 1001403936317, uuid: '621e1b99-5181-4ee2-9bf8-8b13320a3cb4', type: 'radio', elementData: { attributes: { elementType: 'radio', maxScore: 1, isScorable: true, isScoringEnabledForQuestion: true, question: 'Radio2', answer: '', layout: 'vertical', required: false, showErrorMsg: false, fontStyling: { font: 'OpenSans', fontSize: 14, fontColor: '#000000', fontIndent: 'left', bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } }, visible: true, appliedRuleCount: 0, logic: true, isCritical: false, subText: '', choiceList: [{ label: 'Choice 1', value: '1', criticalQuestionCorrectChoice: true, score: 1, $$hashKey: 'object:1223' }, { label: 'Choice 2', value: '2', criticalQuestionCorrectChoice: true, score: 1, $$hashKey: 'object:1224' }], questionHTML: 'PHA+PHN0cm9uZz5SYWRpbzI8L3N0cm9uZz48L3A+', numbering: 3, showNumbering: true, showNumberingDot: true } }, $$hashKey: 'object:1206' }], theme: { themeId: '', themeName: '', isDefault: true, themeLogo: '', themeData: { imgWidth: 243, imgHeight: 30, isAspectRatioChecked: true, logoAspectRatio: 8.1, bgColor: '#ffffff', numberingEnabled: true, title: { text: '', font: 'OpenSans', fontSize: 18, fontStyling: { fontColor: '#2e2e2e', italic: { isLabelItalic: false, fontStyle: 'normal' }, bold: { isLabelBold: true, fontWeight: 'bold' }, underline: { isLabelUnderline: false, textDecoration: 'none' } } }, subTitle: { text: '', font: 'OpenSans', fontSize: 14, fontStyling: { fontColor: '#707070', italic: { isLabelItalic: false, fontStyle: 'normal' }, bold: { isLabelBold: false, fontWeight: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } } } } }, ranking: { isRankingEnabled: false, totalCoverage: 101, ranges: [{ from: '0%', to: '50%', coverage: 51, displayText: 'Failed' }, { from: '51%', to: '100%', coverage: 50, displayText: 'Passed' }] }, themeId: '', elementCount: 4, rules: {}, rulesAssociation: {}, rulesAssociationV2: {}, headerFields: [], formMaxScore: 0, currentScore: 0, percentage: null })
    };
    await CommonQMNoUIUtils.createForm(formDetails, userToken);
    await manageFormsPO.navigateToWithWarningModal();
    await manageFormsPO.searchFormInGrid(formNames[1]);
    await manageFormsPO.openParticularForm(formNames[1]);
    await manageFormsPO.waitForSpinnerToDisappear();
    await page.waitForSelector(formDesignerPage.elements.sectionFormElement);
    await formArea.clickElementOnFormArea('2. YesNo1', 'yesno');
    await formArea.clickAddRulesIcon('2. YesNo1', 'yesno');
    let responseTextOne = await createEditRuleModal.getQuestionText();
    console.log('Question Text ', responseTextOne);
    expect(responseTextOne).toEqual('YesNo1');
    let yesnoRule1Element = await createEditRuleModal.getARuleElementByIndex(0);
    await createEditRuleModal.setConditionDropdown(yesnoRule1Element, 0, 'is');
    await createEditRuleModal.addConditionRow(yesnoRule1Element, 0);
    await createEditRuleModal.setConditionDropdown(yesnoRule1Element, 1, 'is not');
    await createEditRuleModal.setChoiceDropdown(yesnoRule1Element, 1, 'Yes');
    await createEditRuleModal.setHideQuestionsDropdown(yesnoRule1Element, '3. Radio2');
    await createEditRuleModal.clickSetBtn();
    await elementAttributes.clickLogicAttributesSection();
    let responseTextTwo = await elementAttributes.logicPropertiesAttributes.getARuleDescription(0);
    console.log('Rule Description Text ', responseTextTwo);
    expect(responseTextTwo).toEqual('If selectionisYesANDis notYesthenHide 3. Radio2');
    await formArea.getAddRulesIcon('2. YesNo1', 'yesno');
    await formDesignerPage.saveAPublishedForm();
    await manageFormsPO.navigateTo();
    await manageFormsPO.searchFormInGrid(formNames[1]);
    await manageFormsPO.openParticularForm(formNames[1]);
    await manageFormsPO.waitForSpinnerToDisappear();
    await page.waitForSelector(formDesignerPage.elements.sectionFormElement);
    await elementAttributes.clickLogicAttributesSection();
    await formArea.clickElementOnFormArea('2. YesNo1', 'yesno');
    await elementAttributes.logicPropertiesAttributes.clickARuleDeleteButton(0);
    let count = (await elementAttributes.logicPropertiesAttributes.getAllLogicRuleSections()).length;
    console.log('Logic rule sections count', count);
    expect(count).toEqual(0);

});

Then("Step-4: edit rule applied to a question", { timeout: 60 * 1000 }, async () => {

    let formDetails = {
        formName: formNames[2],
        formStatus: 'Draft',
        formType: 'EVALUATION',
        formData: JSON.stringify({ formTitle: '', elements: [{ elementData: { attributes: { isScorable: false, visible: true, question: 'Label1', fontStyling: { underline: { isLabelUnderline: 'false', textDecoration: 'none' }, fontIndent: 'left', fontSize: '14', bold: { isLabelBold: 'true', fontWeight: 'bold' }, italic: { isLabelItalic: 'false', fontStyle: 'normal' }, fontColor: '#000000', font: 'OpenSans' }, questionHTML: 'PHAgc3R5bGU9InRleHQtYWxpZ246bGVmdDsiPjxzdHJvbmc+PHNwYW4gc3R5bGU9ImZvbnQtZmFtaWx5Ok9wZW5TYW5zO2NvbG9yOiMwMDAwMDA7Zm9udC1zaXplOjE0cHg7Ij5MYWJlbDE8L3NwYW4+PC9zdHJvbmc+PC9wPg==', appliedRuleCount: 0 } }, id: 1008655506364, uuid: '8b1584b3-fc91-4a28-a864-b5f2e0ebb0b6', type: 'label', $$hashKey: 'object:895' }, { elementData: { attributes: { numbering: 1, showNumbering: true, visible: true, question: 'Checkbox1', isScoringEnabledForQuestion: true, fontStyling: { underline: { isLabelUnderline: 'false', textDecoration: 'none' }, fontIndent: 'left', fontSize: '14', bold: { isLabelBold: 'true', fontWeight: 'bold' }, italic: { isLabelItalic: 'false', fontStyle: 'normal' }, fontColor: '#000000', font: 'OpenSans' }, questionHTML: 'PHAgc3R5bGU9InRleHQtYWxpZ246bGVmdDsiPjxzdHJvbmc+PHNwYW4gc3R5bGU9ImZvbnQtZmFtaWx5Ok9wZW5TYW5zO2NvbG9yOiMwMDAwMDA7Zm9udC1zaXplOjE0cHg7Ij5DaGVja2JveDE8L3NwYW4+PC9zdHJvbmc+PC9wPg==', maxScore: 2, showNumberingDot: true, subText: '', required: false, layout: 'vertical', isScorable: true, answer: [], choiceList: [{ score: 1, criticalQuestionCorrectChoice: true, label: 'Choice 1', $$hashKey: 'object:951', value: '1', selected: false }, { score: 1, criticalQuestionCorrectChoice: true, label: 'Choice 2', $$hashKey: 'object:952', value: '2', selected: false }], showErrorMsg: false, isCritical: false, appliedRuleCount: 0, logic: true, elementType: 'checkbox' } }, id: 1029055047527, uuid: 'e80ac5f7-da28-457e-8c55-a6e9ba52749a', type: 'checkbox', $$hashKey: 'object:937' }, { elementData: { attributes: { numbering: 2, showNumbering: true, visible: true, question: 'Radio1', isScoringEnabledForQuestion: true, fontStyling: { underline: { isLabelUnderline: 'false', textDecoration: 'none' }, fontIndent: 'left', fontSize: '14', bold: { isLabelBold: 'true', fontWeight: 'bold' }, italic: { isLabelItalic: 'false', fontStyle: 'normal' }, fontColor: '#000000', font: 'OpenSans' }, questionHTML: 'PHAgc3R5bGU9InRleHQtYWxpZ246bGVmdDsiPjxzdHJvbmc+PHNwYW4gc3R5bGU9ImZvbnQtZmFtaWx5Ok9wZW5TYW5zO2NvbG9yOiMwMDAwMDA7Zm9udC1zaXplOjE0cHg7Ij5SYWRpbzE8L3NwYW4+PC9zdHJvbmc+PC9wPg==', maxScore: 1, showNumberingDot: true, subText: '', required: false, layout: 'vertical', isScorable: true, answer: '', choiceList: [{ score: 1, criticalQuestionCorrectChoice: true, label: 'Choice 1', $$hashKey: 'object:985', value: '1' }, { score: 1, criticalQuestionCorrectChoice: true, label: 'Choice 2', $$hashKey: 'object:986', value: '2' }], showErrorMsg: false, isCritical: false, appliedRuleCount: 0, logic: true, elementType: 'radio' } }, id: 1029026566585, uuid: '315f9334-ea27-404a-bdef-0a1af2f6f5e9', type: 'radio', $$hashKey: 'object:977' }, { elementData: { attributes: { numbering: 3, showNumbering: true, visible: true, question: 'YesNo1', isScoringEnabledForQuestion: true, fontStyling: { underline: { isLabelUnderline: 'false', textDecoration: 'none' }, fontIndent: 'left', fontSize: '14', bold: { isLabelBold: 'true', fontWeight: 'bold' }, italic: { isLabelItalic: 'false', fontStyle: 'normal' }, fontColor: '#000000', font: 'OpenSans' }, questionHTML: 'PHAgc3R5bGU9InRleHQtYWxpZ246bGVmdDsiPjxzdHJvbmc+PHNwYW4gc3R5bGU9ImZvbnQtZmFtaWx5Ok9wZW5TYW5zO2NvbG9yOiMwMDAwMDA7Zm9udC1zaXplOjE0cHg7Ij5ZZXNObzE8L3NwYW4+PC9zdHJvbmc+PC9wPg==', maxScore: 1, showNumberingDot: true, subText: '', required: false, layout: 'vertical', isScorable: true, answer: '', choiceList: [{ score: 1, criticalQuestionCorrectChoice: true, label: 'Yes', $$hashKey: 'object:1009', value: '1' }, { score: 0, criticalQuestionCorrectChoice: true, label: 'No', $$hashKey: 'object:1010', value: '2' }], showErrorMsg: false, isCritical: false, appliedRuleCount: 0, logic: true, elementType: 'yes/no' } }, id: 1078297145155, uuid: '2ec9caf5-e9dd-4107-b31f-28093203c7ed', type: 'yesno', $$hashKey: 'object:1001' }, { elementData: { attributes: { numbering: 4, showNumbering: true, visible: true, question: 'Radio2', isScoringEnabledForQuestion: true, fontStyling: { underline: { isLabelUnderline: 'false', textDecoration: 'none' }, fontIndent: 'left', fontSize: '14', bold: { isLabelBold: 'true', fontWeight: 'bold' }, italic: { isLabelItalic: 'false', fontStyle: 'normal' }, fontColor: '#000000', font: 'OpenSans' }, questionHTML: 'PHAgc3R5bGU9InRleHQtYWxpZ246bGVmdDsiPjxzdHJvbmc+PHNwYW4gc3R5bGU9ImZvbnQtZmFtaWx5Ok9wZW5TYW5zO2NvbG9yOiMwMDAwMDA7Zm9udC1zaXplOjE0cHg7Ij5SYWRpbzI8L3NwYW4+PC9zdHJvbmc+PC9wPg==', maxScore: 1, showNumberingDot: true, subText: '', required: false, layout: 'vertical', isScorable: true, answer: '', choiceList: [{ score: 1, criticalQuestionCorrectChoice: true, label: 'Choice 1', $$hashKey: 'object:1029', value: '1' }, { score: 1, criticalQuestionCorrectChoice: true, label: 'Choice 2', $$hashKey: 'object:1030', value: '2' }], showErrorMsg: false, isCritical: false, appliedRuleCount: 0, logic: true, elementType: 'radio' } }, id: 1035464477757, uuid: 'd3dbfbb2-7721-47fa-9eb6-1220f2942203', type: 'radio', $$hashKey: 'object:1021' }], theme: { themeLogo: '', themeName: '', isDefault: true, themeData: { imgWidth: 243, logoAspectRatio: 8.1, bgColor: '#ffffff', subTitle: { fontStyling: { underline: { isLabelUnderline: false, textDecoration: 'none' }, bold: { isLabelBold: false, fontWeight: 'normal' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, fontColor: '#707070' }, fontSize: 14, text: '', font: 'OpenSans' }, isAspectRatioChecked: true, imgHeight: 30, numberingEnabled: true, title: { fontStyling: { underline: { isLabelUnderline: false, textDecoration: 'none' }, bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, fontColor: '#2e2e2e' }, fontSize: 18, text: '', font: 'OpenSans' } }, themeId: '' }, ranking: { totalCoverage: 101, ranges: [{ coverage: 51, displayText: 'Failed', from: '0%', to: '50%' }, { coverage: 50, displayText: 'Passed', from: '51%', to: '100%' }], isRankingEnabled: false }, currentScore: 0, themeId: '', rules: {}, rulesAssociation: {}, rulesAssociationV2: {}, formMaxScore: 0, percentage: null, elementCount: 5, headerFields: [], workflowConfigurationId: '' })
    };
    await CommonQMNoUIUtils.createForm(formDetails, userToken);
    await manageFormsPO.navigateToWithWarningModal();
    await manageFormsPO.searchFormInGrid(formNames[2]);
    await manageFormsPO.openParticularForm(formNames[2]);
    await manageFormsPO.waitForSpinnerToDisappear();
    await page.waitForSelector(formDesignerPage.elements.sectionFormElement);
    await formArea.clickElementOnFormArea('3. YesNo1', 'yesno');
    await elementAttributes.clickLogicAttributesSection();
    await elementAttributes.logicPropertiesAttributes.clickAddRuleButton();
    expect(await createEditRuleModal.getQuestionText()).toEqual('YesNo1');
    let yesnoRule1Element = await createEditRuleModal.getARuleElementByIndex(0);
    await createEditRuleModal.setConditionDropdown(yesnoRule1Element, 0, 'is');
    await createEditRuleModal.addConditionRow(yesnoRule1Element, 0);
    await createEditRuleModal.setConditionDropdown(yesnoRule1Element, 1, 'is not');
    await createEditRuleModal.setChoiceDropdown(yesnoRule1Element, 1, 'Yes');
    await createEditRuleModal.setHideQuestionsDropdown(yesnoRule1Element, '4. Radio2');
    await createEditRuleModal.clickSetBtn();
    expect(await elementAttributes.logicPropertiesAttributes.getARuleDescription(0)).toEqual('If selectionisYesANDis notYesthenHide 4. Radio2');
    await formArea.clickElementOnFormArea('1. Checkbox1', 'checkbox');
    await formArea.clickAddRulesIcon('1. Checkbox1', 'checkbox');
    await createEditRuleModal.addARule(0);
    expect((await createEditRuleModal.getAllRuleElements()).length).toEqual(2);
    await createEditRuleModal.clickSetBtn();
    expect(await elementAttributes.logicPropertiesAttributes.getARuleDescription(0)).toEqual('If selectionisChoice 1thenHide 2. Radio1');
    expect(await elementAttributes.logicPropertiesAttributes.getARuleDescription(1)).toEqual('If selectionisChoice 1thenHide 2. Radio1');

});

Then("Step-5: add rule to a question and then delete that element from form area so rule associated with it will also get deleted", { timeout: 60 * 1000 }, async () => {

    let formDetails = {
        formName: formNames[4],
        formStatus: 'Draft',
        formType: 'EVALUATION',
        formData: JSON.stringify({ currentScore: 0, themeId: '', formTitle: '', rules: {}, rulesAssociation: {}, rulesAssociationV2: {}, elements: [{ elementData: { attributes: { isScorable: false, visible: true, question: 'Label1', fontStyling: { underline: { isLabelUnderline: 'false', textDecoration: 'none' }, fontIndent: 'left', fontSize: '14', bold: { isLabelBold: 'true', fontWeight: 'bold' }, italic: { isLabelItalic: 'false', fontStyle: 'normal' }, fontColor: '#000000', font: 'OpenSans' }, questionHTML: 'PHAgc3R5bGU9InRleHQtYWxpZ246bGVmdDsiPjxzdHJvbmc+PHNwYW4gc3R5bGU9ImZvbnQtZmFtaWx5Ok9wZW5TYW5zO2NvbG9yOiMwMDAwMDA7Zm9udC1zaXplOjE0cHg7Ij5MYWJlbDE8L3NwYW4+PC9zdHJvbmc+PC9wPg==', appliedRuleCount: 0 } }, id: 1019191622599, uuid: 'af7f92ff-7796-43de-aaeb-0031ca16016e', type: 'label', $$hashKey: 'object:1648' }, { elementData: { attributes: { numbering: 1, showNumbering: true, visible: true, question: 'Radio1', isScoringEnabledForQuestion: true, fontStyling: { underline: { isLabelUnderline: 'false', textDecoration: 'none' }, fontIndent: 'left', fontSize: '14', bold: { isLabelBold: 'true', fontWeight: 'bold' }, italic: { isLabelItalic: 'false', fontStyle: 'normal' }, fontColor: '#000000', font: 'OpenSans' }, questionHTML: 'PHAgc3R5bGU9InRleHQtYWxpZ246bGVmdDsiPjxzdHJvbmc+PHNwYW4gc3R5bGU9ImZvbnQtZmFtaWx5Ok9wZW5TYW5zO2NvbG9yOiMwMDAwMDA7Zm9udC1zaXplOjE0cHg7Ij5SYWRpbzE8L3NwYW4+PC9zdHJvbmc+PC9wPg==', maxScore: 1, showNumberingDot: true, subText: '', required: false, layout: 'vertical', isScorable: true, answer: '', choiceList: [{ score: 1, criticalQuestionCorrectChoice: true, label: 'Choice 1', $$hashKey: 'object:1704', value: '1' }, { score: 1, criticalQuestionCorrectChoice: true, label: 'Choice 2', $$hashKey: 'object:1705', value: '2' }], showErrorMsg: false, isCritical: false, appliedRuleCount: 0, logic: true, elementType: 'radio' } }, id: 1023113844661, uuid: 'd7e2ccd7-92bc-44c3-a2ac-40161edd8990', type: 'radio', $$hashKey: 'object:1690' }, { elementData: { attributes: { numbering: 2, showNumbering: true, visible: true, question: 'YesNo1', isScoringEnabledForQuestion: true, fontStyling: { underline: { isLabelUnderline: 'false', textDecoration: 'none' }, fontIndent: 'left', fontSize: '14', bold: { isLabelBold: 'true', fontWeight: 'bold' }, italic: { isLabelItalic: 'false', fontStyle: 'normal' }, fontColor: '#000000', font: 'OpenSans' }, questionHTML: 'PHAgc3R5bGU9InRleHQtYWxpZ246bGVmdDsiPjxzdHJvbmc+PHNwYW4gc3R5bGU9ImZvbnQtZmFtaWx5Ok9wZW5TYW5zO2NvbG9yOiMwMDAwMDA7Zm9udC1zaXplOjE0cHg7Ij5ZZXNObzE8L3NwYW4+PC9zdHJvbmc+PC9wPg==', maxScore: 1, showNumberingDot: true, subText: '', required: false, layout: 'vertical', isScorable: true, answer: '', choiceList: [{ score: 1, criticalQuestionCorrectChoice: true, label: 'Yes', $$hashKey: 'object:1734', value: '1' }, { score: 0, criticalQuestionCorrectChoice: true, label: 'No', $$hashKey: 'object:1735', value: '2' }], showErrorMsg: false, isCritical: false, appliedRuleCount: 0, logic: true, elementType: 'yes/no' } }, id: 1068336781708, uuid: '51b01615-2444-4657-bab8-393b89796268', type: 'yesno', $$hashKey: 'object:1726' }, { elementData: { attributes: { numbering: 3, showNumbering: true, visible: true, question: 'Radio2', isScoringEnabledForQuestion: true, fontStyling: { underline: { isLabelUnderline: 'false', textDecoration: 'none' }, fontIndent: 'left', fontSize: '14', bold: { isLabelBold: 'true', fontWeight: 'bold' }, italic: { isLabelItalic: 'false', fontStyle: 'normal' }, fontColor: '#000000', font: 'OpenSans' }, questionHTML: 'PHAgc3R5bGU9InRleHQtYWxpZ246bGVmdDsiPjxzdHJvbmc+PHNwYW4gc3R5bGU9ImZvbnQtZmFtaWx5Ok9wZW5TYW5zO2NvbG9yOiMwMDAwMDA7Zm9udC1zaXplOjE0cHg7Ij5SYWRpbzI8L3NwYW4+PC9zdHJvbmc+PC9wPg==', maxScore: 1, showNumberingDot: true, subText: '', required: false, layout: 'vertical', isScorable: true, answer: '', choiceList: [{ score: 1, criticalQuestionCorrectChoice: true, label: 'Choice 1', $$hashKey: 'object:1754', value: '1' }, { score: 1, criticalQuestionCorrectChoice: true, label: 'Choice 2', $$hashKey: 'object:1755', value: '2' }], showErrorMsg: false, isCritical: false, appliedRuleCount: 0, logic: true, elementType: 'radio' } }, id: 1059009286482, uuid: '98839dae-4a57-458d-a748-097419688685', type: 'radio', $$hashKey: 'object:1746' }], formMaxScore: 3, percentage: 0, theme: { themeLogo: '', themeName: '', isDefault: true, themeData: { imgWidth: 243, logoAspectRatio: 8.1, bgColor: '#ffffff', subTitle: { fontStyling: { underline: { isLabelUnderline: false, textDecoration: 'none' }, bold: { isLabelBold: false, fontWeight: 'normal' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, fontColor: '#707070' }, fontSize: 14, text: '', font: 'OpenSans' }, isAspectRatioChecked: true, imgHeight: 30, numberingEnabled: true, title: { fontStyling: { underline: { isLabelUnderline: false, textDecoration: 'none' }, bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, fontColor: '#2e2e2e' }, fontSize: 18, text: '', font: 'OpenSans' } }, themeId: '' }, ranking: { totalCoverage: 101, ranges: [{ coverage: 51, displayText: 'Failed', from: '0%', to: '50%' }, { coverage: 50, displayText: 'Passed', from: '51%', to: '100%' }], isRankingEnabled: false }, elementCount: 4, headerFields: [], workflowConfigurationId: '' })
    };
    await CommonQMNoUIUtils.createForm(formDetails, userToken);
    await manageFormsPO.navigateToWithWarningModal();
    await manageFormsPO.searchFormInGrid(formNames[4]);
    await manageFormsPO.openParticularForm(formNames[4]);
    await manageFormsPO.waitForSpinnerToDisappear();
    await page.waitForSelector(formDesignerPage.elements.sectionFormElement);
    await formArea.clickElementOnFormArea('2. YesNo1', 'yesno');
    await elementAttributes.clickLogicAttributesSection();
    await elementAttributes.logicPropertiesAttributes.clickAddRuleButton();
    let yesnoRule1Element = await createEditRuleModal.getARuleElementByIndex(0);
    await createEditRuleModal.setConditionDropdown(yesnoRule1Element, 0, 'is');
    await createEditRuleModal.addConditionRow(yesnoRule1Element, 0);
    await createEditRuleModal.setConditionDropdown(yesnoRule1Element, 1, 'is not');
    await createEditRuleModal.setChoiceDropdown(yesnoRule1Element, 1, 'Yes');
    await createEditRuleModal.setHideQuestionsDropdown(yesnoRule1Element, '3. Radio2');
    await createEditRuleModal.clickSetBtn();
    expect(await elementAttributes.logicPropertiesAttributes.getARuleDescription(0)).toEqual('If selectionisYesANDis notYesthenHide 3. Radio2');
    await formArea.clickDeleteElementIcon('2. YesNo1', 'yesno');
    expect(await formArea.getCountOfElementsInForm()).toEqual(3);
    expect((await elementAttributes.logicPropertiesAttributes.getAllLogicRuleSections()).length).toBeFalsy(0);

});

Then("Step-6: If user will delete a question which is hidden then rule associated with it should get delete", { timeout: 60 * 1000 }, async () => {

    let formDetails = {
        formName: formNames[5],
        formStatus: 'Draft',
        formType: 'EVALUATION',
        formData: JSON.stringify({ formTitle: '', elements: [{ elementData: { attributes: { isScorable: false, visible: true, question: 'Label1', fontStyling: { underline: { isLabelUnderline: 'false', textDecoration: 'none' }, fontIndent: 'left', fontSize: '14', bold: { isLabelBold: 'true', fontWeight: 'bold' }, italic: { isLabelItalic: 'false', fontStyle: 'normal' }, fontColor: '#000000', font: 'OpenSans' }, questionHTML: 'PHAgc3R5bGU9InRleHQtYWxpZ246bGVmdDsiPjxzdHJvbmc+PHNwYW4gc3R5bGU9ImZvbnQtZmFtaWx5Ok9wZW5TYW5zO2NvbG9yOiMwMDAwMDA7Zm9udC1zaXplOjE0cHg7Ij5MYWJlbDE8L3NwYW4+PC9zdHJvbmc+PC9wPg==', appliedRuleCount: 0 } }, id: 1064808225269, uuid: 'e78fd28b-f4d4-4ce2-b355-b61cc4d278de', type: 'label', $$hashKey: 'object:2010' }, { elementData: { attributes: { numbering: 1, showNumbering: true, visible: true, question: 'Radio1', isScoringEnabledForQuestion: true, fontStyling: { underline: { isLabelUnderline: 'false', textDecoration: 'none' }, fontIndent: 'left', fontSize: '14', bold: { isLabelBold: 'true', fontWeight: 'bold' }, italic: { isLabelItalic: 'false', fontStyle: 'normal' }, fontColor: '#000000', font: 'OpenSans' }, questionHTML: 'PHAgc3R5bGU9InRleHQtYWxpZ246bGVmdDsiPjxzdHJvbmc+PHNwYW4gc3R5bGU9ImZvbnQtZmFtaWx5Ok9wZW5TYW5zO2NvbG9yOiMwMDAwMDA7Zm9udC1zaXplOjE0cHg7Ij5SYWRpbzE8L3NwYW4+PC9zdHJvbmc+PC9wPg==', maxScore: 1, showNumberingDot: true, subText: '', required: false, layout: 'vertical', isScorable: true, answer: '', choiceList: [{ score: 1, criticalQuestionCorrectChoice: true, label: 'Choice 1', $$hashKey: 'object:2066', value: '1' }, { score: 1, criticalQuestionCorrectChoice: true, label: 'Choice 2', $$hashKey: 'object:2067', value: '2' }], showErrorMsg: false, isCritical: false, appliedRuleCount: 0, logic: true, elementType: 'radio' } }, id: 1040018697825, uuid: '1fcc997d-a755-43b6-9a9d-3c22caafd37f', type: 'radio', $$hashKey: 'object:2052' }, { elementData: { attributes: { numbering: 2, showNumbering: true, visible: true, question: 'YesNo1', isScoringEnabledForQuestion: true, fontStyling: { underline: { isLabelUnderline: 'false', textDecoration: 'none' }, fontIndent: 'left', fontSize: '14', bold: { isLabelBold: 'true', fontWeight: 'bold' }, italic: { isLabelItalic: 'false', fontStyle: 'normal' }, fontColor: '#000000', font: 'OpenSans' }, questionHTML: 'PHAgc3R5bGU9InRleHQtYWxpZ246bGVmdDsiPjxzdHJvbmc+PHNwYW4gc3R5bGU9ImZvbnQtZmFtaWx5Ok9wZW5TYW5zO2NvbG9yOiMwMDAwMDA7Zm9udC1zaXplOjE0cHg7Ij5ZZXNObzE8L3NwYW4+PC9zdHJvbmc+PC9wPg==', maxScore: 1, showNumberingDot: true, subText: '', required: false, layout: 'vertical', isScorable: true, answer: '', choiceList: [{ score: 1, criticalQuestionCorrectChoice: true, label: 'Yes', $$hashKey: 'object:2096', value: '1' }, { score: 0, criticalQuestionCorrectChoice: true, label: 'No', $$hashKey: 'object:2097', value: '2' }], showErrorMsg: false, isCritical: false, appliedRuleCount: 0, logic: true, elementType: 'yes/no' } }, id: 1010887224167, uuid: 'acb27f36-c465-45f8-9542-27204aa591e0', type: 'yesno', $$hashKey: 'object:2088' }, { elementData: { attributes: { numbering: 3, showNumbering: true, visible: true, question: 'Radio2', isScoringEnabledForQuestion: true, fontStyling: { underline: { isLabelUnderline: 'false', textDecoration: 'none' }, fontIndent: 'left', fontSize: '14', bold: { isLabelBold: 'true', fontWeight: 'bold' }, italic: { isLabelItalic: 'false', fontStyle: 'normal' }, fontColor: '#000000', font: 'OpenSans' }, questionHTML: 'PHAgc3R5bGU9InRleHQtYWxpZ246bGVmdDsiPjxzdHJvbmc+PHNwYW4gc3R5bGU9ImZvbnQtZmFtaWx5Ok9wZW5TYW5zO2NvbG9yOiMwMDAwMDA7Zm9udC1zaXplOjE0cHg7Ij5SYWRpbzI8L3NwYW4+PC9zdHJvbmc+PC9wPg==', maxScore: 1, showNumberingDot: true, subText: '', required: false, layout: 'vertical', isScorable: true, answer: '', choiceList: [{ score: 1, criticalQuestionCorrectChoice: true, label: 'Choice 1', $$hashKey: 'object:2118', value: '1' }, { score: 1, criticalQuestionCorrectChoice: true, label: 'Choice 2', $$hashKey: 'object:2119', value: '2' }], showErrorMsg: false, isCritical: false, appliedRuleCount: 0, logic: true, elementType: 'radio' } }, id: 1049269367434, uuid: 'e8a0db53-795a-4e5a-a2dd-b28356b4aae6', type: 'radio', $$hashKey: 'object:2110' }], theme: { themeLogo: '', themeName: '', isDefault: true, themeData: { imgWidth: 243, logoAspectRatio: 8.1, bgColor: '#ffffff', subTitle: { fontStyling: { underline: { isLabelUnderline: false, textDecoration: 'none' }, bold: { isLabelBold: false, fontWeight: 'normal' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, fontColor: '#707070' }, fontSize: 14, text: '', font: 'OpenSans' }, isAspectRatioChecked: true, imgHeight: 30, numberingEnabled: true, title: { fontStyling: { underline: { isLabelUnderline: false, textDecoration: 'none' }, bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, fontColor: '#2e2e2e' }, fontSize: 18, text: '', font: 'OpenSans' } }, themeId: '' }, ranking: { totalCoverage: 101, ranges: [{ coverage: 51, displayText: 'Failed', from: '0%', to: '50%' }, { coverage: 50, displayText: 'Passed', from: '51%', to: '100%' }], isRankingEnabled: false }, currentScore: 0, themeId: '', rules: {}, rulesAssociation: {}, rulesAssociationV2: {}, formMaxScore: 0, percentage: null, elementCount: 4, headerFields: [], workflowConfigurationId: '' })
    };
    await CommonQMNoUIUtils.createForm(formDetails, userToken);
    await manageFormsPO.navigateToWithWarningModal();
    await manageFormsPO.searchFormInGrid(formNames[5]);
    await manageFormsPO.openParticularForm(formNames[5]);
    await manageFormsPO.waitForSpinnerToDisappear();
    await page.waitForSelector(formDesignerPage.elements.sectionFormElement);
    await formArea.clickElementOnFormArea('2. YesNo1', 'yesno');
    await elementAttributes.clickLogicAttributesSection();
    await elementAttributes.logicPropertiesAttributes.clickAddRuleButton();
    let yesnoRule1Element = await createEditRuleModal.getARuleElementByIndex(0);
    await createEditRuleModal.setConditionDropdown(yesnoRule1Element, 0, 'is');
    await createEditRuleModal.addConditionRow(yesnoRule1Element, 0);
    await createEditRuleModal.setConditionDropdown(yesnoRule1Element, 1, 'is not');
    await createEditRuleModal.setChoiceDropdown(yesnoRule1Element, 1, 'Yes');
    await createEditRuleModal.setHideQuestionsDropdown(yesnoRule1Element, '3. Radio2');
    await createEditRuleModal.clickSetBtn();
    await formArea.clickDeleteElementIcon('3. Radio2', 'radio');
    expect(await formArea.getCountOfElementsInForm()).toEqual(3);
    expect((await elementAttributes.logicPropertiesAttributes.getAllLogicRuleSections()).length).toBeFalsy(0);

});

Then("Step-7: add rule to a question then save that form and check rule by opening that form", { timeout: 60 * 1000 }, async () => {

    let formDetails = {
        formName: formNames[0],
        formStatus: 'Draft',
        formType: 'EVALUATION',
        formData: JSON.stringify({ formTitle: '', elements: [{ elementData: { attributes: { isScorable: false, visible: true, question: 'Label1', fontStyling: { underline: { isLabelUnderline: 'false', textDecoration: 'none' }, fontIndent: 'left', fontSize: '14', bold: { isLabelBold: 'true', fontWeight: 'bold' }, italic: { isLabelItalic: 'false', fontStyle: 'normal' }, fontColor: '#000000', font: 'OpenSans' }, questionHTML: 'PHAgc3R5bGU9InRleHQtYWxpZ246bGVmdDsiPjxzdHJvbmc+PHNwYW4gc3R5bGU9ImZvbnQtZmFtaWx5Ok9wZW5TYW5zO2NvbG9yOiMwMDAwMDA7Zm9udC1zaXplOjE0cHg7Ij5MYWJlbDE8L3NwYW4+PC9zdHJvbmc+PC9wPg==', appliedRuleCount: 0 } }, id: 1064808225269, uuid: '7b6af8c7-2717-4e3c-bbf0-2ed32dc78a57', type: 'label', $$hashKey: 'object:2010' }, { elementData: { attributes: { numbering: 1, showNumbering: true, visible: true, question: 'Radio1', isScoringEnabledForQuestion: true, fontStyling: { underline: { isLabelUnderline: 'false', textDecoration: 'none' }, fontIndent: 'left', fontSize: '14', bold: { isLabelBold: 'true', fontWeight: 'bold' }, italic: { isLabelItalic: 'false', fontStyle: 'normal' }, fontColor: '#000000', font: 'OpenSans' }, questionHTML: 'PHAgc3R5bGU9InRleHQtYWxpZ246bGVmdDsiPjxzdHJvbmc+PHNwYW4gc3R5bGU9ImZvbnQtZmFtaWx5Ok9wZW5TYW5zO2NvbG9yOiMwMDAwMDA7Zm9udC1zaXplOjE0cHg7Ij5SYWRpbzE8L3NwYW4+PC9zdHJvbmc+PC9wPg==', maxScore: 1, showNumberingDot: true, subText: '', required: false, layout: 'vertical', isScorable: true, answer: '', choiceList: [{ score: 1, criticalQuestionCorrectChoice: true, label: 'Choice 1', $$hashKey: 'object:2066', value: '1' }, { score: 1, criticalQuestionCorrectChoice: true, label: 'Choice 2', $$hashKey: 'object:2067', value: '2' }], showErrorMsg: false, isCritical: false, appliedRuleCount: 0, logic: true, elementType: 'radio' } }, id: 1040018697825, uuid: '478ef4ae-a28e-4014-a8a8-e2d0101a8b4a', type: 'radio', $$hashKey: 'object:2052' }, { elementData: { attributes: { numbering: 2, showNumbering: true, visible: true, question: 'YesNo1', isScoringEnabledForQuestion: true, fontStyling: { underline: { isLabelUnderline: 'false', textDecoration: 'none' }, fontIndent: 'left', fontSize: '14', bold: { isLabelBold: 'true', fontWeight: 'bold' }, italic: { isLabelItalic: 'false', fontStyle: 'normal' }, fontColor: '#000000', font: 'OpenSans' }, questionHTML: 'PHAgc3R5bGU9InRleHQtYWxpZ246bGVmdDsiPjxzdHJvbmc+PHNwYW4gc3R5bGU9ImZvbnQtZmFtaWx5Ok9wZW5TYW5zO2NvbG9yOiMwMDAwMDA7Zm9udC1zaXplOjE0cHg7Ij5ZZXNObzE8L3NwYW4+PC9zdHJvbmc+PC9wPg==', maxScore: 1, showNumberingDot: true, subText: '', required: false, layout: 'vertical', isScorable: true, answer: '', choiceList: [{ score: 1, criticalQuestionCorrectChoice: true, label: 'Yes', $$hashKey: 'object:2096', value: '1' }, { score: 0, criticalQuestionCorrectChoice: true, label: 'No', $$hashKey: 'object:2097', value: '2' }], showErrorMsg: false, isCritical: false, appliedRuleCount: 0, logic: true, elementType: 'yes/no' } }, id: 1010887224167, uuid: '7bcf6310-82b1-440e-9eea-82fccd2ccbce', type: 'yesno', $$hashKey: 'object:2088' }, { elementData: { attributes: { numbering: 3, showNumbering: true, visible: true, question: 'Radio2', isScoringEnabledForQuestion: true, fontStyling: { underline: { isLabelUnderline: 'false', textDecoration: 'none' }, fontIndent: 'left', fontSize: '14', bold: { isLabelBold: 'true', fontWeight: 'bold' }, italic: { isLabelItalic: 'false', fontStyle: 'normal' }, fontColor: '#000000', font: 'OpenSans' }, questionHTML: 'PHAgc3R5bGU9InRleHQtYWxpZ246bGVmdDsiPjxzdHJvbmc+PHNwYW4gc3R5bGU9ImZvbnQtZmFtaWx5Ok9wZW5TYW5zO2NvbG9yOiMwMDAwMDA7Zm9udC1zaXplOjE0cHg7Ij5SYWRpbzI8L3NwYW4+PC9zdHJvbmc+PC9wPg==', maxScore: 1, showNumberingDot: true, subText: '', required: false, layout: 'vertical', isScorable: true, answer: '', choiceList: [{ score: 1, criticalQuestionCorrectChoice: true, label: 'Choice 1', $$hashKey: 'object:2118', value: '1' }, { score: 1, criticalQuestionCorrectChoice: true, label: 'Choice 2', $$hashKey: 'object:2119', value: '2' }], showErrorMsg: false, isCritical: false, appliedRuleCount: 0, logic: true, elementType: 'radio' } }, id: 1049269367434, uuid: '45c26672-9287-4201-a257-d4ed48845189', type: 'radio', $$hashKey: 'object:2110' }], theme: { themeLogo: '', themeName: '', isDefault: true, themeData: { imgWidth: 243, logoAspectRatio: 8.1, bgColor: '#ffffff', subTitle: { fontStyling: { underline: { isLabelUnderline: false, textDecoration: 'none' }, bold: { isLabelBold: false, fontWeight: 'normal' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, fontColor: '#707070' }, fontSize: 14, text: '', font: 'OpenSans' }, isAspectRatioChecked: true, imgHeight: 30, numberingEnabled: true, title: { fontStyling: { underline: { isLabelUnderline: false, textDecoration: 'none' }, bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, fontColor: '#2e2e2e' }, fontSize: 18, text: '', font: 'OpenSans' } }, themeId: '' }, ranking: { totalCoverage: 101, ranges: [{ coverage: 51, displayText: 'Failed', from: '0%', to: '50%' }, { coverage: 50, displayText: 'Passed', from: '51%', to: '100%' }], isRankingEnabled: false }, currentScore: 0, themeId: '', rules: {}, rulesAssociation: {}, rulesAssociationV2: {}, formMaxScore: 0, percentage: null, elementCount: 4, headerFields: [], workflowConfigurationId: '' })
    };
    await CommonQMNoUIUtils.createForm(formDetails, userToken);
    await manageFormsPO.navigateToWithWarningModal();
    await manageFormsPO.searchFormInGrid(formNames[0]);
    await manageFormsPO.openParticularForm(formNames[0]);
    await manageFormsPO.waitForSpinnerToDisappear();
    await page.waitForSelector(formDesignerPage.elements.sectionFormElement);
    await formArea.clickElementOnFormArea('2. YesNo1', 'yesno');
    await elementAttributes.clickLogicAttributesSection();
    await elementAttributes.logicPropertiesAttributes.clickAddRuleButton();
    let yesnoRule1Element = await createEditRuleModal.getARuleElementByIndex(0);
    await createEditRuleModal.setConditionDropdown(yesnoRule1Element, 0, 'is');
    await createEditRuleModal.addConditionRow(yesnoRule1Element, 0);
    await createEditRuleModal.setConditionDropdown(yesnoRule1Element, 1, 'is not');
    await createEditRuleModal.setChoiceDropdown(yesnoRule1Element, 1, 'Yes');
    await createEditRuleModal.setHideQuestionsDropdown(yesnoRule1Element, '3. Radio2');
    await createEditRuleModal.clickSetBtn();
    expect(await elementAttributes.logicPropertiesAttributes.getARuleDescription(0)).toEqual('If selectionisYesANDis notYesthenHide 3. Radio2');
    await formDesignerPage.saveAndActivateForm();
    await manageFormsPO.waitForSpinnerToDisappear();
    await manageFormsPO.searchFormInGrid(formNames[0]);
    await manageFormsPO.openParticularForm(formNames[0]);
    await manageFormsPO.waitForSpinnerToDisappear();
    await page.waitForSelector(formDesignerPage.elements.sectionFormElement);
    await formArea.clickElementOnFormArea('2. YesNo1', 'yesno');
    await elementAttributes.clickLogicAttributesSection();
    expect(await elementAttributes.logicPropertiesAttributes.getARuleDescription(0)).toEqual('If selectionisYesANDis notYesthenHide 3. Radio2');

});

Then("Step-8: single edit for multiple rules", { timeout: 60 * 1000 }, async () => {

    let formDetails = {
        formName: formNames[7],
        formStatus: 'Draft',
        formType: 'EVALUATION',
        formData: JSON.stringify({ formTitle: '', elements: [{ id: 1066535185261, uuid: 'a243d158-638a-44b2-b33c-008adffceec4', type: 'dropdown', elementData: { attributes: { visible: true, question: 'Dropdown1', fontStyling: { font: 'OpenSans', fontSize: 14, fontColor: '#000000', fontIndent: 'left', bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } }, isScorable: false, appliedRuleCount: 0, elementType: 'dropdown', answer: [], required: false, showErrorMsg: false, logic: true, subText: '', dropdownType: 'single', itemList: [{ id: 'Choice 1', label: 'Choice 1', value: 'Choice 1' }, { id: 'Choice 2', label: 'Choice 2', value: 'Choice 2' }], questionHTML: 'PHA+RHJvcGRvd24xPC9wPg==', numbering: 1, showNumbering: true, showNumberingDot: true } }, $$hashKey: 'object:2184' }, { id: 1061376332709, uuid: 'bfb06724-b6f0-4ae7-b075-c5bffa5792ba', type: 'checkbox', elementData: { attributes: { visible: true, question: 'Checkbox1', fontStyling: { font: 'OpenSans', fontSize: 14, fontColor: '#000000', fontIndent: 'left', bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } }, isScorable: true, appliedRuleCount: 0, elementType: 'checkbox', maxScore: 2, answer: [], required: false, layout: 'vertical', showErrorMsg: false, logic: true, subText: '', choiceList: [{ label: 'Choice 1', value: '1', criticalQuestionCorrectChoice: true, score: 1, selected: false, $$hashKey: 'object:2224' }, { label: 'Choice 2', value: '2', criticalQuestionCorrectChoice: true, score: 1, selected: false, $$hashKey: 'object:2225' }, { label: 'Choice 3', value: '3', criticalQuestionCorrectChoice: true, selected: false, score: 1, $$hashKey: 'object:2254' }], isCritical: false, isScoringEnabledForQuestion: true, questionHTML: 'PHA+Q2hlY2tib3gxPC9wPg==', numbering: 2, showNumbering: true, showNumberingDot: true } }, $$hashKey: 'object:2209' }, { id: 1082867576757, uuid: '3f582cce-bc0b-44de-b238-b8c327bd79b1', type: 'dropdown', elementData: { attributes: { visible: true, question: 'Dropdown2', fontStyling: { font: 'OpenSans', fontSize: 14, fontColor: '#000000', fontIndent: 'left', bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } }, isScorable: false, appliedRuleCount: 0, elementType: 'dropdown', answer: [], required: false, showErrorMsg: false, logic: true, subText: '', dropdownType: 'single', itemList: [{ id: 'Choice 1', label: 'Choice 1', value: 'Choice 1' }, { id: 'Choice 2', label: 'Choice 2', value: 'Choice 2' }], questionHTML: 'PHA+RHJvcGRvd24yPC9wPg==', numbering: 3, showNumbering: true, showNumberingDot: true } }, $$hashKey: 'object:2263' }, { id: 1033507035886, uuid: '8ff23666-d044-4a71-a964-8de4ff7ada74', type: 'checkbox', elementData: { attributes: { visible: true, question: 'Checkbox2', fontStyling: { font: 'OpenSans', fontSize: 14, fontColor: '#000000', fontIndent: 'left', bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } }, isScorable: true, appliedRuleCount: 0, elementType: 'checkbox', maxScore: 2, answer: [], required: false, layout: 'vertical', showErrorMsg: false, logic: true, subText: '', choiceList: [{ label: 'Choice 1', value: '1', criticalQuestionCorrectChoice: true, score: 1, selected: false, $$hashKey: 'object:2301' }, { label: 'Choice 2', value: '2', criticalQuestionCorrectChoice: true, score: 1, selected: false, $$hashKey: 'object:2302' }], isCritical: false, isScoringEnabledForQuestion: true, questionHTML: 'PHA+Q2hlY2tib3gyPC9wPg==', numbering: 4, showNumbering: true, showNumberingDot: true } }, $$hashKey: 'object:2285' }], theme: { themeId: '', themeName: '', isDefault: true, themeLogo: '', themeData: { imgWidth: 243, imgHeight: 30, isAspectRatioChecked: true, logoAspectRatio: 8.1, bgColor: '#ffffff', numberingEnabled: true, title: { text: '', font: 'OpenSans', fontSize: 18, fontStyling: { fontColor: '#2e2e2e', italic: { isLabelItalic: false, fontStyle: 'normal' }, bold: { isLabelBold: true, fontWeight: 'bold' }, underline: { isLabelUnderline: false, textDecoration: 'none' } } }, subTitle: { text: '', font: 'OpenSans', fontSize: 14, fontStyling: { fontColor: '#707070', italic: { isLabelItalic: false, fontStyle: 'normal' }, bold: { isLabelBold: false, fontWeight: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } } } } }, ranking: { isRankingEnabled: false, totalCoverage: 101, ranges: [{ from: '0%', to: '50%', coverage: 51, displayText: 'Failed' }, { from: '51%', to: '100%', coverage: 50, displayText: 'Passed' }] }, themeId: '', elementCount: 4, rules: { 14217005346156: { questionId: 1061376332709, isApplied: false, operationToPerform: 'Hide', resultQuestion: { element: { id: 1082867576757, uuid: '3f582cce-bc0b-44de-b238-b8c327bd79b1', type: 'dropdown', elementData: { attributes: { visible: true, question: 'Dropdown2', fontStyling: { font: 'OpenSans', fontSize: 14, fontColor: '#000000', fontIndent: 'left', bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } }, isScorable: false, appliedRuleCount: 0, elementType: 'dropdown', answer: [], required: false, showErrorMsg: false, logic: true, subText: '', dropdownType: 'single', itemList: [{ id: 'Choice 1', label: 'Choice 1', value: 'Choice 1' }, { id: 'Choice 2', label: 'Choice 2', value: 'Choice 2' }], questionHTML: 'PHA+RHJvcGRvd24yPC9wPg==', numbering: 3, showNumbering: true, showNumberingDot: true } }, $$hashKey: 'object:2263' }, label: '3. Dropdown2' }, conditionList: [{ operation: { label: 'is', value: '===' }, choice: { choice: { label: 'Choice 1', value: '1', criticalQuestionCorrectChoice: true, score: 1, selected: false, $$hashKey: 'object:2224' }, label: 'Choice 1' }, $$hashKey: 'object:2463' }], ruleExpression: '$ctrl.element.elementData.attributes.answer.indexOf("1") > -1 && $ctrl.element.elementData.attributes.answer.length !== 0' }, 1579667285721: { questionId: 1061376332709, isApplied: false, operationToPerform: 'Hide', resultQuestion: { element: { id: 1033507035886, uuid: '8ff23666-d044-4a71-a964-8de4ff7ada74', type: 'checkbox', elementData: { attributes: { visible: true, question: 'Checkbox2', fontStyling: { font: 'OpenSans', fontSize: 14, fontColor: '#000000', fontIndent: 'left', bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } }, isScorable: true, appliedRuleCount: 0, elementType: 'checkbox', maxScore: 2, answer: [], required: false, layout: 'vertical', showErrorMsg: false, logic: true, subText: '', choiceList: [{ label: 'Choice 1', value: '1', criticalQuestionCorrectChoice: true, score: 1, selected: false, $$hashKey: 'object:2301' }, { label: 'Choice 2', value: '2', criticalQuestionCorrectChoice: true, score: 1, selected: false, $$hashKey: 'object:2302' }], isCritical: false, isScoringEnabledForQuestion: true, questionHTML: 'PHA+Q2hlY2tib3gyPC9wPg==', numbering: 4, showNumbering: true, showNumberingDot: true } }, $$hashKey: 'object:2285' }, label: '4. Checkbox2' }, conditionList: [{ operation: { label: 'is', value: '===' }, choice: { choice: { label: 'Choice 2', value: '2', criticalQuestionCorrectChoice: true, score: 1, selected: false, $$hashKey: 'object:2225' }, label: 'Choice 2' }, $$hashKey: 'object:2488' }], ruleExpression: '$ctrl.element.elementData.attributes.answer.indexOf("2") > -1 && $ctrl.element.elementData.attributes.answer.length !== 0' } }, rulesAssociation: { 1082867576757: { rulesToApply: [], rulesForResult: ['14217005346156'] }, 1061376332709: { rulesToApply: ['14217005346156', '1579667285721'], rulesForResult: [] }, 1033507035886: { rulesToApply: [], rulesForResult: ['1579667285721'] } }, headerFields: [], rulesAssociationV2: {}, formMaxScore: 0, currentScore: 0, percentage: null, workflowConfigurationId: '' })
    };
    await CommonQMNoUIUtils.createForm(formDetails, userToken);
    await manageFormsPO.navigateTo();
    await manageFormsPO.searchFormInGrid(formNames[7]);
    await manageFormsPO.openParticularForm(formNames[7]);
    await manageFormsPO.waitForSpinnerToDisappear();
    await page.waitForSelector(formDesignerPage.elements.sectionFormElement);
    await formArea.clickElementOnFormArea('2. Checkbox1', 'checkbox');
    await elementAttributes.clickLogicAttributesSection();
    expect(await elementAttributes.logicPropertiesAttributes.getARuleDescription(0)).toEqual('If selectionisChoice 1thenHide 3. Dropdown2');
    expect(await elementAttributes.logicPropertiesAttributes.getARuleDescription(1)).toEqual('If selectionisChoice 2thenHide 4. Checkbox2');
    await elementAttributes.logicPropertiesAttributes.clickARuleEditButton(0);
    let yesnoRule1Element = await createEditRuleModal.getARuleElementByIndex(0);
    await createEditRuleModal.setChoiceDropdown(yesnoRule1Element, 0, 'Choice 3');
    await createEditRuleModal.clickSetBtn();
    expect(await elementAttributes.logicPropertiesAttributes.getARuleDescription(0)).toEqual('If selectionisChoice 3thenHide 3. Dropdown2');
    expect(await elementAttributes.logicPropertiesAttributes.getARuleDescription(1)).toEqual('If selectionisChoice 2thenHide 4. Checkbox2');
});