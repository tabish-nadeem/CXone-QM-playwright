import {expect, Locator, Page} from "@playwright/test";
import { MultiSelectDropdownPo } from "./MultiselectDropdownPO";
import { SingleselectDropdownPO } from "./SingleselectDropdownPO";


export class TestFormModalComponentPo {
    readonly page:Page;
    public modalWrapper: Locator;
    public modalTitle: Locator;
    public logo: Locator;
    public score: Locator;
    public validateButton: Locator;
    public cancelButton: Locator;
    public formElements: Locator;
    public closeButton: Locator;
    public headers: Locator;
    public required: Locator;
    public critical: Locator;
    public choices: Locator;
    public datePicker: Locator;
    public timePicker: Locator;
    public shortText: Locator;
    public textArea: Locator;
    public elementText: Locator;
    public hyperlink: Locator;
    public dropdown: Locator;
    public errorMessage: Locator;
    public sectionScore: Locator;


    constructor(){

            this.modalWrapper = this.page.locator('.test-form-modal-wrapper * .cxone-modal-wrapper');
            this.modalTitle = this.page.locator('.headerTitle');
            this.logo = this.page.locator('#form-designer-logo-theme-image');
            this.score = this.page.locator('.score-percentage');
            this.validateButton = this.page.locator('.save-btn');
            this.cancelButton = this.page.locator('.cancel-btn');
            this.formElements = this.page.locator('.preview-area [class*="form-element-div"] .elements-list-wrapper');
            this.closeButton = this.page.locator('.save-btn');
            this.headers = this.page.locator('.header-box');

            this.required = this.page.locator('span.mandatory');
            this.critical = this.page.locator('span.critical-question');
            this.choices = this.page.locator('.test-form-modal-wrapper .choice-row [id*="form-designer"]');
            this.datePicker = this.page.locator('.test-form-modal-wrapper * [id*="cxone-date-picker-"]');
            this.timePicker = this.page.locator('.test-form-modal-wrapper *.cxone-time-picker * input');
            this.shortText = this.page.locator('.test-form-modal-wrapper * #form-designer-answer-text-field * input');
            this.textArea = this.page.locator('.test-form-modal-wrapper * .form-element-textarea * textarea');
            this.elementText = this.page.locator('.element-info-question');
            this.hyperlink = this.page.locator('.test-form-modal-wrapper * .form-element-hyperlink * .element-text * span');
            this.dropdown = this.page.locator('.test-form-modal-wrapper * .form-designer-dropdown');
            this.errorMessage = this.page.locator('.form-designer-error-msg');
            this.sectionScore = this.page.locator('.section-score .current-points');
        
    }


    getTestFormModal() {
        return this.modalWrapper;
    }

    getLogo() {
        return this.logo;
    }

    async getQuestionElement(questionText): Promise<Locator> {
        let allElements = await this.formElements;
        for (let elem of allElements) {
            if (elem.isDisplayed()) {
                if ((await elem.element(this.elementText).textContent()).replace(/\n/g, ' ').includes(questionText)) {
                    await this.page.evaluate('arguments[0].scrollIntoView()', elem.getWebElement());
                    return elem as Promise<Locator>;
                }
            }
        }
    }

    async getElementCssProperties(questionText): Promise<any> {
        const elem = await this.getQuestionElement(questionText);
        return {
            alignment: await elem.locator('.element-info-question .froala-element p').getCssValue('text-align'),
            fontFamily: await elem.locator('.element-info-question .froala-element span').getCssValue('font-family'),
            fontSize: await elem.locator('.element-info-question .froala-element span').getCssValue('font-size'),
            color: await elem.locator('.element-info-question .froala-element span').getCssValue('color'),
            isBold: await elem.locator('.element-info-question .froala-element strong').isPresent(),
            isItalic: await elem.locator('.element-info-question .froala-element em').isPresent(),
            isUnderlined: await elem.locator('.element-info-question .froala-element u').isPresent()
        };
    }

    async selectChoices(questionText, choiceIndex): Promise<any> {
        const elem = await this.getQuestionElement(questionText);
        await this.page.evaluate('arguments[0].click();', (await elem.all(this.choices))[choiceIndex]);
    }

    async getHeaders(): Promise<string> {
        let headers = await this.headers.textContent();
        // @ts-ignore
        return headers.map(header => {
            return header.replace('\n', '');
        });
    }

    async selectDate(questionText, date): Promise<any> {
        const elem = await this.getQuestionElement(questionText);
        await elem.element(this.datePicker).clear();
        await elem.element(this.datePicker).type(date);
    }

    async selectTime(questionText, time): Promise<any> {
        const elem = await this.getQuestionElement(questionText);
        await elem.element(this.datePicker).clear();
        await elem.element(this.datePicker).type(time);
    }

    async enterShortText(questionText, text): Promise<any> {
        const elem = await this.getQuestionElement(questionText);
        await elem.element(this.shortText).clear();
        await elem.element(this.shortText).type(text);
    }

    async enterTextArea(questionText, text): Promise<any> {
        const elem = await this.getQuestionElement(questionText);
        await elem.element(this.textArea).clear();
        await elem.element(this.textArea).type(text);
    }

    async clickHyperLink(questionText): Promise<any> {
        const elem = await this.getQuestionElement(questionText);
        await elem.element(this.hyperlink).click();
    }

    async getErrorMessage(questionText): Promise<string> {
        const elem = await this.getQuestionElement(questionText);
        return elem.element(this.errorMessage).textContent();
    }

    async selectSingleSelectDropDown(questionText, labelToSelect): Promise<any> {
        const elem = await this.getQuestionElement(questionText);
        let dropdownPO = new SingleselectDropdownPO(elem.element(this.dropdown));
        return dropdownPO.selectItem(labelToSelect);
    }

    async selectMultiSelectDropDown(questionText, labelToSelect): Promise<any> {
        const elem = await this.getQuestionElement(questionText);
        let dropdownPO = new MultiSelectDropdownPo(elem.element(this.dropdown));
        return dropdownPO.selectMulitpleItemsByLabels(labelToSelect, false);
    }

    async clickOnValidateButton() {
        await expect(this.validateButton).toBeVisible(10000);
        return this.validateButton.click();
    }

    async getScore() {
        return this.score.textContent();
    }

    async getSectionScore(questionText) {
        const elem = await this.getQuestionElement(questionText);
        return elem.element(this.sectionScore).textContent();

    }
}

