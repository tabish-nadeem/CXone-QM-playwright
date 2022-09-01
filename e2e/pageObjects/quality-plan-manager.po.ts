import * as protHelper from '../../../../tests/protractor/config-helpers';
import { element, by, browser, ElementFinder, ExpectedConditions, ElementArrayFinder } from 'protractor';
import { OmnibarPO } from 'cxone-components/omnibar.po';
import { SpinnerPO } from 'cxone-components/spinner.po';
import { DuplicatePlanModalPO } from './modals/duplicate-plan-modal/duplicate-plan-modal.po';
import { navigateQuicklyTo, navigateTo, refresh, waitForPageToLoad, waitForSpinnerToDisappear } from '../../../../tests/protractor/common/prots-utils';
import { Utils } from '../../../../tests/protractor/common/utils';
import { QualityPlanDetailsPO } from './quality-plan-details/quality-plan-details.po';

const protractorConfig = protHelper.getProtractorHelpers();

export class QualityPlanManagerPO {
    public ancestor: ElementFinder;
    public defaultTimeoutInMillis: number;
    public elements;

    public constructor(ancestorElement?: ElementFinder, defaultTimeoutInMillis = 20000) {
        this.defaultTimeoutInMillis = defaultTimeoutInMillis;
        this.ancestor = ancestorElement || element(by.id('ng2-quality-plan-manager-page'));
        this.elements = {
            container: this.ancestor.element(by.css('#quality-plan-grid-container')),
            gridComponent: this.ancestor.element(by.tagName('cxone-grid')),
            header: this.ancestor.element(by.id('quality-plans-page-title')),
            newPlanBtn: this.ancestor.element(by.id('newPlan')),
            spinner: element(by.css('.cxonespinner div.spinner.spinner-bounce-middle')),
            optionsPlanPopover: element(by.css('popover-container.tooltip-popover-style')),
            clickConfirmDelete: element(by.id('popup-single-delete')),
            confirmCancelBtn: element(by.id('popup-cancel')),
            row: this.ancestor.all(by.css('#quality-plan-grid-container div.ag-center-cols-viewport div[row-index]')),
            activeWarning: element(by.css('.active-warning')),
            breadCrumbLink: element(by.css('.breadcrumb-item a'))
        };
    }

    public async navigate(quickly?: boolean) {
        if (quickly) {
            return await navigateQuicklyTo(protractorConfig.fdUtils.getPageIdentifierUrls('qp.qpPlanManager'), element(by.id('quality-plan-grid-container')));
        } else {
            return await navigateTo(protractorConfig.fdUtils.getPageIdentifierUrls('qp.qpPlanManager'), element(by.id('quality-plan-grid-container')));
        }
    }

    public async refresh() {
        await refresh(element(by.id('quality-plan-grid-container')));
    }

    public getNewPlanButton(): ElementFinder {
        return this.elements.newPlanBtn;
    }

    public getGrid(): ElementFinder {
        return this.elements.gridComponent;
    }

    public async getHeaderText(): Promise<string> {
        return await this.elements.header.getText();
    }

    public getGridRow(rowIndex: number) {
        return element(by.css(`div.ag-center-cols-container div.ag-row[row-index="${rowIndex}"]`));
    }

    public async searchPlan(planName: string) {
        const omnibarPO = new OmnibarPO(element(by.css('cxone-omnibar')));
        await omnibarPO.typeSearchQuery(planName);
        await this.waitForSpinnerToDisappear();
    }

    public async verifyPlanPresence(planName: string, shouldSearch = true): Promise<boolean> {
        if (shouldSearch) {
            await this.searchPlan(planName);
        }
        return this.ancestor.element(by.xpath('.//*[text()="' + planName + '"]/..')).isPresent();
    }

    public async getGridRowOfMatchingText(text: string) {
        let row: ElementFinder = await this.ancestor.element(by.xpath('.//*[text()="' + text + '"]/..'));
        const rowIndex = await row.getAttribute('row-index');
        return this.getGridRow(+rowIndex);
    }

    public async getPlanRowElements(value): Promise<any> {
        let columns = await this.ancestor.all(by.xpath('.//*[text()="' + value + '"]/../*'));
        await protractorConfig.testUtils.waitUntilDisplayed(columns[0]);
        return {
            evaluationType: await columns[1].getText(),
            planOccurence: await columns[2].getText(),
            lastModified: await columns[3].getText(),
            status: await columns[4].getText()
        };
    }

    public async clickConfirmBtn(btnName) {
        await Utils.click(element(by.id('popup-' + btnName + '')));
        await this.waitForSpinnerToDisappear();
    }

    public clickBreadCrumbLink() {
        return this.elements.breadCrumbLink.click();
    }

    public async waitForSpinnerToDisappear(timeToWait?) {
        const spinnerPO = new SpinnerPO('cxone-spinner');
        if (!timeToWait) {
            timeToWait = 60000;
        }
        return spinnerPO.waitForSpinnerToBeHidden(false, timeToWait);
    }

    public async verifyHamburgerMenu(value) {
        const row = await this.getGridRowOfMatchingText(value);
        const actionMore = row.element(by.css('button.action-btn.action-more'));
        return actionMore.isPresent();
    }

    public async verifyDeleteOption(value) {
        const row = await this.getGridRowOfMatchingText(value);
        const actionDelete = row.element(by.css('button.action-btn.action-delete'));
        return actionDelete.isPresent();
    }

    public async getHamburgerMenuItem(value: string, action: string) {
        const row = await this.getGridRowOfMatchingText(value);
        const actionMore = row.element(by.css('button.action-btn.action-more'));
        await actionMore.click();
        await browser.wait(ExpectedConditions.visibilityOf(element(by.css('popover-container .more-option-popover'))), 5000);
        return element(by.css(`popover-container .more-option-popover .clickable.${action.toLowerCase()}`));
    }

    public async verifyHamburgerMenuOptions(planName: string) {
        const row = await this.getGridRowOfMatchingText(planName);
        const actionMore = row.element(by.css('button.action-btn.action-more'));
        await actionMore.click();
        await browser.wait(ExpectedConditions.visibilityOf(element(by.css('popover-container .more-option-popover'))), 5000);
        const visibilityOptions = {
            activate: await element(by.css('popover-container .more-option-popover .clickable.activate')).isPresent(),
            duplicate: await element(by.css('popover-container .more-option-popover .clickable.duplicate')).isPresent(),
            deactivate: await element(by.css('popover-container .more-option-popover .clickable.deactivate')).isPresent()
        };
        return visibilityOptions;
    }

    public async clickConfirmDeleteBtn(skipWaitForSpinner?) {
        await protractorConfig.testUtils.waitUntilDisplayed(this.elements.clickConfirmDelete);
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
        await protractorConfig.testUtils.waitUntilDisplayed(this.elements.confirmCancelBtn);
        return this.elements.confirmCancelBtn.click();
    }

    public async getErrorWarning() {
        return await this.elements.activeWarning.getText();
    }

    public async duplicatePlan(oldPlanName: string, newPlanName: string) {
        const duplicateFormModalPO = new DuplicatePlanModalPO();
        await this.searchPlan(oldPlanName);
        const menuItem = await this.getHamburgerMenuItem(oldPlanName, 'Duplicate');
        await menuItem.click();
        await browser.wait(ExpectedConditions.visibilityOf(element(by.css('.cxone-modal-wrapper'))), this.defaultTimeoutInMillis);
        await duplicateFormModalPO.enterPlanName(newPlanName);
        await duplicateFormModalPO.clickSaveButton();
        await this.waitForSpinnerToDisappear();
        await this.searchPlan('');
    }

    public async activatePlan(planName: string) {
        await this.searchPlan(planName);
        const menuItem = await this.getHamburgerMenuItem(planName, 'Activate');
        await menuItem.click();
        await this.waitForSpinnerToDisappear();
        await this.searchPlan('');
    }

    public async deletePlan(planName: string) {
        await this.searchPlan(planName);
        const row = await this.getGridRowOfMatchingText(planName);
        await row.element(by.css('button.action-btn.action-delete')).click();
        await browser.wait(ExpectedConditions.visibilityOf(element(by.css('popover-container div.confirmBtns button[id="popup-single-delete"]'))), 5000);
        await element(by.css('popover-container div.confirmBtns button[id="popup-single-delete"]')).click();
        await this.waitForSpinnerToDisappear();
    }

    public async deactivatePlan(planName: string) {
        await this.searchPlan(planName);
        const menuItem = await this.getHamburgerMenuItem(planName, 'Deactivate');
        await menuItem.click();
        await this.clickConfirmBtn('yes-deactivate');
        await this.waitForSpinnerToDisappear();
        await this.searchPlan('');
    }

    public async openQualityPlanByName(planName: string): Promise<any> {
        const qpDetailsPO = new QualityPlanDetailsPO();
        await this.searchPlan(planName);
        await Utils.waitUntilVisible(this.ancestor.element(by.xpath('.//*[text()="' + planName + '"]/..')));
        await Utils.click(this.ancestor.element(by.xpath('.//*[text()="' + planName + '"]/..')));
        await waitForSpinnerToDisappear();
        await waitForPageToLoad(qpDetailsPO.container);
    }

    public async deleteAllPlans() {
        await this.searchPlan('');
        const allPlansElements = this.ancestor.all(by.css('#quality-plan-grid-container div.ag-center-cols-viewport div[row-index] div[col-id="planName"]'));
        const allPlanNames: string[] = await allPlansElements.map(el => {
            return el.getText();
        });
        for (let i = 0; i <= allPlanNames.length - 1; i++) {
            console.log(`\nDeleting Plan - ${allPlanNames[i]}`);
            await this.deletePlan(allPlanNames[i]);
            await Utils.waitForTime(1000);
        }
    }

    public async waitForPageToLoad() {
        await waitForPageToLoad(this.elements.container);
    }
}
