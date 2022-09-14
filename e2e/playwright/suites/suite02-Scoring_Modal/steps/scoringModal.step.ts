import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
import { Utils } from '../../../../common/utils';
import { GlobalTenantUtils } from '../../../../common/globalTenantUtils';
import { FeatureToggleUtils } from '../../../../common/FeatureToggleUtils';
import * as _ from 'lodash';
import FormDesignerPagePO from '../../../../pageObjects/form-designer-page.po';
import { FormAreaComponentPo } from '../../../../pageObjects/form-area.component.po';
import { DesignerToolbarComponentPO } from '../../../../pageObjects/designer-toolbar.component.po';
import { ScoringModalComponentPo } from '../../../../pageObjects/scoring-modal.component.po';
import { ElementAttributesComponentPo } from '../../../../pageObjects/element-attributes.component.po';
import { ManageFormsPO } from '../../../../pageObjects/manage-forms.po';
import { LoginPage } from '../../../../common/login';
import { FEATURE_TOGGLES } from '../../../../common/uiConstants';
let _ = require('lodash');
let browser: any;
let context: BrowserContext;
let page: Page;
let formDesignerPage;
let formArea;
let designerToolbar;
let scoringModal;
let elementAttributes;
let manageFormsPO;
let loginPage:LoginPage;
let userToken: any ;
let userDetails ;
let globalTenantUtils:GlobalTenantUtils;


BeforeAll({ timeout: 300 * 1000 }, async () => {
    browser = await chromium.launch({
        headless: false,
        args: ['--window-position=-8,0']
    });
    context = await browser.newContext();
    page = await context.newPage();
    userDetails = globalTenantUtils.getDefaultTenantCredentials();
    formDesignerPage = new FormDesignerPagePO();
    formArea = new FormAreaComponentPo();
    designerToolbar = new DesignerToolbarComponentPO();
    scoringModal = new ScoringModalComponentPo();
    elementAttributes = new ElementAttributesComponentPo();
    manageFormsPO = new ManageFormsPO(page);
    loginPage = new LoginPage(page);
    userToken = await loginPage.login(userDetails.adminCreds.email, userDetails.adminCreds.password);
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken)
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.RELEASE_NAVIGATION_REDESIGN, userDetails.orgName, userToken)
    await manageFormsPO.navigateTo();    
    await formDesignerPage.navigateTo();
    await page.waitForSelector(await formArea.getFormArea());
});

AfterAll({ timeout: 400 * 1000}, async () =>{
    await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);
    await loginPage.logout();
})



Given("Step 1: Scoring modal should open after clicking on scoring button and Should close after clicking on set/cancel button",{timeout: 60 * 1000 }, async () => {
    await formArea.dragElementToFormArea('section');
    await formArea.dragElementToFormArea('text');
    await formArea.dragElementToFormArea('radio');
    await formArea.dragElementToSection('radio', '1. Set Title');
    await designerToolbar.clickOnScoringButton();
    
    expect(await Utils.isEnabled(scoringModal.getScoringModal())).toBe(true);
    await scoringModal.clickCancelModalButton(false, true);
    expect(await Utils.isPresent(await scoringModal.getSaveButton())).toBe(false);
    expect(await Utils.isPresent(await scoringModal.getCancelModalButton())).toBe(false);
});

When("Step-2: Scoring modal should open with default values to the radio button", { timeout: 180 * 1000 }, async () => {
    await formArea.dragElementToFormArea('radio');
    await designerToolbar.clickOnScoringButton();
    expect(await scoringModal.getScoringOfQuestionOption('1. Set question', 0)).toBe('1');
    expect(await scoringModal.getScoringOfQuestionOption('1. Set question', 1)).toBe('1');
    expect(await Utils.isEnabled(await scoringModal.getSaveButton())).toBe(false);
    await scoringModal.clickCancelModalButton(false, true);
    await formArea.dragElementToFormArea('checkbox');
    await designerToolbar.clickOnScoringButton();
    expect(await scoringModal.getScoringOfQuestionOption('2. Set question', 0)).toBe('1');
    expect(await scoringModal.getScoringOfQuestionOption('2. Set question', 1)).toBe('1');
    expect(await Utils.isEnabled(await scoringModal.getSaveButton())).toBe(false);
    expect(await Utils.isEnabled(await scoringModal.getCancelModalButton())).toBe(true);
});

Then("STEP-3: Scoring modal should open with default values to the checkbox after adding multiple options", { timeout: 180 * 1000 }, async () => {
    await formArea.dragElementToFormArea('checkbox');
    await designerToolbar.clickOnScoringButton();
    expect(await scoringModal.getMaxPointsOfQuestion('1. Set question')).toEqual('Max Points:2');
    await scoringModal.clickCancelModalButton(false, true);
    await formArea.clickElementOnFormArea('1. Set question','checkbox');
    await elementAttributes.clickAddMultipleButton();
    await elementAttributes.addMultipleModal.enterChoice('List Value1');
    await elementAttributes.addMultipleModal.enterChoice('List Value2');
    await elementAttributes.addMultipleModal.enterChoice('List Value3');
    await elementAttributes.addMultipleModal.clickAddButton();
    await designerToolbar.clickOnScoringButton();
    expect(await scoringModal.getMaxPointsOfQuestion('1. Set question')).toEqual('Max Points:5');
    expect(await Utils.isEnabled(await scoringModal.getSaveButton())).toBe(false);
    await scoringModal.clickCancelModalButton(false, true);
    await formArea.dragElementToFormArea('radio');
    await elementAttributes.clickAddMultipleButton();
    await elementAttributes.addMultipleModal.enterChoice('List Value1');
    await elementAttributes.addMultipleModal.enterChoice('List Value2');
    await elementAttributes.addMultipleModal.enterChoice('List Value3');
    await elementAttributes.addMultipleModal.clickAddButton();
    await designerToolbar.clickOnScoringButton();
    expect(await scoringModal.getMaxPointsOfQuestion('2. Set question')).toEqual('Max Points:1');
});
Then("STEP-4: Scoring modal should open with default values to the radio button after adding option using copy", { timeout: 180 * 1000 }, async () => {
    await formArea.dragElementToFormArea('radio');
    await designerToolbar.clickOnScoringButton();
    expect(await scoringModal.getMaxPointsOfQuestion('1. Set question')).toEqual('Max Points:1');
    expect(await Utils.isEnabled(await scoringModal.getSaveButton())).toBe(false);
    await scoringModal.clickCancelModalButton(false, true);
    await formArea.clickCopyElementIcon('1. Set question', 'radio');
    await designerToolbar.clickOnScoringButton();
    expect(await scoringModal.getMaxPointsOfQuestion('2. Set question')).toEqual('Max Points:1');
    expect(await Utils.isEnabled(await scoringModal.getSaveButton())).toBe(false);
});
Then("STEP-5: Scoring modal should open with default values to the checkbox after adding multiple options", { timeout: 180 * 1000 }, async () => {
    await formArea.dragElementToFormArea('checkbox');
    await elementAttributes.clickAddMultipleButton();
    await elementAttributes.addMultipleModal.enterChoice('List Value1');
    await elementAttributes.addMultipleModal.enterChoice('List Value2');
    await elementAttributes.addMultipleModal.enterChoice('List Value3');
    await elementAttributes.addMultipleModal.clickAddButton();
    await elementAttributes.choicePropertiesElementAttributes.clickChoiceCheckbox(2);
    await elementAttributes.choicePropertiesElementAttributes.clickChoiceCheckbox(3);
    await elementAttributes.choicePropertiesElementAttributes.clickChoiceCheckbox(4);
    await formArea.dragElementToFormArea('radio');
    await formArea.clickElementOnFormArea('2. Set question', 'radio');
    await elementAttributes.clickAddMultipleButton();
    await elementAttributes.addMultipleModal.enterChoice('List Value1');
    await elementAttributes.addMultipleModal.enterChoice('List Value2');
    await elementAttributes.addMultipleModal.enterChoice('List Value3');
    await elementAttributes.addMultipleModal.clickAddButton();
    await elementAttributes.choicePropertiesElementAttributes.clickChoiceRadioButton('4');
    await designerToolbar.clickOnScoringButton();
    await scoringModal.clickEnableScoring();
    expect(await scoringModal.getCalculatedScore()).toEqual('Calculated weighted score : 67');
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 4 of 6');
    await scoringModal.clickCancelModalButton(true, true);
});

When("STEP-6: Reset button should be disabled by default and get enabled when enable scoring checkbox is checked", { timeout: 180 * 1000 }, async () => {
    await formArea.dragElementToFormArea('radio');
    await designerToolbar.clickOnScoringButton();
    expect(await Utils.isEnabled(await scoringModal.getResetButton())).toBe(false);
    await scoringModal.clickEnableScoring();
    expect(await Utils.isEnabled(await scoringModal.getResetButton())).toBe(true);
});

Then("STEP-7: Scoring modal should open with default values to the checkbox after adding multiple options", { timeout: 180 * 1000 }, async () => {
    await formArea.dragElementToFormArea('radio');
    await elementAttributes.choicePropertiesElementAttributes.clickChoiceRadioButton(0);
    await formArea.dragElementToFormArea('checkbox');
    await elementAttributes.choicePropertiesElementAttributes.clickChoiceCheckbox(0);
    await designerToolbar.clickOnScoringButton();
    await scoringModal.clickEnableScoring();
    expect(await Utils.isSelected(await scoringModal.getScorableCheckboxOfAQuestion('1. Set question'))).toBeTruthy();
    expect(await Utils.isSelected(await scoringModal.getScorableCheckboxOfAQuestion('2. Set question'))).toBeTruthy();
    await scoringModal.setScoringToQuestionOption('1. Set question', 0, 10);
    await scoringModal.setScoringToQuestionOption('1. Set question', 1, 10);
    expect(await scoringModal.getMaxPointsOfQuestion('1. Set question')).toEqual('Max Points:10');
    expect(await scoringModal.getScoringOfQuestionOption('1. Set question', 0)).toEqual('10');
    expect(await scoringModal.getScoringOfQuestionOption('1. Set question', 1)).toEqual('10');
    await scoringModal.setScoringToQuestionOption('2. Set question', 0, 10);
    await scoringModal.setScoringToQuestionOption('2. Set question', 1, 10);
    expect(await scoringModal.getScoringOfQuestionOption('2. Set question', 0)).toEqual('10');
    expect(await scoringModal.getScoringOfQuestionOption('2. Set question', 1)).toEqual('10');
    expect(await scoringModal.getMaxPointsOfQuestion('2. Set question')).toEqual('Max Points:20');
    await scoringModal.clickScorableCheckboxOfAQuestion('2. Set question');
    expect(await Utils.isSelected(await scoringModal.getScorableCheckboxOfAQuestion('2. Set question'))).toBeFalsy();
    await scoringModal.clickResetButton();
    expect(await scoringModal.getScoringOfQuestionOption('1. Set question', 0)).toEqual('1');
    expect(await scoringModal.getScoringOfQuestionOption('1. Set question', 1)).toEqual('1');
    expect(await scoringModal.getScoringOfQuestionOption('2. Set question', 0)).toEqual('1');
    expect(await scoringModal.getScoringOfQuestionOption('2. Set question', 1)).toEqual('1');
    expect(await scoringModal.getMaxPointsOfQuestion('1. Set question')).toEqual('Max Points:1');
    expect(await scoringModal.getMaxPointsOfQuestion('2. Set question')).toEqual('Max Points:2');
    expect(await Utils.isSelected(await scoringModal.getScorableCheckboxOfAQuestion('2. Set question'))).toBeTruthy();
});

When("STEP-8: Should verify current score is 0 if scoring is not enable", { timeout: 180 * 1000 }, async () => {
    await formArea.dragElementToFormArea('radio');
    await elementAttributes.choicePropertiesElementAttributes.clickChoiceRadioButton(0);
    await formArea.dragElementToFormArea('checkbox');
    await elementAttributes.choicePropertiesElementAttributes.clickChoiceCheckbox(0);
    await designerToolbar.clickOnScoringButton();
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 0 of 0');
    await scoringModal.clickEnableScoring();
    expect(await scoringModal.getCalculatedScore()).toEqual('Calculated weighted score : 67');
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 2 of 3');
    await scoringModal.clickCancelModalButton(true, false);
    await scoringModal.clickCancelModalButton(true, true);
    await formArea.dragElementToFormArea('section');
    await formArea.dragElementToSection('radio', '3. Set Title');
    await elementAttributes.choicePropertiesElementAttributes.clickChoiceRadioButton(0);
    await formArea.dragElementToSection('checkbox', '3. Set Title');
    await elementAttributes.choicePropertiesElementAttributes.clickChoiceCheckbox(0);
    await designerToolbar.clickOnScoringButton();
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 0 of 0');
    await scoringModal.clickEnableScoring();
    expect(await scoringModal.getCalculatedScore()).toEqual('Calculated weighted score : 67');
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 4 of 6');
});

Then("STEP-9: Should verify current score is 100 if user fill all ans correct", { timeout: 180 * 1000 }, async () => {
    await formArea.dragElementToFormArea('radio');
    await elementAttributes.choicePropertiesElementAttributes.clickChoiceRadioButton(0);
    await formArea.dragElementToFormArea('checkbox');
    await elementAttributes.choicePropertiesElementAttributes.clickChoiceCheckbox(0);
    await formArea.dragElementToFormArea('section');
    await formArea.dragElementToSection('radio', '3. Set Title');
    await elementAttributes.choicePropertiesElementAttributes.clickChoiceRadioButton(0);
    await formArea.dragElementToFormArea('checkbox');
    await elementAttributes.choicePropertiesElementAttributes.clickChoiceCheckbox(0);
    await designerToolbar.clickOnScoringButton();
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 0 of 0');
    await scoringModal.clickEnableScoring();
    expect(await scoringModal.getCalculatedScore()).toEqual('Calculated weighted score : 67');
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 4 of 6');
    await scoringModal.clickQuestionOption('2. Set question', 1);
    await scoringModal.clickQuestionOption('4. Set question', 1);
    expect(await scoringModal.getCalculatedScore()).toEqual('Calculated weighted score : 100');
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 6 of 6');    
});
Then("STEP-10: Should verify current score is getting updated after changing the ans option", { timeout: 180 * 1000 }, async () => {
    await formArea.dragElementToFormArea('radio');
    await elementAttributes.choicePropertiesElementAttributes.clickChoiceRadioButton(0);
    await formArea.dragElementToFormArea('checkbox');
    await elementAttributes.choicePropertiesElementAttributes.clickChoiceCheckbox(0);
    await formArea.dragElementToFormArea('yesno');
    await elementAttributes.choicePropertiesElementAttributes.clickChoiceYesNoButton(0);
    await formArea.dragElementToFormArea('section');
    await formArea.dragElementToSection('radio', '4. Set Title');
    await elementAttributes.choicePropertiesElementAttributes.clickChoiceRadioButton(0);
    await formArea.dragElementToSection('checkbox', '4. Set Title');
    await elementAttributes.choicePropertiesElementAttributes.clickChoiceCheckbox(0);
    await designerToolbar.clickOnScoringButton();
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 0 of 0');
    await scoringModal.clickEnableScoring();
    expect(await scoringModal.getCalculatedScore()).toEqual('Calculated weighted score : 71');
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 5 of 7');
    await scoringModal.clickQuestionOption('2. Set question', 1);
    await scoringModal.clickQuestionOption('4.2 Set question', 1);
    expect(await scoringModal.getCalculatedScore()).toEqual('Calculated weighted score : 86');
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 6 of 7');
    await scoringModal.clickQuestionOption('3. Set question', 1);
    expect(await scoringModal.getCalculatedScore()).toEqual('Calculated weighted score : 71');
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 5 of 7');
    await scoringModal.clickQuestionOption('2. Set question', 0);
    await scoringModal.clickQuestionOption('2. Set question', 1);
    await scoringModal.clickQuestionOption('4.2 Set question', 0);
    await scoringModal.clickQuestionOption('4.2 Set question', 1);
    expect(await scoringModal.getCalculatedScore()).toEqual('Calculated weighted score : 43');
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 3 of 7');
    await scoringModal.clickQuestionOption('1. Set question', 1);
    await scoringModal.clickQuestionOption('4.1 Set question', 1);
    expect(await scoringModal.getCalculatedScore()).toEqual('Calculated weighted score : 57');
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 4 of 7');
});
Then("STEP-11: Correct current score and percentage should get calculated for elements", { timeout: 180 * 1000 }, async () => {
    await formArea.dragElementToFormArea('radio'); //1. Set question
    await elementAttributes.choicePropertiesElementAttributes.clickChoiceRadioButton(0);
    await formArea.dragElementToFormArea('checkbox'); //2. Set question
    await elementAttributes.choicePropertiesElementAttributes.clickChoiceCheckbox(0);
    await formArea.dragElementToFormArea('section');//3. Set Title
    await formArea.dragElementToSection('checkbox', '3. Set Title'); //3.1 Set question
    await elementAttributes.choicePropertiesElementAttributes.clickChoiceCheckbox(0);
    await designerToolbar.clickOnScoringButton();
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 0 of 0');
    await scoringModal.clickEnableScoring();
    expect(await scoringModal.getCalculatedScore()).toEqual('Calculated weighted score : 60');
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 3 of 5');
    await scoringModal.setScoringToQuestionOption('1. Set question', 0, 10);
    await scoringModal.setScoringToQuestionOption('1. Set question', 1, 0);
    await scoringModal.setScoringToQuestionOption('2. Set question', 0, 20);
    await scoringModal.setScoringToQuestionOption('2. Set question', 1, 20);
    await scoringModal.setScoringToQuestionOption('3.1 Set question', 0, 5);
    await scoringModal.setScoringToQuestionOption('3.1 Set question', 1, 5);
    expect(await scoringModal.getCalculatedScore()).toEqual('Calculated weighted score : 58');
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 35 of 60');
    await scoringModal.clickQuestionOption('2. Set question', 1);
    await scoringModal.clickQuestionOption('3.1 Set question', 1);
    expect(await scoringModal.getCalculatedScore()).toEqual('Calculated weighted score : 100');
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 60 of 60');
    await scoringModal.clickQuestionOption('2. Set question', 0);
    await scoringModal.clickQuestionOption('2. Set question', 1);
    await scoringModal.clickQuestionOption('3.1 Set question', 0);
    await scoringModal.clickQuestionOption('3.1 Set question', 1);
    expect(await scoringModal.getCalculatedScore()).toEqual('Calculated weighted score : 17');
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 10 of 60');
    await scoringModal.clickQuestionOption('1. Set question', 1);
    expect(await scoringModal.getCalculatedScore()).toEqual('Calculated weighted score : 0');
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 0 of 60');
});
When("STEP-12: If there is NA, After selecting NA question should get removed from calculation multiple add- radio", { timeout: 180 * 1000 }, async () => {
    await formArea.dragElementToFormArea('radio');
    await elementAttributes.choicePropertiesElementAttributes.clickNACheckbox();
    await elementAttributes.clickAddMultipleButton();
    await elementAttributes.addMultipleModal.enterChoice('List Value1');
    await elementAttributes.addMultipleModal.enterChoice('List Value2');
    await elementAttributes.addMultipleModal.enterChoice('List Value3');
    await elementAttributes.addMultipleModal.clickAddButton();
    await formArea.dragElementToFormArea('section');
    await formArea.dragElementToSection('radio', '2. Set Title');
    await elementAttributes.choicePropertiesElementAttributes.clickNACheckbox();
    await elementAttributes.clickAddMultipleButton();
    await elementAttributes.addMultipleModal.enterChoice('List Value1');
    await elementAttributes.addMultipleModal.enterChoice('List Value2');
    await elementAttributes.addMultipleModal.enterChoice('List Value3');
    await elementAttributes.addMultipleModal.clickAddButton();
    await designerToolbar.clickOnScoringButton();
    await scoringModal.clickEnableScoring();
    expect(await scoringModal.getCalculatedScore()).toEqual('Calculated weighted score : 0');
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 0 of 2');
    await scoringModal.setScoringToQuestionOption('1. Set question', 0, 10);
    await scoringModal.setScoringToQuestionOption('1. Set question', 1, 0);
    await scoringModal.setScoringToQuestionOption('1. Set question', 2, 20);
    await scoringModal.setScoringToQuestionOption('1. Set question', 3, 20);
    await scoringModal.setScoringToQuestionOption('1. Set question', 4, 5);
    await scoringModal.setScoringToQuestionOption('2.1 Set question', 0, 0);
    await scoringModal.setScoringToQuestionOption('2.1 Set question', 1, 5);
    await scoringModal.setScoringToQuestionOption('2.1 Set question', 2, 5);
    await scoringModal.setScoringToQuestionOption('2.1 Set question', 3, 1);
    await scoringModal.setScoringToQuestionOption('2.1 Set question', 4, 1);
    expect(await scoringModal.getCalculatedScore()).toEqual('Calculated weighted score : 0');
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 0 of 25');
    await scoringModal.clickQuestionOption('1. Set question', 2);
    expect(await scoringModal.getCalculatedScore()).toEqual('Calculated weighted score : 80');
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 20 of 25');
    await scoringModal.clickQuestionOption('1. Set question', 5);
    expect(await scoringModal.getCalculatedScore()).toEqual('Calculated weighted score : 0');
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 0 of 5');
    await scoringModal.clickQuestionOption('2.1 Set question', 0);
    await scoringModal.clickQuestionOption('2.1 Set question', 1);
    expect(await scoringModal.getCalculatedScore()).toEqual('Calculated weighted score : 100');
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 5 of 5');
    await scoringModal.clickQuestionOption('2.1 Set question', 5);
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 0 of 0');
    await scoringModal.clickQuestionOption('2.1 Set question', 1);
    await scoringModal.clickQuestionOption('1. Set question', 1);
    expect(await scoringModal.getCalculatedScore()).toEqual('Calculated weighted score : 20');
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 5 of 25');
});
Then("STEP-13: If there is NA, After selecting NA question should get removed from calculation - radio", { timeout: 180 * 1000 }, async () => {
    await formArea.dragElementToFormArea('radio');
    await elementAttributes.choicePropertiesElementAttributes.clickNACheckbox();
    await formArea.dragElementToFormArea('checkbox');
    await elementAttributes.choicePropertiesElementAttributes.clickNACheckbox();
    await formArea.dragElementToFormArea('section');
    await formArea.dragElementToSection('radio', '3. Set Title');
    await elementAttributes.choicePropertiesElementAttributes.clickNACheckbox();
    await formArea.dragElementToSection('checkbox', '3. Set Title');
    await elementAttributes.choicePropertiesElementAttributes.clickNACheckbox();
    await designerToolbar.clickOnScoringButton();
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 0 of 0');
    await scoringModal.clickEnableScoring();
    await scoringModal.setScoringToQuestionOption('1. Set question', 0, 10);
    await scoringModal.setScoringToQuestionOption('1. Set question', 1, 0);
    await scoringModal.setScoringToQuestionOption('2. Set question', 0, 20);
    await scoringModal.setScoringToQuestionOption('2. Set question', 1, 20);
    await scoringModal.setScoringToQuestionOption('3.1 Set question', 0, 5);
    await scoringModal.setScoringToQuestionOption('3.1 Set question', 1, 5);
    await scoringModal.setScoringToQuestionOption('3.2 Set question', 0, 5);
    await scoringModal.setScoringToQuestionOption('3.2 Set question', 1, 0);
    expect(await scoringModal.getCalculatedScore()).toEqual('Calculated weighted score : 0');
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 0 of 65');
    await scoringModal.clickQuestionOption('1. Set question', 2);
    expect(await scoringModal.getCalculatedScore()).toEqual('Calculated weighted score : 0');
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 0 of 55');
    await scoringModal.clickQuestionOption('3.2 Set question', 2);
    expect(await scoringModal.getCalculatedScore()).toEqual('Calculated weighted score : 0');
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 0 of 50');
    await scoringModal.clickQuestionOption('1. Set question', 0);
    await scoringModal.clickQuestionOption('3.2 Set question', 0);
    expect(await scoringModal.getCalculatedScore()).toEqual('Calculated weighted score : 23');
    expect(await scoringModal.getCurrentPoints()).toEqual('Current points : 15 of 65');
});

Then("STEP-14: Scorable checkbox should be disabled by default and should get enabled if enable scoring checkbox is checked", { timeout: 180 * 1000 }, async () => {
    await formArea.dragElementToFormArea('checkbox');
    await formArea.dragElementToFormArea('section');
    await formArea.dragElementToSection('radio', '2. Set Title');
    await formArea.dragElementToSection('yesno', '2. Set Title');
    await designerToolbar.clickOnScoringButton();
    expect(await Utils.isEnabled(await scoringModal.getScorableCheckboxOfAQuestion('1. Set question'))).toBeFalsy();
    expect(await Utils.isEnabled(await scoringModal.getScorableCheckboxOfAQuestion('2.1 Set question'))).toBeFalsy();
    expect(await Utils.isEnabled(await scoringModal.getScorableCheckboxOfAQuestion('2.2 Set question'))).toBeFalsy();
    await scoringModal.clickEnableScoring();
    expect(await Utils.isEnabled(await scoringModal.getScorableCheckboxOfAQuestion('1. Set question'))).toBeTruthy();
    expect(await Utils.isEnabled(await scoringModal.getScorableCheckboxOfAQuestion('2.1 Set question'))).toBeTruthy();
    expect(await Utils.isEnabled(await scoringModal.getScorableCheckboxOfAQuestion('2.2 Set question'))).toBeTruthy();
});

Then("STEP-15: Count asterisk(*) on scoring modal", { timeout: 180 * 1000 }, async () => {
    await formArea.dragElementToFormArea('text');
    await elementAttributes.clickRequiredCheckbox();
    await formArea.dragElementToFormArea('radio');
    await elementAttributes.clickRequiredCheckbox();
    await formArea.dragElementToFormArea('checkbox');
    await elementAttributes.clickRequiredCheckbox();
    await formArea.dragElementToFormArea('section');
    await designerToolbar.clickOnScoringButton();
    expect(await scoringModal.isQuestionRequired('1. Set question')).toBeTruthy();
    expect(await scoringModal.isQuestionRequired('2. Set question')).toBeTruthy();
    expect(await scoringModal.isQuestionRequired('3. Set question')).toBeTruthy();
});