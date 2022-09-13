import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
import { GlobalTenantUtils } from "../../../../common/globalTenantUtils";
import { CommonUIUtils } from "cxone-playwright-test-utils";
import { CommonNoUIUtils } from "../../../../common/CommonNoUIUtils";
import { CommonQMNoUIUtils } from "../../../../common/CommonQMNoUIUtils"
import { Utils } from "../../../../common/utils"
import { LoginPage } from "../../../../common/login";
import { FEATURE_TOGGLES } from "../../../../common/uiConstants"
import { FormAreaComponentPo } from "../../../../pageObjects/form-area.component.po";
import { ManageFormsPO } from "../../../../pageObjects/manage-forms.po";
import FormDesignerPagePO from '../../../../pageObjects/form-designer-page.po';
import { QuestionBankComponentPo } from '../../../../pageObjects/question-bank.component.po'
import { OnPrepare } from "../../../../playwright.config";
import * as moment from 'moment';

let browser: any,
    page: Page,
    userDetails: any,
    formDetails: any,
    userToken: any,
    formDesignerPage: any,
    formArea: any,
    manageFormsPO: any,
    questionBankComponentPo: any,
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
    questionBankComponentPo = new QuestionBankComponentPo();
    loginPage = new LoginPage(page);
})

AfterAll({ timeout: 60 * 1000 }, async () => {
    await browser.close();
});

Given("should be able to save element in question bank with properties", { timeout: 60 * 1000 }, async () => {
    formDetails = {
        formName: formNames[0],
        formStatus: 'Draft',
        formType: 'EVALUATION',
        formData: JSON.stringify({ formTitle: '', elements: [{ id: 1016239372479, uuid: 'e55b81d9-b9ea-4203-a832-ff20bc3eacb0', type: 'radio', elementData: { attributes: { visible: true, question: 'Radio1', fontStyling: { font: 'OpenSans', fontSize: 14, fontColor: '#000000', fontIndent: 'left', bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } }, isScorable: true, appliedRuleCount: 0, elementType: 'radio', maxScore: 1, answer: '1', required: true, layout: 'horizontal', showErrorMsg: false, logic: true, subText: 'This is instruction for radio 1', choiceList: [{ label: 'Answer 1', value: '1', criticalQuestionCorrectChoice: true, score: 1, $$hashKey: 'object:254' }, { label: 'Choice 3', value: '3', criticalQuestionCorrectChoice: true, score: 1, $$hashKey: 'object:279' }, { label: 'Answer 2', value: '2', criticalQuestionCorrectChoice: true, score: 1, $$hashKey: 'object:255' }], isCritical: false, isScoringEnabledForQuestion: true, questionHTML: 'PHA+UmFkaW8xPC9wPg==', numbering: 1, showNumbering: true, showNumberingDot: true, bankId: '11eb1e7f-e48c-9370-89ac-0242ac110009' } }, $$hashKey: 'object:239' }, { id: 1011652624937, uuid: 'cef32609-a5c1-4850-a42f-28b8dcfa7e66', type: 'yesno', elementData: { attributes: { visible: true, question: 'YesNo1', fontStyling: { font: 'OpenSans', fontSize: 14, fontColor: '#000000', fontIndent: 'left', bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } }, isScorable: true, appliedRuleCount: 0, elementType: 'yes/no', maxScore: 1, answer: '', required: false, layout: 'vertical', showErrorMsg: false, logic: true, subText: '', choiceList: [{ label: 'Yes', value: '1', criticalQuestionCorrectChoice: true, score: 1, $$hashKey: 'object:584' }, { label: 'No', value: '2', criticalQuestionCorrectChoice: true, score: 0, $$hashKey: 'object:585' }, { label: 'N/A', value: 'na', naElement: true, score: 0, $$hashKey: 'object:605' }], isCritical: false, isScoringEnabledForQuestion: true, questionHTML: 'PHA+WWVzTm8xPC9wPg==', numbering: 2, showNumbering: true, showNumberingDot: true, isNAChecked: true, bankId: '11eb1e7f-f88c-8290-89ac-0242ac110009' } }, $$hashKey: 'object:566' }, { id: 1063204624173, uuid: 'c4839331-768f-4522-a954-25f71911bcca', type: 'datetime', elementData: { attributes: { visible: true, appliedRuleCount: 0, logic: true, dateAttributes: { elementType: 'date', question: 'DateTime', visible: true, required: false, showErrorMsg: false, fontStyling: { font: 'OpenSans', fontSize: 14, fontColor: '#000000', fontIndent: 'left', bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } }, subText: '', isScorable: false, answer: 1604482138000, useCurrentDate: false, dateFormats: ['dd-MMM-yyyy', 'MMM-dd-yyyy', 'yyyy-MMM-dd'], dateFormat: 'MMM d, yyyy', questionHTML: 'PHA+RGF0ZVRpbWU8L3A+' }, timeAttributes: { elementType: 'time', question: 'Set Question', visible: true, required: false, showErrorMsg: false, fontStyling: { font: 'OpenSans', fontSize: 14, fontColor: '#000000', fontIndent: 'left', bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } }, subText: '', isScorable: false, answer: 1604482138000, useCurrentTime: false, timeFormats: ['12H', '24H'], questionHTML: 'PHA+PHN0cm9uZz48c3BhbiBzdHlsZT0iZm9udC1mYW1pbHk6J09wZW5TYW5zJztmb250LXNpemU6MTRweDtjb2xvcjojMDAwMDAwOyI+U2V0IFF1ZXN0aW9uPC9zcGFuPjwvc3Ryb25nPjwvcD4=' }, numbering: 3, showNumbering: true, showNumberingDot: true, bankId: '11eb1e80-2d03-4bd0-89ac-0242ac110009' } }, $$hashKey: 'object:1349' }, { id: 1031167547185, uuid: '06e729ea-1c6e-4924-938d-c5ca9dba83db', type: 'datetime', elementData: { attributes: { visible: true, appliedRuleCount: 0, logic: true, dateAttributes: { elementType: 'date', question: 'Set question', visible: false, required: false, showErrorMsg: false, fontStyling: { font: 'OpenSans', fontSize: 14, fontColor: '#000000', fontIndent: 'left', bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } }, subText: '', isScorable: false, answer: 1604457900000, useCurrentDate: false, dateFormats: ['dd-MMM-yyyy', 'MMM-dd-yyyy', 'yyyy-MMM-dd'], dateFormat: 'MMM d, yyyy', questionHTML: 'PHA+PHN0cm9uZz48c3BhbiBzdHlsZT0iZm9udC1mYW1pbHk6J09wZW5TYW5zJztmb250LXNpemU6MTRweDtjb2xvcjojMDAwMDAwOyI+U2V0IHF1ZXN0aW9uPC9zcGFuPjwvc3Ryb25nPjwvcD4=' }, timeAttributes: { elementType: 'time', question: 'OnlyTime', visible: true, required: false, showErrorMsg: false, fontStyling: { font: 'OpenSans', fontSize: 14, fontColor: '#000000', fontIndent: 'left', bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } }, subText: 'Set the time', isScorable: false, answer: 1604457900000, useCurrentTime: false, timeFormats: ['12H', '24H'], questionHTML: 'PHA+T25seVRpbWU8L3A+' }, numbering: 4, showNumbering: true, showNumberingDot: true, bankId: '11eb1e80-2577-d6b0-89ac-0242ac110009' } }, $$hashKey: 'object:1197' }, { id: 1085419927632, uuid: 'ee6c1a53-c2a3-41e3-b895-93017162fa59', type: 'datetime', elementData: { attributes: { visible: true, appliedRuleCount: 0, logic: true, dateAttributes: { elementType: 'date', question: 'OnlyDate', visible: true, required: false, showErrorMsg: false, fontStyling: { font: 'OpenSans', fontSize: 14, fontColor: '#000000', fontIndent: 'left', bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } }, subText: '', isScorable: false, answer: 1469179711000, useCurrentDate: false, dateFormats: ['dd-MMM-yyyy', 'MMM-dd-yyyy', 'yyyy-MMM-dd'], dateFormat: 'MMM-dd-yyyy', questionHTML: 'PHA+T25seURhdGU8L3A+' }, timeAttributes: { elementType: 'time', question: 'Set Question', visible: false, required: false, showErrorMsg: false, fontStyling: { font: 'OpenSans', fontSize: 14, fontColor: '#000000', fontIndent: 'left', bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } }, subText: '', isScorable: false, answer: 1469179711000, useCurrentTime: false, timeFormats: ['12H', '24H'], questionHTML: 'PHA+PHN0cm9uZz48c3BhbiBzdHlsZT0iZm9udC1mYW1pbHk6J09wZW5TYW5zJztmb250LXNpemU6MTRweDtjb2xvcjojMDAwMDAwOyI+U2V0IFF1ZXN0aW9uPC9zcGFuPjwvc3Ryb25nPjwvcD4=' }, numbering: 5, showNumbering: true, showNumberingDot: true, bankId: '11eb1e80-1d7c-61b0-84ec-0242ac110004' } }, $$hashKey: 'object:1049' }, { id: 1072249482308, uuid: '2008de25-4057-4b0e-a6b1-1cea3d009d6f', type: 'hyperlink', elementData: { attributes: { visible: true, appliedRuleCount: 0, question: 'www.google.com', fontStyling: { font: 'OpenSans', fontSize: 14, fontColor: '#007cbe', fontIndent: 'left', bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } }, isScorable: false, url: 'http://', questionHTML: 'PHA+d3d3Lmdvb2dsZS5jb208L3A+', bankId: '11eb1e80-1585-ceb0-89ac-0242ac110009' } }, $$hashKey: 'object:938' }, { id: 1047592096881, uuid: '2df8cbac-992b-4856-8c98-0bb41fe62e6b', type: 'textarea', elementData: { attributes: { visible: true, appliedRuleCount: 0, question: 'LongText1', fontStyling: { font: 'OpenSans', fontSize: 14, fontColor: '#000000', fontIndent: 'left', bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } }, isScorable: false, answer: '', required: false, prePopulatedHintText: 'This is hint text for long text 1', showErrorMsg: false, subText: '', limitCharacters: true, limitCharactersText: '300', questionHTML: 'PHA+TG9uZ1RleHQxPC9wPg==', numbering: 6, showNumbering: true, showNumberingDot: true, bankId: '11eb1e80-0e23-8c70-84ec-0242ac110004' } }, $$hashKey: 'object:819' }, { id: 1058446662315, uuid: 'e9ae9bb3-3577-4714-981f-356bb2be455a', type: 'text', elementData: { attributes: { visible: true, appliedRuleCount: 0, question: 'ShortText1', fontStyling: { font: 'OpenSans', fontSize: 14, fontColor: '#000000', fontIndent: 'left', bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } }, isScorable: false, answer: '', required: false, prePopulatedHintText: 'This is hint text for short text 1', showErrorMsg: false, questionHTML: 'PHA+U2hvcnRUZXh0MTwvcD4=', numbering: 7, showNumbering: true, showNumberingDot: true, bankId: '11eb1e80-0350-8d70-84ec-0242ac110004' } }, $$hashKey: 'object:706' }, { id: 1047975732107, uuid: '3af58989-d68c-4a4f-b367-f8145b1e9662', type: 'checkbox', elementData: { attributes: { visible: true, question: 'Checkbox1', fontStyling: { font: 'OpenSans', fontSize: 14, fontColor: '#000000', fontIndent: 'left', bold: { isLabelBold: true, fontWeight: 'bold' }, italic: { isLabelItalic: false, fontStyle: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } }, isScorable: true, appliedRuleCount: 0, elementType: 'checkbox', maxScore: 2, answer: [], required: false, layout: 'vertical', showErrorMsg: false, logic: true, subText: '', choiceList: [{ label: 'Choice 1', value: '1', criticalQuestionCorrectChoice: true, score: 1, selected: false, $$hashKey: 'object:398' }, { label: 'Choice 2', value: '2', criticalQuestionCorrectChoice: true, score: 1, selected: false, $$hashKey: 'object:399' }, { label: 'List Value1', value: '3', criticalQuestionCorrectChoice: true, selected: false, score: 1, $$hashKey: 'object:442' }, { label: 'ListValue2', value: '4', criticalQuestionCorrectChoice: true, selected: false, score: 1, $$hashKey: 'object:443' }, { label: 'List Value3', value: '5', criticalQuestionCorrectChoice: true, selected: false, score: 1, $$hashKey: 'object:444' }], isCritical: false, isScoringEnabledForQuestion: true, questionHTML: 'PHA+Q2hlY2tib3gxPC9wPg==', numbering: 8, showNumbering: true, showNumberingDot: true, bankId: '11eb1e7f-f131-4530-89ac-0242ac110009' } }, $$hashKey: 'object:380' }], theme: { themeId: '', themeName: '', isDefault: true, themeLogo: '', themeData: { imgWidth: 243, imgHeight: 30, isAspectRatioChecked: true, logoAspectRatio: 8.1, bgColor: '#ffffff', numberingEnabled: true, title: { text: '', font: 'OpenSans', fontSize: 18, fontStyling: { fontColor: '#2e2e2e', italic: { isLabelItalic: false, fontStyle: 'normal' }, bold: { isLabelBold: true, fontWeight: 'bold' }, underline: { isLabelUnderline: false, textDecoration: 'none' } } }, subTitle: { text: '', font: 'OpenSans', fontSize: 14, fontStyling: { fontColor: '#707070', italic: { isLabelItalic: false, fontStyle: 'normal' }, bold: { isLabelBold: false, fontWeight: 'normal' }, underline: { isLabelUnderline: false, textDecoration: 'none' } } } } }, ranking: { isRankingEnabled: false, totalCoverage: 101, ranges: [{ from: '0%', to: '50%', coverage: 51, displayText: 'Failed' }, { from: '51%', to: '100%', coverage: 50, displayText: 'Passed' }] }, themeId: '', elementCount: 9, rules: {}, rulesAssociation: {}, headerFields: [], formMaxScore: 0, currentScore: 1, percentage: null })
    };
    await CommonQMNoUIUtils.createForm(formDetails, userToken);
    await manageFormsPO.navigate();
    await manageFormsPO.searchFormInGrid(formNames[0]);
    await manageFormsPO.openParticularForm(formNames[0]);
    await CommonUIUtils.waitUntilIconLoaderDone(page);
    await page.waitForSelector(formDesignerPage.elements.sectionFormElement)
    await formArea.clickSaveElementIcon('1. Radio1', 'radio');
    await formArea.clickSaveElementIcon('2. YesNo1', 'yesno');
    await formArea.clickSaveElementIcon('3. DateTime', 'datetime');
    await formArea.clickSaveElementIcon('4. OnlyTime', 'datetime');
    await formArea.clickSaveElementIcon('5. OnlyDate', 'datetime');
    await formArea.clickSaveElementIcon('www.google.com', 'hyperlink');
    await formArea.clickSaveElementIcon('6. LongText1', 'textarea');
    await formArea.clickSaveElementIcon('7. ShortText1', 'text');
    await formArea.clickSaveElementIcon('8. Checkbox1', 'checkbox');
    await formDesignerPage.clickOnQuestionBankTab();
    expect(Utils.isPresent(await questionBankComponentPo.getAQuestionElement('1. Radio1'))).toBeTruthy();
    expect(Utils.isPresent(await questionBankComponentPo.getAQuestionElement('2. YesNo1'))).toBeTruthy();
    expect(Utils.isPresent(await questionBankComponentPo.getAQuestionElement('3. DateTime'))).toBeTruthy();
    expect(Utils.isPresent(await questionBankComponentPo.getAQuestionElement('4. OnlyTime'))).toBeTruthy();
    expect(Utils.isPresent(await questionBankComponentPo.getAQuestionElement('5. OnlyDate'))).toBeTruthy();
    expect(Utils.isPresent(await questionBankComponentPo.getAQuestionElement('www.google.com'))).toBeTruthy();
    expect(Utils.isPresent(await questionBankComponentPo.getAQuestionElement('6. LongText1'))).toBeTruthy();
    expect(Utils.isPresent(await questionBankComponentPo.getAQuestionElement('7. ShortText1'))).toBeTruthy();
    expect(Utils.isPresent(await questionBankComponentPo.getAQuestionElement('8. Checkbox1'))).toBeTruthy();
});

When("should be able to search question in question bank", { timeout: 180 * 1000 }, async () => {
    await questionBankComponentPo.searchAQuestion('Checkbox1');
    expect(Utils.isPresent(await questionBankComponentPo.getAQuestionElement('8. Checkbox1'))).toBeTruthy();
    expect((await questionBankComponentPo.getAllQuestionElement()).length).toEqual(1);
});

Then("should show tooltip of a question bank question", { timeout: 180 * 1000 }, async () => {
    expect(await questionBankComponentPo.getTooltipOfQuestionText('Checkbox1')).toEqual('Checkbox\n' + 'Checkbox1');
    await formDesignerPage.clickOnQuestionBankTab(); //Just to close tooltip
});

Then("should be able to delete question from question bank", { timeout: 180 * 1000 }, async () => {
    await questionBankComponentPo.clearSearchQuestionTextBox();
    await questionBankComponentPo.deleteAQuestion('Checkbox1', true);
    expect(Utils.isPresent(await questionBankComponentPo.getAQuestionElement('Checkbox1'))).toBeFalsy();
    expect((await questionBankComponentPo.getAllQuestionElement()).length).toEqual(8);
});

Then("should be able to save question with same question text after deleting previous one", { timeout: 180 * 1000 }, async () => {
    await formDesignerPage.clickOnElementsTab();
    await formArea.clickSaveElementIcon('8. Checkbox1', 'checkbox');
    await formDesignerPage.clickOnQuestionBankTab();
    expect(Utils.isPresent(await questionBankComponentPo.getAQuestionElement('Checkbox1'))).toBeTruthy();
    expect((await questionBankComponentPo.getAllQuestionElement()).length).toEqual(9);
});

Then("should be able to apply froala editing to question, save to bank and verify changes after dragging question to form area", { timeout: 180 * 1000 }, async () => {
    await formArea.froalaSetLabel('8. Checkbox1', 'NewCheckbox1', 'checkbox');
    await formArea.clickSaveElementIcon('8. NewCheckbox1', 'checkbox');
    await formDesignerPage.clickOnQuestionBankTab();
    expect(Utils.isPresent(await questionBankComponentPo.getAQuestionElement('Checkbox1'))).toBeTruthy();
    expect(Utils.isPresent(await questionBankComponentPo.getAQuestionElement('NewCheckbox1'))).toBeTruthy();
    expect((await questionBankComponentPo.getAllQuestionElement()).length).toEqual(10);
    await questionBankComponentPo.dragAQuestionToFormArea('NewCheckbox1');
    expect(Utils.isPresent(await formArea.getElementOnFormArea('NewCheckbox1', 'checkbox'))).toBeTruthy();
});