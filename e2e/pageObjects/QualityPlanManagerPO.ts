
import { OmnibarPO } from 'cxone-components/omnibar.po';
import { SpinnerPO } from 'cxone-components/spinner.po';
import { DuplicateFormModalPO } from './DuplicateFormModalPO'
import { QualityPlanDetailsPO } from './AualityPlanDetailsPO';
import { fdUtils } from '../common/fdUtils';
import { Page, Locator, expect } from "@playwright/test";
import { Helpers } from "../playwright.helpers";
import { URLs } from "../common/pageIdentifierURLs";
import { Utils } from '../common/utils';
import { UIConstants } from '../common/uiConstants';
import { CommonUIUtils } from "cxone-playwright-test-utils"

// const protractorConfig = protHelper.getProtractorHelpers();
let page: Page;
let utils = new Utils(page);

export class QualityPlanManagerPO {
     waitForPageToLoad() {
          throw new Error("Method not implemented.");
     }
    readonly page: Page;
    readonly gridPO: Locator;
    readonly defaultTimeoutInMillis: number;
    readonly elements: { newPlanBtn: any; gridComponent: any; header: any; breadCrumbLink: any; clickConfirmDelete: any; row: any; noMatchfoundMsg?: any; confirmCancelBtn: any; activeWarning: any; container: any; spinner?: any; optionsPlanPopover?: any; };
    readonly uiConstants: UIConstants;

    public constructor(PageElement?: any, defaultTimeoutInMillis = 20000) {
        this.defaultTimeoutInMillis = defaultTimeoutInMillis;
        this.page = PageElement ||this.page.locator((`div[id="ng2-quality-plan-manager-page"]`));
        this.elements = {
            container: this.page.locator.locator((`div[id="quality-plan-grid-container"]`)),
            gridComponent: this.page.locator.locator(('cxone-grid')).textContent(),
            header: this.page.locator.locator((`div[id='quality-plans-page-title']`)),
            newPlanBtn:this.page.locator.locator(('#newPlan')),
            spinner:this.page.locator.locator(('.cxonespinner div.spinner.spinner-bounce-middle')),
            optionsPlanPopover: this.page.locator.locator(('popover-container.tooltip-popover-style')),
            clickConfirmDelete:this.page.locator.locator(('#popup-single-delete')),
            confirmCancelBtn:this.page.locator.locator(('#popup-cancel')),
            row: this.page.locator(('#quality-plan-grid-container div.ag-center-cols-viewport div[row-index]')),
            activeWarning: this.page.locator.locator(('.active-warning')),
            breadCrumbLink: this.page.locator.locator(('.breadcrumb-item a'))
        };
    }

   async navigate(quickly?: boolean) {
    let baseUrl = this.uiConstants.URLS.LOCALHOST
    await this.page.goto(baseUrl + URLs.myZone.planMonitoring);
    await this.page.waitForURL('**\/#/qualityplan');
    await CommonUIUtils.waitUntilIconLoaderDone(this.page);
    await this.page.waitForSelector(`#ng2-quality-plan-details-page`);
    }


    getNewPlanButton() {
        return this.elements.newPlanBtn;
    }

    async getGrid() {
        return this.elements.gridComponent;
    }

    async  getHeaderText(): Promise<string> {
        return await this.elements.header.getText();
    }

    async getGridRow(rowIndex: number) {
        return this.page.locator((`div.ag-center-cols-container div.ag-row[row-index="${rowIndex}"]`));
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
        return this.page.locator(('xpath=.//*[text()="' + planName + '"]/..'));
    }

    async getGridRowOfMatchingText(text: string) {
        let row = await this.page.locator(('xpath=.//*[text()="' + text + '"]/..'));
        const rowIndex = await row.getAttribute('row-index');
        return this.getGridRow(+rowIndex);
    }

     async getPlanRowElements(value: string): Promise<any> {
        let columns = await this.page(('xpath=.//*[text()="' + value + '"]/../*'));
        await utils.waitUntilDisplayed(columns[0]);
        return {
            evaluationType: await columns[1].getText(),
            planOccurence: await columns[2].getText(),
            lastModified: await columns[3].getText(),
            status: await columns[4].getText()
        };
    }

     async clickConfirmBtn(btnName: string) {
        await Utils.click(this.page.locator(('#popup-' + btnName + '')));
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
        const actionMore = row.this.page.locator(('button.action-btn.action-more'));
        return actionMore.isPresent();
    }

  async verifyDeleteOption(value: string) {
        const row = await this.getGridRowOfMatchingText(value);
        const actionDelete = row.this.page.locator(('button.action-btn.action-delete'));
        return actionDelete.isPresent();
    }

     async getHamburgerMenuItem(value: string, action: string) {
        const row = await this.getGridRowOfMatchingText(value);
        const actionMore = row.this.page.locator(('button.action-btn.action-more'));
        await actionMore.click();
        await expect(this.page.locator('popover-container .more-option-popover').waitFor({state:'attached',timeout:5000}))
        return Page.locator((`popover-container .more-option-popover .clickable.${action.toLowerCase()}`));
    }

     async verifyHamburgerMenuOptions(planName: string) {
        const row = await this.getGridRowOfMatchingText(planName);
        const actionMore = row.this.page.locator(('button.action-btn.action-more'));
        await actionMore.click();
        await expect(this.page.locator('popover-container .more-option-popover').waitFor({state:'attached',timeout:5000}))
        const visibilityOptions = {
            activate: await this.page.locator(('popover-container .more-option-popover .clickable.activate')).isPresent(),
            duplicate: await this.page.locator(('popover-container .more-option-popover .clickable.duplicate')).isPresent(),
            deactivate: await this.page.locator(('popover-container .more-option-popover .clickable.deactivate')).isPresent()
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
        const duplicateFormModalPO = new DuplicateFormModalPO();  //! new 
        await this.searchPlan(oldPlanName);
        const menuItem = await this.getHamburgerMenuItem(oldPlanName, 'Duplicate');
        await menuItem.click();
        await expect(this.page.locator('.cxone-modal-wrapper').waitFor({state:'attached',timeout:this.defaultTimeoutInMillis}))
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
        await row.this.page.locator(('button.action-btn.action-delete')).click();
        await expect(this.page.locator('popover-container div.confirmBtns button[id="popup-single-delete').waitFor({state:'attached',timeout:5000}))
        await this.page.locator(('popover-container div.confirmBtns button[id="popup-single-delete"]')).click();
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
        await this.page.waitForSelector('xpath=.//*[text()="' + planName + '"]/..');
        await Utils.click(this.page.locator(('xpath=.//*[text()="' + planName + '"]/..')));
        await utils. waitForSpinnerToDisappear();
        await utils.waitForPageToLoad(qpDetailsPO.container);  //!
    } 

    public async deleteAllPlans() {
        await this.searchPlan('');
        const allPlansElements = this.page(('#quality-plan-grid-container div.ag-center-cols-viewport div[row-index] div[col-id="planName"]'));
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
