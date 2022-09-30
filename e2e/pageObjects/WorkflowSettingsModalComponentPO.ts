import {SingleselectDropdownPO} from './SingleselectDropdownPO';
import {expect, Locator, Page} from "@playwright/test";

export class WorkflowSettingsModalComponentPo {
    readonly page: Page;
    readonly modalWrapper: Locator;
    readonly closeButton: Locator;
    readonly cancelButton: Locator;
    readonly saveButton: Locator;
    readonly confirmYesButton: Locator;
    readonly confirmNoButton: Locator;
    readonly agentCanReviewCheckBox: Locator;
    readonly displayScoreToAgentCheckBox: Locator;
    readonly agentCanAcknowledgeCheckbox: Locator;
    readonly agentCanRequestReviewCheckbox: Locator;
    readonly assignedEvaluatorRadio: Locator;
    readonly specificEvaluatorRadio: Locator;
    readonly specificEvaluatorDropdown: Locator;
    constructor(page: Page) {
    this.specificEvaluatorDropdown = new SingleselectDropdownPO(this.page.locator(('#workflow-config-specific-evaluator')));
     this.modalWrapper= this.page.locator(('.workflow-settings-modal-wrapper'));
     this.closeButton= this.page.locator(('.workflow-settings-modal-wrapper *.close-button'));
     this.cancelButton= this.page.locator(('.workflow-settings-modal-wrapper *.cancel-btn'));
     this.saveButton= this.page.locator(('.workflow-settings-modal-wrapper *.save-btn'));
     this.confirmYesButton= this.page.locator(('#exit-yes-btn'));
     this.confirmNoButton= this.page.locator(('#close-popover'));
     this.agentCanReviewCheckBox= this.page.locator(('cxone-checkbox[name="agentCanReviewCheckbox"] input'));
     this.displayScoreToAgentCheckBox= this.page.locator(('cxone-checkbox[name="agentCanViewScoreCheckbox"] input'));
     this.agentCanAcknowledgeCheckbox= this.page.locator(('cxone-checkbox[name="agentCanAcknowledgeCheckbox"] input'));
     this.agentCanRequestReviewCheckbox= this.page.locator(('cxone-checkbox[name="agentCanRequestReviewCheckbox"] input'));
     this.assignedEvaluatorRadio= this.page.locator(('.workflow-default-evaluator-wrapper * input[name="evaluatorRadio"]'));
     this.specificEvaluatorRadio= this.page.locator(('.workflow-specific-evaluator * input[name="evaluatorRadio"]'));
    };

    async clickCloseButton(): Promise<any> {
        return this.closeButton.click() as Promise<any>;
    }

    async clickCancelButton(): Promise<any> {
        return this.cancelButton.click() as Promise<any>;
    }

    async clickPopOverYes(): Promise<any> {
        await expect(this.page.locator(this.confirmYesButton).waitFor({state:'attached',timeout:10000}))
        await this.confirmYesButton.click()
        await expect(this.page.locator(this.modalWrapper).waitFor({state:'attached',timeout:10000}))
    }

    async clickPopOverNo(): Promise<any> {
        await expect(this.page.locator(this.confirmNoButton).waitFor({state:'attached',timeout:10000}))

        return this.confirmNoButton.click() as Promise<any>;
    }

    async clickSaveButton(): Promise<any> {
        await this.saveButton.click();
        await expect(this.page.locator(this.modalWrapper).waitFor({state:'attached',timeout:10000}))
    }

    async clickAgentCanReviewCheckBox(): Promise<any> {
          await expect(this.page.locator(this.agentCanReviewCheckBox).waitFor({state:'attached',timeout:10000}))
          return this.page.executeScript('arguments[0].click();', this.agentCanReviewCheckBox) as Promise<any>;
    }

    async clickDisplayScoreToAgentCheckBox(): Promise<any> {

        await expect(this.page.locator(this.displayScoreToAgentCheckBox).waitFor({state:'attached',timeout:10000}))
        return this.page.executeScript('arguments[0].click();', this.displayScoreToAgentCheckBox) as Promise<any>;
    }

    async clickAgentCanAcknowledgeCheckbox(): Promise<any> {
        await expect(this.page.locator(this.agentCanAcknowledgeCheckbox).waitFor({state:'attached',timeout:10000}))
        return this.page.executeScript('arguments[0].click();', this.agentCanAcknowledgeCheckbox) as Promise<any>;
    }

    async clickagentCanRequestReviewCheckbox(): Promise<any> {
        await expect(this.page.locator(this.agentCanRequestReviewCheckbox).waitFor({state:'attached',timeout:10000}))
        return this.page.executeScript('arguments[0].click();', this.agentCanRequestReviewCheckbox) as Promise<any>;
    }

    async clickAssignedEvaluatorRadio(): Promise<any> {
        await expect(this.page.locator(this.assignedEvaluatorRadio).waitFor({state:'attached',timeout:10000}))
        return this.page.executeScript('arguments[0].click();', this.assignedEvaluatorRadio) as Promise<any>;
    }

    async clickSpecificEvaluatorRadio(): Promise<any> {
        await expect(this.page.locator(this.specificEvaluatorRadio).waitFor({state:'attached',timeout:10000}))
        return this.page.executeScript('arguments[0].click();', this.specificEvaluatorRadio) as Promise<any>;
    }

    getAgentCanReviewCheckBox() {
        return this.agentCanReviewCheckBox;
    }

    getDisplayScoreToAgentCheckBox() {
        return this.displayScoreToAgentCheckBox;
    }

    getAgentCanAcknowledgeCheckbox() {
        return this.agentCanAcknowledgeCheckbox;
    }

    getagentCanRequestReviewCheckbox() {
        return this.agentCanRequestReviewCheckbox;
    }

    getAssignedEvaluatorRadio() {
        return this.assignedEvaluatorRadio;
    }

    getSpecificEvaluatorRadio() {
        return this.specificEvaluatorRadio;
    }

    getModalWrapper() {
        return this.modalWrapper;
    }

}

