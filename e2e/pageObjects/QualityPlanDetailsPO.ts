import { Utils } from '../common/utils';
import { Page, Locator } from "@playwright/test";
import { Helpers } from "../playwright.helpers";
import { URLs } from "../common/pageIdentifierURLs";
import { UIConstants } from '../common/uiConstants';
import { CommonUIUtils } from "cxone-playwright-test-utils"
let browser: any;
let page: Page;
let utils = new Utils(page);

export class QualityPlanDetailsPO {
    readonly page: Page;
    readonly gridPO: Locator;
    readonly planDetailsAncestor: Locator;
    readonly evaluatorsGridPO: Locator;
    readonly timePeriodDropdown: Locator;
    readonly container: Locator;
    readonly planStatus: any;
    readonly uiConstants: UIConstants;

    public constructor() {

        this.page = this.page.locator(`#ng2-quality-plan-details-page`);
        this.container = this.page.locator(`div[class=".filters-container"]`);

    }
    async navigate() {
        // console.log('Coming to Navigate')
        // await this.page.waitForLoadState('load');
        // let BaseUrl = await Helpers.getBaseUrl();
        // await this.page.goto(BaseUrl + URLs.myZone.planMonitoring);
        // // await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        // await this.page.waitForTimeout(3000);

        let baseUrl = this.uiConstants.URLS.LOCALHOST
        await this.page.goto(baseUrl + URLs.myZone.planMonitoring);
        await this.page.waitForURL('**\/#/qualityplan');
        await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        await this.page.waitForSelector(`#ng2-quality-plan-details-page`);

    };

    
    public async clearPlanName() {

        await this.page.locator((`div[id="planName input"]`)).clear();

    }

    public async clearPlanDescription() {

        await  this.page.locator((`div[id="planDescription input"]`)).clear();
    }

    public async enterPlanName(name: string) {
        await this.clearPlanName();
        await this. page.locator((`div[id="planName input"]`)).sendKeys(name);
    }

    public async enterPlanDescription(description: string) {
        await this.clearPlanDescription();
        await this.page.locator((`div[id="#planDescription input"]`)).sendKeys(description);
    }

    public async getPlanName() {
        return await Utils.getAttribute(this.page.locator((`div[id="planName input"]`)), 'value');
    }

    public async getPlanDescription() {
        return await Utils.getAttribute(this.page.locator((`div[id="planDescription input"]`)), 'value');
    }

    public async isPlanNameEnabled() {
        return await Utils.isEnabled(this.page.locator((`div[id="planName input"]`)));
    }

    public async isPlanDescriptionEnabled() {
        return await Utils.isEnabled(this.page.locator((`div[id="planDescription input"]`)));
    }

    public async getPlanNameErrorMessage() {
        return await Utils.getText(this.page.locator((`div[class="plan-header-wrapper .error-message"]`)));
    }

    public async saveAsDraft() {
        await Utils.click(this.page.locator(('#save-as-draft')));
        await Utils.waitForSpinnerToDisappear();
    }

    public async saveAndActivate() {
        await Utils.click(this.page.locator(('#save-and-activate')));
        await Utils.waitForSpinnerToDisappear();
    }

    public getPlanNamePageTitleElement() {
        return  this. page.locator((`div[class="quality-plan-details-page-title"]`));
    }

    public async cancel(tooltipButtonLabel = 'yes') {
        await Utils.click(this.page.locatort(('#cancel')));
        await Utils.waitForTime(1000);
        if (await Utils.isPresent(this.page.locator(('.closing-popup')))) {
            await Utils.click(this.page.locator((`div[id="exit-${tooltipButtonLabel.toLowerCase()}-btn"]`)));
        }
        await Utils.waitForSpinnerToDisappear();
    }


}
