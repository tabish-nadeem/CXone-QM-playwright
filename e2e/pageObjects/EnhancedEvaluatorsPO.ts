// import {OmnibarPO} from 'cxone-components/omnibar.po';
// import {ElementFinder, by, element} from 'protractor';
// import {Utils} from '../../../../../../tests/protractor/common/utils';

import { Utils } from '../common/utils';
import { Page, Locator } from "@playwright/test";
import { Helpers } from "../playwright.helpers";
import { URLs } from "../common/pageIdentifierURLs";

let browser: any;
let page: Page;
let utils = new Utils(page);
export class EnhancedEvaluatorsPO {
     readonly ancestor: Locator;
     readonly page: Page
     readonly modal: Locator;
     readonly elements: {
        error: Locator;
    };

    public constructor() {
        this.page = this.page.locator('.evaluators-container'));
        this.modal = this.page.locator(('add-evaluators-modal'));
        this.elements = {
            error: this.page.locator(('.header-row .error-message'))
        };
    }

    async getSelectedEvaluatorsCount() {
        return +(await Utils.getText(this.ancestor.page.locator(('.evaluators-count .count'))));
    }

   async clickAddEvaluatorsButton() {
        await Utils.click(this.page.locator(('add-evaluators-btn')));
        await Utils.waitUntilVisible(this.modal);
        await Utils.waitForTime(2000);
    }

 async clickMoveButton() {
        await Utils.click(this.page.locator(('.movePush .cxone-btn')));
        await Utils.waitForTime(1000);
    }

    async verifyEnhancedModal() {
        await this.clickAddEvaluatorsButton();
        return await Utils.isPresent(this.page.locator(('.movePush .cxone-btn')));
    }

   async isErrorVisible() {
        return await Utils.isPresent(this.elements.error);
    }

 async getErrorMessage() {
        return await Utils.getText(this.elements.error);
    }

   async addEvaluators(evaluatorNames: string[]) {
        await this.clickAddEvaluatorsButton();
        for (let i = 0; i <= evaluatorNames.length - 1; i++) {
            await this.addSingleEvaluator(evaluatorNames[i]);
        }
        await this.clickMoveButton();
        await this.modalSubmit();
    }

    async addSingleEvaluator(evaluatorName: string) {
        const omnibarPO = new OmnibarPO(this.page.locator(('.cxone-add-entity cxone-omnibar')));
        omnibarPO.typeSearchQuery('');
        omnibarPO.typeSearchQuery(evaluatorName);
        await Utils.waitForTime(5000);
        await Utils.click(this.getRowCheckbox(evaluatorName));
    }

    getRow(evaluatorName: string, ancestor: Locator) {
        return this.page.locator(('.cxone-grid .ag-center-cols-container .ag-row')).textContent();
    }

    getRowCheckbox(evaluatorName: string) {
        const row = this.getRow(evaluatorName, this.modal);
        return row.this.page.locator(('.ag-selection-checkbox .ag-icon-checkbox-unchecked'));
    }

  async modalSubmit() {
        await Utils.click(this.page.locator(('.save-btn')));
        await Utils.waitUntilVisible(this.modal);
    }
 async modalCancel() {
        await Utils.click(this.page.locator(('.cancel-btn')));
        await Utils.waitUntilVisible(this.modal);
    }

   async deleteEvaluator(evaluatorName: string) {
        const row = this.getRow(evaluatorName, this.ancestor);
        await Utils.click(row.this.page.locator(('[col-id="action"] cxone-svg-sprite-icon')));
        await Utils.waitForTime(2000);
    }

   async isDeleteEvaluatorButtonVisible(evaluatorName: string) {
        const row = this.getRow(evaluatorName, this.page);
        return await Utils.isPresent(row.this.page.locator(('[col-id="action"] cxone-svg-sprite-icon')));
    }

     async getSelectedEvaluators() {
        const allRows = this.page.locator(('.cxone-grid .ag-center-cols-container .ag-row'));
        return await allRows.map(row => {
            return Utils.getText(row.this.page.locator(('.ag-cell[col-id="fullName"]')));
        });
    }

    async isAddEvaluatorsButtonEnabled() {
        return await Utils.isEnabled(this.page.locator(('add-evaluators-btn')));
    }

   async isEditEvaluatorInfoIconVisible() {
        return await Utils.isPresent(this.page.locator(('.edit-evaluator-info-message-box')));
    }

    async clickEditEvaluatorInfoIcon() {
        await Utils.click(this.page.locator(('.edit-evaluator-info-message-box')));
    }

    async getEditEvaluatorInfoIconTooltipText() {
        return this.page.locator(('.cxone-popover .popover-content')).textContent();
    }

    async getSelectiveFieldsEditMsgText() {
        return this.page.locator(('.can-edit-message')).textContent();
    }
}
