import { OmnibarPO } from './OmnibarPO';
import { Utils } from '../common/utils';
import { Page, Locator } from "@playwright/test";


export class EvaluatorsPO {
     readonly page: Page;
     readonly modal: Locator;
     readonly error : Locator
     

     public constructor() {
          this.page = this.page.locator(('.evaluators-container'));
          this.modal = this.page.locator(('add-evaluators-modal'));
          
             this.error = this.page.locator(('.header-row .error-message'))
          
     }

     public async getSelectedEvaluatorsCount() {
          return  await  this.page.locator(('.evaluators-count .count')).textContent();
     }

     public async  clickAddEvaluatorsButton() {
          await this.page.locator(('add-evaluators-btn')).click();
          await Utils.waitUntilVisible(this.modal);
          // await Utils.waitForTime(2000);
          await utils.delay(2000)
     }

     public async isErrorVisible() {
          return await this.error.isPresent();
     }

     public async getErrorMessage() {
          return await this.error.getText();
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
          // await Utils.waitForTime(1000);
          await utils.delay(2000)
          await this.getRow(evaluatorName, this.modal).click();
     }

     private getRow(evaluatorName: string, ancestor: Locator) {
             return this.page.locator(('.cxone-grid .ag-center-cols-container .ag-row'));
     }

     public async modalSubmit() {
          await  this.modal.page.locator(('.save-btn')).click();
          await Utils.waitUntilVisible(this.modal);
     }

     public async modalCancel() {
          await this.modal.page.locator(('.cancel-btn')).click();
          await Utils.waitUntilVisible(this.modal);
     }

     public async deleteEvaluator(evaluatorName: string) {
          const row = this.getRow(evaluatorName, this.page);
          await row.this.page.locatorr(('[col-id="action"] cxone-svg-sprite-icon')).click();
          await Utils.waitForTime(1000);
     }

     public async isDeleteEvaluatorButtonVisible(evaluatorName: string) {
          const row = this.getRow(evaluatorName, this.page);
          return await row.this.page.locator(('[col-id="action"] cxone-svg-sprite-icon')).isPresent();
     }

     public async getSelectedEvaluators() {
          const allRows =this.page.locator(('.cxone-grid .ag-center-cols-container .ag-row'));
          return await allRows.map((row: { page: { locator: (arg0: string) => any[]; }; }) => {
               return row.page.locator('.ag-cell[col-id="fullName"]');
          });
     }

     public async isAddEvaluatorsButtonEnabled() {
          return await Utils.isEnabled(this.page.locator(('add-evaluators-btn')));
     }
     public async isEditEvaluatorInfoIconVisible() {
          return await this.page.locator(('.edit-evaluator-info-message-box')).isPresent();
     }

     public async clickEditEvaluatorInfoIcon() {
          await this.page.locator(('.edit-evaluator-info-message-box')).click();
     }

     public async getEditEvaluatorInfoIconTooltipText() {
             return this.page.locator(('.cxone-popover .popover-content')).textContent();
     }

     public async getSelectiveFieldsEditMsgText() {
          return this.page.locator(('.can-edit-message'))
     }
}
