import { Page, expect } from "@playwright/test";
import { CommonUIUtils } from "cxone-playwright-test-utils";
import { Given, When,Then, BeforeAll } from "cucumber";
import { GlobalTenantUtils } from "../../../../common/globalTenantUtils";
import { AddMultipleModalPo } from "../../../../pageObjects/add-multiple-modal.component.po";
import { ChoiceListPropertiesComponentPo } from "../../../../pageObjects/choice-list-properties.component.po";
import { ElementAttributesComponentPo } from "../../../../pageObjects/element-attributes.component.po";
import { FormAreaComponentPo } from "../../../../pageObjects/form-area.component.po";
import FormDesignerPagePO from "../../../../pageObjects/form-designer-page.po";
import { LoginPage } from "../../../../common/login";
import { ELEMENT_TYPES, FEATURE_TOGGLES } from "../../../../common/uiConstants";
import { FeatureToggleUtils } from "../../../../common/FeatureToggleUtils";
import { Utils } from "../../../../common/utils";

let formAreaComponentPo;
let formDesignerPagePO;
let elementAttributesComponentPo;
let choiceListPropertiesComponentPo;
let addMultipleModalPo;
let userToken;
let userDetails;
let page: Page;
let globalTenantUtils:GlobalTenantUtils;
let loginPage:LoginPage;
BeforeAll({timeout: 300 * 1000}, async () => {
    formAreaComponentPo = new FormAreaComponentPo();
    formDesignerPagePO = new FormDesignerPagePO();
    elementAttributesComponentPo = new ElementAttributesComponentPo();
    choiceListPropertiesComponentPo = new ChoiceListPropertiesComponentPo();
    addMultipleModalPo = new AddMultipleModalPo();
    userDetails = globalTenantUtils.getDefaultTenantCredentials();
    loginPage = new LoginPage(page);

    const onStart = async () => {
        userToken = await loginPage.login(userDetails.adminCreds.email, userDetails.adminCreds.password);
        await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);
        await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.RELEASE_NAVIGATION_REDESIGN, userDetails.orgName, userToken);
        await formDesignerPagePO.navigateTo();
        await formAreaComponentPo.getFormArea();
    };

    
    const onEnd = async () => {
        await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);

        await loginPage.logout();
    };
});

Given("STEP-1: Should set other attributes for date element",{timeout: 60 * 1000 }, async () => {
    await formAreaComponentPo.dragElementToFormArea(ELEMENT_TYPES.CHECKBOX);
    await formAreaComponentPo.froalaSetLabel('1. Set question', 'Checkbox1', ELEMENT_TYPES.CHECKBOX);
    let res = await formAreaComponentPo.getCountOfElementsInForm();
    expect(res).toEqual(1);
    await formAreaComponentPo.dragElementToFormArea(ELEMENT_TYPES.CHECKBOX);
    await formAreaComponentPo.froalaSetLabel('2. Set question', 'Checkbox2', ELEMENT_TYPES.CHECKBOX);
    res = await formAreaComponentPo.getCountOfElementsInForm();
    expect(res).toEqual(2);
    await formAreaComponentPo.moveElementIndexToIndex(0, 1);
    await formAreaComponentPo.clickDeleteElementIcon('1. Checkbox2', ELEMENT_TYPES.CHECKBOX);
    await formAreaComponentPo.clickDeleteElementIcon('1. Checkbox1', ELEMENT_TYPES.CHECKBOX);
    res = await formAreaComponentPo.getCountOfElementsInForm();
    expect(res).toEqual(0);
});

When("STEP-2: Should add multiple choices to checkbox element",{timeout: 60 * 1000 }, async () => {
    let listValues = ['List Value1', 'List Value2', 'List Value3'];
    await formAreaComponentPo.dragElementToFormArea(ELEMENT_TYPES.CHECKBOX);
    await elementAttributesComponentPo.clickAddMultipleButton();
    await addMultipleModalPo.enterChoice(listValues[0]);
    await addMultipleModalPo.enterChoice(listValues[1]);
    await addMultipleModalPo.enterChoice(listValues[2]);
    await addMultipleModalPo.clickAddButton();
    await page.waitForSelector(addMultipleModalPo.getModal());
    let choices = page.textContent(await choiceListPropertiesComponentPo.getVerticalChoicesOfQuestion());

    expect(choices).toContain('List Value1');
    expect(choices).toContain('List Value2');
    expect(choices).toContain('List Value3');
    await formAreaComponentPo.clickDeleteElementIcon('1. Set question', ELEMENT_TYPES.CHECKBOX);
});

Then("STEP-3: Should drag and drop checkbox inside section and set some attributes",{timeout: 60 * 1000 }, async () => {
    let allPromises:any = [];
    await formAreaComponentPo.dragElementToFormArea(ELEMENT_TYPES.SECTION);
    await formAreaComponentPo.froalaSetLabel('1. Set Title', 'Section1', ELEMENT_TYPES.SECTION);
    await formAreaComponentPo.dragElementToSection(ELEMENT_TYPES.CHECKBOX, '1. Section1');
    await formAreaComponentPo.froalaSetLabel('1.1 Set question', 'Checkbox inside section', ELEMENT_TYPES.CHECKBOX);
    await elementAttributesComponentPo.enterInstructions('Sub text for checkbox inside section');
    allPromises.push(page.textContent(await elementAttributesComponentPo.getInstructionsTextBox()));
    await formAreaComponentPo.clickQuestionTextOfAnElement('1. Section1', ELEMENT_TYPES.SECTION);
    let res = await formAreaComponentPo.getCountOfSectionElementsInForm();
    expect(res).toEqual(1);
    await formAreaComponentPo.clickDeleteElementIcon('1. Section1', ELEMENT_TYPES.SECTION);
});


Then("STEP-4: Should set the layout for the checkbox choices",{timeout: 60 * 1000 }, async () => {
    await formAreaComponentPo.dragElementToFormArea(ELEMENT_TYPES.CHECKBOX);
    await formAreaComponentPo.froalaSetLabel('1. Set question', 'Checkbox1', ELEMENT_TYPES.CHECKBOX);
    await elementAttributesComponentPo.clickHorizontalLayoutRadio();
    const res = Utils.isSelected(await elementAttributesComponentPo.getHorizontalLayoutRadio());
    expect(res).toBeTruthy();
});

Then("STEP-5: Should copy and delete the checkbox in form body",{timeout: 60 * 1000 }, async () => {
    await formAreaComponentPo.clickCopyElementIcon('1. Checkbox1', ELEMENT_TYPES.CHECKBOX);
    let count = await formAreaComponentPo.getCountOfElementsInForm();
    expect(count).toEqual(2);
    await formAreaComponentPo.clickDeleteElementIcon('1. Checkbox1', ELEMENT_TYPES.CHECKBOX);
    count = await formAreaComponentPo.getCountOfElementsInForm();
    expect(count).toEqual(1);
    await formAreaComponentPo.clickDeleteElementIcon('1. Checkbox1', ELEMENT_TYPES.CHECKBOX);
});
Then("STEP-6: Should create copy of choices and remove",{timeout: 60 * 1000 }, async () => {
    await formAreaComponentPo.dragElementToFormArea(ELEMENT_TYPES.CHECKBOX);
    await formAreaComponentPo.froalaSetLabel('1. Set question', 'Checkbox1', ELEMENT_TYPES.CHECKBOX);
    await choiceListPropertiesComponentPo.clickAddChoiceButton(1);
    await choiceListPropertiesComponentPo.enterChoiceName(2, 'Choice 3');
    let choices = Utils.getText(await choiceListPropertiesComponentPo.getVerticalChoicesOfQuestion());
    expect(choices).toContain('Choice 3');
    await choiceListPropertiesComponentPo.clickDeleteChoiceButton(2);
    choices = Utils.getText(await choiceListPropertiesComponentPo.getVerticalChoicesOfQuestion());
    expect(choices).not.toContain('Choice 3');
    await formAreaComponentPo.clickDeleteElementIcon('1. Checkbox1', ELEMENT_TYPES.CHECKBOX);

});
Then("STEP-7: Should select and deselect NA checkbox of checkbox",{timeout: 60 * 1000 }, async () => {
    await formAreaComponentPo.dragElementToFormArea(ELEMENT_TYPES.CHECKBOX);
    await formAreaComponentPo.froalaSetLabel('1. Set question', 'Checkbox1', ELEMENT_TYPES.CHECKBOX);
    let choices = await Utils.getText(await choiceListPropertiesComponentPo.getVerticalChoicesOfQuestion());
    expect(choices).not.toContain('N/A');
    await choiceListPropertiesComponentPo.clickNACheckbox();
    await Utils.waitUntilVisible(await choiceListPropertiesComponentPo.getChoiceNameTextBox(2), 2000);
    choices = await Utils.getText(await choiceListPropertiesComponentPo.getVerticalChoicesOfQuestion());
    expect(choices).toContain('N/A');
    await choiceListPropertiesComponentPo.clickNACheckbox();
    await Utils.waitForTime(2000);
    choices = await Utils.getText(await choiceListPropertiesComponentPo.getVerticalChoicesOfQuestion());
    expect(choices).not.toContain('N/A');
    await formAreaComponentPo.clickDeleteElementIcon('1. Checkbox1', ELEMENT_TYPES.CHECKBOX);

});
Then("STEP-8: Should have mandatory attribute enabled for checkbox element",{timeout: 60 * 1000 }, async () => {
    await formAreaComponentPo.dragElementToFormArea(ELEMENT_TYPES.CHECKBOX);
    await formAreaComponentPo.froalaSetLabel('1. Set question', 'Checkbox1', ELEMENT_TYPES.CHECKBOX);
    await elementAttributesComponentPo.clickRequiredCheckbox();
    let text = await formAreaComponentPo.getMandatoryText();
    expect(text).toEqual('Required');
    await elementAttributesComponentPo.clickRequiredCheckbox();
    await formAreaComponentPo.clickDeleteElementIcon('1. Checkbox1', ELEMENT_TYPES.CHECKBOX);

});

