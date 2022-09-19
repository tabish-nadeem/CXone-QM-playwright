import { expect, Locator, Page } from "@playwright/test";
import { CreateEditRuleModalComponentPo } from "./CreateEditRuleModalComponentPO";



export class LogicPropertiesComponentPo {
  public createEditRuleModalComponentPo: CreateEditRuleModalComponentPo;
  readonly page: Page;
  public logicPropertiesWrapper: Locator
  public ruleSections: Locator
  public addRuleButton: Locator
  public ruleNumber: Locator
  public editRuleButton: Locator
  public deleteRuleButton: Locator
  public ruleDescription: Locator;

  constructor(page: Page) {
    this.page = page
    this.page = this.page.locator(".logic-properties-wrapper");
    this.logicPropertiesWrapper = this.page.locator(".cxone-logic-properties"),
      this.ruleSections = this.page.locator(".logic-panel-rule"),
      this.addRuleButton = this.page.locator("#form-designer-add-rule"),
      this.ruleNumber = this.page.locator(".rule-number"),
      this.editRuleButton = this.page.locator('[id*="edit-rule-btn-"]'),
      this.deleteRuleButton = this.page.locator('[id*="delete-rule-btn-"]'),
      // this.createEditRuleModalComponentPo = new CreateEditRuleModalComponentPo()
      this.ruleDescription = this.page.locator(".rule-description")


  }

  async getLogicPropertiesWrapper(): Promise<Locator> {
    let elem = this.logicPropertiesWrapper;
    await expect(elem).isVisible(10000);
    return elem;
  }

  async getAllLogicRuleSections(): Promise<Locator[]> {
    let ruleSections = await this.ruleSections;

    return ruleSections;
  }

  async getARuleHeader(index: any): Promise<string> {
    let elem = (await this.getAllLogicRuleSections())[index].this.page.locator(
      this.ruleNumber
    );
    await expect(elem).toBeVisible(10000);
    return elem.getText() as Promise<string>;
  }

  async getARuleDescription(index: any): Promise<string> {
    let elem = (await this.getAllLogicRuleSections())[index].this.page.locator(
      this.ruleDescription
    );
    await expect(elem).isVisible(10000);
    return elem.getText() as Promise<string>;
  }

  async getARuleEditButton(index: any): Promise<Locator> {
    let elem = (await this.getAllLogicRuleSections())[index].this.page.locator(
      this.editRuleButton
    );
    await expect(elem).isVisible(10000);
    return elem;
  }

  async clickARuleEditButton(index: any): Promise<string> {
    return (await this.getARuleEditButton(index)).click() as Promise<any>;
  }

  async getARuleDeleteButton(index: any): Promise<Locator> {
    let elem = (await this.getAllLogicRuleSections())[index].this.page.locator(
      this.deleteRuleButton
    );
    await expect(elem).isVisible(10000);
    return elem;
  }

  async clickARuleDeleteButton(index: any): Promise<string> {
    return (await this.getARuleDeleteButton(index)).click() as Promise<any>;
  }

  async getAddRuleButton(): Promise<Locator> {
    let elem = this.addRuleButton;
    await expect(elem).isVisible(10000);
    return elem;
  }

  async clickAddRuleButton(): Promise<any> {
    await (await this.getAddRuleButton()).click();
    return (await expect(
      await this.createEditRuleModalComponentPo.getLogicModalWrapper()
    ).isVisible(10000)) as Promise<any>;
  }
}
