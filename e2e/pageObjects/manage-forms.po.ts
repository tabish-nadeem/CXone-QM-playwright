
import { expect, Locator, Page } from "@playwright/test";
import moment from "moment";
import { fdUtils } from "../common/FdUtils";
import { Utils } from "../common/utils";
import { CommonUIUtils } from "cxone-playwright-test-utils";
import { OmnibarPO } from "./omnibar.po";
import { RenameFormModalPO } from "./rename-form-modal.po";
import { WarningModalComponentPo } from "./warning-modal.component.po";
import { DuplicateFormModalPO } from "./duplicate-form-modal.po";

export class ManageFormsPO {
  public ancestor: Locator;
  public defaultTimeoutInMillis: number;
  public elements;
  public utils: Utils;
  public readonly page: Page;

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


    public constructor(pageElement?: Page, defaultTimeoutInMillis = 20000) {
        this.defaultTimeoutInMillis = defaultTimeoutInMillis;
        this.page = pageElement || this.page.locator('#ng2-manage-forms-page');
        this.utils = new Utils(this.page);
        this.elements = {
            container: this.page.locator('#ng2-manage-forms-page'),
            gridComponent: this.page.locator('cxone-grid'),
            header: this.page.locator('#manage-forms-page-title'),
            newFormBtn: this.page.locator('#createForm'),
            currentUserName: this.page.locator('#simple-dropdown div.titleText'),
            publishBtn: this.page.locator('#bulk-btn-activate'),
            unpublishBtn: this.page.locator('#bulk-btn-deactivate'),
            bulkDeleteBtn: this.page.locator('#bulk-btn-delete'),
            spinner: this.page.locator('.cxonespinner .spinner.spinner-bounce-middle'),
            delPublishFormPopover: this.page.locator('popover-container.tooltip-popover-style'),
            clickConfirmDelete: this.page.locator('button, input[type="button"], input[type="submit"] >> text = "Yes"'),
            confirmCancelBtn: this.page.locator('#popup-cancel'),
            row: this.page.locator('#manage-forms-grid div.ag-center-cols-viewport div[row-index]'),
            noMatchfoundMsg: this.page.locator('#manage-forms-grid span.no-rows-overlay-text')
        };
    }


    public async navigateToWithWarningModal() {
        const warningModalComponentPo = new WarningModalComponentPo();
        await this.page.goto(fdUtils.getPageIdentifierUrls('forms.form_Manager'));        
        await warningModalComponentPo.clickYesButton();
        return await this.utils.waitForPageToLoad(this.page.locator('#ng2-manage-forms-page #manage-forms-grid'));
    }

    public getNewFormButton(): Locator {
        return this.elements.newFormBtn;
    }

    public async getHeaderText(): Promise<string> {
        return await this.elements.header.textContent();
    }

    public getGridRow(rowIndex: number) {
        return this.page.locator(`div.ag-center-cols-container div.ag-row[row-index="${rowIndex}"]`);
    }

    public async verifyFormPresence(formName: string, shouldSearch = true): Promise<boolean> {
        if (shouldSearch) {
            await this.searchFormInGrid(formName);
        }
        return this.page.locator('xpath=.//*[text()="' + formName + '"]/..').isPresent();
    }

    public async getGridRowOfMatchingText(text: string) {
        let row: Locator = await this.page.locator('xpath=.//*[text()="' + text + '"]/../../..');
        const rowIndex = await row.getAttribute('row-index');
        return this.getGridRow(+rowIndex);
    }

    public async getGridRowTexts(row: number | Locator) {
        let cells: any;
        if (typeof row === 'number') {
            cells = await this.page.locator(`div.ag-center-cols-container div.ag-row[row-index="${row}"] div.ag-cell`);
        } else {
            cells = await this.page.locator('div.ag-cell');
        }
        return {
            version: await cells[2].textContent(),
            lastModified: await cells[3].textContent(),
            modifiedBy: await cells[4].textContent(),
            status: await cells[5].textContent()
        };
    }

    public async getFormRowElements(value: any): Promise<any> {
        let columns = await this.page.locator('xpath=.//*[text()="' + value + '"]/../../../*');
        await this.page.waitForSelector(columns[0])
        
        return {
            version: await columns[2].textContent(),
            lastModified: await columns[3].textContent(),
            modifiedBy: await columns[4].textContent(),
            status: await columns[5].textContent(),
            actions: await columns[6].textContent()
        };
    }

    public getTodaysDate(format:any): string {
        return moment().utc().format(format);
    }

    public async getCurrentUserName(): Promise<string> {
        await expect(this.page.locator('header.nice-header')).toBeVisible(this.defaultTimeoutInMillis);
        return await this.elements.currentUserName.textContent();
    }

    public async getBulkOperationsButtonEnabledStates(): Promise<{ activate: boolean; deactivate: boolean; delete: boolean }> {
        const obj = {
            activate: await this.elements.publishBtn.isEnabled(),
            deactivate: await this.elements.publishBtn.isEnabled(),
            delete: await this.elements.publishBtn.isEnabled()
        };
        return obj;
    }

    public async selectParticularForm(formName: any): Promise<any> {
        let row: Locator = this.page.locator('xpath=.//*[text()="' + formName + '"]/../../..');
        let checkboxToSelect = row.locator('span.ag-selection-checkbox .ag-icon.ag-icon-checkbox-unchecked');
        return await checkboxToSelect.click();
    }

    public async openParticularForm(formName: any): Promise<any> {
        await Utils.click(this.page.locator('xpath=.//*[text()="' + formName + '"]/../../..'));
        await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        await Utils.waitForTime(2000);
    }

    public async clickUnpublishButton() {
        const isEnabled = await this.elements.unpublishBtn.isEnabled();
        if (!isEnabled) {
            await expect(this.elements.unpublishBtn).toBeEnabled(this.defaultTimeoutInMillis);
        }
        return await this.elements.unpublishBtn.click();
    }

    public async clickBulkDeleteButton() {
        const isEnabled = await this.elements.bulkDeleteBtn.isEnabled();
        if (!isEnabled) {
            await expect(this.elements.bulkDeleteBtn).toBeEnabled(this.defaultTimeoutInMillis);

        }
        return await this.elements.bulkDeleteBtn.click();
    }

    public async clickConfirmBtn(btnName: any) {
        let btn = this.page.locator('#popup-' + btnName + '');
        this.page.waitForSelector('#popup-' + btnName + '')
        await btn.click();
        return CommonUIUtils.waitUntilIconLoaderDone(this.page);
    }

    public async waitForSpinnerToDisappear(timeToWait?: number) {
        if (!timeToWait) {
            timeToWait = 60000;
        }
        return await this.utils.waitUntilNotVisible(this.elements.spinner, timeToWait);
    }

    public async verifyHamburgerMenu(value: any) {
        const row = await this.getGridRowOfMatchingText(value);
        const actionMore = row.locator('button.action-btn.action-more');
        return actionMore.isPresent();
    }

    public async verifyDeleteOption(value: any) {
        const row = await this.getGridRowOfMatchingText(value);
        const actionDelete = row.locator('button.action-btn.action-delete');
        return actionDelete.isPresent();
    }

    public async getHamburgerMenuItem(value: string, action: string) {
        const row = await this.getGridRowOfMatchingText(value);
        const actionMore = row.locator('button.action-btn.action-more');
        await actionMore.click();
        await expect(this.page.locator('popover-container .more-option-popover')).toBeVisible(5000);
        return this.page.locator(`popover-container .more-option-popover .clickable.${action.toLowerCase()}`);
    }

    public async verifyHamburgerMenuOptions(formName: string) {
        const row = await this.getGridRowOfMatchingText(formName);
        const actionMore = row.locator('button.action-btn.action-more');
        await actionMore.click();
        await expect(this.page.locator('popover-container .more-option-popover')).toBeVisible(5000);

        const visibilityOptions = {
            activate: await this.page.locator('popover-container .more-option-popover .clickable.activate').isPresent(),
            deactivate: await this.page.locator('popover-container .more-option-popover .clickable.unpublish').isPresent(),
            duplicate: await this.page.locator('popover-container .more-option-popover .clickable.duplicate').isPresent(),
            rename: await this.page.locator('popover-container .more-option-popover .clickable.rename').isPresent()
        };
        return visibilityOptions;
    }

    public async verifyMessageMouseHoverDelOfPublishedForm(value: any) {
        try {
            const row = await this.getGridRowOfMatchingText(value);
            const actionDelete = row.locator('button.action-btn.action-delete svg');
            await actionDelete.hover();
            await expect(this.elements.delPublishFormPopover).toBeVisible(10000);
            return this.elements.delPublishFormPopover.textContent();
        } catch (ex) {
            console.error('Failed to get hover message', ex);
        }
    }

    public async bulkDelete() {
        await this.page.waitForSelector('#bulk-btn-delete');
        return this.elements.bulkDeleteBtn.click();
    }

    public async clickConfirmDeleteBtn(skipWaitForSpinner?: any) {
        await this.page.waitForSelector('button, input[type="button"], input[type="submit"] >> text = "Yes"')
        await this.elements.clickConfirmDelete.click();
        if (!skipWaitForSpinner) {
            await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        }
    }

    public async getNumberOfRows() {
        return await this.elements.row.count();
    }

    public async getNoMatchFoundMsg() {
        return await this.elements.noMatchfoundMsg.textContent();
    }

    public async clickConfirmCancel() {
        await this.page.waitForSelector('#popup-cancel');
        return this.elements.confirmCancelBtn.click();
    }

    public async bulkActivateForms(formNames: string[]) {
        for (let i = 0; i < formNames.length; i++) {
            await this.selectParticularForm(formNames[i]);
        }
        await this.utils.waitForItemToBeClickable(this.elements.publishBtn, 5000);
        await this.elements.publishBtn.click();
        await expect(this.page.locator('popover-container.bulk-operations')).toBeVisible(5000);
        await this.clickConfirmBtn('publish');
        return CommonUIUtils.waitUntilIconLoaderDone(this.page);
    }

    public async bulkDeactivateForms(formNames: string[]) {
        const promises:any = [];
        formNames.forEach(formName => promises.push(this.selectParticularForm(formName)));
        await Promise.all(promises);
        const isEnabled = await this.elements.unpublishBtn.isEnabled();
        if (!isEnabled) {
            await expect(this.elements.unpublishBtn).toBeEnabled(this.defaultTimeoutInMillis);
        }
        await this.elements.unpublishBtn.click();
        await expect(this.page.locator('popover-container.bulk-operations')).toBeVisible(5000);
        await this.clickConfirmBtn('unpublish');
        return CommonUIUtils.waitUntilIconLoaderDone(this.page);
    }

    public async bulkDeleteForms(formNames: string[]) {
        const promises:any = [];
        formNames.forEach(formName => promises.push(this.selectParticularForm(formName)));
        await Promise.all(promises);
        await this.clickBulkDeleteButton();
        await expect(this.page.locator('popover-container.bulk-operations')).toBeVisible(5000);
        await this.clickConfirmBtn('delete');
        return CommonUIUtils.waitUntilIconLoaderDone(this.page);
    }

    public async duplicateForm(oldFormName: string, newFormName: string) {
        const duplicateFormModalPO = new DuplicateFormModalPO();
        await this.searchFormInGrid(oldFormName);
        const menuItem = await this.getHamburgerMenuItem(oldFormName, 'Duplicate');
        await menuItem.click();
        await expect(this.page.locator('cxone-modals')).toBeVisible(this.defaultTimeoutInMillis);
        await duplicateFormModalPO.enterFormName(newFormName);
        await duplicateFormModalPO.clickSaveButton();
        await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        await this.searchFormInGrid('');
    }

    public async renameForm(oldFormName: string, newFormName: string) {
        const renameFormModalPO = new RenameFormModalPO();
        await this.searchFormInGrid(oldFormName);
        const menuItem = await this.getHamburgerMenuItem(oldFormName, 'Rename');
        await menuItem.click();
        await expect(this.page.locator('cxone-modals')).toBeVisible(this.defaultTimeoutInMillis);
        await renameFormModalPO.enterName(newFormName);
        await renameFormModalPO.clickChangeBtn();
        await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        await this.searchFormInGrid('');
    }

    public async activateForm(formName: string) {
        await this.searchFormInGrid(formName);
        const menuItem = await this.getHamburgerMenuItem(formName, 'Activate');
        await menuItem.click();
        await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        await this.searchFormInGrid('');
    }

    public async deleteForm(formName: string) {
        await this.searchFormInGrid(formName);
        const row = await this.getGridRowOfMatchingText(formName);
        await row.locator('button.action-btn.action-delete').click();
        await expect(this.page.locator('popover-container div.confirmBtns button[id="popup-single-delete"]')).toBeVisible(5000);
        await this.page.locator('popover-container div.confirmBtns button[id="popup-single-delete"]').click();
        return CommonUIUtils.waitUntilIconLoaderDone(this.page);
    }

    public async deactivateForm(formName: string) {
        await this.searchFormInGrid(formName);
        const menuItem = await this.getHamburgerMenuItem(formName, 'Unpublish');
        await menuItem.click();
        await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        await this.searchFormInGrid('');
    }

    public async searchFormInGrid(formName: string) {
        const omnibarPO = new OmnibarPO(this.page.locator('cxone-omnibar'));
        await expect(this.page.locator('cxone-omnibar')).toBeVisible(5000);
        await omnibarPO.typeSearchQuery(formName);
        fdUtils.waitABit(1000)
    }
}
