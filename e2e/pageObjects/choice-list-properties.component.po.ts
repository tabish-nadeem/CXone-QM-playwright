import { AddMultipleModalPo } from "./add-multiple-modal.component.po";
import { expect, Locator, Page } from "@playwright/test";

export class ChoiceListPropertiesComponentPo {
  ancestor: Locator;
  addMultipleModal = new AddMultipleModalPo();
  elements: any;
  public readonly page: Page;

  constructor() {
    this.ancestor = this.page.locator(".choice-list-properties");
    this.elements = {
      criticalCheckbox: this.ancestor.locator(
        "#form-designer-critical-question-checkbox"
      ),
      enableScoringWarning: this.ancestor.locator("#critical-question-warning"),
      criticalQuestionHelp: this.ancestor.locator("#critical-question-help"),
      useNACheckbox: this.ancestor.locator("#form-designer-use-na"),
      addMultiple: this.ancestor.locator("#form-designer-add-multiple"),
      verticalQuestionChoices: this.page.locator(".choice-vertical"),
    };
  }

  async getMarkAsCriticalCheckbox(): Promise<Locator> {
    const elem = this.elements.criticalCheckbox;
    await expect(
      this.page.locator(elem).waitFor({ state: "attached", timeout: 10000 })
    );
    return elem;
  }

  async clickMarkAsCriticalCheckbox(): Promise<any> {
    return await this.page.evaluate(
      "arguments[0].click();",
      await this.getMarkAsCriticalCheckbox()
    );
  }

  async getEnableScoringIcon(): Promise<Locator> {
    const elem = this.elements.enableScoringWarning;
    await expect(elem).toBeVisible(10000);
    return elem;
  }

  async getHelpIconCriticalQuestion(): Promise<Locator> {
    const elem = this.elements.criticalQuestionHelp;
    await expect(elem).toBeVisible(10000);
    return elem;
  }

  async getChoiceRadioButton(index: any): Promise<Locator> {
    const elem = this.ancestor.locator(
      "#form-designer-choices-" + index + " .cxone-radio"
    );
    await expect(elem).toBeVisible(10000);
    return elem;
  }

  async clickChoiceRadioButton(index: any): Promise<any> {
    return (await this.getChoiceRadioButton(index)).click() as Promise<any>;
  }

  async getChoiceYesNoButton(index: any): Promise<Locator> {
    const elem = this.ancestor.locator(
      "#form-designer-yesno-choices-value-" + index + " .cxone-radio"
    );
    await expect(elem).toBeVisible(10000);
    return elem;
  }

  async clickChoiceYesNoButton(index: any): Promise<any> {
    return (await this.getChoiceYesNoButton(index)).click() as Promise<any>;
  }

  async getChoiceCheckbox(index: any): Promise<Locator> {
    const elem = this.ancestor.locator(
      "#form-designer-choices-" + index + " .cxone-checkbox"
    );
    await expect(elem).toBeVisible(10000);
    return elem;
  }

  async clickChoiceCheckbox(index: any): Promise<any> {
    return (await this.getChoiceCheckbox(index)).click() as Promise<any>;
  }

  async getChoiceNameTextBox(index: any): Promise<Locator> {
    const elem = this.ancestor.locator(
      "#form-designer-choices-text-" + index + " input"
    );
    await expect(elem).toBeVisible(10000);
    return elem;
  }

  async enterChoiceName(index, text): Promise<any> {
    return (await this.getChoiceNameTextBox(index)).sendKeys(
      text
    ) as Promise<any>;
  }

  async getAddChoiceButton(index: any): Promise<Locator> {
    const elem = this.ancestor.locator("#form-designer-choices-add-" + index);
    await expect(elem).toBeVisible(10000);
    return elem;
  }

  async clickAddChoiceButton(index: any): Promise<any> {
    return (await this.getAddChoiceButton(index)).click() as Promise<any>;
  }

  async getDeleteChoiceButton(index: any): Promise<Locator> {
    const elem = this.ancestor.locator(
      "#form-designer-choices-delete-" + index
    );
    await expect(elem).toBeVisible(10000);
    return elem;
  }

  async clickDeleteChoiceButton(index: any): Promise<any> {
    return (await this.getDeleteChoiceButton(index)).click() as Promise<any>;
  }

  async getCorrectAnswerChoiceFlag(index: any): Promise<Locator> {
    const elem = this.ancestor.locator(
      "#form-designer-choices-correct-answer-" + index
    );
    await expect(elem).toBeVisible(10000);
    return elem;
  }

  async clickCorrectAnswerChoiceFlag(index: any): Promise<any> {
    return (
      await this.getCorrectAnswerChoiceFlag(index)
    ).click() as Promise<any>;
  }

  async getNACheckbox(): Promise<Locator> {
    const elem = this.elements.useNACheckbox;
    await expect(
      this.page.locator(elem).waitFor({ state: "attached", timeout: 10000 })
    );
    return elem;
  }

  async clickNACheckbox(): Promise<any> {
    return await this.page.evaluate(
      "arguments[0].click();",
      await this.getNACheckbox()
    );
  }

  async getAddMultipleButton(): Promise<Locator> {
    const elem = this.elements.addMultiple;
    await expect(elem).toBeVisible(10000);
    return elem;
  }

  async clickAddMultipleButton(): Promise<any> {
    await (await this.getAddMultipleButton()).click();
    return (await expect(this.addMultipleModal.getModal()).toBeVisible(
      10000
    )) as Promise<any>;
  }

  async getVerticalChoicesOfQuestion(): Promise<any> {
    const elem = this.elements.verticalQuestionChoices;
    await expect(elem).toBeVisible(10000);
    return elem;
  }
}
