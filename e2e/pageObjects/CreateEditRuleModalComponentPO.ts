import { PlanSummaryPO } from './PlanSummaryPO';
import { expect, Locator, Page } from "@playwright/test";
import { SingleselectDropdownPO } from './SingleselectDropdownPO';

export class CreateEditRuleModalComponentPo {
    readonly page: Page;
    //   public elements: any;
    public rulesLocators: any;
    public conditionsLocators: any;
    public modalWrapper: Locator
    public logicModalTitle: Locator
    public questionTitle: Locator
    public setBtn: Locator
    public cancelBtn: Locator
    public cancelWarning: Locator
    public closeNoPopup: Locator
    public closeYesPopup: Locator
    public closeButton: Locator
    public ruleContainers: Locator
    public addRule: Locator
    public removeRule: Locator
    public questionsDropdown: Locator
    public conditionContainers: Locator
    public addCondition: Locator
    public removeCondition: Locator
    public operatorDropdown: Locator
    public conditionDropdown: Locator
    public choiceDropdown: Locator
    public elementDropdown: Locator
    public datePickerTextBox: Locator

    constructor(page: Page) {


        this.modalWrapper= this.page.locator('.create-edit-rule-modal-wrapper * .cxone-modal-wrapper'),
        this.logicModalTitle = this.page.locator('.headerTitle'),
        this.questionTitle = this.page.locator('.rule-header-div'),
        this.setBtn = this.page.locator('.save-btn'),
        this.cancelBtn = this.page.locator('.cancel-btn'),
        this.cancelWarning= this.page.locator('.popover-content .closing-popup'),
        this.closeNoPopup = this.page.locator('#close-popover'),
        this.closeYesPopup = this.page.locator('#exit-yes-btn'),
        this.closeButton = this.page.locator('.modal-header-wrapper *.close-button'),
        this.ruleContainers = this.page.locator('.rule-div')


        this.addRule = this.page.locator('[id*="set-rule-add-rule"]'),
        this.removeRule = this.page.locator('[id*="set-rule-remove-rule"]'),
        this.questionsDropdown = this.page.locator('[name="result-question-dropdown"]')



        this.conditionContainers= this.page.locator('.condition-div'),
        this.addCondition = this.page.locator('[id*="set-rule-add-condition"]'),
        this.removeCondition = this.page.locator('[id*="set-rule-delete-condition"]'),
        this.operatorDropdown = this.page.locator('[name="operator-dropdown"]'),
        this.conditionDropdown = this.page.locator('[id*="set-rule-condition-dropdown"] cxone-singleselect-dropdown'),
        this.choiceDropdown = this.page.locator('[id*="set-rule-choice-dropdown"] cxone-singleselect-dropdown'),
        this.elementDropdown = this.page.locator('[id*="set-rule-element-dropdown"]'),
        this.datePickerTextBox = this.page.locator('[id*="set-rule-datepicker-choice"] *.input-wrapper *input')

  }


    async getLogicModalWrapper(): Promise<Locator> {
        let elem = this.modalWrapper;
        await expect(elem).isVisible(10000);
        return elem;
    }

    async getLogicModalTitle(): Promise<any> {
        await expect(this.logicModalTitle).isVisible(10000);
        return this.logicModalTitle.getText();
    }

    async getQuestionText(): Promise<any> {
        await expect(this.questionTitle).isVisible(10000);
        return await this.questionTitle.getText();
    }

    async clickSetBtn(): Promise<any> {
        await expect(this.setBtn).isVisible(10000);
        await this.setBtn.click();
        await expect(this.page.locator(this.setBtn).waitFor({ state: "attached", timeout: 10000 }));
    }

    async clickCancelBtn(): Promise<any> {
        await expect(this.cancelBtn).isVisible(10000);
        return await this.cancelBtn.click();
    }

    async getCancelWarning(): Promise<string> {
        await expect(this.cancelWarning).isVisible(10000);
        return this.cancelWarning.getText();
    }

    async clickWarningNoButton(): Promise<any> {
        await expect(this.closeNoPopup).isVisible(10000);
        return await this.closeNoPopup.click();
    }

    async clickWarningYesButton(): Promise<any> {
        await expect(this.closeYesPopup).isVisible(10000);
        return await this.closeYesPopup.click();
    }

    async clickCloseButton(): Promise<any> {
        await expect(this.closeButton).isVisible(10000);
        return await this.closeButton.click();
    }

    async getARuleElementByIndex(index): Promise<Locator> {
        await expect(this.modalWrapper).isVisible(10000);
        return (await this.ruleContainers)[index];
    }

    async getAllRuleElements(): Promise<Locator[]> {
        await expect(this.modalWrapper).isVisible(10000);
        return this.ruleContainers;
    }

    async addARule(ruleElementIndex: number): Promise<any> {
        let ruleElement = await this.getARuleElementByIndex(ruleElementIndex);
        await ruleElement.this.page.locator(this.rulesLocators.addRule).click();
        await expect(await this.getARuleElementByIndex(ruleElementIndex + 1)).isVisible(10000);
    }

    async RemoveARule(ruleElement): Promise<any> {
        await ruleElement.this.page.locator(this.rulesLocators.removeRule).click();
        await expect(ruleElement).toBeHidden(10000);
    }

    async setHideQuestionsDropdown(ruleElement, labelToSelect): Promise<any> {
        let hideQuestionDD = ruleElement.this.page.locator(this.rulesLocators.questionsDropdown);
        await hideQuestionDD.locator('.icon-carat').click();
        await hideQuestionDD.locator('.search-box input').type(labelToSelect);
        let choice = hideQuestionDD.locator(`.item-text >> text = ${labelToSelect}`);
        await expect(choice).isVisible(10000);
        await choice.click();
    }

    async getHideQuestionsDDPlaceholder(ruleElement): Promise<any> {
        let hideQuestionDD = ruleElement.this.page.locator(this.rulesLocators.questionsDropdown);
        return await hideQuestionDD.this.page.locator(this.conditionsLocators.operatorDropdown).locator('button-text').getQuestionText();
    }

    private async getAConditionRowByIndex(ruleElement, conditionRowIndex): Promise<Locator> {
        await expect(this.page.modalWrapper).isVisible(10000);
        return (await ruleElement.all(this.conditionsLocators.conditionContainers))[conditionRowIndex];
    }

    private async getAllConditionRowByIndex(ruleElement): Promise<Locator> {
        await expect(this.page.modalWrapper).isVisible(10000);
        return ruleElement.all(this.conditionsLocators.conditionContainers);
    }

    async addConditionRow(ruleElement, conditionRowIndex): Promise<any> {
        await (await this.getAConditionRowByIndex(ruleElement, conditionRowIndex)).this.page.locator(this.conditionsLocators.addCondition).click();
        await expect(await this.getAConditionRowByIndex(ruleElement, conditionRowIndex + 1)).isVisible(10000);
    }

    async removeConditionRow(ruleElement, conditionRowIndex): Promise<any> {
        await (await this.getAConditionRowByIndex(ruleElement, conditionRowIndex)).this.page.locator(this.conditionsLocators.removeCondition).click();
        await expect(await this.getAConditionRowByIndex(ruleElement, conditionRowIndex)).toBeHidden(10000);
    }

    async setOperatorDropdown(ruleElement, conditionRowIndex, labelToSelect): Promise<any> {
        let conditionRow = await this.getAConditionRowByIndex(ruleElement, conditionRowIndex);
        await conditionRow.this.page.locator(this.conditionsLocators.operatorDropdown).locator('.icon-carat').click();
        let choice = conditionRow.this.page.locator(this.conditionsLocators.operatorDropdown).locator(`.item-text >> text = ${labelToSelect}`);
        await expect(choice).isVisible(10000);
        await choice.click();
    }

    async setConditionDropdown(ruleElement, conditionRowIndex, labelToSelect): Promise<any> {
        let conditionRow = await this.getAConditionRowByIndex(ruleElement, conditionRowIndex);
        await conditionRow.this.page.locator(this.conditionsLocators.conditionDropdown).locator('.icon-carat').click();
        let choice = conditionRow.this.page.locator(this.conditionsLocators.conditionDropdown).locator(`.item-text >> text = ${labelToSelect}`);
        await expect(choice).isVisible(10000);
        await choice.click();
    }

    async setChoiceDropdown(ruleElement, conditionRowIndex, labelToSelect): Promise<any> {
        let conditionRow = await this.getAConditionRowByIndex(ruleElement, conditionRowIndex);
        await conditionRow.this.page.locator(this.conditionsLocators.choiceDropdown).locator('.icon-carat').click();
        let choice = conditionRow.this.page.locator(this.conditionsLocators.choiceDropdown).locator(`.item-text >> text = ${labelToSelect}`);
        await expect(choice).toBeVisible(10000);
        await choice.click();
    }

    /**
     Currently used for date condition row
     */
    async setElementDropdown(ruleElement, conditionRowIndex, labelToSelect): Promise<any> {
        let conditionRow = await this.getAConditionRowByIndex(ruleElement, conditionRowIndex);
        let setElementDropdownPO = new SingleselectDropdownPO(conditionRow.this.page.locator(this.conditionsLocators.elementDropdown));
        return setElementDropdownPO.selectItem(labelToSelect);
    }

    async setDateToACondition(ruleElement, conditionRowIndex, dateToSet): Promise<any> {
        let conditionRow = await this.getAConditionRowByIndex(ruleElement, conditionRowIndex);
        await conditionRow.this.page.locator(this.conditionsLocators.datePickerTextBox).type(dateToSet);
    }

    async getEnteredDateFromACondition(ruleElement, conditionRowIndex): Promise<string> {
        let conditionRow = await this.getAConditionRowByIndex(ruleElement, conditionRowIndex);
        return conditionRow.this.page.locator(this.conditionsLocators.datePickerTextBox).getAttribute('value');
    }

}

