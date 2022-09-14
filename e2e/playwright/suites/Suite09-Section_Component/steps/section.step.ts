import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
import { FormAreaComponentPo } from '../../../../pageObjects/form-area.component.po';
import { ManageFormsPO } from '../../../../pageObjects/manage-forms.po';
import FormDesignerPagePO from "../../../../pageObjects/form-designer-page.po";
import { OnPrepare } from '../../../../playwright.config';
import { LoginPage } from "../../../../common/login";
import { GlobalTenantUtils } from '../../../../common/globalTenantUtils';
import { CommonNoUIUtils } from '../../../../common/CommonNoUIUtils';
import {AccountUtils} from "../../../../common/AccountUtils";
import { FEATURE_TOGGLES } from "../../../../common/uiConstants";
import { FeatureToggleUtils } from '../../../../common/FeatureToggleUtils';
import {ELEMENT_TYPES} from "../../../../common/uiConstants";
import {CommonQMNoUIUtils} from "../../../../common/CommonQMNoUIUtils";

let page: Page;
let browser: any;
let context: BrowserContext;
let newOnPrepare:any;
let loginPage:any;
let formAreaComponentPo:any;
let formDesignerPagePO:any;
let manageFormsPO:any;
let userToken:any;
let userDetails:any;
let newGlobalTenantUtils:any;

formAreaComponentPo = new FormAreaComponentPo();
formDesignerPagePO = new FormDesignerPagePO();
manageFormsPO = new ManageFormsPO(page.locator('ng2-manage-forms-page'));
newGlobalTenantUtils = new GlobalTenantUtils();

let formNames = [
    'TestSectionForm1' + AccountUtils.getRandomString(),
    'TestSectionForm2' + AccountUtils.getRandomString(),
    'TestSectionForm3' + AccountUtils.getRandomString(),
    'TestSectionForm4' + AccountUtils.getRandomString()
];

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

    userDetails = await newGlobalTenantUtils.getDefaultTenantCredentials();
    userToken = await CommonNoUIUtils.login(userDetails.adminCreds.email, userDetails.adminCreds.password,true);
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.RELEASE_NAVIGATION_REDESIGN, userDetails.orgName, userToken);
    await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);
    await formDesignerPagePO.navigateTo();
    await formAreaComponentPo.getFormArea();
});

AfterAll({ timeout: 60 * 1000 }, async () => {
    await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);
    await loginPage.logout(true, 120000, userDetails.orgName, userToken);
    await browser.close();
});

Given("Step-1: should add elements inside the section and delete them", { timeout: 60 * 1000 }, async () => {

    let allPromises:any = [];
    await formAreaComponentPo.dragElementToFormArea(ELEMENT_TYPES.SECTION);
    await formAreaComponentPo.setLabel('1. Set Title', 'Section1', ELEMENT_TYPES.SECTION);
    allPromises.push(formAreaComponentPo.getCountOfElementsInForm());
    await formAreaComponentPo.dragElementToSection(ELEMENT_TYPES.LONG_TEXT, '1. Section1');
    await formAreaComponentPo.setLabel('1.1 Set question', 'TextBox1', ELEMENT_TYPES.LONG_TEXT);
    await formAreaComponentPo.dragElementToSection(ELEMENT_TYPES.LABEL, '1. Section1');
    await formAreaComponentPo.setLabel('Set Title', 'Label', ELEMENT_TYPES.LABEL);
    allPromises.push(formAreaComponentPo.getCountOfSectionElementsInForm());
    let res = await Promise.all(allPromises);
    expect(res[0]).toEqual(1);
    expect(res[1]).toEqual(2);
    await formAreaComponentPo.clickDeleteElementIcon('1. Section1', ELEMENT_TYPES.SECTION);

});

When("Step-2: should check numbering of form elements inside section", { timeout: 60 * 1000 }, async () => {

    let promises:any = [];
    await formAreaComponentPo.dragElementToFormArea(ELEMENT_TYPES.SECTION);
    await formAreaComponentPo.setLabel('1. Set Title', 'Section1', ELEMENT_TYPES.SECTION);
    for (let i = 0; i <= 4; i = i + 1) {
        promises.push(await formAreaComponentPo.dragElementToSection(ELEMENT_TYPES.SHORT_TEXT, '1. Section1'),
            await formAreaComponentPo.setLabel('1.1 Set question', 'Label1', ELEMENT_TYPES.SHORT_TEXT));
    }
    await Promise.all(promises);
    promises = [];
    for (let i = 1; i <= 5; i = i + 1) {
        promises.push(await formAreaComponentPo.getNumbering(i));
    }
    let res = await Promise.all(promises);
    expect(res[0]).toEqual('1.1');
    expect(res[1]).toEqual('1.2');
    expect(res[2]).toEqual('1.3');
    expect(res[3]).toEqual('1.4');
    expect(res[4]).toEqual('1.5');

});

Then("Step-3: should add a section and add label elements inside it, and delete one label", { timeout: 60 * 1000 }, async () => {

    await formAreaComponentPo.clickDeleteElementIcon('1.1 Label1', ELEMENT_TYPES.SHORT_TEXT);
    let count = await formAreaComponentPo.getCountOfSectionElementsInForm();
    expect(count).toEqual(4);
    await formAreaComponentPo.clickDeleteElementIcon('1.1 Label1', ELEMENT_TYPES.SHORT_TEXT);
    count = await formAreaComponentPo.getCountOfSectionElementsInForm();
    expect(count).toEqual(3);
    await formAreaComponentPo.clickDeleteElementIcon('1. Section1', ELEMENT_TYPES.SECTION);

});

Then("Step-4: should add a section and duplicate elements inside section", { timeout: 60 * 1000 }, async () => {

    let allPromises:any = [];
    await formAreaComponentPo.dragElementToFormArea(ELEMENT_TYPES.SECTION);
    await formAreaComponentPo.setLabel('1. Set Title', 'Section1', ELEMENT_TYPES.SECTION);
    allPromises.push(
        await formAreaComponentPo.dragElementToSection(ELEMENT_TYPES.SHORT_TEXT, '1. Section1'),
        await formAreaComponentPo.setLabel('1.1 Set question', 'TextBox1', ELEMENT_TYPES.SHORT_TEXT)
    );
    await Promise.all(allPromises);
    await formAreaComponentPo.clickCopyElementIcon('1.1 TextBox1', ELEMENT_TYPES.SHORT_TEXT);
    await formAreaComponentPo.setLabel('1.1 TextBox1', 'TextBox2', ELEMENT_TYPES.SHORT_TEXT);
    allPromises.push(await formAreaComponentPo.getCountOfSectionElementsInForm(),
        await formAreaComponentPo.getCountOfElementsInForm());
    await formAreaComponentPo.clickDeleteElementIcon('1. Section1', ELEMENT_TYPES.SECTION);
    let res = await Promise.all(allPromises);
    expect(res[2]).toEqual(2);
    expect(res[3]).toEqual(1);
});

Then("Step-5: should add some elements, reorder them and delete all and click on form designer page", { timeout: 60 * 1000 }, async () => {

    await formAreaComponentPo.dragElementToFormArea(ELEMENT_TYPES.RADIO);
    await formAreaComponentPo.setLabel('1. Set question', 'RadioButton1', ELEMENT_TYPES.RADIO);
    await formAreaComponentPo.dragElementToFormArea(ELEMENT_TYPES.YESNO);
    await formAreaComponentPo.setLabel('2. Set question', 'Yes/No1', ELEMENT_TYPES.YESNO);
    await formAreaComponentPo.dragElementToFormArea(ELEMENT_TYPES.CHECKBOX);
    await formAreaComponentPo.setLabel('3. Set question', 'Checkbox1', ELEMENT_TYPES.CHECKBOX);
    await formAreaComponentPo.moveElementIndexToIndex(0, 2);
    await formAreaComponentPo.moveElementIndexToIndex(0, 1);
    await formAreaComponentPo.clickDeleteElementIcon('1. Checkbox1', ELEMENT_TYPES.CHECKBOX);
    await formAreaComponentPo.clickDeleteElementIcon('1. Yes/No1', ELEMENT_TYPES.YESNO);
    await formAreaComponentPo.clickDeleteElementIcon('1. RadioButton1', ELEMENT_TYPES.RADIO);
    expect(await formAreaComponentPo.getCountOfElementsInForm()).toEqual(0);
});

Then("Step-6: should not allow to drop a section under section-RAIN-416", { timeout: 60 * 1000 }, async () => {

    let allPromises:any = [];
    allPromises.push(
        await formAreaComponentPo.dragElementToFormArea(ELEMENT_TYPES.SECTION),
        await formAreaComponentPo.setLabel('1. Set Title', 'Section1', ELEMENT_TYPES.SECTION)
    );
    allPromises.push(await formAreaComponentPo.dragElementToSection(ELEMENT_TYPES.SECTION, '1. Section1'),
        await formAreaComponentPo.setLabel('1. Set Title', 'Section2', ELEMENT_TYPES.SECTION),
        await formAreaComponentPo.getCountOfElementsInForm()
    );
    let res = await Promise.all(allPromises);
    expect(res[4]).toEqual(2);
    await formAreaComponentPo.clickDeleteElementIcon('1. Section2', ELEMENT_TYPES.SECTION);
    await formAreaComponentPo.clickDeleteElementIcon('1. Section1', ELEMENT_TYPES.SECTION);
});

Then("Step-7: should drag and drop two sections and move element from section to section", { timeout: 60 * 1000 }, async () => {

    let promises:any = [];
    await formAreaComponentPo.dragElementToFormArea(ELEMENT_TYPES.SECTION);
    await formAreaComponentPo.setLabel('1. Set Title', 'Section1', ELEMENT_TYPES.SECTION);
    await formAreaComponentPo.dragElementToFormArea(ELEMENT_TYPES.SECTION);
    await formAreaComponentPo.setLabel('2. Set Title', 'Section2', ELEMENT_TYPES.SECTION);
    await formAreaComponentPo.dragElementToSection(ELEMENT_TYPES.CHECKBOX, '1. Section1');
    await formAreaComponentPo.setLabel('1.1 Set question', 'Checkbox', ELEMENT_TYPES.CHECKBOX);
    for (let i = 0; i <= 2; i = i + 1) {
        promises.push(await formAreaComponentPo.getNumbering(i));
    }
    let res = await Promise.all(promises);
    expect(res[0]).toEqual('1.');
    expect(res[1]).toEqual('1.1');
    expect(res[2]).toEqual('2.');
    await formAreaComponentPo.clickElementInsideSection('1.1 Checkbox', ELEMENT_TYPES.CHECKBOX);
    await formAreaComponentPo.dragElementSectionToSection('1.1 Checkbox', ELEMENT_TYPES.CHECKBOX, '2. Section2');
    promises = [];
    for (let i = 0; i <= 2; i = i + 1) {
        promises.push(await formAreaComponentPo.getNumbering(i));
    }
    let responses = await Promise.all(promises);
    expect(responses[0]).toEqual('1.');
    expect(responses[1]).toEqual('2.');
    expect(responses[2]).toEqual('2.1');
    await formAreaComponentPo.clickDeleteElementIcon('1. Section1', ELEMENT_TYPES.SECTION);
    await formAreaComponentPo.clickDeleteElementIcon('1. Section2', ELEMENT_TYPES.SECTION);
});

Then("Step-8: should add sections and reorder them", { timeout: 60 * 1000 }, async () => {

    let formDetails:any = {
        formName: formNames[0],
        formStatus: 'Draft',
        formType: 'EVALUATION',
        formData: JSON.stringify({
            formTitle: '',
            elements: [{
                id: 1052793611851,
                uuid: '4bda4fe5-b3d0-4c70-9e77-5d397b79e6ad',
                type: 'section',
                elementData: {
                    sectionElementData: [],
                    attributes: {
                        isScorable: false,
                        question: 'Set Title',
                        backgroundColor: '#ffffff',
                        fontStyling: {
                            font: 'OpenSans',
                            fontSize: 18,
                            fontColor: '#5b788e',
                            fontIndent: 'left',
                            bold: { isLabelBold: false, fontWeight: 'normal' },
                            italic: { isLabelItalic: false, fontStyle: 'normal' },
                            underline: { isLabelUnderline: false, textDecoration: 'none' }
                        },
                        visible: true,
                        appliedRuleCount: 0,
                        questionHTML: 'PHA+PHNwYW4gc3R5bGU9ImZvbnQtZmFtaWx5OidPcGVuU2Fucyc7Zm9udC1zaXplOjE4cHg7Y29sb3I6IzViNzg4ZTsiPlNlY3Rpb24xPC9zcGFuPjwvcD4=',
                        numbering: 1,
                        showNumbering: true,
                        showNumberingDot: true
                    }
                },
                $$hashKey: 'object:1581'
            }, {
                id: 1055881969885,
                uuid: 'e9ecefb9-ac8b-4985-8c1f-2dbf7199aa4a',
                type: 'section',
                elementData: {
                    sectionElementData: [],
                    attributes: {
                        isScorable: false,
                        question: 'Set Title',
                        backgroundColor: '#ffffff',
                        fontStyling: {
                            font: 'OpenSans',
                            fontSize: 18,
                            fontColor: '#5b788e',
                            fontIndent: 'left',
                            bold: { isLabelBold: false, fontWeight: 'normal' },
                            italic: { isLabelItalic: false, fontStyle: 'normal' },
                            underline: { isLabelUnderline: false, textDecoration: 'none' }
                        },
                        visible: true,
                        appliedRuleCount: 0,
                        questionHTML: 'PHA+PHNwYW4gc3R5bGU9XCJmb250LWZhbWlseTonT3BlblNhbnMnO2ZvbnQtc2l6ZToxOHB4O2NvbG9yOiM1Yjc4OGU7XCI+U2VjdGlvbjI8L3NwYW4+PC9wPg==',
                        numbering: 2,
                        showNumbering: true,
                        showNumberingDot: true
                    }
                },
                $$hashKey: 'object:1682'
            }, {
                id: 1057704726268,
                uuid: 'cdb95da0-7445-4c5b-922e-1b2bc4c92560',
                type: 'section',
                elementData: {
                    sectionElementData: [],
                    attributes: {
                        isScorable: false,
                        question: 'Set Title',
                        backgroundColor: '#ffffff',
                        fontStyling: {
                            font: 'OpenSans',
                            fontSize: 18,
                            fontColor: '#5b788e',
                            fontIndent: 'left',
                            bold: { isLabelBold: false, fontWeight: 'normal' },
                            italic: { isLabelItalic: false, fontStyle: 'normal' },
                            underline: { isLabelUnderline: false, textDecoration: 'none' }
                        },
                        visible: true,
                        appliedRuleCount: 0,
                        questionHTML: 'PHA+PHNwYW4gc3R5bGU9XCJmb250LWZhbWlseTonT3BlblNhbnMnO2ZvbnQtc2l6ZToxOHB4O2NvbG9yOiM1Yjc4OGU7XCI+U2VjdGlvbjM8L3NwYW4+PC9wPg==',
                        numbering: 3,
                        showNumbering: true,
                        showNumberingDot: true
                    }
                },
                $$hashKey: 'object:1713'
            }, {
                id: 1037273380912,
                uuid: '7f5ce9ad-ab4a-4000-831e-871565f4e43c',
                type: 'section',
                elementData: {
                    sectionElementData: [],
                    attributes: {
                        isScorable: false,
                        question: 'Set Title',
                        backgroundColor: '#ffffff',
                        fontStyling: {
                            font: 'OpenSans',
                            fontSize: 18,
                            fontColor: '#5b788e',
                            fontIndent: 'left',
                            bold: { isLabelBold: false, fontWeight: 'normal' },
                            italic: { isLabelItalic: false, fontStyle: 'normal' },
                            underline: { isLabelUnderline: false, textDecoration: 'none' }
                        },
                        visible: true,
                        appliedRuleCount: 0,
                        questionHTML: 'PHA+PHNwYW4gc3R5bGU9XCJmb250LWZhbWlseTonT3BlblNhbnMnO2ZvbnQtc2l6ZToxOHB4O2NvbG9yOiM1Yjc4OGU7XCI+U2VjdGlvbjQ8L3NwYW4+PC9wPg==',
                        numbering: 4,
                        showNumbering: true,
                        showNumberingDot: true
                    }
                },
                $$hashKey: 'object:1700'
            }],
            theme: {
                themeId: '',
                themeName: '',
                isDefault: true,
                themeLogo: '',
                themeData: {
                    imgWidth: 243,
                    imgHeight: 30,
                    isAspectRatioChecked: true,
                    logoAspectRatio: 8.1,
                    bgColor: '#ffffff',
                    numberingEnabled: true,
                    title: {
                        text: '',
                        font: 'OpenSans',
                        fontSize: 18,
                        fontStyling: {
                            fontColor: '#2e2e2e',
                            italic: { isLabelItalic: false, fontStyle: 'normal' },
                            bold: { isLabelBold: true, fontWeight: 'bold' },
                            underline: { isLabelUnderline: false, textDecoration: 'none' }
                        }
                    },
                    subTitle: {
                        text: '',
                        font: 'OpenSans',
                        fontSize: 14,
                        fontStyling: {
                            fontColor: '#707070',
                            italic: { isLabelItalic: false, fontStyle: 'normal' },
                            bold: { isLabelBold: false, fontWeight: 'normal' },
                            underline: { isLabelUnderline: false, textDecoration: 'none' }
                        }
                    }
                }
            },
            ranking: {
                isRankingEnabled: false,
                totalCoverage: 101,
                ranges: [{
                    from: '0%',
                    to: '50%',
                    coverage: 51,
                    displayText: 'Failed'
                }, { from: '51%', to: '100%', coverage: 50, displayText: 'Passed' }]
            },
            themeId: '',
            elementCount: 4,
            rules: {},
            rulesAssociation: {},
            rulesAssociationV2: {},
            headerFields: [],
            formMaxScore: 0,
            currentScore: 0,
            percentage: null,
            workflowConfigurationId: '11e9b8eb-b2dc-5400-9b85-0242ac110002'
        })
    };
    await CommonQMNoUIUtils.createForm(formDetails, userToken);
    console.log('Form used :', formNames[0]);
    await formDesignerPagePO.navigateTo();
    await manageFormsPO.navigateTo();
    await manageFormsPO.searchFormInGrid(formNames[0]);
    await manageFormsPO.waitForSpinnerToDisappear();
    await manageFormsPO.openParticularForm(formNames[0]);
    await manageFormsPO.waitForSpinnerToDisappear();
    await page.waitForSelector(await formDesignerPagePO.getCloseFormButton());
    await formAreaComponentPo.moveElementIndexToIndex(0, 2);
    let text = await formAreaComponentPo.getQuestionTextOfAnElement(page.locator('.form-element-div')).get(0);
    await formDesignerPagePO.navigateTo();
    expect(text).toContain('Section2');

});

Then("Step-9: should drag and drop section and elements and move element inside section", { timeout: 60 * 1000 }, async () => {

    let formDetails:any = {
        formName: formNames[1],
        formStatus: 'Draft',
        formType: 'EVALUATION',
        formData: JSON.stringify({
            formTitle: '',
            elements: [{
                id: 1077259508451,
                uuid: 'e8539ba2-1dde-478c-80c5-eba034546442',
                type: 'section',
                elementData: {
                    sectionElementData: [],
                    attributes: {
                        isScorable: false,
                        question: 'Set Title',
                        backgroundColor: '#ffffff',
                        fontStyling: {
                            font: 'OpenSans',
                            fontSize: 18,
                            fontColor: '#5b788e',
                            fontIndent: 'left',
                            bold: { isLabelBold: false, fontWeight: 'normal' },
                            italic: { isLabelItalic: false, fontStyle: 'normal' },
                            underline: { isLabelUnderline: false, textDecoration: 'none' }
                        },
                        visible: true,
                        appliedRuleCount: 0,
                        questionHTML: 'PHA+PHNwYW4gc3R5bGU9XCJmb250LWZhbWlseTonT3BlblNhbnMnO2ZvbnQtc2l6ZToxOHB4O2NvbG9yOiM1Yjc4OGU7XCI+U2VjdGlvbjE8L3NwYW4+PC9wPg==',
                        numbering: 1,
                        showNumbering: true,
                        showNumberingDot: true
                    }
                },
                $$hashKey: 'object:410'
            }, {
                id: 1003604246231,
                uuid: '0ef245ef-32e3-4269-8a2e-e0096ca5cd28',
                type: 'section',
                elementData: {
                    sectionElementData: [],
                    attributes: {
                        isScorable: false,
                        question: 'Set Title',
                        backgroundColor: '#ffffff',
                        fontStyling: {
                            font: 'OpenSans',
                            fontSize: 18,
                            fontColor: '#5b788e',
                            fontIndent: 'left',
                            bold: { isLabelBold: false, fontWeight: 'normal' },
                            italic: { isLabelItalic: false, fontStyle: 'normal' },
                            underline: { isLabelUnderline: false, textDecoration: 'none' }
                        },
                        visible: true,
                        appliedRuleCount: 0,
                        questionHTML: 'PHA+PHNwYW4gc3R5bGU9XCJmb250LWZhbWlseTonT3BlblNhbnMnO2ZvbnQtc2l6ZToxOHB4O2NvbG9yOiM1Yjc4OGU7XCI+U2VjdGlvbjI8L3NwYW4+PC9wPg==',
                        numbering: 2,
                        showNumbering: true,
                        showNumberingDot: true
                    }
                },
                $$hashKey: 'object:425'
            }, {
                id: 1023556506813,
                uuid: '3919aa9e-2792-4b29-a697-13fe35bc8790',
                type: 'radio',
                elementData: {
                    attributes: {
                        elementType: 'radio',
                        maxScore: 1,
                        isScorable: true,
                        isScoringEnabledForQuestion: true,
                        question: 'Set question',
                        answer: '',
                        layout: 'vertical',
                        required: false,
                        showErrorMsg: false,
                        fontStyling: {
                            font: 'OpenSans',
                            fontSize: 14,
                            fontColor: '#000000',
                            fontIndent: 'left',
                            bold: { isLabelBold: true, fontWeight: 'bold' },
                            italic: { isLabelItalic: false, fontStyle: 'normal' },
                            underline: { isLabelUnderline: false, textDecoration: 'none' }
                        },
                        visible: true,
                        appliedRuleCount: 0,
                        logic: true,
                        isCritical: false,
                        subText: '',
                        choiceList: [{
                            label: 'Choice 1',
                            value: '1',
                            criticalQuestionCorrectChoice: true,
                            score: 1,
                            $$hashKey: 'object:473'
                        }, {
                            label: 'Choice 2',
                            value: '2',
                            criticalQuestionCorrectChoice: true,
                            score: 1,
                            $$hashKey: 'object:474'
                        }],
                        questionHTML: 'PHA+PHN0cm9uZz48c3BhbiBzdHlsZT1cImZvbnQtZmFtaWx5OidPcGVuU2Fucyc7Zm9udC1zaXplOjE0cHg7Y29sb3I6IzAwMDAwMDtcIj5SYWRpb0J1dHRvbjE8L3NwYW4+PC9zdHJvbmc+PC9wPg==',
                        numbering: 3,
                        showNumbering: true,
                        showNumberingDot: true
                    }
                },
                $$hashKey: 'object:439'
            }, {
                id: 1058980187637,
                uuid: 'eef070e5-48f5-4e24-8663-ff187c3dd78d',
                type: 'radio',
                elementData: {
                    attributes: {
                        elementType: 'radio',
                        maxScore: 1,
                        isScorable: true,
                        isScoringEnabledForQuestion: true,
                        question: 'Set question',
                        answer: '',
                        layout: 'vertical',
                        required: false,
                        showErrorMsg: false,
                        fontStyling: {
                            font: 'OpenSans',
                            fontSize: 14,
                            fontColor: '#000000',
                            fontIndent: 'left',
                            bold: { isLabelBold: true, fontWeight: 'bold' },
                            italic: { isLabelItalic: false, fontStyle: 'normal' },
                            underline: { isLabelUnderline: false, textDecoration: 'none' }
                        },
                        visible: true,
                        appliedRuleCount: 0,
                        logic: true,
                        isCritical: false,
                        subText: '',
                        choiceList: [{
                            label: 'Choice 1',
                            value: '1',
                            criticalQuestionCorrectChoice: true,
                            score: 1,
                            $$hashKey: 'object:503'
                        }, {
                            label: 'Choice 2',
                            value: '2',
                            criticalQuestionCorrectChoice: true,
                            score: 1,
                            $$hashKey: 'object:504'
                        }],
                        questionHTML: 'PHA+PHN0cm9uZz48c3BhbiBzdHlsZT1cImZvbnQtZmFtaWx5OidPcGVuU2Fucyc7Zm9udC1zaXplOjE0cHg7Y29sb3I6IzAwMDAwMDtcIj5SYWRpb0J1dHRvbjI8L3NwYW4+PC9zdHJvbmc+PC9wPg==',
                        numbering: 4,
                        showNumbering: true,
                        showNumberingDot: true
                    }
                },
                $$hashKey: 'object:480'
            }],
            theme: {
                themeId: '',
                themeName: '',
                isDefault: true,
                themeLogo: '',
                themeData: {
                    imgWidth: 243,
                    imgHeight: 30,
                    isAspectRatioChecked: true,
                    logoAspectRatio: 8.1,
                    bgColor: '#ffffff',
                    numberingEnabled: true,
                    title: {
                        text: '',
                        font: 'OpenSans',
                        fontSize: 18,
                        fontStyling: {
                            fontColor: '#2e2e2e',
                            italic: { isLabelItalic: false, fontStyle: 'normal' },
                            bold: { isLabelBold: true, fontWeight: 'bold' },
                            underline: { isLabelUnderline: false, textDecoration: 'none' }
                        }
                    },
                    subTitle: {
                        text: '',
                        font: 'OpenSans',
                        fontSize: 14,
                        fontStyling: {
                            fontColor: '#707070',
                            italic: { isLabelItalic: false, fontStyle: 'normal' },
                            bold: { isLabelBold: false, fontWeight: 'normal' },
                            underline: { isLabelUnderline: false, textDecoration: 'none' }
                        }
                    }
                }
            },
            ranking: {
                isRankingEnabled: false,
                totalCoverage: 101,
                ranges: [{
                    from: '0%',
                    to: '50%',
                    coverage: 51,
                    displayText: 'Failed'
                }, { from: '51%', to: '100%', coverage: 50, displayText: 'Passed' }]
            },
            themeId: '',
            elementCount: 4,
            rules: {},
            rulesAssociation: {},
            rulesAssociationV2: {},
            headerFields: [],
            formMaxScore: 0,
            currentScore: 0,
            percentage: null,
            workflowConfigurationId: '11e9b8eb-b2dc-5400-9b85-0242ac110002'
        })
    };
    await CommonQMNoUIUtils.createForm(formDetails, userToken);
    console.log('Form used :', formNames[1]);
    await manageFormsPO.navigateTo();
    await manageFormsPO.searchFormInGrid(formNames[1]);
    await manageFormsPO.waitForSpinnerToDisappear();
    await manageFormsPO.openParticularForm(formNames[1]);
    await manageFormsPO.waitForSpinnerToDisappear();
    await formAreaComponentPo.clickElementOnFormArea('3. RadioButton1', ELEMENT_TYPES.RADIO);
    await formAreaComponentPo.dragElementFromFormAreaToSection(ELEMENT_TYPES.RADIO, '1. Section1');
    await formAreaComponentPo.clickElementOnFormArea('1. Section1', ELEMENT_TYPES.SECTION);
    let res = await formAreaComponentPo.getCountOfElementsInForm();
    expect(res).toEqual(3);
    await formDesignerPagePO.navigateTo();
});

Then("Step-10: should drag and drop section and element inside section and move element outside section", { timeout: 60 * 1000 }, async () => {

    let formDetails:any = {
        formName: formNames[2],
        formStatus: 'Draft',
        formType: 'EVALUATION',
        formData: JSON.stringify({
            formTitle: '',
            elements: [{
                id: 1052793611851,
                uuid: '4bda4fe5-b3d0-4c70-9e77-5d397b79e6ad',
                type: 'section',
                elementData: {
                    sectionElementData: [{
                        id: 1043909077721,
                        uuid: '2cd12bd3-67a8-4cf3-a385-73406877b6d6',
                        type: 'checkbox',
                        elementData: {
                            attributes: {
                                elementType: 'checkbox',
                                maxScore: 2,
                                isScorable: true,
                                isScoringEnabledForQuestion: true,
                                question: 'Set question',
                                answer: [],
                                layout: 'vertical',
                                required: false,
                                showErrorMsg: false,
                                fontStyling: {
                                    font: 'OpenSans',
                                    fontSize: 14,
                                    fontColor: '#000000',
                                    fontIndent: 'left',
                                    bold: { isLabelBold: true, fontWeight: 'bold' },
                                    italic: { isLabelItalic: false, fontStyle: 'normal' },
                                    underline: { isLabelUnderline: false, textDecoration: 'none' }
                                },
                                visible: true,
                                appliedRuleCount: 0,
                                logic: true,
                                isCritical: false,
                                subText: '',
                                choiceList: [{
                                    label: 'Choice 1',
                                    value: '1',
                                    criticalQuestionCorrectChoice: true,
                                    score: 1,
                                    selected: false,
                                    $$hashKey: 'object:2531'
                                }, {
                                    label: 'Choice 2',
                                    value: '2',
                                    criticalQuestionCorrectChoice: true,
                                    score: 1,
                                    selected: false,
                                    $$hashKey: 'object:2532'
                                }],
                                questionHTML: 'PHA+Q2hlY2tib3gxPC9wPg==',
                                numbering: '1.1',
                                showNumbering: true,
                                showNumberingDot: false
                            }
                        },
                        $$hashKey: 'object:2490'
                    }],
                    attributes: {
                        isScorable: false,
                        question: 'Set Title',
                        backgroundColor: '#ffffff',
                        fontStyling: {
                            font: 'OpenSans',
                            fontSize: 18,
                            fontColor: '#5b788e',
                            fontIndent: 'left',
                            bold: { isLabelBold: false, fontWeight: 'normal' },
                            italic: { isLabelItalic: false, fontStyle: 'normal' },
                            underline: { isLabelUnderline: false, textDecoration: 'none' }
                        },
                        visible: true,
                        appliedRuleCount: 0,
                        questionHTML: 'PHA+PHNwYW4gc3R5bGU9XCJmb250LWZhbWlseTonT3BlblNhbnMnO2ZvbnQtc2l6ZToxOHB4O2NvbG9yOiM1Yjc4OGU7XCI+U2VjdGlvbjE8L3NwYW4+PC9wPg==',
                        numbering: 1,
                        showNumbering: true,
                        showNumberingDot: true
                    }
                },
                $$hashKey: 'object:1581'
            }],
            theme: {
                themeId: '',
                themeName: '',
                isDefault: true,
                themeLogo: '',
                themeData: {
                    imgWidth: 243,
                    imgHeight: 30,
                    isAspectRatioChecked: true,
                    logoAspectRatio: 8.1,
                    bgColor: '#ffffff',
                    numberingEnabled: true,
                    title: {
                        text: '',
                        font: 'OpenSans',
                        fontSize: 18,
                        fontStyling: {
                            fontColor: '#2e2e2e',
                            italic: { isLabelItalic: false, fontStyle: 'normal' },
                            bold: { isLabelBold: true, fontWeight: 'bold' },
                            underline: { isLabelUnderline: false, textDecoration: 'none' }
                        }
                    },
                    subTitle: {
                        text: '',
                        font: 'OpenSans',
                        fontSize: 14,
                        fontStyling: {
                            fontColor: '#707070',
                            italic: { isLabelItalic: false, fontStyle: 'normal' },
                            bold: { isLabelBold: false, fontWeight: 'normal' },
                            underline: { isLabelUnderline: false, textDecoration: 'none' }
                        }
                    }
                }
            },
            ranking: {
                isRankingEnabled: false,
                totalCoverage: 101,
                ranges: [{
                    from: '0%',
                    to: '50%',
                    coverage: 51,
                    displayText: 'Failed'
                }, { from: '51%', to: '100%', coverage: 50, displayText: 'Passed' }]
            },
            themeId: '',
            elementCount: 2,
            rules: {},
            rulesAssociation: {},
            rulesAssociationV2: {},
            headerFields: [],
            formMaxScore: 0,
            currentScore: 0,
            percentage: null,
            workflowConfigurationId: '11e9b8eb-b2dc-5400-9b85-0242ac110002'
        })
    };
    await CommonQMNoUIUtils.createForm(formDetails, userToken);
    console.log('Form used :', formNames[2]);
    await manageFormsPO.navigateTo();
    await manageFormsPO.searchFormInGrid(formNames[2]);
    await manageFormsPO.waitForSpinnerToDisappear();
    await manageFormsPO.openParticularForm(formNames[2]);
    await manageFormsPO.waitForSpinnerToDisappear();
    expect(await formAreaComponentPo.getCountOfElementsInForm()).toEqual(1);
    await formAreaComponentPo.clickElementOnFormArea('1.1 Checkbox1', ELEMENT_TYPES.CHECKBOX);
    await formAreaComponentPo.dragElementOutsideSection('1.1 Checkbox1', ELEMENT_TYPES.CHECKBOX);
    expect(await formAreaComponentPo.getCountOfElementsInForm()).toEqual(2);
    await formDesignerPagePO.navigateTo();
});