

// import {Locator, element, by, browser, ExpectedConditions} from 'protractor';
import {expect, Locator, Page} from "@playwright/test";
import { AddMultipleModalPo } from "./add-multiple-modal.component.po";
import { ChoiceListPropertiesComponentPo } from "./choice-list-properties.component.po";
import { HeaderPropertiesComponentPo } from "./header-properties.component.po";
import { ImageUploadComponentPo } from "./image-upload.component.po";
import { LogicPropertiesComponentPo } from "./logic-properties.component.po";

export class ElementAttributesComponentPo {
    ancestor: Locator;
    readonly page:Page;
    addMultipleModal = new AddMultipleModalPo();
    choicePropertiesElementAttributes = new ChoiceListPropertiesComponentPo();
    headerPropertiesAttributes = new HeaderPropertiesComponentPo();
    logicPropertiesAttributes = new LogicPropertiesComponentPo();
    imageUploadComponentPo = new ImageUploadComponentPo();
    public elements : any;

    constructor() {
        this.ancestor = this.page.locator('.cxone-element-attributes');
        this.elements = {
            title: this.ancestor.locator('#element-display-name'),
            instructions: this.ancestor.locator('#form-designer-subtext-text * input'),
            requiredCheckbox: this.page.locator('#form-designer-mandatory-text'),
            hyperlink: this.ancestor.locator('#form-designer-input-hyperlink-url * input'),
            hintText: this.ancestor.locator('#hint-text-container * input'),
            characterLimitCheckbox: this.ancestor.locator('#form-designer-limit-character-checkbox'),
            characterLimitTextBox: this.ancestor.locator('#form-designer-limit-character-text-box * input'),
            multipleSelectionRadio: this.ancestor.locator('#form-designer-multi-select-dropdown'),
            singleSelectionRadio: this.ancestor.locator('#form-designer-single-select-dropdown'),
            verticalLayoutRadio: this.ancestor.locator('#form-designer-vertical * input'),
            horizontalLayoutRadio: this.ancestor.locator('#form-designer-horizontal * input'),
            addMultipleValuesButton: this.ancestor.locator('#form-designer-add-multiple'),
            backgroundColorTextBox: this.ancestor.locator('.cxone-color-picker * input'),
            criticalQuestionHelpText: this.ancestor.locator('.form-designer-critical-question-help-text'),
            criticalQuestionAnswerNotSelectedError: this.ancestor.locator('.critical-question-invalid')

        };
    }

    async getTitle(): Promise<string> {
        let elem = this.elements.title;
        await expect(elem).toBeVisible(10000);
        return elem.getText();
    }

    async getInstructionsTextBox(): Promise<Locator> {
        let elem = this.elements.instructions;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async enterInstructions(text:string): Promise<any> {
        return (await this.getInstructionsTextBox()).sendKeys(text) as Promise<any>;
    }

    async getRequiredCheckbox(): Promise<Locator> {
        let elem = this.elements.requiredCheckbox;
        await expect(this.page.locator(elem).waitFor({state:'attached',timeout:10000}));
        return elem;
    }

    async clickRequiredCheckbox(): Promise<any> {
        await this.page.evaluate('arguments[0].click();', (await this.getRequiredCheckbox()));
    }

    async getHyperlinkTextBox(): Promise<Locator> {
        let elem = this.elements.hyperlink;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async enterHyperlink(text:string): Promise<any> {
        return (await this.getHyperlinkTextBox()).sendKeys(text) as Promise<any>;
    }

    async getHintTextTextBox(): Promise<Locator> {
        let elem = this.elements.hintText;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async enterHintText(text:string): Promise<any> {
        return (await this.getHintTextTextBox()).sendKeys(text) as Promise<any>;
    }

    async getCharacterLimitCheckbox(): Promise<Locator> {
        let elem = this.elements.characterLimitCheckbox;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async clickCharacterLimitCheckbox(): Promise<any> {
        return (await this.getCharacterLimitCheckbox()).click() as Promise<any>;
    }

    async getCharacterLimitTextBox(): Promise<Locator> {
        let elem = this.elements.characterLimitTextBox;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async enterCharacterLimitTextBox(text:string): Promise<any> {
        return (await this.getCharacterLimitTextBox()).sendKeys(text) as Promise<any>;
    }

    async getMultipleSelectionRadio(): Promise<Locator> {
        let elem = this.elements.multipleSelectionRadio;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async clickMultipleSelectionRadio(): Promise<any> {
        return (await this.getMultipleSelectionRadio()).click() as Promise<any>;
    }

    async getSingleSelectionRadio(): Promise<Locator> {
        let elem = this.elements.singleSelectionRadio;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async clickSingleSelectionRadio(): Promise<any> {
        return (await this.getSingleSelectionRadio()).click() as Promise<any>;
    }

    async getAddMultipleButton(): Promise<Locator> {
        let elem = this.elements.addMultipleValuesButton;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async clickVerticalLayoutRadio(): Promise<any> {
        await this.page.evaluate('arguments[0].click();', (await this.getVerticalLayoutRadio()));
    }

    async getVerticalLayoutRadio(): Promise<Locator> {
        let elem = this.elements.verticalLayoutRadio;
        await expect(this.page.locator(elem).waitFor({state:'attached',timeout:10000}))
        return elem;
    }

    async clickHorizontalLayoutRadio(): Promise<any> {
        await this.page.evaluate('arguments[0].click();', (await this.getHorizontalLayoutRadio()));
    }

    async getHorizontalLayoutRadio(): Promise<Locator> {
        let elem = this.elements.horizontalLayoutRadio;
        await expect(this.page.locator(elem).waitFor({state:'attached',timeout:10000}))
        return elem;
    }

    async clickAddMultipleButton(): Promise<any> {
        await (await this.getAddMultipleButton()).click();
        return await expect(this.addMultipleModal.getModal()).toBeVisible(10000) as Promise<any>;
    }

    async getBackgroundColorTextBox(): Promise<Locator> {
        let elem = this.elements.backgroundColorTextBox;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async enterBackgroundColor(colorCode:any): Promise<any> {
        await (await this.getBackgroundColorTextBox()).clear();
        return (await this.getBackgroundColorTextBox()).sendKeys(colorCode) as Promise<any>;
    }

    async getCriticalQuestionHelpText(): Promise<any> {
        await expect(this.elements.criticalQuestionHelpText).toBeVisible(10000);
        return await this.elements.criticalQuestionHelpText.getText();
    }

    async getCriticalQuestionAnswerNotSelectedError(): Promise<any> {
        await expect(this.elements.criticalQuestionAnswerNotSelectedError).toBeVisible(10000);
        return await this.elements.criticalQuestionAnswerNotSelectedError.getText();
    }

    async clickLogicAttributesSection() {
        await this.page.locator('.tab-header .header >> text = LOGIC').click();
        await expect(this.page.locator('.logic-properties-wrapper')).toBeVisible(10000);
    }

    async clickPropertiesAttributesSection() {
        await this.page.locator('.tab-header .header >> text = PROPERTIES').click();
        await expect(this.page.locator('.element-properties-wrapper')).toBeVisible(10000);
    }
}
