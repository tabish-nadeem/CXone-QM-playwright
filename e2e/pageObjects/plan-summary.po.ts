import { by, element, ElementFinder } from 'protractor';
import { Utils } from '../common/utils';

export class PlanSummaryPO {
    public ancestor: ElementFinder;
    public elements: {
    };

    public constructor() {
        this.ancestor = element(by.css('.plan-summary-wrapper'));
        this.elements = {};
    }

    public async getTotalEvaluationsInPlan() {
        return await Utils.getText(this.ancestor.element(by.id('total-interactions')));
    }

    public async getEvaluationsPerEvaluator() {
        return await Utils.getText(this.ancestor.element(by.id('evals-per-day-per-evaluator')));
    }

    public async getTotalDaysInPlan() {
        return await Utils.getText(this.ancestor.element(by.id('plan-days')));
    }

    public async getInteractionsPerAgent() {
        return await Utils.getText(this.ancestor.element(by.id('interaction-per-agent')));
    }
}
