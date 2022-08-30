import { Page, Locator } from "@playwright/test";
import { Helpers } from "../playwright.helpers";
import { URLs } from "../common/pageIdentifierURLs";
import { CommonUIUtils } from "cxone-playwright-test-utils";

export class SearchPO {
    readonly page: Page;
    readonly searchButton: Locator;
    readonly moreItemsPopover: Locator;
    readonly dropdownOptions: Locator;
    readonly searchInputBox: any;
    readonly dateRangeDD: Locator;
    readonly moreItemsActionType: any;
    readonly calibrationModal :any;
    constructor(page: Page) {
        this.page = page;
        this.dropdownOptions = page.locator(`ul[id="dropdown-split"]`);
        this.searchButton = page.locator(`button[class="cxone-btn btn-big btn-primary"]`);
        this.moreItemsPopover = page.locator('.popover-content');
        this.searchInputBox = page.locator(`input[id="search-input"]`);
        this.dateRangeDD = page.locator(`button[id='button-single']`);

        this.calibrationModal = page.locator('.cxone-qm-calibration-helper-component'),
        this.moreItemsActionType = (action: string) => {
            return page.locator('.popover-action.' + action);
        }
    }

    async clickSearchButton(){
        await this.searchButton.click();
    }

    async openSelfAssessmentModal(searchItem: string) {
        await this.navigate();
        await this.searchByAgentName(searchItem); 
        await this.startSelfAssessment(0, false);
    }

    async navigate() {
        await this.page.waitForLoadState('load');
        let baseUrl = await Helpers.getBaseUrl();
        await this.page.goto(baseUrl + URLs.search.search);
        await this.page.waitForSelector(`div[class='top-section welcome-mode']`);
        await CommonUIUtils.waitUntilIconLoaderDone(this.page);
    }

    async searchByAgentName(agentName: string) {
        await (this.searchInputBox).isVisible();
        await this.searchInputBox.fill(agentName);
        await this.clickDateRangeDropdown();
        await this.selectOptionFromDropdown('Current month');
        await this.searchButton.click();
        await CommonUIUtils.waitUntilIconLoaderDone(this.page);
    }

    async startSelfAssessment(index: number, ignoreWait?: boolean) {
        await this.clickMoreHamburgerOnSegmentByIndex(index);
        await this.moreItemsActionType('self-assessment').click();
        console.log("Self assessment option is clicked");
        if (!ignoreWait) {
        await this.page.waitForSelector(`.p-dialog-content div.cxone-modal-wrapper`);
        await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        }
    }
    
    public async startCalibration(index: number, ignoreWait?: boolean) {
        await this.clickMoreHamburgerOnSegmentByIndex(index);
        await this.moreItemsActionType('calibration').click();
        if (!ignoreWait) {
            await this.page.waitForSelector(`.p-dialog-content div.cxone-modal-wrapper`);
            await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        }
    }
    async clickMoreHamburgerOnSegmentByIndex(index: number) {
        await this.page.waitForSelector('.right-actions-button div');
        const moreButton = await this.page.$$('.right-actions-button div');
        await moreButton[index].click();
        await this.moreItemsPopover.isVisible();
    }

    async selectOptionFromDropdown(option: string) {
        const options = this.page.locator(`ul[id="dropdown-split"] li span:has-text("${option}")`);
        await options.click();
    }

    async clickDateRangeDropdown() {
        await this.dateRangeDD.click();
        this.dropdownOptions.isVisible();
    }
}