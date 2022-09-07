import { OmnibarPO } from 'cxone-components/omnibar.po';
import { Page, Locator } from "@playwright/test";
import { Utils } from '../common/utils';

export class EvaluatorsPO {
    public ancestor: Locator;
    readonly page:Page;
    readonly utils: Utils;
    public modal: Locator;
    public elements: {
        error: Locator;
    };

    public constructor() {
        this.ancestor = this.page.locator('.evaluators-container');
        this.modal = this.page.locator('#add-evaluators-modal');
        this.elements = {
            error: this.page.locator('.header-row .error-message')
        };
    }

    public async getSelectedEvaluatorsCount() {
        return +(Utils.getText(this.page.locator('.evaluators-count .count'))).trim();
    }

    public async clickAddEvaluatorsButton() {
        Utils.click(this.page.locator('#add-evaluators-btn'));
        Utils.waitUntilVisible(this.modal);
        Utils.waitForTime(2000);
    }

    public async isErrorVisible() {
        return  Utils.isPresent(this.elements.error);
    }

    public async getErrorMessage() {
        return  Utils.getText(this.elements.error);
    }

    public async addEvaluators(evaluatorNames: string[]) {
        await this.clickAddEvaluatorsButton();
        for (let i = 0; i <= evaluatorNames.length - 1; i++) {
            await this.addSingleEvaluator(evaluatorNames[i]);
        }
        await this.modalSubmit();
    }

    private async addSingleEvaluator(evaluatorName: string) {
        const omnibarPO = new OmnibarPO(this.page.locator('.cxone-add-entity cxone-omnibar'));
        omnibarPO.typeSearchQuery('');
        omnibarPO.typeSearchQuery(evaluatorName);
        Utils.waitForTime(1000);
        Utils.click(this.getRow(evaluatorName, this.modal));
    }

    private getRow(evaluatorName: string, ancestor: Locator) {
        return this.page.locator('.cxone-grid .ag-center-cols-container .ag-row', evaluatorName);
    }

    public async modalSubmit() {
        Utils.click(this.page.locator('.save-btn'));
        Utils.waitUntilInvisible(this.modal);
    }

    public async modalCancel() {
        Utils.click(this.page.locator('.cancel-btn'));
        Utils.waitUntilInvisible(this.modal);
    }

    public async deleteEvaluator(evaluatorName: string) {
        const row = this.getRow(evaluatorName, this.ancestor);
        Utils.click(row.this.page.locator('[col-id="action"] cxone-svg-sprite-icon'));
        Utils.waitForTime(1000);
    }

    public async isDeleteEvaluatorButtonVisible(evaluatorName: string) {
        const row = this.getRow(evaluatorName, this.ancestor);
        return await Utils.isPresent(row.this.page.locator('[col-id="action"] cxone-svg-sprite-icon'));
    }

    public async getSelectedEvaluators() {
        const allRows = this.page.locator('.cxone-grid .ag-center-cols-container .ag-row');
        return await allRows.map((row:any) => {
            return Utils.getText(row.this.page.locator('.ag-cell[col-id="fullName"]'));
        });
    }

    public async isAddEvaluatorsButtonEnabled() {
        return await Utils.isEnabled(this.page.locator('#add-evaluators-btn'));
    }
    public async isEditEvaluatorInfoIconVisible() {
        return await Utils.isPresent(this.page.locator('.edit-evaluator-info-message-box'));
    }

    public async clickEditEvaluatorInfoIcon() {
        await Utils.click(this.page.locator('.edit-evaluator-info-message-box'));
    }

    public async getEditEvaluatorInfoIconTooltipText() {
        return this.page.locator('.cxone-popover .popover-content', 'affect the plan distribution').getText();
    }

    public async getSelectiveFieldsEditMsgText() {
        return this.page.locator('.can-edit-message').getText();
    }
}
