import { by, element } from 'protractor';
import { Utils } from '../common/utils';
import { navigateQuicklyTo, navigateTo, refresh, waitForPageToLoad, waitForSpinnerToDisappear } from '../../../../../tests/protractor/common/prots-utils';

// !
import { Page, Locator } from "@playwright/test";
import { Helpers } from "../playwright.helpers";
import { URLs } from "../common/pageIdentifierURLs";
// const protractorConfig = protHelper.getProtractorHelpers();
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
    readonly container : Locator;
    readonly planStatus: any;

    public constructor() {
        // this.qualityPlanManager = new QualityPlanManagerPO();
        // this.ancestor = element(by.id('ng2-quality-plan-details-page'));
        this.ancestor = page.locator(`id="ng2-quality-plan-details-page"`);
        this.container = page.locator(`div[class=".filters-container"]`);
        // this.container = this.ancestor.element(by.css('.filters-container'));
    }

    // public async navigate(quickly?: boolean) {
    //     if (quickly) {
    //         return await navigateQuicklyTo(protractorConfig.fdUtils.getPageIdentifierUrls('qp.qpPlanDetails'), this.container);
    //     } else {
    //         return await navigateTo(protractorConfig.fdUtils.getPageIdentifierUrls('qp.qpPlanDetails'), this.container);
    //     }
    // }
    async navigate() {
        console.log('Coming to Navigate')
        await this.page.waitForLoadState('load');
        let BaseUrl = await Helpers.getBaseUrl();
        await this.page.goto( BaseUrl + URLs.myZone.planMonitoring);
        // await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        await this.page.waitForTimeout(3000);
       
    };

 async refresh() {
        await refresh(this.container);
    }

    public async clearPlanName() {
      
        await page.locator((`div[id="planName input"]`)).clear();
   
    }

    public async clearPlanDescription() {
        // await this.ancestor(by.css('#planDescription input')).clear();
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
        return await Utils.getAttribute(page.locator(by.css('#planName input')), 'value');
    }

    public async getPlanDescription() {
        return await Utils.getAttribute(page.locator(by.css('#planDescription input')), 'value');
    }

    public async isPlanNameEnabled() {
        return await Utils.isEnabled(page.locator(by.css('#planName input')));
    }

    public async isPlanDescriptionEnabled() {
        return await Utils.isEnabled(page.locator(by.css('#planDescription input')));
    }

    public async getPlanNameErrorMessage() {
        return await Utils.getText(page.locator(by.css('.plan-header-wrapper .error-message')));
    }

    public async saveAsDraft() {
        await Utils.click(page.locator(by.id('save-as-draft')));
        await waitForSpinnerToDisappear();
    }

    public async saveAndActivate() {
        await Utils.click(page.locator(by.id('save-and-activate')));
        await waitForSpinnerToDisappear();
    }

    public getPlanNamePageTitleElement() {
        return page.locator(by.css('.quality-plan-details-page-title'));
    }

    public async cancel(tooltipButtonLabel = 'yes') {
        await Utils.click(page.locatort(by.id('cancel')));
        await Utils.waitForTime(1000);
        if (await Utils.isPresent(page.locator(by.css('.closing-popup')))) {
            await Utils.click(page.locator(by.id(`exit-${tooltipButtonLabel.toLowerCase()}-btn`)));
        }
        await waitForSpinnerToDisappear();
    }

    public async waitForPageToLoad() {
        await waitForPageToLoad(this.container);
    }
}
