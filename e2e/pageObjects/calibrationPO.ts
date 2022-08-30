import { Page, Locator } from "@playwright/test";
import { Utils } from "../common/utils";
import { URLs } from '../common/pageIdentifierURLs';
import { Helpers } from "../playwright.helpers";
import { CommonUIUtils } from "cxone-playwright-test-utils";

let utils: any;

export class CalibrationPO {
    readonly page: Page;
    readonly newCalibration: Locator;
    readonly pageTitle: Locator;
    readonly itemsCountLabel: Locator;
    readonly popOverMsg: Locator;
    readonly searchInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.newCalibration = page.locator(`button[id="new-calibration"]`);
        this.pageTitle = page.locator(`div[id="calibrations-page-title"]`);
        this.itemsCountLabel = page.locator(`#itemsCountLbl .count-wrapper`);
        this.popOverMsg = page.locator(`.popover-content > span`);
        this.searchInput = page.locator(`.search-wrapper input`);
    }

    async navigate() {
        utils = new Utils(this.page);
        let baseUrl = await Helpers.getBaseUrl();
        await this.page.waitForLoadState('load');
        await this.page.goto(baseUrl + URLs.myZone.calibrations, { timeout: 20000, waitUntil: "load" });
        await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        await this.page.waitForSelector(`div[id=ng2-calibrations-page]`);
        await utils.delay(8000);
    }

    async getRowElementsByCalibrationName() {
        let rowCells = this.page.locator(`div[role=rowgroup] div[row-id="0"] div[role="gridcell"]`);
        let formDetails = await rowCells.allTextContents();
        return {
            agentName: formDetails[2],
            calibrationForm: formDetails[3],
            originalScore: formDetails[4],
            calibrationScore: formDetails[5],
            remainingDays: formDetails[7],
            completionRate: formDetails[6]
        }
    }

    async getRowElementsByCalibrationRowData() {
        let rowCells = this.page.locator(`div[role=rowgroup] div[row-id="0"] div[role="gridcell"]`);
        let formDetails = await rowCells.allTextContents();
        return {
            originalScore: formDetails[4],
            calibrationScore: formDetails[5],
            remainingDays: formDetails[7],
            completionRate: formDetails[6]
        }
    }

    async getRowElementsByCalibrationNameValue(value: any) {
        let rowCells = this.page.locator(`//*[@col-id="calibrationName"][contains(text(),"${value}")]/..//*[@role="gridcell"]`);
        let formDetails = await rowCells.allTextContents();
        return {
            originalScore: formDetails[4],
            calibrationScore: formDetails[5],
            completionRate: formDetails[6],
            remainingDays: formDetails[7]
        }
    }

    async clickNewCalibration() {
        await this.newCalibration.click();
        await CommonUIUtils.waitUntilIconLoaderDone(this.page);
    }

    async getPageTitle() {
        return await this.pageTitle.textContent();
    }

    getItemCountLabelElement() {
        return this.itemsCountLabel;
    }

    async getItemCountLabel() {
        return await this.itemsCountLabel.textContent();
    }

    async getRowByColumnText(columnId: any, columnValue: any) {
        let rowCells = this.page.locator(`//*[@col-id="${columnId}"][contains(text(),"${columnValue}")]/../../../../..//*[@role="gridcell"]`);
        let formDetails = await rowCells.allTextContents();
        return {
            calibrationName: formDetails[0],
            initiatedBy: formDetails[1],
            agentName: formDetails[2],
            calibrationForm: formDetails[3],
            originalScore: formDetails[4],
            calibrationScore: formDetails[5],
            completionRate: formDetails[6],
            remainingDays: formDetails[7]
        }
    }

    async waitAndGetCalibrationData(calibrationName: string, expectedValue: string) {
        const row_value = await this.getRowByColumnText('calibrationName', calibrationName);
        let completionRateValue = row_value.completionRate;
        if (completionRateValue !== expectedValue) {
            await utils.delay(4000);
            await this.navigate();
        } else {
            await utils.delay(4000);
            await this.navigate();
            return;
        }
    }

    async deleteCalibration() {
        await this.page.locator('[iconname="icon-delete"]').click();
    }

    async clickDeletePopoverBtn(action: string) {
        let identifier = '#popup-' + action;
        await this.page.locator(identifier).click();
        await this.popOverMsg.isHidden();
        if (action === 'single-delete') {
            await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        }
    }

    async isCalibrationPresent(value: any) {
        return await this.page.isVisible(value);
    }

    async getGridRowByIndex(rowIndex: number) {
        return this.page.locator(`div.ag-center-cols-container div.ag-row[row-index="${rowIndex}"]`);
    }

    async getGridRowOfMatchingText(calibrationName: string) {
        return this.page.locator('//*[text()="' + calibrationName + '"]');
    }

    async getGridRowOfMatchingTextNew(calibrationName: string) {
        return this.page.locator(`//*[@col-id="calibrationName"][contains(text(),"${calibrationName}")]/../div[@col-id="avgScore"]//a`);
    }

    async getGridRow(rowIndex: number) {
        return this.page.locator(`div.ag-center-cols-container div.ag-row[row-index="${rowIndex}"]`);
    }

    async getActiveCalibrationDeleteButton(formName: string) {
        const row = await this.getGridRowOfMatchingText(formName);
        return row.locator(`.action-delete-activeCalibration`);
    }

    async getCompletedCalibrationDeleteButton(rowToSelect: string) {
        const row = await this.getGridRowOfMatchingText(rowToSelect);
        return row.locator('.action-delete-validButton');
    }

    async clickOnCalibrationScore(calibrationName) {
        const row = await this.getGridRowOfMatchingTextNew(calibrationName);
        await row.click();
        await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        await this.page.waitForSelector(`#calibration-score-grid .cxone-grid`);
    }
}