import { page } from '@playwright/test';


// import {Locator, element, by, browser, ExpectedConditions} from 'protractor';
import {expect, Locator, Page} from "@playwright/test";
import { AddMultipleModalPo } from "./AddMultipleModalComponentPO";
import { ChoiceListPropertiesComponentPo } from "./ChoiceListPropertiesComponentPO";
import { HeaderPropertiesComponentPo } from "./HeaderPropertiesComponentPO";
import { ImageUploadComponentPo } from "./ImageUploadComponentPO";
import { LogicPropertiesComponentPo } from "./LogicPropertiesComponentPO";

export class ElementAttributesComponentPo {
    readonly page:Page;
    readonly addMultipleModal :AddMultipleModalPo;
    readonly choicePropertiesElementAttributes : ChoiceListPropertiesComponentPo;
    readonly headerPropertiesAttributes: HeaderPropertiesComponentPo;
    readonly logicPropertiesAttributes : LogicPropertiesComponentPo;
    readonly imageUploadComponentPo : ImageUploadComponentPo;
    // readonly elements : any;
    public title                                           :Locator
    public instructions:Locator
    public requiredCheckbox:Locator
    public hyperlink:Locator
    public hintText:Locator
    public characterLimitCheckbox:Locator
    public characterLimitTextBox:Locator
    public multipleSelectionRadio:Locator
    public singleSelectionRadio:Locator
    public verticalLayoutRadio:Locator
    public horizontalLayoutRadio:Locator
    public addMultipleValuesButton:Locator
    public backgroundColorTextBox:Locator
    public criticalQuestionHelpText:Locator
    public criticalQuestionAnswerNotSelectedError:Locator

    constructor(page:Page) {
         this.page = page
        // this.page = this.page.locator('.cxone-element-attributes');
        
            this.title = this.page.locator('#element-display-name'),
            this.instructions = this.page.locator('#form-designer-subtext-text * input'),
            this.requiredCheckbox = this.page.locator('#form-designer-mandatory-text'),
            this.hyperlink = this.page.locator('#form-designer-input-hyperlink-url * input'),
            this.hintText = this.page.locator('#hint-text-container * input'),
            this.characterLimitCheckbox = this.page.locator('#form-designer-limit-character-checkbox'),
            this.characterLimitTextBox = this.page.locator('#form-designer-limit-character-text-box * input'),
            this.multipleSelectionRadio = this.page.locator('#form-designer-multi-select-dropdown'),
            this.singleSelectionRadio = this.page.locator('#form-designer-single-select-dropdown'),
            this.verticalLayoutRadio = this.page.locator('#form-designer-vertical * input'),
            this.horizontalLayoutRadio = this.page.locator('#form-designer-horizontal * input'),
            this.addMultipleValuesButton =this.page.locator('#form-designer-add-multiple'),
            this.backgroundColorTextBox =this.page.locator('.cxone-color-picker * input'),
            this.criticalQuestionHelpText = this.page.locator('.form-designer-critical-question-help-text'),
            this.criticalQuestionAnswerNotSelectedError = this.page.locator('.critical-question-invalid')

    }

    async getTitle(): Promise<string> {
        let elem = this.title;
        await expect(elem).toBeVisible(10000);
        return elem.textContent();
    }

    async getInstructionsTextBox(): Promise<Locator> {
        let elem = this.instructions;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async enterInstructions(text:string): Promise<any> {
        return (await this.getInstructionsTextBox()).type(text) as Promise<any>;
    }

    async getRequiredCheckbox(): Promise<Locator> {
        let elem = this.requiredCheckbox;
        await expect(this.page.locator(elem).waitFor({state:'attached',timeout:10000}));
        return elem;
    }

    async clickRequiredCheckbox(): Promise<any> {
        await this.page.evaluate('arguments[0].click();', (await this.getRequiredCheckbox()));
    }

    async getHyperlinkTextBox(): Promise<Locator> {
        let elem = this.hyperlink;
        await expect(elem).isVisible(10000);
        return elem;
    }

    async enterHyperlink(text:string): Promise<any> {
        return (await this.getHyperlinkTextBox()).type(text) as Promise<any>;
    }

    async getHintTextTextBox(): Promise<Locator> {
        let elem = this.hintText;
        await expect(elem).isVisible(10000);
        return elem;
    }

    async enterHintText(text:string): Promise<any> {
        return (await this.getHintTextTextBox()).type(text) as Promise<any>;
    }

    async getCharacterLimitCheckbox(): Promise<Locator> {
        let elem = this.characterLimitCheckbox;
        await expect(elem).isVisible(10000);
        return elem;
    }

    async clickCharacterLimitCheckbox(): Promise<any> {
        return (await this.getCharacterLimitCheckbox()).click() as Promise<any>;
    }

    async getCharacterLimitTextBox(): Promise<Locator> {
        let elem = this.characterLimitTextBox;
        await expect(elem).isVisible(10000);
        return elem;
    }

    async enterCharacterLimitTextBox(text:string): Promise<any> {
        return (await this.getCharacterLimitTextBox()).type(text) as Promise<any>;
    }

    async getMultipleSelectionRadio(): Promise<Locator> {
        let elem = this.multipleSelectionRadio;
        await expect(elem).isVisible(10000);
        return elem;
    }

    async clickMultipleSelectionRadio(): Promise<any> {
        return (await this.getMultipleSelectionRadio()).click() as Promise<any>;
    }

    async getSingleSelectionRadio(): Promise<Locator> {
        let elem = this.singleSelectionRadio;
        await expect(elem).isVisible(10000);
        return elem;
    }

    async clickSingleSelectionRadio(): Promise<any> {
        return (await this.getSingleSelectionRadio()).click() as Promise<any>;
    }

    async getAddMultipleButton(): Promise<Locator> {
        let elem = this.addMultipleValuesButton;
        await expect(elem).isVisible(10000);
        return elem;
    }

    async clickVerticalLayoutRadio(): Promise<any> {
        await this.page.evaluate('arguments[0].click();', (await this.getVerticalLayoutRadio()));
    }

    async getVerticalLayoutRadio(): Promise<Locator> {
        let elem = this.verticalLayoutRadio;
        await expect(this.page.locator(elem).waitFor({state:'attached',timeout:10000}))
        return elem;
    }

    async clickHorizontalLayoutRadio(): Promise<any> {
        await this.page.evaluate('arguments[0].click();', (await this.getHorizontalLayoutRadio()));
    }

    async getHorizontalLayoutRadio(): Promise<Locator> {
        let elem = this.horizontalLayoutRadio;
        await expect(this.page.locator(elem).waitFor({state:'attached',timeout:10000}))
        return elem;
    }

    async clickAddMultipleButton(): Promise<any> {
        await (await this.getAddMultipleButton()).click();
        return await expect(this.addMultipleModal.getModal()).toBeVisible(10000) as Promise<any>;
    }

    async getBackgroundColorTextBox(): Promise<Locator> {
        let elem = this.backgroundColorTextBox;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async enterBackgroundColor(colorCode:any): Promise<any> {
        await (await this.getBackgroundColorTextBox()).clear();
        return (await this.getBackgroundColorTextBox()).type(colorCode) as Promise<any>;
    }

    async getCriticalQuestionHelpText(): Promise<any> {
        await expect(this.criticalQuestionHelpText).isVisible(10000);
        return await this.criticalQuestionHelpText.textContent();
    }

    async getCriticalQuestionAnswerNotSelectedError(): Promise<any> {
        await expect(this.criticalQuestionAnswerNotSelectedError).isVisible(10000);
        return await this.criticalQuestionAnswerNotSelectedError.textContent();
    }

    async clickLogicAttributesSection() {
        await this.page.locator('.tab-header .header >> text = LOGIC').click();
        await expect(this.page.locator('.logic-properties-wrapper')).isVisible(10000);
    }

    async clickPropertiesAttributesSection() {
        await this.page.locator('.tab-header .header >> text = PROPERTIES').click();
        await expect(this.page.locator('.element-properties-wrapper')).isVisible(10000);
    }
}
