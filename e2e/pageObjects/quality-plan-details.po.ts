import { Utils } from '../common/utils';
import { Page, Locator } from "@playwright/test";
import { Helpers } from "../playwright.helpers";
import { URLs } from "../common/pageIdentifierURLs";
let browser: any;
let page: Page;
let utils = new Utils(page);

export class QualityPlanDetailsPO {
    readonly page: Page;
    readonly gridPO: Locator;
    readonly planDetailsAncestor: Locator;
    readonly evaluatorsGridPO: Locator;
    readonly timePeriodDropdown: Locator;
    readonly ancestor: Locator;
    readonly container: Locator;
    readonly planStatus: any;

    public constructor() {
     
        this.ancestor = page.locator(`id="ng2-quality-plan-details-page"`);
        this.container = page.locator(`div[class=".filters-container"]`);
       
    }
    async navigate() {
        console.log('Coming to Navigate')
        await this.page.waitForLoadState('load');
        let BaseUrl = await Helpers.getBaseUrl();
        await this.page.goto(BaseUrl + URLs.myZone.planMonitoring);
        // await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        await this.page.waitForTimeout(3000);

    };

    async refresh() {
        await utils.refresh();
    }

    public async clearPlanName() {

        await page.locator((`div[id="planName input"]`)).clear();

    }

    public async clearPlanDescription() {

        await page.locator((`div[id="planDescription input"]`)).clear();
    }

    public async enterPlanName(name: string) {
        await this.clearPlanName();
        await page.locator((`div[id="planName input"]`)).sendKeys(name);
    }

    public async enterPlanDescription(description: string) {
        await this.clearPlanDescription();
        await page.locator((`div[id="#planDescription input"]`)).sendKeys(description);
    }

    public async getPlanName() {
        return await Utils.getAttribute(page.locator((`div[id="planName input"]`)), 'value');
    }

    public async getPlanDescription() {
        return await Utils.getAttribute(page.locator((`div[id="planDescription input"]`)), 'value');
    }

    public async isPlanNameEnabled() {
        return await Utils.isEnabled(page.locator((`div[id="planName input"]`)));
    }

    public async isPlanDescriptionEnabled() {
        return await Utils.isEnabled(page.locator((`div[id="planDescription input"]`)));
    }

    public async getPlanNameErrorMessage() {
        return await Utils.getText(page.locator((`div[class="plan-header-wrapper .error-message"]`)));
    }

    public async saveAsDraft() {
        await Utils.click(page.locator(('#save-as-draft')));
        await Utils.waitForSpinnerToDisappear();
    }

    public async saveAndActivate() {
        await Utils.click(page.locator(('#save-and-activate')));
        await Utils.waitForSpinnerToDisappear();
    }

    public getPlanNamePageTitleElement() {
        return page.locator((`div[class="quality-plan-details-page-title"]`));
    }

    public async cancel(tooltipButtonLabel = 'yes') {
        await Utils.click(page.locatort(('#cancel')));
        await Utils.waitForTime(1000);
        if (await Utils.isPresent(page.locator(('.closing-popup')))) {
            await Utils.click(page.locator((`div[id="exit-${tooltipButtonLabel.toLowerCase()}-btn"]`)));
        }
        await Utils.waitForSpinnerToDisappear();
    }


}
