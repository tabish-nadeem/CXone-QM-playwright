import { AddMultipleModalPo } from "./AddMultipleModalComponentPO";
import { expect, Locator, Page } from "@playwright/test";

export class ChoiceListPropertiesComponentPo {
   
 public addMultipleModal : AddMultipleModalPo;
  // elements: any;
   readonly page: Page;
  public enableScoringWarning: any;
  public criticalQuestionHelp: Locator;
  public useNACheckbox: Locator;
  public addMultiple: Locator;
  public verticalQuestionChoices: Locator;
  public criticalCheckbox:Locator
 

  constructor(page:Page) {
    // this.page = this.page.locator(".choice-list-properties");
    this.page  = Page
   
     this.criticalCheckbox = this.page.locator(
        "#form-designer-critical-question-checkbox"
      ),
      this.enableScoringWarning = this.page.locator("#critical-question-warning"),
      this.criticalQuestionHelp =this.page.locator("#critical-question-help"),
      this.useNACheckbox = this.page.locator("#form-designer-use-na"),
      this.addMultiple =this.page.locator("#form-designer-add-multiple"),
      this.verticalQuestionChoices = this.page.locator(".choice-vertical")
   

  }


  async getMarkAsCriticalCheckbox(): Promise<Locator> {
    const elem = this.criticalCheckbox;
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
    const elem = this.enableScoringWarning;
    await expect(elem).isVisible(10000);
    return elem;
  }

  async getHelpIconCriticalQuestion(): Promise<Locator> {
    const elem = this.criticalQuestionHelp;
    await expect(elem).isVisible(10000);
    return elem;
  }

  async getChoiceRadioButton(index: any): Promise<Locator> {
    const elem = this.page.locator(
      "#form-designer-choices-" + index + " .cxone-radio"
    );
    await expect(elem).isVisible(10000);
    return elem;
  }

  async clickChoiceRadioButton(index: any): Promise<any> {
    return (await this.getChoiceRadioButton(index)).click() as Promise<any>;
  }

  async getChoiceYesNoButton(index: any): Promise<Locator> {
    const elem = this.page.locator(
      "#form-designer-yesno-choices-value-" + index + " .cxone-radio"
    );
    await expect(elem).isVisible(10000);
    return elem;
  }

  async clickChoiceYesNoButton(index: any): Promise<any> {
    return (await this.getChoiceYesNoButton(index)).click() as Promise<any>;
  }

  async getChoiceCheckbox(index: any): Promise<Locator> {
    const elem = this.page.locator(
      "#form-designer-choices-" + index + " .cxone-checkbox"
    );
    await expect(elem).isVisible(10000);
    return elem;
  }

  async clickChoiceCheckbox(index: any): Promise<any> {
    return (await this.getChoiceCheckbox(index)).click() as Promise<any>;
  }

  async getChoiceNameTextBox(index: any): Promise<Locator> {
    const elem = this.page.locator(
      "#form-designer-choices-text-" + index + " input"
    );
    await expect(elem).isVisible(10000);
    return elem;
  }

  async enterChoiceName(index, text): Promise<any> {
    return (await this.getChoiceNameTextBox(index)).sendKeys(
      text
    ) as Promise<any>;
  }

  async getAddChoiceButton(index: any): Promise<Locator> {
    const elem = this.page.locator("#form-designer-choices-add-" + index);
    await expect(elem).isVisible(10000);
    return elem;
  }

  async clickAddChoiceButton(index: any): Promise<any> {
    return (await this.getAddChoiceButton(index)).click() as Promise<any>;
  }

  async getDeleteChoiceButton(index: any): Promise<Locator> {
    const elem = this.page.locator(
      "#form-designer-choices-delete-" + index
    );
    await expect(elem).isVisible(10000);
    return elem;
  }

  async clickDeleteChoiceButton(index: any): Promise<any> {
    return (await this.getDeleteChoiceButton(index)).click() as Promise<any>;
  }

  async getCorrectAnswerChoiceFlag(index: any): Promise<Locator> {
    const elem = this.page.locator(
      "#form-designer-choices-correct-answer-" + index
    );
    await expect(elem).isVisible(10000);
    return elem;
  }

  async clickCorrectAnswerChoiceFlag(index: any): Promise<any> {
    return (
      await this.getCorrectAnswerChoiceFlag(index)
    ).click() as Promise<any>;
  }

  async getNACheckbox(): Promise<Locator> {
    const elem = this.useNACheckbox;
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
    const elem = this.addMultiple;
    await expect(elem).isVisible(10000);
    return elem;
  }

  async clickAddMultipleButton(): Promise<any> {
    await (await this.getAddMultipleButton()).click();
    return (await expect(this.addMultipleModal.getModal()).isVisible(
      10000
    )) as Promise<any>;
  }

  async getVerticalChoicesOfQuestion(): Promise<any> {
    const elem = this.verticalQuestionChoices;
    await expect(elem).isVisible(10000);
    return elem;
  }
}
