import { expect, Locator, Page } from "@playwright/test";
import { CreateEditRuleModalComponentPo } from "./create-edit-rule-modal.component.po";



export class LogicPropertiesComponentPo {
  ancestor: Locator;
  createEditRuleModalComponentPo = new CreateEditRuleModalComponentPo();
  public elements: any;
  public readonly page: Page;
  public elementLocators: any;

  constructor() {
    this.page = this.page.locator(".logic-properties-wrapper");
    this.elements = {
      logicPropertiesWrapper: this.page.locator(".cxone-logic-properties"),
      ruleSections: this.page.locator(".logic-panel-rule"),
      addRuleButton: this.page.locator("#form-designer-add-rule"),
    };
    this.elementLocators = {
      ruleNumber: this.page.locator(".rule-number"),
      editRuleButton: this.page.locator('[id*="edit-rule-btn-"]'),
      deleteRuleButton: this.page.locator('[id*="delete-rule-btn-"]'),
      ruleDescription: this.page.locator(".rule-description"),
    };
  }

  async getLogicPropertiesWrapper(): Promise<Locator> {
    let elem = this.elements.logicPropertiesWrapper;
    await expect(elem).toBeVisible(10000);
    return elem;
  }

  async getAllLogicRuleSections(): Promise<Locator[]> {
    let ruleSections = await this.elements.ruleSections;

    return ruleSections;
  }

  async getARuleHeader(index: any): Promise<string> {
    let elem = (await this.getAllLogicRuleSections())[index].element(
      this.elementLocators.ruleNumber
    );
    await expect(elem).toBeVisible(10000);
    return elem.getText() as Promise<string>;
  }

  async getARuleDescription(index: any): Promise<string> {
    let elem = (await this.getAllLogicRuleSections())[index].element(
      this.elementLocators.ruleDescription
    );
    await expect(elem).toBeVisible(10000);
    return elem.getText() as Promise<string>;
  }

  async getARuleEditButton(index: any): Promise<Locator> {
    let elem = (await this.getAllLogicRuleSections())[index].element(
      this.elementLocators.editRuleButton
    );
    await expect(elem).toBeVisible(10000);
    return elem;
  }

  async clickARuleEditButton(index: any): Promise<string> {
    return (await this.getARuleEditButton(index)).click() as Promise<any>;
  }

  async getARuleDeleteButton(index: any): Promise<Locator> {
    let elem = (await this.getAllLogicRuleSections())[index].element(
      this.elementLocators.deleteRuleButton
    );
    await expect(elem).toBeVisible(10000);
    return elem;
  }

  async clickARuleDeleteButton(index: any): Promise<string> {
    return (await this.getARuleDeleteButton(index)).click() as Promise<any>;
  }

  async getAddRuleButton(): Promise<Locator> {
    let elem = this.elements.addRuleButton;
    await expect(elem).toBeVisible(10000);
    return elem;
  }

  async clickAddRuleButton(): Promise<any> {
    await (await this.getAddRuleButton()).click();
    return (await expect(
      await this.createEditRuleModalComponentPo.getLogicModalWrapper()
    ).toBeVisible(10000)) as Promise<any>;
  }
}
