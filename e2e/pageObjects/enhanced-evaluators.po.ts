import { Locator } from '@playwright/test';
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
     readonly modal: Locator;
     readonly elements: {
        error: Locator;
    };

    public constructor() {
        this.ancestor = page.locator('.evaluators-container'));
        this.modal = page.locator(('add-evaluators-modal'));
        this.elements = {
            error: this.ancestor.page.locator(('.header-row .error-message'))
        };
    }

    async getSelectedEvaluatorsCount() {
        return +(await Utils.getText(this.ancestor.page.locator(('.evaluators-count .count')))).trim();
    }

   async clickAddEvaluatorsButton() {
        await Utils.click(this.ancestor.page.locator(('add-evaluators-btn')));
        await Utils.waitUntilVisible(this.modal);
        await Utils.waitForTime(2000);
    }

 async clickMoveButton() {
        await Utils.click(this.modal.page.locator(('.movePush .cxone-btn')));
        await Utils.waitForTime(1000);
    }

    async verifyEnhancedModal() {
        await this.clickAddEvaluatorsButton();
        return await Utils.isPresent(this.modal.page.locator(('.movePush .cxone-btn')));
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
        const omnibarPO = new OmnibarPO(this.modal.Page.locator(('.cxone-add-entity cxone-omnibar')));
        omnibarPO.typeSearchQuery('');
        omnibarPO.typeSearchQuery(evaluatorName);
        await Utils.waitForTime(5000);
        await Utils.click(this.getRowCheckbox(evaluatorName));
    }

    getRow(evaluatorName: string, ancestor: Locator) {
        return ancestor.page.locator(('.cxone-grid .ag-center-cols-container .ag-row', evaluatorName)).textContent();
    }

    getRowCheckbox(evaluatorName: string) {
        const row = this.getRow(evaluatorName, this.modal);
        return row.page.locator(('.ag-selection-checkbox .ag-icon-checkbox-unchecked'));
    }

  async modalSubmit() {
        await Utils.click(this.modal.page.locator(('.save-btn')));
        await Utils.waitUntilInvisible(this.modal);
    }
 async modalCancel() {
        await Utils.click(this.modal.page.locator(('.cancel-btn')));
        await Utils.waitUntilInvisible(this.modal);
    }

   async deleteEvaluator(evaluatorName: string) {
        const row = this.getRow(evaluatorName, this.ancestor);
        await Utils.click(row.page.locator(('[col-id="action"] cxone-svg-sprite-icon')));
        await Utils.waitForTime(2000);
    }

   async isDeleteEvaluatorButtonVisible(evaluatorName: string) {
        const row = this.getRow(evaluatorName, this.ancestor);
        return await Utils.isPresent(row.page.locator(('[col-id="action"] cxone-svg-sprite-icon')));
    }

     async getSelectedEvaluators() {
        const allRows = this.ancestor.all(('.cxone-grid .ag-center-cols-container .ag-row'));
        return await allRows.map(row => {
            return Utils.getText(row.page.locator(('.ag-cell[col-id="fullName"]')));
        });
    }

    async isAddEvaluatorsButtonEnabled() {
        return await Utils.isEnabled(this.ancestor.page.locator(('add-evaluators-btn')));
    }

   async isEditEvaluatorInfoIconVisible() {
        return await Utils.isPresent(this.ancestor.page.locator(('.edit-evaluator-info-message-box')));
    }

    async clickEditEvaluatorInfoIcon() {
        await Utils.click(this.ancestor.page.locator(('.edit-evaluator-info-message-box')));
    }

    async getEditEvaluatorInfoIconTooltipText() {
        return this.ancestor.page.locator(('.cxone-popover .popover-content', 'affect the plan distribution')).textContent();
    }

    async getSelectiveFieldsEditMsgText() {
        return this.ancestor.page.locator(('.can-edit-message')).getText();
    }
}
