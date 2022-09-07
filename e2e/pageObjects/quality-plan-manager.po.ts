
import { OmnibarPO } from 'cxone-components/omnibar.po';
import { SpinnerPO } from 'cxone-components/spinner.po';
import { DuplicatePlanModalPO } from './modals/duplicate-plan-modal/duplicate-plan-modal.po';
import { QualityPlanDetailsPO } from '../pageObjects/quality-plan-details.po';
import { fdUtils } from '../common/fdUtils';
import { Page, Locator } from "@playwright/test";
import { Helpers } from "../playwright.helpers";
import { URLs } from "../common/pageIdentifierURLs";
import { Utils } from '../common/utils';

// const protractorConfig = protHelper.getProtractorHelpers();
let page: Page;
let utils = new Utils(page);
export class QualityPlanManagerPO {
     waitForPageToLoad() {
          throw new Error("Method not implemented.");
     }
    readonly page: Page;
    readonly gridPO: Locator;
    readonly ancestor:Locator ;
    readonly defaultTimeoutInMillis: number;
    readonly elements: { newPlanBtn: any; gridComponent: any; header: any; breadCrumbLink: any; clickConfirmDelete: any; row: any; noMatchfoundMsg?: any; confirmCancelBtn: any; activeWarning: any; container: any; spinner?: any; optionsPlanPopover?: any; };

    public constructor(ancestorElement?: any, defaultTimeoutInMillis = 20000) {
        this.defaultTimeoutInMillis = defaultTimeoutInMillis;
        this.ancestor = ancestorElement || page.locator((`div[id="ng2-quality-plan-manager-page"]`));
        this.elements = {
            container: this.ancestor.Page.locator((`div[id="quality-plan-grid-container"]`)),
            gridComponent: this.ancestor.Page.locator(('cxone-grid')).textContent(),
            header: this.ancestor.Page.locator((`div[id='quality-plans-page-title']`)),
            newPlanBtn: this.ancestor.Page.locator(('#newPlan')),
            spinner:Page.locator(('.cxonespinner div.spinner.spinner-bounce-middle')),
            optionsPlanPopover: Page.locator(('popover-container.tooltip-popover-style')),
            clickConfirmDelete:Page.locator(('#popup-single-delete')),
            confirmCancelBtn:Page.locator(('#popup-cancel')),
            row: this.ancestor.all(('#quality-plan-grid-container div.ag-center-cols-viewport div[row-index]')),
            activeWarning: Page.locator(('.active-warning')),
            breadCrumbLink: Page.locator(('.breadcrumb-item a'))
        };
    }

   async navigate(quickly?: boolean) {
    console.log('Coming to Navigate')
    await this.page.waitForLoadState('load');
    let BaseUrl = await Helpers.getBaseUrl();
    await this.page.goto(BaseUrl + URLs.myZone.planMonitoring);
    // await CommonUIUtils.waitUntilIconLoaderDone(this.page);
    await this.page.waitForTimeout(3000);
    }

     async refresh() {
        await utils.refreshpage(Page.locator(('quality-plan-grid-container')));
    }

    async getNewPlanButton() {
        return this.elements.newPlanBtn;
    }

    async getGrid() {
        return this.elements.gridComponent;
    }

    async  getHeaderText(): Promise<string> {
        return await this.elements.header.getText();
    }

    async getGridRow(rowIndex: number) {
        return Page.locator((`div.ag-center-cols-container div.ag-row[row-index="${rowIndex}"]`));
    }

     async searchPlan(planName: string) {
        const omnibarPO = new OmnibarPO(Page.locator(('cxone-omnibar')));
        await omnibarPO.typeSearchQuery(planName);
        await this.waitForSpinnerToDisappear();
    }

     async verifyPlanPresence(planName: string, shouldSearch = true): Promise<boolean> {
        if (shouldSearch) {
            await this.searchPlan(planName);
        }
        return this.ancestor.Page.locator(('xpath=.//*[text()="' + planName + '"]/..'));
    }

    async getGridRowOfMatchingText(text: string) {
        let row = await this.ancestor.Page.locator(('xpath=.//*[text()="' + text + '"]/..'));
        const rowIndex = await row.getAttribute('row-index');
        return this.getGridRow(+rowIndex);
    }

     async getPlanRowElements(value: string): Promise<any> {
        let columns = await this.ancestor.all(('xpath=.//*[text()="' + value + '"]/../*'));
        await utils.waitUntilDisplayed(columns[0]);
        return {
            evaluationType: await columns[1].getText(),
            planOccurence: await columns[2].getText(),
            lastModified: await columns[3].getText(),
            status: await columns[4].getText()
        };
    }

     async clickConfirmBtn(btnName: string) {
        await Utils.click(Page.locator(('#popup-' + btnName + '')));
        await this.waitForSpinnerToDisappear();
    }

   async clickBreadCrumbLink() {
        return this.elements.breadCrumbLink.click();
    }

     async waitForSpinnerToDisappear(timeToWait?: number | undefined) {
        const spinnerPO = new SpinnerPO('cxone-spinner');
        if (!timeToWait) {
            timeToWait = 60000;
        }
        return spinnerPO.waitForSpinnerToBeHidden(false, timeToWait);
    }

  async verifyHamburgerMenu(value: string) {
        const row = await this.getGridRowOfMatchingText(value);
        const actionMore = row.Page.locator(('button.action-btn.action-more'));
        return actionMore.isPresent();
    }

  async verifyDeleteOption(value: string) {
        const row = await this.getGridRowOfMatchingText(value);
        const actionDelete = row.Page.locator(('button.action-btn.action-delete'));
        return actionDelete.isPresent();
    }

     async getHamburgerMenuItem(value: string, action: string) {
        const row = await this.getGridRowOfMatchingText(value);
        const actionMore = row.Page.locator(('button.action-btn.action-more'));
        await actionMore.click();
        await page.wait(ExpectedConditions.visibilityOf(page.locator(by.css('popover-container .more-option-popover'))), 5000);
        return Page.locator((`popover-container .more-option-popover .clickable.${action.toLowerCase()}`));
    }

     async verifyHamburgerMenuOptions(planName: string) {
        const row = await this.getGridRowOfMatchingText(planName);
        const actionMore = row.Page.locator(('button.action-btn.action-more'));
        await actionMore.click();
        await page.wait(ExpectedConditions.visibilityOf(page.locator(by.css('popover-container .more-option-popover'))), 5000);
        const visibilityOptions = {
            activate: await Page.locator(('popover-container .more-option-popover .clickable.activate')).isPresent(),
            duplicate: await Page.locator(('popover-container .more-option-popover .clickable.duplicate')).isPresent(),
            deactivate: await Page.locator(('popover-container .more-option-popover .clickable.deactivate')).isPresent()
        };
        return visibilityOptions;
    }

    async clickConfirmDeleteBtn(skipWaitForSpinner?: any) {
        await utils.waitUntilDisplayed(this.elements.clickConfirmDelete);
        await this.elements.clickConfirmDelete.click();
        if (!skipWaitForSpinner) {
            await this.waitForSpinnerToDisappear();
        }
    }

    async getNumberOfRows() {
        return await this.elements.row.count();
    }

   async getNoMatchFoundMsg() {
        return await this.elements.noMatchfoundMsg.getText();
    }

    async clickConfirmCancel() {
        await utils.waitUntilDisplayed(this.elements.confirmCancelBtn);
        return this.elements.confirmCancelBtn.click();
    }

    async getErrorWarning() {
        return await this.elements.activeWarning.getText();
    }

   async duplicatePlan(oldPlanName: string, newPlanName: string) {
        const duplicateFormModalPO = new DuplicatePlanModalPO();  //! new 
        await this.searchPlan(oldPlanName);
        const menuItem = await this.getHamburgerMenuItem(oldPlanName, 'Duplicate');
        await menuItem.click();
        await page.wait(ExpectedConditions.visibilityOf(page.locator(('.cxone-modal-wrapper'))), this.defaultTimeoutInMillis);
        await duplicateFormModalPO.enterPlanName(newPlanName);
        await duplicateFormModalPO.clickSaveButton();
        await this.waitForSpinnerToDisappear();
        await this.searchPlan('');
    }

 async activatePlan(planName: string) {
        await this.searchPlan(planName);
        const menuItem = await this.getHamburgerMenuItem(planName, 'Activate');
        await menuItem.click();
        await this.waitForSpinnerToDisappear();
        await this.searchPlan('');
    }

   async deletePlan(planName: string) {
        await this.searchPlan(planName);
        const row = await this.getGridRowOfMatchingText(planName);
        await row.page.locator(('button.action-btn.action-delete')).click();
        await page.wait(ExpectedConditions.visibilityOf(page.locator(('popover-container div.confirmBtns button[id="popup-single-delete"]'))), 5000);
        await page.locator(('popover-container div.confirmBtns button[id="popup-single-delete"]')).click();
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
        await Utils.waitUntilVisible(this.ancestor.page.locator(('xpath=.//*[text()="' + planName + '"]/..')));
        await Utils.click(this.ancestor.page.locator(('xpath=.//*[text()="' + planName + '"]/..')));
        await utils. waitForSpinnerToDisappear();
        await utils.waitForPageToLoad(qpDetailsPO.container);  //!
    } 

    public async deleteAllPlans() {
        await this.searchPlan('');
        const allPlansElements = this.ancestor.all(('#quality-plan-grid-container div.ag-center-cols-viewport div[row-index] div[col-id="planName"]'));
        const allPlanNames: string[] = await allPlansElements.map((el: { getText: () => any; }) => {
            return el.getText();
        });
        for (let i = 0; i <= allPlanNames.length - 1; i++) {
            console.log(`\nDeleting Plan - ${allPlanNames[i]}`);
            await this.deletePlan(allPlanNames[i]);
            await Utils.waitForTime(1000);
        }
    }

   
}
