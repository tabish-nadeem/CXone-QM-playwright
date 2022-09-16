import { expect, Locator, Page } from "@playwright/test";
import { SpinnerPO } from "./SpinnerPO";
import { Utils } from "../common/utils";
import { CommonUIUtils } from "cxone-playwright-test-utils";

export class DesignerToolbarComponentPO {
  readonly page: Page;
  readonly locator: Locator;
  readonly utils: Utils;
  readonly defaultTimeoutInMillis: number;
  public   undoBtn                :Locator
  public   redoBtn:Locator
  public   scoringBtn:Locator
  public   workFlowSettingsButton:Locator
  public   testFormBtn:Locator
  public   commonUIUtils : CommonUIUtils
  
  constructor(page:Page) {
    this.commonUIUtils = new CommonUIUtils
    this.locator = this.page.locator(".cxone-designer-toolbar");
 
      this.undoBtn=this.page.locator('.toolbar-btn[iconname="icon-undo"]'),
      this.redoBtn = this.page.locator('.toolbar-btn[iconname="icon-redo"]'),
      this.scoringBtn = this.page.locator(".btn-scoring"),
      this.workFlowSettingsButton = this.page.locator("#form-designer-workflow-settings-btn"),
      this.testFormBtn = this.page.locator("#form-designer-test-form-btn")
 
  }

  async isUndoButtonDisabled() {
    return await this.undoBtn.isEnabled();
  }

  async isRedoButtonDisabled() {
    return await this.redoBtn.isEnabled();
  }

  async undo(times = 1, timeout?: number) {
    timeout = timeout ? timeout : 1000;
    for (let i = 0; i < times; i++) {
      await this.undoBtn.click();
      await this.utils.delay(timeout);
    }
  }

  async redo(times = 1, timeout?: number) {
    timeout = timeout ? timeout : 1000;
    for (let i = 0; i < times; i++) {
      await this.redoBtn.click();
      await this.utils.delay(timeout);
    }
  }

  async clickOnScoringButton() {
    await expect(this.scoringBtn).toBeVisible(10000);
    await this.scoringBtn.click();
    await expect(this.locator(".scoring-modal-wrapper")).isVisible(
      10000
    );
  }

  async clickOnWorkFlowSettingsButton() {
    await expect(this.page.workFlowSettingsButton).isVisible(10000);
    await this.page.workFlowSettingsButton.click();
    await expect(
      this.page.locator(".workflow-settings-modal-wrapper")
    ).toBeVisible(10000);
    await this.utils.delay(2000);
    // await this.waitForSpinnerToDisappear();
    await  this.commonUIUtils.waitUntilIconLoaderDone(this.page);
  }

  async waitForSpinnerToDisappear(timeToWait?: number) {
    if (!timeToWait) {
      timeToWait = 60000;
    }
    const spinner = new SpinnerPO(".apphttpSpinner .cxonespinner");
    return await spinner.waitForSpinnerToBeHidden(false, timeToWait);
  }

  async clickOnTestFormButton() {
    await expect(this.page.testFormBtn).toBeVisible(10000);
    await this.page.testFormBtn.click();
    await expect(this.page.locator(".test-form-modal-wrapper")).isVisible(
      10000
    );
  }
}
