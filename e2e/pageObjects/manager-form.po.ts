import { Page, Locator } from "@playwright/test";
import { Utils } from "../common/utils";
import { URLs } from '../common/pageIdentifierURLs';
import { Helpers } from "../playwright.helpers";
import { CommonUIUtils } from "cxone-playwright-test-utils";

export class ManageFormsPO {
    readonly page: Page;
    readonly defaultTimeoutInMillis: number;
    readonly elements: any;

    constructor(pageElement?: Page, defaultTimeoutInMillis = 20000){
        this.defaultTimeoutInMillis = defaultTimeoutInMillis;
        this.page = pageElement || this.page.locator(`#ng2-manage-forms-page`)
        this.elements = {
            container: this.page.locator(`#ng2-manage-forms-page`),
            gridComponent: this.page.locator(`cxone-grid`),
            itemsCountLabel: this.page.locator(`<need to mention>`),
            header: this.page.locator(`#manage-forms-page-title`),
            newFormBtn: this.page.locator(`#createForm`),
            currentUserName: this.page.locator(`#simple-dropdown div.titleText`),
            publishBtn: this.page.locator(`#bulk-btn-activate`),
            unpublishBtn: this.page.locator(`#bulk-btn-deactivate`),
            bulkDeleteBtn: this.page.locator(`#bulk-btn-delete`),
            spinner: this.page.locator(`.cxonespinner .spinner.spinner-bounce-middle`),
            delPublishFormPopover: this.page.locator(`popover-container.tooltip-popover-style`),
            clickConfirmDelete: this.page.locator(`button:has-text("Yes")`),
            confirmCancelBtn: this.page.locator(`#popup-cancel`),
            row: this.page.locator(`#manage-forms-grid div.ag-center-cols-viewport div[row-index]`),
            noMatchfoundMsg: this.page.locator(`#manage-forms-grid span.no-rows-overlay-text`)
        }
    }

    public async refresh() {
        // return await navigateQuicklyTo(protractorConfig.fdUtils.getPageIdentifierUrls('forms.form_Manager'), element(by.css('#ng2-manage-forms-page #manage-forms-grid')), protractorConfig.fdUtils.getPageIdentifierUrls('qp.qpPlanManager'));
    }

    public async navigateTo() {
        // return await navigateTo(protractorConfig.fdUtils.getPageIdentifierUrls('forms.form_Manager'), element(by.css('#ng2-manage-forms-page #manage-forms-grid')));
    }

    public async navigateToWithWarningModal() {
        // const warningModalComponentPo = new WarningModalComponentPo();
        // await browser.get(protractorConfig.fdUtils.getPageIdentifierUrls('forms.form_Manager'));
        // await warningModalComponentPo.clickYesButton();
        // return await waitForPageToLoad(element(by.css('#ng2-manage-forms-page #manage-forms-grid')));
    }

    public getNewFormButton(): Page {
        // return this.elements.newFormBtn;
    }

    public async getHeaderText(): Promise<any> {
        // return await this.elements.header.getText();
    }

    public getGridRow(rowIndex: number) {
        // return element(by.css(`div.ag-center-cols-container div.ag-row[row-index="${rowIndex}"]`));
    }

    public async verifyFormPresence(formName: string, shouldSearch = true): Promise<boolean> {
        // if (shouldSearch) {
        //     await this.searchFormInGrid(formName);
        // }
        // return this.ancestor.element(by.xpath('.//*[text()="' + formName + '"]/..')).isPresent();
    }

    public async getGridRowOfMatchingText(text: string) {
        // let row: ElementFinder = await this.ancestor.element(by.xpath('.//*[text()="' + text + '"]/../../..'));
        // const rowIndex = await row.getAttribute('row-index');
        // return this.getGridRow(+rowIndex);
    }

    public async getGridRowTexts(row: number | Page) {
        // let cells;
        // if (typeof row === 'number') {
        //     cells = await element.all(by.css(`div.ag-center-cols-container div.ag-row[row-index="${row}"] div.ag-cell`));
        // } else {
        //     cells = await element.all(by.css('div.ag-cell'));
        // }
        // return {
        //     version: await cells[2].getText(),
        //     lastModified: await cells[3].getText(),
        //     modifiedBy: await cells[4].getText(),
        //     status: await cells[5].getText()
        // };
    }

    public async getFormRowElements(value): Promise<any> {
        // let columns = await this.ancestor.all(by.xpath('.//*[text()="' + value + '"]/../../../*'));
        // await protractorConfig.testUtils.waitUntilDisplayed(columns[0]);
        // return {
        //     version: await columns[2].getText(),
        //     lastModified: await columns[3].getText(),
        //     modifiedBy: await columns[4].getText(),
        //     status: await columns[5].getText(),
        //     actions: await columns[6].getText()
        // };
    }

    public getTodaysDate(format:any): any {
        // return moment().utc().format(format);
    }

    public async getCurrentUserName(): Promise<any> {
        // await browser.wait(ExpectedConditions.visibilityOf(element(by.css('header.nice-header'))), this.defaultTimeoutInMillis);
        // return await this.elements.currentUserName.getText();
    }

    public async getBulkOperationsButtonEnabledStates(): Promise<any> {
        // const obj = {
        //     activate: await this.elements.publishBtn.isEnabled(),
        //     deactivate: await this.elements.publishBtn.isEnabled(),
        //     delete: await this.elements.publishBtn.isEnabled()
        // };
        // return obj;
    }

    public async selectParticularForm(formName): Promise<any> {
        // let row: ElementFinder = this.ancestor.element(by.xpath('.//*[text()="' + formName + '"]/../../..'));
        // let checkboxToSelect = row.element(by.css('span.ag-selection-checkbox .ag-icon.ag-icon-checkbox-unchecked'));
        // return await checkboxToSelect.click();
    }

    public async openParticularForm(formName): Promise<any> {
        // await Utils.click(this.ancestor.element(by.xpath('.//*[text()="' + formName + '"]/../../..')));
        // await waitForSpinnerToDisappear();
        // await Utils.waitForTime(2000);
    }

    public async clickUnpublishButton() {
        // const isEnabled = await this.elements.unpublishBtn.isEnabled();
        // if (!isEnabled) {
        //     await browser.wait(ExpectedConditions.elementToBeClickable(this.elements.unpublishBtn), this.defaultTimeoutInMillis);
        // }
        // return await this.elements.unpublishBtn.click();
    }

    public async clickBulkDeleteButton() {
        // const isEnabled = await this.elements.bulkDeleteBtn.isEnabled();
        // if (!isEnabled) {
        //     await browser.wait(ExpectedConditions.elementToBeClickable(this.elements.bulkDeleteBtn), this.defaultTimeoutInMillis);
        // }
        // return await this.elements.bulkDeleteBtn.click();
    }

    public async clickConfirmBtn(btnName) {
        // let btn = element(by.id('popup-' + btnName + ''));
        // await protractorConfig.testUtils.waitUntilDisplayed(btn);
        // await btn.click();
        // return this.waitForSpinnerToDisappear();
    }

    public async waitForSpinnerToDisappear(timeToWait?: number) {
        // await waitForSpinnerToDisappear(timeToWait);
    }

    public async verifyHamburgerMenu(value) {
        // const row = await this.getGridRowOfMatchingText(value);
        // const actionMore = row.element(by.css('button.action-btn.action-more'));
        // return actionMore.isPresent();
    }

    public async verifyDeleteOption(value) {
        // const row = await this.getGridRowOfMatchingText(value);
        // const actionDelete = row.element(by.css('button.action-btn.action-delete'));
        // return actionDelete.isPresent();
    }

    public async getHamburgerMenuItem(value: string, action: string) {
        // const row = await this.getGridRowOfMatchingText(value);
        // const actionMore = row.element(by.css('button.action-btn.action-more'));
        // await actionMore.click();
        // await browser.wait(ExpectedConditions.visibilityOf(element(by.css('popover-container .more-option-popover'))), 5000);
        // return element(by.css(`popover-container .more-option-popover .clickable.${action.toLowerCase()}`));
    }

    public async verifyHamburgerMenuOptions(formName: string) {
        // const row = await this.getGridRowOfMatchingText(formName);
        // const actionMore = row.element(by.css('button.action-btn.action-more'));
        // await actionMore.click();
        // await browser.wait(ExpectedConditions.visibilityOf(element(by.css('popover-container .more-option-popover'))), 5000);
        // const visibilityOptions = {
        //     activate: await element(by.css('popover-container .more-option-popover .clickable.activate')).isPresent(),
        //     deactivate: await element(by.css('popover-container .more-option-popover .clickable.unpublish')).isPresent(),
        //     duplicate: await element(by.css('popover-container .more-option-popover .clickable.duplicate')).isPresent(),
        //     rename: await element(by.css('popover-container .more-option-popover .clickable.rename')).isPresent()
        // };
        // return visibilityOptions;
    }

    public async verifyMessageMouseHoverDelOfPublishedForm(value: any) {
        // try {
        //     const row = await this.getGridRowOfMatchingText(value);
        //     const actionDelete = row.element(by.css('button.action-btn.action-delete svg'));
        //     await browser.actions().mouseMove(actionDelete).perform();
        //     await browser.wait(ExpectedConditions.visibilityOf(this.elements.delPublishFormPopover), 10000);
        //     return this.elements.delPublishFormPopover.getText();
        // } catch (ex) {
        //     console.error('Failed to get hover message', ex);
        // }
    }

    public async bulkDelete() {
        // await protractorConfig.testUtils.waitUntilDisplayed(this.elements.bulkDeleteBtn);
        // return this.elements.bulkDeleteBtn.click();
    }

    public async clickConfirmDeleteBtn(skipWaitForSpinner?: any) {
        // await protractorConfig.testUtils.waitUntilDisplayed(this.elements.clickConfirmDelete);
        // await this.elements.clickConfirmDelete.click();
        // if (!skipWaitForSpinner) {
        //     await this.waitForSpinnerToDisappear();
        // }
    }

    public async getNumberOfRows() {
        // return await this.elements.row.count();
    }

    public async getNoMatchFoundMsg() {
        // return await this.elements.noMatchfoundMsg.getText();
    }

    public async clickConfirmCancel() {
        // await protractorConfig.testUtils.waitUntilDisplayed(this.elements.confirmCancelBtn);
        // return this.elements.confirmCancelBtn.click();
    }

    public async bulkActivateForms(formNames: string[]) {
        // for (let i = 0; i < formNames.length; i++) {
        //     await this.selectParticularForm(formNames[i]);
        // }
        // await protractorConfig.testUtils.waitForItemToBeClickable(this.elements.publishBtn);
        // await this.elements.publishBtn.click();
        // await browser.wait(ExpectedConditions.visibilityOf(element(by.css('popover-container.bulk-operations'))), 5000);
        // await this.clickConfirmBtn('publish');
        // return this.waitForSpinnerToDisappear();
    }

    public async bulkDeactivateForms(formNames: string[]) {
        // const promises = [];
        // formNames.forEach(formName => promises.push(this.selectParticularForm(formName)));
        // await Promise.all(promises);
        // const isEnabled = await this.elements.unpublishBtn.isEnabled();
        // if (!isEnabled) {
        //     await browser.wait(ExpectedConditions.elementToBeClickable(this.elements.unpublishBtn), this.defaultTimeoutInMillis);
        // }
        // await this.elements.unpublishBtn.click();
        // await browser.wait(ExpectedConditions.visibilityOf(element(by.css('popover-container.bulk-operations'))), 5000);
        // await this.clickConfirmBtn('unpublish');
        // return this.waitForSpinnerToDisappear();
    }

    public async bulkDeleteForms(formNames: string[]) {
        // const promises = [];
        // formNames.forEach(formName => promises.push(this.selectParticularForm(formName)));
        // await Promise.all(promises);
        // await this.clickBulkDeleteButton();
        // await browser.wait(ExpectedConditions.visibilityOf(element(by.css('popover-container.bulk-operations'))), 5000);
        // await this.clickConfirmBtn('delete');
        // return this.waitForSpinnerToDisappear();
    }

    public async duplicateForm(oldFormName: string, newFormName: string) {
        // const duplicateFormModalPO = new DuplicateFormModalPO();
        // await this.searchFormInGrid(oldFormName);
        // const menuItem = await this.getHamburgerMenuItem(oldFormName, 'Duplicate');
        // await menuItem.click();
        // await browser.wait(ExpectedConditions.visibilityOf(element(by.css('cxone-modal'))), this.defaultTimeoutInMillis);
        // await duplicateFormModalPO.enterFormName(newFormName);
        // await duplicateFormModalPO.clickSaveButton();
        // await this.waitForSpinnerToDisappear();
        // await this.searchFormInGrid('');
    }

    public async renameForm(oldFormName: string, newFormName: string) {
        // const renameFormModalPO = new RenameFormModalPO();
        // await this.searchFormInGrid(oldFormName);
        // const menuItem = await this.getHamburgerMenuItem(oldFormName, 'Rename');
        // await menuItem.click();
        // await browser.wait(ExpectedConditions.visibilityOf(element(by.css('cxone-modal'))), this.defaultTimeoutInMillis);
        // await renameFormModalPO.enterName(newFormName);
        // await renameFormModalPO.clickChangeBtn();
        // await this.waitForSpinnerToDisappear();
        // await this.searchFormInGrid('');
    }

    public async activateForm(formName: string) {
        // await this.searchFormInGrid(formName);
        // const menuItem = await this.getHamburgerMenuItem(formName, 'Activate');
        // await menuItem.click();
        // await this.waitForSpinnerToDisappear();
        // await this.searchFormInGrid('');
    }

    public async deleteForm(formName: string) {
        // await this.searchFormInGrid(formName);
        // const row = await this.getGridRowOfMatchingText(formName);
        // await row.element(by.css('button.action-btn.action-delete')).click();
        // await browser.wait(ExpectedConditions.visibilityOf(element(by.css('popover-container div.confirmBtns button[id="popup-single-delete"]'))), 5000);
        // await element(by.css('popover-container div.confirmBtns button[id="popup-single-delete"]')).click();
        // return this.waitForSpinnerToDisappear();
    }

    public async deactivateForm(formName: string) {
        // await this.searchFormInGrid(formName);
        // const menuItem = await this.getHamburgerMenuItem(formName, 'Unpublish');
        // await menuItem.click();
        // await this.waitForSpinnerToDisappear();
        // await this.searchFormInGrid('');
    }

    public async searchFormInGrid(formName: string) {
        // const omnibarPO = new OmnibarPO(element(by.css('cxone-omnibar')));
        // await browser.wait(ExpectedConditions.visibilityOf(element(by.css('cxone-omnibar'))), 5000);
        // await omnibarPO.typeSearchQuery(formName);
        // await protractorConfig.fdUtils.waitABit(1000);
    }

    async getItemCountLabel() {
        // return await this.itemsCountLabel.textContent();
    }
}