import { by, element, ElementFinder } from 'protractor';
import { Utils } from '../../../../../tests/protractor/common/utils';
import { navigateQuicklyTo, navigateTo, refresh, waitForPageToLoad, waitForSpinnerToDisappear } from '../../../../../tests/protractor/common/prots-utils';
import * as protHelper from '../../../../../tests/protractor/config-helpers';
import { QualityPlanManagerPO } from '../quality-plan-manager.po';

const protractorConfig = protHelper.getProtractorHelpers();

export class QualityPlanDetailsPO {
    public ancestor: ElementFinder;
    public container: ElementFinder;
    public qualityPlanManager: QualityPlanManagerPO;

    public constructor() {
        this.qualityPlanManager = new QualityPlanManagerPO();
        this.ancestor = element(by.id('ng2-quality-plan-details-page'));
        this.container = this.ancestor.element(by.css('.filters-container'));
    }

    public async navigate(quickly?: boolean) {
        if (quickly) {
            return await navigateQuicklyTo(protractorConfig.fdUtils.getPageIdentifierUrls('qp.qpPlanDetails'), this.container);
        } else {
            return await navigateTo(protractorConfig.fdUtils.getPageIdentifierUrls('qp.qpPlanDetails'), this.container);
        }
    }

    public async refresh() {
        await refresh(this.container);
    }

    public async clearPlanName() {
        await this.ancestor.element(by.css('#planName input')).clear();
    }

    public async clearPlanDescription() {
        await this.ancestor.element(by.css('#planDescription input')).clear();
    }

    public async enterPlanName(name: string) {
        await this.clearPlanName();
        await this.ancestor.element(by.css('#planName input')).sendKeys(name);
    }

    public async enterPlanDescription(description: string) {
        await this.clearPlanDescription();
        await this.ancestor.element(by.css('#planDescription input')).sendKeys(description);
    }

    public async getPlanName() {
        return await Utils.getAttribute(this.ancestor.element(by.css('#planName input')), 'value');
    }

    public async getPlanDescription() {
        return await Utils.getAttribute(this.ancestor.element(by.css('#planDescription input')), 'value');
    }

    public async isPlanNameEnabled() {
        return await Utils.isEnabled(this.ancestor.element(by.css('#planName input')));
    }

    public async isPlanDescriptionEnabled() {
        return await Utils.isEnabled(this.ancestor.element(by.css('#planDescription input')));
    }

    public async getPlanNameErrorMessage() {
        return await Utils.getText(this.ancestor.element(by.css('.plan-header-wrapper .error-message')));
    }

    public async saveAsDraft() {
        await Utils.click(this.ancestor.element(by.id('save-as-draft')));
        await waitForSpinnerToDisappear();
    }

    public async saveAndActivate() {
        await Utils.click(this.ancestor.element(by.id('save-and-activate')));
        await waitForSpinnerToDisappear();
    }

    public getPlanNamePageTitleElement() {
        return this.ancestor.element(by.css('.quality-plan-details-page-title'));
    }

    public async cancel(tooltipButtonLabel = 'yes') {
        await Utils.click(this.ancestor.element(by.id('cancel')));
        await Utils.waitForTime(1000);
        if (await Utils.isPresent(element(by.css('.closing-popup')))) {
            await Utils.click(element(by.id(`exit-${tooltipButtonLabel.toLowerCase()}-btn`)));
        }
        await waitForSpinnerToDisappear();
    }

    public async waitForPageToLoad() {
        await waitForPageToLoad(this.container);
    }
}
