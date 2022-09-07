import { OmnibarPO } from 'cxone-components/omnibar.po';
<<<<<<< HEAD

=======
import { Utils } from '../common/utils';
import { Page, Locator } from "@playwright/test";


let page: Page;
let utils = new Utils(page);

export class EvaluatorsPO {
     readonly page: Page;
     readonly ancestor: Locator;
     readonly modal: Locator;
     readonly elements: {
          error: Locator;
     };

     public constructor() {
          this.ancestor = page.locator(('.evaluators-container'));
          this.modal = page.locator(('add-evaluators-modal'));
          this.elements = {
               error: this.ancestor.page.locator(('.header-row .error-message'))
          };
     }

     public async getSelectedEvaluatorsCount() {
          return +(await Utils.getText(this.ancestor.page.locator(('.evaluators-count .count')))).trim();
     }

     public async clickAddEvaluatorsButton() {
          await Utils.click(this.ancestor.page.locator(('add-evaluators-btn')));
          await Utils.waitUntilVisible(this.modal);
          await Utils.waitForTime(2000);
     }

     public async isErrorVisible() {
          return await Utils.isPresent(this.elements.error);
     }

     public async getErrorMessage() {
          return await Utils.getText(this.elements.error);
     }

     public async addEvaluators(evaluatorNames: string[]) {
          await this.clickAddEvaluatorsButton();
          for (let i = 0; i <= evaluatorNames.length - 1; i++) {
               await this.addSingleEvaluator(evaluatorNames[i]);
          }
          await this.modalSubmit();
     }

     private async addSingleEvaluator(evaluatorName: string) {
          const omnibarPO = new OmnibarPO(this.modal.page.locator(('.cxone-add-entity cxone-omnibar')));
          omnibarPO.typeSearchQuery('');
          omnibarPO.typeSearchQuery(evaluatorName);
          await Utils.waitForTime(1000);
          await Utils.click(this.getRow(evaluatorName, this.modal));
     }

     private getRow(evaluatorName: string, ancestor: Locator) {
          //    return ancestor.page.locator(('.cxone-grid .ag-center-cols-container .ag-row', evaluatorName));
     }

     public async modalSubmit() {
          await Utils.click(this.modal.page.locator(('.save-btn')));
          await Utils.waitUntilInvisible(this.modal);
     }

     public async modalCancel() {
          await Utils.click(this.modal.page.locator(('.cancel-btn')));
          await Utils.waitUntilInvisible(this.modal);
     }

     public async deleteEvaluator(evaluatorName: string) {
          const row = this.getRow(evaluatorName, this.ancestor);
          await Utils.click(row.page.locator(('[col-id="action"] cxone-svg-sprite-icon')));
          await Utils.waitForTime(1000);
     }

     public async isDeleteEvaluatorButtonVisible(evaluatorName: string) {
          const row = this.getRow(evaluatorName, this.ancestor);
          return await Utils.isPresent(row.this.page.locator(('[col-id="action"] cxone-svg-sprite-icon')));
     }

     public async getSelectedEvaluators() {
          const allRows =this.page.locator(('.cxone-grid .ag-center-cols-container .ag-row'));
          return await allRows.map((row: { page: { locator: (arg0: string) => any[]; }; }) => {
               return Utils.getText(row.page.locator(('.ag-cell[col-id="fullName"]')));
          });
     }

     public async isAddEvaluatorsButtonEnabled() {
          return await Utils.isEnabled(this.ancestor.page.locator(('add-evaluators-btn')));
     }
     public async isEditEvaluatorInfoIconVisible() {
          return await Utils.isPresent(this.ancestor.page.locator(('.edit-evaluator-info-message-box')));
     }

     public async clickEditEvaluatorInfoIcon() {
          await Utils.click(this.ancestor.page.locator(('.edit-evaluator-info-message-box')));
     }

     public async getEditEvaluatorInfoIconTooltipText() {
          //    return this.ancestor.page.locator(('.cxone-popover .popover-content', 'affect the plan distribution')).getText();
     }

     public async getSelectiveFieldsEditMsgText() {
          return this.ancestor.page.locator(('.can-edit-message')).getText();
     }
>>>>>>> ebc0ce36673cfeb12581961f94cff8b8aa00f36b
}
