import {expect, Locator, Page} from "@playwright/test";
import {SingleselectDropdownPO} from 'cxone-qm-library/singleselect-dropdown.po';
import {MultiselectDropdownPO} from 'cxone-components/multiselect-dropdown.po';


export class TestFormModalComponentPo {
    public readonly page:Page;
    public elements:any;
    public locators:any;

    constructor(){

        this.elements = {
            modalWrapper: this.page.locator('.test-form-modal-wrapper * .cxone-modal-wrapper'),
            modalTitle: this.page.locator('.headerTitle'),
            logo: this.page.locator('#form-designer-logo-theme-image'),
            score: this.page.locator('.score-percentage'),
            validateButton: this.page.locator('.save-btn'),
            cancelButton: this.page.locator('.cancel-btn'),
            formElements: this.page.locator('.preview-area [class*="form-element-div"] .elements-list-wrapper'),
            closeButton: this.page.locator('.save-btn'),
            headers: this.page.locator('.header-box')
        }
        this.locators = {
            required: this.page.locator('span.mandatory'),
            critical: this.page.locator('span.critical-question'),
            choices: this.page.locator('.test-form-modal-wrapper .choice-row [id*="form-designer"]'),
            datePicker: this.page.locator('.test-form-modal-wrapper * [id*="cxone-date-picker-"]'),
            timePicker: this.page.locator('.test-form-modal-wrapper *.cxone-time-picker * input'),
            shortText: this.page.locator('.test-form-modal-wrapper * #form-designer-answer-text-field * input'),
            textArea: this.page.locator('.test-form-modal-wrapper * .form-element-textarea * textarea'),
            elementText: this.page.locator('.element-info-question'),
            hyperlink: this.page.locator('.test-form-modal-wrapper * .form-element-hyperlink * .element-text * span'),
            dropdown: this.page.locator('.test-form-modal-wrapper * .form-designer-dropdown'),
            errorMessage: this.page.locator('.form-designer-error-msg'),
            sectionScore: this.page.locator('.section-score .current-points')
        }
    }


    getTestFormModal() {
        return this.elements.modalWrapper;
    }

    getLogo() {
        return this.elements.logo;
    }

    async getQuestionElement(questionText): Promise<Locator> {
        let allElements = await this.elements.formElements;
        for (let elem of allElements) {
            if (elem.isDisplayed()) {
                if ((await elem.element(this.locators.elementText).getText()).replace(/\n/g, ' ').includes(questionText)) {
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
        await this.page.evaluate('arguments[0].click();', (await elem.all(this.locators.choices))[choiceIndex]);
    }

    async getHeaders(): Promise<string> {
        let headers = await this.elements.headers.getText();
        // @ts-ignore
        return headers.map(header => {
            return header.replace('\n', '');
        });
    }

    async selectDate(questionText, date): Promise<any> {
        const elem = await this.getQuestionElement(questionText);
        await elem.element(this.locators.datePicker).clear();
        await elem.element(this.locators.datePicker).sendKeys(date);
    }

    async selectTime(questionText, time): Promise<any> {
        const elem = await this.getQuestionElement(questionText);
        await elem.element(this.locators.datePicker).clear();
        await elem.element(this.locators.datePicker).sendKeys(time);
    }

    async enterShortText(questionText, text): Promise<any> {
        const elem = await this.getQuestionElement(questionText);
        await elem.element(this.locators.shortText).clear();
        await elem.element(this.locators.shortText).sendKeys(text);
    }

    async enterTextArea(questionText, text): Promise<any> {
        const elem = await this.getQuestionElement(questionText);
        await elem.element(this.locators.textArea).clear();
        await elem.element(this.locators.textArea).sendKeys(text);
    }

    async clickHyperLink(questionText): Promise<any> {
        const elem = await this.getQuestionElement(questionText);
        await elem.element(this.locators.hyperlink).click();
    }

    async getErrorMessage(questionText): Promise<string> {
        const elem = await this.getQuestionElement(questionText);
        return elem.element(this.locators.errorMessage).getText();
    }

    async selectSingleSelectDropDown(questionText, labelToSelect): Promise<any> {
        const elem = await this.getQuestionElement(questionText);
        let dropdownPO = new SingleselectDropdownPO(elem.element(this.locators.dropdown));
        return dropdownPO.selectItem(labelToSelect);
    }

    async selectMultiSelectDropDown(questionText, labelToSelect): Promise<any> {
        const elem = await this.getQuestionElement(questionText);
        let dropdownPO = new MultiselectDropdownPO(elem.element(this.locators.dropdown));
        return dropdownPO.selectItem(labelToSelect, false);
    }

    async clickOnValidateButton() {
        await expect(this.elements.validateButton).toBeVisible(10000);
        return this.elements.validateButton.click();
    }

    async getScore() {
        return this.elements.score.getText();
    }

    async getSectionScore(questionText) {
        const elem = await this.getQuestionElement(questionText);
        return elem.element(this.locators.sectionScore).getText();

    }
}

