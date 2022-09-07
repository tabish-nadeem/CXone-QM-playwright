
import { Page, expect } from "@playwright/test";
import { Given, When,Then, BeforeAll } from "cucumber";
import { GlobalTenantUtils } from "../../../../common/globalTenantUtils";
import { ChoiceListPropertiesComponentPo } from "../../../../pageObjects/choice-list-properties.component.po";
import { ElementAttributesComponentPo } from "../../../../pageObjects/element-attributes.component.po";
import { FormAreaComponentPo } from "../../../../pageObjects/form-area.component.po";
import FormDesignerPagePO from "../../../../pageObjects/form-designer-page.po";
import { LoginPage } from "../../../../common/login";
import { ELEMENT_TYPES, FEATURE_TOGGLES } from "../../../../common/uiConstants";
import { FeatureToggleUtils } from "../../../../common/FeatureToggleUtils";
import { Utils } from "../../../../common/utils";
import { DesignerToolbarComponentPO } from "../../../../pageObjects/designer-toolbar.component.po";
import { ScoringModalComponentPo } from "../../../../pageObjects/scoring-modal.component.po";
import { CreateEditRuleModalComponentPo } from "../../../../pageObjects/create-edit-rule-modal.component.po";
import { ManageFormsPO } from "../../../../pageObjects/manage-forms.po";
import { AccountUtils } from "../../../../common/AccountUtils";
import {fdUtils} from "../../../../common/FdUtils";


let formAreaComponentPo;
let formDesignerPagePO;
let elementAttributesComponentPo;
let choiceListPropertiesComponentPo;
let designerToolbarComponentPO;
let scoringModalComponentPo;
let testFormModalComponentPo;
let createEditRuleModalComponentPo;
let manageFormsPO;
let userToken;
let userDetails;
let formNames:string[];
let page: Page;

let globalTenantUtils:GlobalTenantUtils;
let loginPage:LoginPage;

BeforeAll({timeout: 300 * 1000}, async () => {
    formAreaComponentPo = new FormAreaComponentPo();
    formDesignerPagePO = new FormDesignerPagePO();
    elementAttributesComponentPo = new ElementAttributesComponentPo();
    choiceListPropertiesComponentPo = new ChoiceListPropertiesComponentPo();
    designerToolbarComponentPO = new DesignerToolbarComponentPO();
    scoringModalComponentPo = new ScoringModalComponentPo();
    testFormModalComponentPo = new TestFormModalComponentPo();
    createEditRuleModalComponentPo = new CreateEditRuleModalComponentPo();
    manageFormsPO = new ManageFormsPO(page.locator('#ng2-manage-forms-page'));
    userDetails = globalTenantUtils.getDefaultTenantCredentials();
    loginPage = new LoginPage(page);

    formNames = [
        'Form1' + AccountUtils.getRandomString(),
        'Form2' + AccountUtils.getRandomString(),
        'Form3' + AccountUtils.getRandomString(),
        'Form4' + AccountUtils.getRandomString()
    ];


    const onStart = async () => {
        userToken = await loginPage.login(userDetails.adminCreds.email, userDetails.adminCreds.password);
        await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);
        await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.RELEASE_NAVIGATION_REDESIGN, userDetails.orgName, userToken);
        await manageFormsPO.navigateTo();
    };

    
    const onEnd = async () => {
        await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);

        await loginPage.logout();
    };
});


Given ("STEP-1: Should verify critical question features for a scorable question - radio button", {timeout: 60 * 1000 }, async ()=> {
    let allPromises:any = [];
    await formDesignerPagePO.navigateTo();
    await formAreaComponentPo.dragElementToFormArea(ELEMENT_TYPES.RADIO);
    await designerToolbarComponentPO.clickOnScoringButton();
    await scoringModalComponentPo.clickEnableScoring();
    await scoringModalComponentPo.clickSaveButton();
    await formAreaComponentPo.clickElementOnFormArea('1. Set question', ELEMENT_TYPES.RADIO);
    await formAreaComponentPo.froalaSetLabel('1. Set question', 'RadioButton', ELEMENT_TYPES.RADIO);
    await choiceListPropertiesComponentPo.clickNACheckbox();
    await choiceListPropertiesComponentPo.clickMarkAsCriticalCheckbox();
    let text = await formAreaComponentPo.getMandatoryText();
    expect(text).toContain('Required');
    expect(text).toContain('Critical');
    let criticalQuestionHelpText = await elementAttributesComponentPo.getCriticalQuestionHelpText();
    expect(criticalQuestionHelpText).toEqual(fdUtils.getExpectedString('elementAttributeComponent.helpTextForCriticalQuestion'));
    await Utils.click(await formDesignerPagePO.getSaveFormButton());
    let errorText = await elementAttributesComponentPo.getCriticalQuestionAnswerNotSelectedError();
    expect(errorText).toEqual(fdUtils.getExpectedString('elementAttributeComponent.answerValidation'));
    await choiceListPropertiesComponentPo.clickCorrectAnswerChoiceFlag(1);
    await designerToolbarComponentPO.clickOnScoringButton();
    allPromises.push(
        scoringModalComponentPo.getCalculatedScore(),
        scoringModalComponentPo.getCurrentPoints()
    );
    let res = await Promise.all(allPromises);
    expect(res[0]).toEqual('Calculated weighted score : 0');
    expect(res[1]).toEqual('Current points : 0 of 1');
    await scoringModalComponentPo.clickCancelModalButton(false, false);
    await formAreaComponentPo.clickElementOnFormArea('1. RadioButton', ELEMENT_TYPES.RADIO);
    await formDesignerPagePO.saveFormAsDraft(formNames[0], true);
    await manageFormsPO.navigateTo();
    await manageFormsPO.searchFormInGrid(formNames[0]);
    await manageFormsPO.waitForSpinnerToDisappear();
    await manageFormsPO.openParticularForm(formNames[0]);
    await manageFormsPO.waitForSpinnerToDisappear();
    expect(Utils.isPresent(await formAreaComponentPo.getRequiredIcon('1. RadioButton', ELEMENT_TYPES.RADIO))).toBeTruthy();
    expect(Utils.isPresent(await formAreaComponentPo.getCriticalQuestionIcon('1. RadioButton', ELEMENT_TYPES.RADIO))).toBeTruthy();
    await formAreaComponentPo.clickElementOnFormArea('1. RadioButton', ELEMENT_TYPES.RADIO);
    await formAreaComponentPo.clickCopyElementIcon('1. RadioButton', ELEMENT_TYPES.RADIO);
    expect(Utils.isPresent(await formAreaComponentPo.getRequiredIcon('2. RadioButton', ELEMENT_TYPES.RADIO))).toBeTruthy();
    expect(Utils.isPresent(await formAreaComponentPo.getCriticalQuestionIcon('2. RadioButton', ELEMENT_TYPES.RADIO))).toBeTruthy();
    await formAreaComponentPo.clickDeleteElementIcon('2. RadioButton', ELEMENT_TYPES.RADIO);
})
When ("STEP-2: Should verify critical question in Test Form and in activated form",{timeout: 60 * 1000 },async () => {
    await formAreaComponentPo.clickElementOnFormArea('1. RadioButton', ELEMENT_TYPES.RADIO);
    await designerToolbarComponentPO.clickOnTestFormButton();
    await testFormModalComponentPo.clickOnValidateButton();
    expect(await testFormModalComponentPo.getErrorMessage('1. RadioButton')).toEqual(fdUtils.getExpectedString('elementListComponent.errorMsg'));
    await testFormModalComponentPo.selectChoices('1. RadioButton', 0);
    expect(await testFormModalComponentPo.getScore()).toEqual('100.00');
    await testFormModalComponentPo.selectChoices('1. RadioButton', 1);
    expect(await testFormModalComponentPo.getScore()).toEqual('0.00');
    await testFormModalComponentPo.clickOnValidateButton();
    await page.waitForSelector(await testFormModalComponentPo.getTestFormModal());
    await formDesignerPagePO.saveAndActivateForm();
    await manageFormsPO.waitForSpinnerToDisappear();
    await manageFormsPO.searchFormInGrid(formNames[0]);
    await manageFormsPO.searchFormInGrid(formNames[0]);
    await manageFormsPO.waitForSpinnerToDisappear();
    await manageFormsPO.openParticularForm(formNames[0]);
    await manageFormsPO.waitForSpinnerToDisappear();
    await formAreaComponentPo.clickElementOnFormArea('1. RadioButton', ELEMENT_TYPES.RADIO);
    await designerToolbarComponentPO.clickOnTestFormButton();
    await testFormModalComponentPo.selectChoices('1. RadioButton', 0);
    expect(await testFormModalComponentPo.getScore()).toEqual('100.00');
    await testFormModalComponentPo.clickOnValidateButton();
    await Utils.click(await formDesignerPagePO.getCloseButtonForActiveForm());
})
Then ("STEP-3: Should verify logic cannot be configured for critical question", {timeout: 60 * 1000 }, async () => {
    await formDesignerPagePO.navigateTo();
    await formAreaComponentPo.dragElementToFormArea(ELEMENT_TYPES.RADIO);
    await formAreaComponentPo.froalaSetLabel('1. Set question', 'RadioButton', ELEMENT_TYPES.RADIO);
    await formAreaComponentPo.dragElementToFormArea(ELEMENT_TYPES.RADIO);
    await formAreaComponentPo.froalaSetLabel('2. Set question', 'RadioButton2', ELEMENT_TYPES.RADIO);
    await choiceListPropertiesComponentPo.enterChoiceName(0, 'Choice 3');
    await choiceListPropertiesComponentPo.enterChoiceName(1, 'Choice 3');
    await designerToolbarComponentPO.clickOnScoringButton();
    await scoringModalComponentPo.clickEnableScoring();
    await scoringModalComponentPo.clickSaveButton();
    await formAreaComponentPo.clickElementOnFormArea('1. RadioButton', ELEMENT_TYPES.RADIO);
    await choiceListPropertiesComponentPo.clickMarkAsCriticalCheckbox();
    await choiceListPropertiesComponentPo.clickCorrectAnswerChoiceFlag(0);
    await formAreaComponentPo.clickAddRulesIcon('1. RadioButton', ELEMENT_TYPES.RADIO);
    await createEditRuleModalComponentPo.clickSetBtn();
    await formAreaComponentPo.clickElementOnFormArea('2. RadioButton2', ELEMENT_TYPES.RADIO);
    await choiceListPropertiesComponentPo.clickMarkAsCriticalCheckbox();
    let res = await formDesignerPagePO.getWarningMesaage();
    expect(res).toContain(fdUtils.getExpectedString('elementAttributeComponent.logicWarning'));
    await formDesignerPagePO.clickOnNoBtnInWarning();
    await choiceListPropertiesComponentPo.clickMarkAsCriticalCheckbox();
    await formDesignerPagePO.clickOnYesBtnInWarning();
    await choiceListPropertiesComponentPo.clickCorrectAnswerChoiceFlag(1);
    await formAreaComponentPo.clickElementOnFormArea('1. RadioButton', ELEMENT_TYPES.RADIO);
    await formAreaComponentPo.clickAddRulesIcon('1. RadioButton', ELEMENT_TYPES.RADIO);
    // let value = await createEditRuleModalComponentPo.getQuestionsDropdown('set-rule-result-question-0');
    // expect(value.trim()).toEqual('Select Item');
    await createEditRuleModalComponentPo.clickCloseButton();
})