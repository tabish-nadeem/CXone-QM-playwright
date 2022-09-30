// import { by, element, ElementFinder } from 'protractor';
import { expect, Locator, Page } from "@playwright/test";
import { Utils } from '../common/utils';

export class PlanSummaryPO {
    // public ancestor: ElementFinder;
    readonly page : Page
    public elements: {
    };

    public constructor(page:Page) {
        this.page = page
        // this.ancestor = element(by.css('.plan-summary-wrapper'));
        this.elements = {};
    }

    public async getTotalEvaluationsInPlan() {
        return await this.page.locator('#total-interactions').textContent();
    }

    public async getEvaluationsPerEvaluator() {
        return await this.page.locator('evals-per-day-per-evaluator').textContent();
    }

    public async getTotalDaysInPlan() {
        return await this.page.locator('#plan-days').textContent();
    }

    public async getInteractionsPerAgent() {
        return await this.page.locator('#interaction-per-agent').textContent();
    }
}
