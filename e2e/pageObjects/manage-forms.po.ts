import { expect, Locator, Page } from "@playwright/test";
import moment from "moment";
import { CommonNoUIUtils } from "../common/CommonNoUIUtils";

import { fdUtils } from "../common/FdUtils";
import { Utils } from "../common/utils";
import { DuplicateFormModalPO } from "./duplicate-form-modal.po";
import { OmnibarPO } from "./omnibar.po";
import { RenameFormModalPO } from "./rename-form-modal.po";
// import {
//     navigateTo,
//     navigateQuicklyTo,
//     waitForSpinnerToDisappear,
//     waitForPageToLoad
// } from '../../../../tests/protractor/common/prots-utils';
// import { Utils } from '../../../../tests/protractor/common/utils';

export class ManageFormsPO {
  public ancestor: Locator;
  public defaultTimeoutInMillis: number;
  public elements;
  public utils: Utils;
  public readonly page: Page;

  public constructor(
    ancestorElement?: Locator,
    defaultTimeoutInMillis = 20000
  ) {
    this.defaultTimeoutInMillis = defaultTimeoutInMillis;
    this.ancestor =
      ancestorElement || this.page.locator("#ng2-manage-forms-page");
    this.elements = {
      container: this.ancestor.locator("#ng2-manage-forms-page"),
      gridComponent: this.ancestor.locator("cxone-grid"),
      header: this.ancestor.locator("#manage-forms-page-title"),
      newFormBtn: this.ancestor.locator("#createForm"),
      currentUserName: this.page.locator("#simple-dropdown div.titleText"),
      publishBtn: this.ancestor.locator("#bulk-btn-activate"),
      unpublishBtn: this.ancestor.locator("#bulk-btn-deactivate"),
      bulkDeleteBtn: this.ancestor.locator("#bulk-btn-delete"),
      spinner: this.page.locator(
        ".cxonespinner .spinner.spinner-bounce-middle"
      ),
      delPublishFormPopover: this.page.locator(
        "popover-container.tooltip-popover-style"
      ),
      clickConfirmDelete: this.page.locator(
        'button, input[type="button"], input[type="submit"] >> text = "Yes"'
      ),
      confirmCancelBtn: this.page.locator("#popup-cancel"),
      row: this.ancestor.locator(
        "#manage-forms-grid div.ag-center-cols-viewport div[row-index]"
      ),
      noMatchfoundMsg: this.ancestor.locator(
        "#manage-forms-grid span.no-rows-overlay-text"
      ),
    };
  }

  public async refresh() {
    return await navigateQuicklyTo(
      fdUtils.getPageIdentifierUrls("forms.form_Manager"),
      this.page.locator("#ng2-manage-forms-page #manage-forms-grid"),
      fdUtils.getPageIdentifierUrls("qp.qpPlanManager")
    );
  }

  public async navigateTo() {
    return await navigateTo(
      fdUtils.getPageIdentifierUrls("forms.form_Manager"),
      this.page.locator("#ng2-manage-forms-page #manage-forms-grid")
    );
  }

  public async navigateToWithWarningModal() {
    const warningModalComponentPo = new WarningModalComponentPo();
    await this.page.goto(fdUtils.getPageIdentifierUrls("forms.form_Manager"));
    await warningModalComponentPo.clickYesButton();
    return await waitForPageToLoad(
      this.page.locator("#ng2-manage-forms-page #manage-forms-grid")
    );
  }

  public getNewFormButton(): Locator {
    return this.elements.newFormBtn;
  }

  public async getHeaderText(): Promise<string> {
    return await this.elements.header.getText();
  }

  public getGridRow(rowIndex: number) {
    return this.page.locator(
      `div.ag-center-cols-container div.ag-row[row-index="${rowIndex}"]`
    );
  }

  public async verifyFormPresence(
    formName: string,
    shouldSearch = true
  ): Promise<boolean> {
    if (shouldSearch) {
      await this.searchFormInGrid(formName);
    }
    return this.ancestor
      .locator('xpath=.//*[text()="' + formName + '"]/..')
      .isPresent();
  }

  public async getGridRowOfMatchingText(text: string) {
    let row: Locator = await this.ancestor.locator(
      'xpath=.//*[text()="' + text + '"]/../../..'
    );
    const rowIndex = await row.getAttribute("row-index");
    return this.getGridRow(+rowIndex);
  }

  public async getGridRowTexts(row: number | Locator) {
    let cells;
    if (typeof row === "number") {
      cells = await this.page.locator(
        `div.ag-center-cols-container div.ag-row[row-index="${row}"] div.ag-cell`
      );
    } else {
      cells = await this.page.locator("div.ag-cell");
    }
    return {
      version: await cells[2].getText(),
      lastModified: await cells[3].getText(),
      modifiedBy: await cells[4].getText(),
      status: await cells[5].getText(),
    };
  }

  public async getFormRowElements(value): Promise<any> {
    let columns = await this.ancestor.locator(
      'xpath=.//*[text()="' + value + '"]/../../../*'
    );
    await Utils.waitUntilVisible(columns[0]);

    return {
      version: await columns[2].getText(),
      lastModified: await columns[3].getText(),
      modifiedBy: await columns[4].getText(),
      status: await columns[5].getText(),
      actions: await columns[6].getText(),
    };
  }

  public getTodaysDate(format): string {
    return moment().utc().format(format);
  }

  public async getCurrentUserName(): Promise<string> {
    await expect(this.page.locator("header.nice-header")).toBeVisible(
      this.defaultTimeoutInMillis
    );
    return await this.elements.currentUserName.getText();
  }

  public async getBulkOperationsButtonEnabledStates(): Promise<{
    activate: boolean;
    deactivate: boolean;
    delete: boolean;
  }> {
    const obj = {
      activate: await this.elements.publishBtn.isEnabled(),
      deactivate: await this.elements.publishBtn.isEnabled(),
      delete: await this.elements.publishBtn.isEnabled(),
    };
    return obj;
  }

  public async selectParticularForm(formName): Promise<any> {
    let row: Locator = this.ancestor.locator(
      'xpath=.//*[text()="' + formName + '"]/../../..'
    );
    let checkboxToSelect = row.locator(
      "span.ag-selection-checkbox .ag-icon.ag-icon-checkbox-unchecked"
    );
    return await checkboxToSelect.click();
  }

  public async openParticularForm(formName): Promise<any> {
    await Utils.click(
      this.ancestor.locator('xpath=.//*[text()="' + formName + '"]/../../..')
    );
    await Utils.waitForSpinnerToDisappear();
    await Utils.waitForTime(2000);
  }

  public async clickUnpublishButton() {
    const isEnabled = await this.elements.unpublishBtn.isEnabled();
    if (!isEnabled) {
      await expect(this.elements.unpublishBtn).toBeEnabled(
        this.defaultTimeoutInMillis
      );
    }
    return await this.elements.unpublishBtn.click();
  }

  public async clickBulkDeleteButton() {
    const isEnabled = await this.elements.bulkDeleteBtn.isEnabled();
    if (!isEnabled) {
      await expect(this.elements.bulkDeleteBtn).toBeEnabled(
        this.defaultTimeoutInMillis
      );
    }
    return await this.elements.bulkDeleteBtn.click();
  }

  public async clickConfirmBtn(btnName) {
    let btn = this.page.locator("#popup-" + btnName + "");
    Utils.waitUntilVisible(btn);
    await btn.click();
    return this.waitForSpinnerToDisappear();
  }

  public async waitForSpinnerToDisappear(timeToWait?: number) {
    await waitForSpinnerToDisappear(timeToWait);
  }

  public async verifyHamburgerMenu(value) {
    const row = await this.getGridRowOfMatchingText(value);
    const actionMore = row.locator("button.action-btn.action-more");
    return actionMore.isPresent();
  }

  public async verifyDeleteOption(value) {
    const row = await this.getGridRowOfMatchingText(value);
    const actionDelete = row.locator("button.action-btn.action-delete");
    return actionDelete.isPresent();
  }

  public async getHamburgerMenuItem(value: string, action: string) {
    const row = await this.getGridRowOfMatchingText(value);
    const actionMore = row.locator("button.action-btn.action-more");
    await actionMore.click();
    await expect(
      this.page.locator("popover-container .more-option-popover")
    ).toBeVisible(5000);
    return this.page.locator(
      `popover-container .more-option-popover .clickable.${action.toLowerCase()}`
    );
  }

  public async verifyHamburgerMenuOptions(formName: string) {
    const row = await this.getGridRowOfMatchingText(formName);
    const actionMore = row.locator("button.action-btn.action-more");
    await actionMore.click();
    await expect(
      this.page.locator("popover-container .more-option-popover")
    ).toBeVisible(5000);

    const visibilityOptions = {
      activate: await this.page
        .locator("popover-container .more-option-popover .clickable.activate")
        .isPresent(),
      deactivate: await this.page
        .locator("popover-container .more-option-popover .clickable.unpublish")
        .isPresent(),
      duplicate: await this.page
        .locator("popover-container .more-option-popover .clickable.duplicate")
        .isPresent(),
      rename: await this.page
        .locator("popover-container .more-option-popover .clickable.rename")
        .isPresent(),
    };
    return visibilityOptions;
  }

  public async verifyMessageMouseHoverDelOfPublishedForm(value) {
    try {
      const row = await this.getGridRowOfMatchingText(value);
      const actionDelete = row.locator("button.action-btn.action-delete svg");
      await browser.actions().mouseMove(actionDelete).perform();
      await expect(this.elements.delPublishFormPopover).toBeVisible(10000);
      return this.elements.delPublishFormPopover.getText();
    } catch (ex) {
      console.error("Failed to get hover message", ex);
    }
  }

  public async bulkDelete() {
    await Utils.waitUntilVisible(this.elements.bulkDeleteBtn);
    // await protractorConfig.testUtils.waitUntilDisplayed(this.elements.bulkDeleteBtn);
    return this.elements.bulkDeleteBtn.click();
  }

  public async clickConfirmDeleteBtn(skipWaitForSpinner?) {
    await Utils.waitUntilVisible(this.elements.clickConfirmDelete);
    // await protractorConfig.testUtils.waitUntilDisplayed(this.elements.clickConfirmDelete);
    await this.elements.clickConfirmDelete.click();
    if (!skipWaitForSpinner) {
      await this.waitForSpinnerToDisappear();
    }
  }

  public async getNumberOfRows() {
    return await this.elements.row.count();
  }

  public async getNoMatchFoundMsg() {
    return await this.elements.noMatchfoundMsg.getText();
  }

  public async clickConfirmCancel() {
    await Utils.waitUntilVisible(this.elements.confirmCancelBtn);
    // await protractorConfig.testUtils.waitUntilDisplayed(this.elements.confirmCancelBtn);
    return this.elements.confirmCancelBtn.click();
  }

  public async bulkActivateForms(formNames: string[]) {
    for (let i = 0; i < formNames.length; i++) {
      await this.selectParticularForm(formNames[i]);
    }
    await protractorConfig.testUtils.waitForItemToBeClickable(
      this.elements.publishBtn
    );
    await this.elements.publishBtn.click();
    await expect(
      this.page.locator("popover-container.bulk-operations")
    ).toBeVisible(5000);
    await this.clickConfirmBtn("publish");
    return this.waitForSpinnerToDisappear();
  }

  public async bulkDeactivateForms(formNames: string[]) {
    const promises: any = [];
    formNames.forEach((formName) =>
      promises.push(this.selectParticularForm(formName))
    );
    await Promise.all(promises);
    const isEnabled = await this.elements.unpublishBtn.isEnabled();
    if (!isEnabled) {
      await expect(this.elements.unpublishBtn).toBeEnabled(
        this.defaultTimeoutInMillis
      );
    }
    await this.elements.unpublishBtn.click();
    await expect(
      this.page.locator("popover-container.bulk-operations")
    ).toBeVisible(5000);
    await this.clickConfirmBtn("unpublish");
    return this.waitForSpinnerToDisappear();
  }

  public async bulkDeleteForms(formNames: string[]) {
    const promises: any = [];
    formNames.forEach((formName) =>
      promises.push(this.selectParticularForm(formName))
    );
    await Promise.all(promises);
    await this.clickBulkDeleteButton();
    await expect(
      this.page.locator("popover-container.bulk-operations")
    ).toBeVisible(5000);
    await this.clickConfirmBtn("delete");
    return this.waitForSpinnerToDisappear();
  }

  public async duplicateForm(oldFormName: string, newFormName: string) {
    const duplicateFormModalPO = new DuplicateFormModalPO();
    await this.searchFormInGrid(oldFormName);
    const menuItem = await this.getHamburgerMenuItem(oldFormName, "Duplicate");
    await menuItem.click();
    await expect(this.page.locator("cxone-modals")).toBeVisible(
      this.defaultTimeoutInMillis
    );
    await duplicateFormModalPO.enterFormName(newFormName);
    await duplicateFormModalPO.clickSaveButton();
    await this.waitForSpinnerToDisappear();
    await this.searchFormInGrid("");
  }

  public async renameForm(oldFormName: string, newFormName: string) {
    const renameFormModalPO = new RenameFormModalPO();
    await this.searchFormInGrid(oldFormName);
    const menuItem = await this.getHamburgerMenuItem(oldFormName, "Rename");
    await menuItem.click();
    await expect(this.page.locator("cxone-modals")).toBeVisible(
      this.defaultTimeoutInMillis
    );
    await renameFormModalPO.enterName(newFormName);
    await renameFormModalPO.clickChangeBtn();
    await this.waitForSpinnerToDisappear();
    await this.searchFormInGrid("");
  }

  public async activateForm(formName: string) {
    await this.searchFormInGrid(formName);
    const menuItem = await this.getHamburgerMenuItem(formName, "Activate");
    await menuItem.click();
    await this.waitForSpinnerToDisappear();
    await this.searchFormInGrid("");
  }

  public async deleteForm(formName: string) {
    await this.searchFormInGrid(formName);
    const row = await this.getGridRowOfMatchingText(formName);
    await row.locator("button.action-btn.action-delete").click();
    await expect(
      this.page.locator(
        'popover-container div.confirmBtns button[id="popup-single-delete"]'
      )
    ).toBeVisible(5000);
    await this.page
      .locator(
        'popover-container div.confirmBtns button[id="popup-single-delete"]'
      )
      .click();
    return this.waitForSpinnerToDisappear();
  }

  public async deactivateForm(formName: string) {
    await this.searchFormInGrid(formName);
    const menuItem = await this.getHamburgerMenuItem(formName, "Unpublish");
    await menuItem.click();
    await this.waitForSpinnerToDisappear();
    await this.searchFormInGrid("");
  }

  public async searchFormInGrid(formName: string) {
    const omnibarPO = new OmnibarPO(this.page.locator("cxone-omnibar"));
    await expect(this.page.locator("cxone-omnibar")).toBeVisible(5000);
    await omnibarPO.typeSearchQuery(formName);
    fdUtils.waitABit(1000);
  }
}
