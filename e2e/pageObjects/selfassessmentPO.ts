import { Page, Locator, expect } from "@playwright/test";
import { Helpers } from "../playwright.helpers";
import { Utils } from "../common/utils";
import { URLs } from '../common/pageIdentifierURLs';
import { CommonUIUtils } from "cxone-playwright-test-utils";

let utils : any;

export class SelfAssessmentPO {
    readonly page: Page;
    readonly selfAssessmentTitle: Locator;
    readonly createNewSelfAssessmentButton: Locator;
    readonly itemsCountLabel: Locator;
    readonly statusFilterButton: Locator;
    readonly clearAll: Locator;
    readonly selfassessment: Locator;
    readonly selfassesmentbutton: Locator;
    readonly popOverMsg: Locator;
    readonly selectCompletedCheckbox: Locator;
    readonly statusDropdown: any;
    readonly selfAssessmentColumnHeader: any;
    readonly ascendingOrder: Locator;
    readonly descendingOrder: Locator;
    readonly selfAssessmentToast: Locator;


    constructor(page: Page) {
        this.page = page;
        this.selfAssessmentTitle = page.locator(`div[id="self-assessment-page-title"]`);
        this.createNewSelfAssessmentButton = page.locator(`button[id="new-self-assessment"]`);
        this.itemsCountLabel = page.locator(`.count-wrapper.flex-container>div.count`);
        this.statusFilterButton = page.locator(`div[class="filter-btn"]`);
        this.statusDropdown = page.locator(`div[class="dropdown-button"]`);
        this.clearAll = page.locator('.clear-all');
        this.selfassessment = page.locator(`a[id="selfAssessments"]`);
        this.selfassesmentbutton = page.locator(`button[id="new-self-assessment"]`);
        this.popOverMsg = page.locator(`.popover-content * span`);
        this.selfAssessmentColumnHeader = (index: any) => {
            return page.locator(`.ag-header-cell.ag-header-cell-sortable div span[aria-colindex="${index}"]`);
        }
        this.descendingOrder = page.locator(`div span[class="ag-header-icon ag-sort-descending-icon"]`);
        this.ascendingOrder = page.locator(`div span[class="ag-header-icon ag-sort-ascending-icon"]`);
        this.selfAssessmentToast = page.locator(`.toast-bottom-right.toast-container`);
    }

    async getAllRows() {
        return this.page.$$('.ag-center-cols-viewport .ag-row');
    }

    async getRowByRowIndex(rowIndex: number) {
        return this.page.$$((`.ag-center-cols-viewport .ag-row[row-index=${rowIndex}]`));
    }

    async getRowByText(text: string) {
        return this.page.$$('.ag-center-cols-viewport .ag-row');
    }

    async getTotalRowCount() {
        return (await this.getAllRows()).length;
    }

   async getSelfAssessmentToastMsg() {
        await this.page.waitForSelector(`.toast-bottom-right.toast-container`);
        return await this.selfAssessmentToast.textContent();
   }

    async columnSort() {
        if(this.ascendingOrder.isVisible){
        console.log("Column is sorted in Ascending Order");
        }
        else if(this.descendingOrder.isVisible){
            console.log("Column is sorted in Descending Order");
        }
    }
    async getPageTitleElement() {
        return await this.selfAssessmentTitle.textContent();
    }

    async createNewSelfAssessmentButtonElement() {
        return this.createNewSelfAssessmentButton;
    }

    async getElementText(element: any) {
        return this.page.textContent(element);
    }

    async navigate() {
        utils = new Utils(this.page);
        await this.page.waitForLoadState('load');
        let baseUrl = await Helpers.getBaseUrl();
        await this.page.goto(baseUrl + URLs.myZone.selfAssessments,{timeout:20000,waitUntil:"load"});
        await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        await this.page.waitForSelector(`[class="ag-root-wrapper-body ag-layout-normal"]`);
        await utils.delay(4000);
    }

    async getItemCountLabel() {
        return await this.itemsCountLabel.textContent();
    }

    async clickSelfAsessmentButton() {
        await this.selfassesmentbutton.click();
        CommonUIUtils.waitUntilIconLoaderDone(this.page);
    }

    async getPopupUrl() {
        const [popup] = await Promise.all([
            this.page.waitForEvent('popup'),
            this.page.locator(`span[role="gridcell"] .default-renderer:has-text("Agent User")`).click(),
        ]);
        await popup.waitForLoadState();
        let url = popup.url();
        popup.close();
        return url;
    }

    async deleteSelfAssessment(formName: string) {
        const row = await this.getGridRowOfMatchingText(formName);
        await row.locator('cxone-svg-sprite-icon[iconname="icon-delete"]').click();
    }

    async clickDeletePopoverButton(action: string) {
        let identifier = '#popup-' + action;
        await this.page.locator(identifier).click();
    }

    async isSelfAssessmentPresent(value: string) {
        return await this.page.isVisible('#ng2-self-assessment-grid-container [role="row"]:has([col-id="agentName"]:has-text("' + value + '"))');
    }

    async getGridRow(rowIndex: number) {
        return this.page.locator(`div.ag-center-cols-container div.ag-row[row-index="${rowIndex}"]`);
    }

    async scrollOnElement(page: Page, selector: string) {
        await this.page.$eval(selector, (element) => {
          element.scrollIntoView();
        });
    }

    async clickStatusFilterBtn() {
        await this.statusFilterButton.click();
        await this.statusDropdown.isVisible();
    }

    async clickClearAllFilters() {
        await this.clearAll.click();
    }

    async selectStatusFilters(){
        await this.statusDropdown.click();
    }

    async applyFilter(labelValue: string){
        await this.clickStatusFilterBtn();
        await this.selectStatusFilters();
        await this.page.locator(`div[aria-label="${labelValue}"]`).click();
        CommonUIUtils.waitUntilIconLoaderDone(this.page)
        await this.page.mouse.click(1020,344);
    }

    async getGridRowOfMatchingText(text: string) {
        await this.page.waitForLoadState('domcontentloaded');
        let row = this.page.locator(`//*[@col-id="agentName"]//*[contains(text(),"${text}")]/../../../../..`);
        const rowIndex = await row.getAttribute('row-index');
        return this.getGridRow(+rowIndex);
    }

    async getDeletePopoverMsg(agentName: string) {
        const row = await this.getGridRowOfMatchingText(agentName);
        let dltButton = row.locator('button.action-btn.action-delete');
        await dltButton.hover({timeout: 3000});
        await this.page.waitForSelector(`div[role="dialog"] span`);
        const popoverElement = this.page.locator(`div[role="dialog"] span`);
        return await popoverElement.textContent();
    }

    async openSelfAssessment(columnId: any, columnValue: any) {
        //let utils = new Utils(this.page);
        let row = await this.getRowByColumnText(columnId, columnValue);
        return await utils.click(`//*[@col-id="${columnId}"]//*[contains(text(),"${row.status}")]`);
    }    

    async getRowByColumnText(columnId: any, columnValue: any) {
        //let utils = new Utils(this.page);
        let rowCells = this.page.locator(`//*[@col-id="${columnId}"]//*[contains(text(),"${columnValue}")]/../../../../..//*[@role="gridcell"]`);
        let formDetails = await rowCells.allTextContents();
        return {
            agentName: formDetails[0],
            initiatorName: formDetails[1],
            formName: formDetails[2],
            segmentStartTime: formDetails[3],
            segmentDuration: formDetails[4],
            remainingDays: formDetails[5],
            score: formDetails[6],
            status: formDetails[7]
        }
    }
    async getRowElementsByAgentName(agentName: string) {
        let rowCells = this.page.locator(`//*[@col-id="agentName"]//*[contains(text(),"${agentName}")]/../../../../..//*[@role='gridcell']`);
        let formDetails = await rowCells.allTextContents();
        return {
            agentName: formDetails[0],
            initiatorName: formDetails[1],
            formName: formDetails[2],
            segmentStartTime: formDetails[3],
            segmentDuration: formDetails[4],
            remainingDays: formDetails[5],
            score: formDetails[6],
            status: formDetails[7]
        }
}

    async sortOnSelfAssessmentColumnHeader(columnIndex: any, type: string) {
      if (type === 'ASC') {
        await this.selfAssessmentColumnHeader(columnIndex);
        return await CommonUIUtils.waitUntilIconLoaderDone(this.page);
    } else if (type === 'DESC') {
        await this.selfAssessmentColumnHeader(columnIndex);
        await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        await this.selfAssessmentColumnHeader(columnIndex);
        return await CommonUIUtils.waitUntilIconLoaderDone(this.page);
    }
}

async verifySelfAssessmentRows(){
    //let utils = new Utils(this.page);
    let countOfRows = 0;
    for (let i = 1; i <= 5; i++) {
        await this.navigate();
        await utils.delay(10000);
        countOfRows = (await this.getAllRows()).length;
        if (countOfRows !== 3) {
            console.log('Total count of rows ' + countOfRows);
            console.log('Retrying...');
            continue;
        } else {
            break;
        }
    }
    expect(countOfRows).toEqual(3);
}
}
