import { Page, Locator } from "@playwright/test";
import { Helpers } from "../playwright.helpers";
import { URLs } from "../common/pageIdentifierURLs";
import { CommonUIUtils } from "cxone-playwright-test-utils";
import { Utils } from "../common/utils";


let browser: any;
let page: Page;
let utils = new Utils(page);

export class PlansMonitoringPagePO {
    readonly page: Page;
    readonly gridPO: Locator;
    readonly planDetailsAncestor: Locator;
    readonly evaluatorsGridPO: Locator;
    readonly timePeriodDropdown: Locator;
    readonly ancestor: Locator;
    readonly planStatus: any;

    constructor(page: Page) {
        this.page = page;
        this.ancestor = page.locator(`id="ng2-plans-monitoring-page"`);
        this.gridPO = page.locator(`div[id="plans-monitoring-grid-container"]`);
        this.planDetailsAncestor = page.locator(`div[class="container page-container ng2-plan-details"]`);
        this.evaluatorsGridPO = page.locator(`cxone-grid[id="ng2-plan-details-evaluators-grid"]`);
        this.timePeriodDropdown = page.locator(`cxone-singleselect-dropdown[id="ng2-header-time-period-dropdown"]`);
        this.planStatus = (colName: any) => {
            return page.locator('.score-text#' + colName);
        }

    }
    async navigate() {
        console.log('Coming to Navigate')
        await this.page.waitForLoadState('load');
        let BaseUrl = await Helpers.getBaseUrl();
        await this.page.goto( BaseUrl + URLs.myZone.planMonitoring);
        await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        await this.page.waitForTimeout(3000);
        await this.page.waitForSelector(`div[id="plans-monitoring-grid-container"]`);
    };

    async getRowByColumnText(columnId: any, columnValue: any) {
        let rowCells = this.page.locator(`//*[@col-id="${columnId}"]//*[contains(text(),"${columnValue}")]/../../../../..//*[@role="gridcell"]`);
        let formDetails = await rowCells.allTextContents();
        console.log('FORMDETAILS--------->', formDetails)
        return {
            planName: formDetails[0],
            planOccurence: formDetails[1],
            distributionRate: formDetails[2],
            consumptionRate: formDetails[3],
            avgEvalPerDay: formDetails[4],
            remainingDays: formDetails[5],
            status: formDetails[6]
        }
    }

    async getRowByColumnTextP(columnId: any, columnValue: any) {
        let rowCells = this.page.locator(`//*[@col-id="${columnId}"]//*[contains(text(),"${columnValue}")]/../../../../..//*[@role="gridcell"]`);
        let formDetails = await rowCells.allTextContents();
        console.log('FORMDETAILS--------->', formDetails)
        return {
            planName: formDetails[0],
            planOccurence: formDetails[1],
            distributionRate: formDetails[2],
            consumptionRate: formDetails[3],
            avgEvalPerDay: formDetails[4],
            remainingDays: formDetails[5],
            status: formDetails[6]
        }
    }

    async getPlanRowByPlanName(planName: string) {
        return await this.getRowByColumnText('planName', planName);
    }

    public getAllRows() {
        return this.page.locator('.ag-center-cols-viewport .ag-row');
    }
    public async getTotalRowCount() {
        return await this.getAllRows().count();
    }
    public async getRowByColumnTextDetails(columnId: string, text: string) {
        let rowCells = this.page.locator(`//*[@col-id="${columnId}"]//*[contains(text(),"${text}")]/../../../../..//*[@role="gridcell"]`);
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
    async getEvaluatorRowByEvaluatorName(evaluatorName: string) {
        return await this.getRowByColumnText('evaluatorCount', evaluatorName);
    }

    async getEvaluatorRowDetails(evaluatorName: string) {
        const evaluatorNameText = evaluatorName[0] + evaluatorName.substring(evaluatorName.indexOf(' ') + 1, 1) + ' ' + evaluatorName;
        const row = await this.getEvaluatorRowByEvaluatorName(evaluatorNameText);
        return {
            evaluatorName: this.page.locator('.ag-cell[col-id="evaluatorCount"] .employee-name-box .employee-name').textContent(),
            evaluatorStatus: this.page.locator('.ag-cell[col-id="evaluatorCount"] .employee-name-box .evaluator-status').textContent(),
            evaluatorStatusClass: this.page.locator('.ag-cell[col-id="evaluatorCount"] .employee-name-box .evaluator-status').getAttribute('class'),
            evaluationCompletionRatio: await this.page.locator('.ag-cell[col-id="pd_actualExpected"] .avg-score-box .score').textContent(),
            employeeAvatar: this.page.locator('.ag-cell[col-id="evaluatorCount"] .employee-name-box .employee-avatar').textContent()
        };
    }
    async isOpen() {
        return await this.page.locator('.icon-carat.dropdown-open').isVisible();
    }

    toggle() {
        return this.page.locator(' .dropdown-button').click();
    }

    async open() {
        const isOpen = await this.isOpen();
        if (!isOpen) {
            return await this.toggle();
        } else {
            return;
        }
    }

    async close() {
        const isOpen = await this.isOpen();
        if (isOpen) {
            return this.toggle();
        } else {
            return;
        }
    }
    //Have to work on the scroll function 
    async hasScrollSideBarToClick(elem) {
        let webElem = await elem.getWebElement();
        await browser.executeScript('arguments[0].scrollIntoView()', webElem); // if no scrollbar this just stays
        await this.page.waitForTimeout(2000); // added this wait to prevent flakiness - it takes a little more time for the scroll animation to end for long lists inside dropdown, and while the animation is in progress, element is already clickable
        // await browser.wait(ExpectedConditions.elementToBeClickable(elem), 10000);
        await browser.waitForSelector(elem).clickable(10000);
        await elem.click();
    }
    async selectItemByLabelWithoutSearchBox(label: string) {
        await this.open();
        let elems = this.page.locator(`.options-wrapper .item-row:has-text("${label}")`);
        await this.hasScrollSideBarToClick(elems[0]);
    }
    async selectTimePeriodFromDropdown(dateRange: string) {
        await this.isOpen();
        await this.selectItemByLabelWithoutSearchBox(dateRange);
        await this.close();
    }

    async getPlanRowDetails(planName: string) {
        let rowCells = this.page.locator(`//*[@col-id="planName"]//*[contains(text(),"${planName}")]/../../../../..//*[@role='gridcell']`);
        let formDetails = await rowCells.allTextContents();
        console.log('FORMDETAILS', formDetails);
        return {
            planName: planName,
            planOccurence: formDetails[1],
            distributionRate: formDetails[2],
            consumptionRate: formDetails[3],
            avgEvalPerDay: formDetails[4],
            remainingDays: formDetails[5],
            status: formDetails[6]
        }
    }
    async openPlanMonDetails(planName: any) {
        let row = await this.getPlanRowByPlanName(planName);
        console.log('CLICKED PLANS-MON DETAILS PAGE');
        console.log('PLANS-MON DETAILS ROW', row);
        await this.page.click(`//*[@col-id="planName"]//*[contains(text(),"${row.planName}")]`);
        await this.page.waitForSelector('div[class=ng2-plan-stats]');
        console.log('WAITED AND SUCCESS FOR PLANS DETAILS');
    }

    //Have to work on the browser part
    public async waitForCellValueToUpdate(planName: string, columnId: string, valueToVerify: string) {
        let count = 0;
        await browser.wait(async () => {
            count = count + 1;
            await browser.refresh();
            await browser.sleep(20000);
            const details = await this.getPlanRowDetails(planName);
            if (details[columnId] === valueToVerify) {
                return true;
            }
            console.log('Trying to find data at PlanMonitoring Page: Retry', count);
        }, 120000, valueToVerify + ' not updated!!!');
    }

    async verifyPlanStat(colName: String) {
        console.log('verifyPlanStat-->', colName);
        // console.log('CHECKING SCORE TEXT-------->', await this.planStatus(colName).textContent());
        return await this.planStatus(colName).textContent();
    };
    //Have to work on the map function
    async getPlanSummaryDetails() {
        let tmp = this.page.locator('div[class="ng2-plan-summary"] div[class="summary-box"]');
        let tmpDetails = await tmp.allTextContents();
        console.log('TMP------>', tmpDetails);
        return {
            planOccurence: tmpDetails[0],
            evaluationInPlan: tmpDetails[1],
            agentsInPlan: tmpDetails[2],
            interactionPerAgent: tmpDetails[3]
        }
    }

    async getConsumptionTrend() {
        return await this.page.locator('.trend-duration .ag-header-cell-text').textContent();
    }

    //Have to work on the map function
    public async openAndFetchDropDownValues() {
        await this.page.locator('[class="icon-carat dropdown-open"]').click();
        await this.page.locator('[class="options-wrapper ng-tns-c29-6 ng-star-inserted"]').isVisible();
        let tmp = this.page.$$('.options-wrapper .item-text');
        let temp = (await tmp).map((elem) => {
            return elem.textContent();
        });
        return temp;
    }


    public async closeDropDown() {
        await this.page.locator('.icon-carat').click();
        return await this.page.locator('.options-wrapper').isVisible();
    }

    public async getEvaluatorRow(evaluatorName: string) {
        const evaluatorNameText = evaluatorName[0] + evaluatorName.substring(evaluatorName.indexOf(' ') + 1, 1) + ' ' + evaluatorName;
        const row = await this.getEvaluatorRowByEvaluatorName(evaluatorNameText);
        return {
            //Have to use const row with the return
            evaluatorName: await this.page.locator('.ag-cell[col-id="evaluatorCount"] .employee-name-box .employee-name').textContent(),
            evaluationCompletionRatio: await this.page.locator('.ag-cell[col-id="pd_actualExpected"] .avg-score-box .score').textContent()
        };
    }

    public async getWarningIconToolTipText(location) {
        let warningIconElement;
        if (location === 'gridHeader') {
            warningIconElement = this.page.locator('div[class=\'warning-icon-header-cell-renderer\'] .status-icon .icon-warning');
        } else if (location === 'plantStatus') {
            warningIconElement = this.page.locator('.score-text#distribution-rate .icon-warning');
        }
        await this.page.locator(warningIconElement).hover();
        const tooltipElement = this.page.locator('.warning-icon-tooltip-container');
        return await (tooltipElement).textContent();
    }

    public async isWarningIconVisible(location) {
        if (location === 'gridHeader') {
            return await this.page.locator('div[class=\'warning-icon-header-cell-renderer\'] .status-icon .icon-warning').isVisible();
        } else if (location === 'plantStatus') {
            return await this.page.locator('.score-text#distribution-rate .icon-warning').isVisible();
        }
    }
    public async openPlanDetails(planName: string) {
        let loc = await this.getPlanRowByPlanName(planName);
        let PlanName = loc.planName;
        console.log("locator--",loc.planName);
        await this.page.waitForSelector(`//*[@col-id="planName"]//*[contains(text(),"${PlanName}")]`);
        await this.page.locator(`//*[@col-id="planName"]//*[contains(text(),"${PlanName}")]`).click();
        await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        //await utils.delay(7000);
        await this.page.waitForSelector('[ref="gridPanel"]');
    }
}