import { expect, Locator, Page } from "@playwright/test";
import { SpinnerPO } from "./spinner.po";
import { Utils } from "../common/utils";

export class DesignerToolbarComponentPO {
  readonly page: Page;
  readonly locator: Locator;
  readonly utils: Utils;
  readonly elements: any;
  readonly defaultTimeoutInMillis: number;

  constructor() {
    this.locator = this.page.locator(".cxone-designer-toolbar");
    this.elements = {
      undoBtn: this.page.locator('.toolbar-btn[iconname="icon-undo"]'),
      redoBtn: this.page.locator('.toolbar-btn[iconname="icon-redo"]'),
      scoringBtn: this.page.locator(".btn-scoring"),
      workFlowSettingsButton: this.page.locator("#form-designer-workflow-settings-btn"),
      testFormBtn: this.page.locator("#form-designer-test-form-btn"),
    };
  }

  async isUndoButtonDisabled() {
    return await this.elements.undoBtn.isEnabled();
  }

  async isRedoButtonDisabled() {
    return await this.elements.redoBtn.isEnabled();
  }

  async undo(times = 1, timeout?: number) {
    timeout = timeout ? timeout : 1000;
    for (let i = 0; i < times; i++) {
      await this.elements.undoBtn.click();
      await this.utils.delay(timeout);
    }
  }

  async redo(times = 1, timeout?: number) {
    timeout = timeout ? timeout : 1000;
    for (let i = 0; i < times; i++) {
      await this.elements.redoBtn.click();
      await this.utils.delay(timeout);
    }
  }

  async clickOnScoringButton() {
    await expect(this.elements.scoringBtn).toBeVisible(10000);
    await this.elements.scoringBtn.click();
    await expect(this.page.locator(".scoring-modal-wrapper")).toBeVisible(
      10000
    );
  }

  async clickOnWorkFlowSettingsButton() {
    await expect(this.elements.workFlowSettingsButton).toBeVisible(10000);
    await this.elements.workFlowSettingsButton.click();
    await expect(
      this.page.locator(".workflow-settings-modal-wrapper")
    ).toBeVisible(10000);
    await this.utils.delay(2000);
    await this.waitForSpinnerToDisappear();
  }

  async waitForSpinnerToDisappear(timeToWait?: number) {
    if (!timeToWait) {
      timeToWait = 60000;
    }
    const spinner = new SpinnerPO(".apphttpSpinner .cxonespinner");
    return await spinner.waitForSpinnerToBeHidden(false, timeToWait);
  }

  async clickOnTestFormButton() {
    await expect(this.elements.testFormBtn).toBeVisible(10000);
    await this.elements.testFormBtn.click();
    await expect(this.page.locator(".test-form-modal-wrapper")).toBeVisible(
      10000
    );
  }
}
