import { expect, Locator, Page } from "@playwright/test";

import {SingleselectDropdownPO} from 'cxone-qm-library/singleselect-dropdown.po';

export class CreateEditRuleModalComponentPo {
  public readonly page: Page;
  public elements: any;
  public rulesLocators: any;
  public conditionsLocators: any;

  constructor(){

      this.elements = {
          modalWrapper:this.page.locator('.create-edit-rule-modal-wrapper * .cxone-modal-wrapper'),
          logicModalTitle:this.page.locator('.headerTitle'),
          questionTitle:this.page.locator('.rule-header-div'),
          setBtn:this.page.locator('.save-btn'),
          cancelBtn:this.page.locator('.cancel-btn'),
          cancelWarning:this.page.locator('.popover-content .closing-popup'),
          closeNoPopup:this.page.locator('#close-popover'),
          closeYesPopup:this.page.locator('#exit-yes-btn'),
          closeButton:this.page.locator('.modal-header-wrapper *.close-button'),
          ruleContainers: this.page.locator('.rule-div')
      };
      this.rulesLocators = {
          addRule: this.page.locator('[id*="set-rule-add-rule"]'),
          removeRule: this.page.locator('[id*="set-rule-remove-rule"]'),
          questionsDropdown: this.page.locator('[name="result-question-dropdown"]')
    
      }
      this.conditionsLocators = {
          conditionContainers: this.page.locator('.condition-div'),
          addCondition: this.page.locator('[id*="set-rule-add-condition"]'),
          removeCondition: this.page.locator('[id*="set-rule-delete-condition"]'),
          operatorDropdown: this.page.locator('[name="operator-dropdown"]'),
          conditionDropdown: this.page.locator('[id*="set-rule-condition-dropdown"] cxone-singleselect-dropdown'),
          choiceDropdown: this.page.locator('[id*="set-rule-choice-dropdown"] cxone-singleselect-dropdown'),
          elementDropdown: this.page.locator('[id*="set-rule-element-dropdown"]'),
          datePickerTextBox: this.page.locator('[id*="set-rule-datepicker-choice"] *.input-wrapper *input')
      }
  }


    async getLogicModalWrapper(): Promise<Locator> {
        let elem = this.elements.modalWrapper;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async getLogicModalTitle(): Promise<any> {
        await expect(this.elements.logicModalTitle).toBeVisible(10000);
        return this.elements.logicModalTitle.getText();
    }

    async getQuestionText(): Promise<any> {
        await expect(this.elements.questionTitle).toBeVisible(10000);
        return await this.elements.questionTitle.getText();
    }

    async clickSetBtn(): Promise<any> {
        await expect(this.elements.setBtn).toBeVisible(10000);
        await this.elements.setBtn.click();
        await expect(this.page.locator(this.elements.setBtn).waitFor({ state: "attached", timeout: 10000 }));
    }

    async clickCancelBtn(): Promise<any> {
        await expect(this.elements.cancelBtn).toBeVisible(10000);
        return await this.elements.cancelBtn.click();
    }

    async getCancelWarning(): Promise<string> {
        await expect(this.elements.cancelWarning).toBeVisible(10000);
        return this.elements.cancelWarning.getText();
    }

    async clickWarningNoButton(): Promise<any> {
        await expect(this.elements.closeNoPopup).toBeVisible(10000);
        return await this.elements.closeNoPopup.click();
    }

    async clickWarningYesButton(): Promise<any> {
        await expect(this.elements.closeYesPopup).toBeVisible(10000);
        return await this.elements.closeYesPopup.click();
    }

    async clickCloseButton(): Promise<any> {
        await expect(this.elements.closeButton).toBeVisible(10000);
        return await this.elements.closeButton.click();
    }

    async getARuleElementByIndex(index): Promise<Locator> {
        await expect(this.elements.modalWrapper).toBeVisible(10000);
        return (await this.elements.ruleContainers)[index];
    }

    async getAllRuleElements(): Promise<Locator[]> {
        await expect(this.elements.modalWrapper).toBeVisible(10000);
        return this.elements.ruleContainers;
    }

    async addARule(ruleElementIndex:number): Promise<any> {
        let ruleElement = await this.getARuleElementByIndex(ruleElementIndex);
        await ruleElement.element(this.rulesLocators.addRule).click();
        await expect(await this.getARuleElementByIndex(ruleElementIndex + 1)).toBeVisible(10000);
    }

    async RemoveARule(ruleElement): Promise<any> {
        await ruleElement.element(this.rulesLocators.removeRule).click();
        await expect(ruleElement).toBeHidden(10000);
    }

    async setHideQuestionsDropdown(ruleElement, labelToSelect): Promise<any> {
        let hideQuestionDD = ruleElement.element(this.rulesLocators.questionsDropdown);
        await hideQuestionDD.locator('.icon-carat').click();
        await hideQuestionDD.locator('.search-box input').sendKeys(labelToSelect);
        let choice = hideQuestionDD.locator(`.item-text >> text = ${labelToSelect}`);
        await expect(choice).toBeVisible(10000);
        await choice.click();
    }

    async getHideQuestionsDDPlaceholder(ruleElement): Promise<any> {
        let hideQuestionDD = ruleElement.element(this.rulesLocators.questionsDropdown);
        return await hideQuestionDD.element(this.conditionsLocators.operatorDropdown).locator('button-text').getQuestionText();
    }

    private async getAConditionRowByIndex(ruleElement, conditionRowIndex): Promise<Locator> {
        await expect(this.elements.modalWrapper).toBeVisible(10000);
        return (await ruleElement.all(this.conditionsLocators.conditionContainers))[conditionRowIndex];
    }

    private async getAllConditionRowByIndex(ruleElement): Promise<Locator> {
        await expect(this.elements.modalWrapper).toBeVisible(10000);
        return ruleElement.all(this.conditionsLocators.conditionContainers);
    }

    async addConditionRow(ruleElement, conditionRowIndex): Promise<any> {
        await (await this.getAConditionRowByIndex(ruleElement, conditionRowIndex)).element(this.conditionsLocators.addCondition).click();
        await expect(await this.getAConditionRowByIndex(ruleElement, conditionRowIndex + 1)).toBeVisible(10000);
    }

    async removeConditionRow(ruleElement, conditionRowIndex): Promise<any> {
        await (await this.getAConditionRowByIndex(ruleElement, conditionRowIndex)).element(this.conditionsLocators.removeCondition).click();
        await expect(await this.getAConditionRowByIndex(ruleElement, conditionRowIndex)).toBeHidden(10000);
    }

    async setOperatorDropdown(ruleElement, conditionRowIndex, labelToSelect): Promise<any> {
        let conditionRow = await this.getAConditionRowByIndex(ruleElement, conditionRowIndex);
        await conditionRow.element(this.conditionsLocators.operatorDropdown).locator('.icon-carat').click();
        let choice = conditionRow.element(this.conditionsLocators.operatorDropdown).locator(`.item-text >> text = ${labelToSelect}`);
        await expect(choice).toBeVisible(10000);
        await choice.click();
    }

    async setConditionDropdown(ruleElement, conditionRowIndex, labelToSelect): Promise<any> {
        let conditionRow = await this.getAConditionRowByIndex(ruleElement, conditionRowIndex);
        await conditionRow.element(this.conditionsLocators.conditionDropdown).locator('.icon-carat').click();
        let choice = conditionRow.element(this.conditionsLocators.conditionDropdown).locator(`.item-text >> text = ${labelToSelect}`);
        await expect(choice).toBeVisible(10000);
        await choice.click();
    }

    async setChoiceDropdown(ruleElement, conditionRowIndex, labelToSelect): Promise<any> {
        let conditionRow = await this.getAConditionRowByIndex(ruleElement, conditionRowIndex);
        await conditionRow.element(this.conditionsLocators.choiceDropdown).locator('.icon-carat').click();
        let choice = conditionRow.element(this.conditionsLocators.choiceDropdown).locator(`.item-text >> text = ${labelToSelect}`);
        await expect(choice).toBeVisible(10000);
        await choice.click();
    }

    /**
     Currently used for date condition row
     */
    async setElementDropdown(ruleElement, conditionRowIndex, labelToSelect): Promise<any> {
        let conditionRow = await this.getAConditionRowByIndex(ruleElement, conditionRowIndex);
        let setElementDropdownPO = new SingleselectDropdownPO(conditionRow.element(this.conditionsLocators.elementDropdown));
        return setElementDropdownPO.selectItem(labelToSelect);
    }

    async setDateToACondition(ruleElement, conditionRowIndex, dateToSet): Promise<any> {
        let conditionRow = await this.getAConditionRowByIndex(ruleElement, conditionRowIndex);
        await conditionRow.element(this.conditionsLocators.datePickerTextBox).sendKeys(dateToSet);
    }

    async getEnteredDateFromACondition(ruleElement, conditionRowIndex): Promise<string> {
        let conditionRow = await this.getAConditionRowByIndex(ruleElement, conditionRowIndex);
        return conditionRow.element(this.conditionsLocators.datePickerTextBox).getAttribute('value');
    }

}

