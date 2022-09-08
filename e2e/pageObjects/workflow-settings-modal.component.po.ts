// import {element, by, browser, ExpectedConditions} from 'protractor';
import {SingleselectDropdownPO} from '../pageObjects/singleselect-dropdown.po';
import {expect, Locator, Page} from "@playwright/test";

export class WorkflowSettingsModalComponentPo {

    specificEvaluatorDropdown = new SingleselectDropdownPO(Page.locator(('#workflow-config-specific-evaluator')));

    elements = {
        modalWrapper: Page.locator(('.workflow-settings-modal-wrapper')),
        closeButton: Page.locator(('.workflow-settings-modal-wrapper *.close-button')),
        cancelButton: Page.locator(('.workflow-settings-modal-wrapper *.cancel-btn')),
        saveButton: Page.locator(('.workflow-settings-modal-wrapper *.save-btn')),
        confirmYesButton: Page.locator(('#exit-yes-btn')),
        confirmNoButton: Page.locator(('#close-popover')),
        agentCanReviewCheckBox: Page.locator(('cxone-checkbox[name="agentCanReviewCheckbox"] input')),
        displayScoreToAgentCheckBox: Page.locator(('cxone-checkbox[name="agentCanViewScoreCheckbox"] input')),
        agentCanAcknowledgeCheckbox: Page.locator(('cxone-checkbox[name="agentCanAcknowledgeCheckbox"] input')),
        agentCanRequestReviewCheckbox: Page.locator(('cxone-checkbox[name="agentCanRequestReviewCheckbox"] input')),
        assignedEvaluatorRadio: Page.locator(('.workflow-default-evaluator-wrapper * input[name="evaluatorRadio"]')),
        specificEvaluatorRadio: Page.locator(('.workflow-specific-evaluator * input[name="evaluatorRadio"]'))
    };

    async clickCloseButton(): Promise<any> {
        return this.elements.closeButton.click() as Promise<any>;
    }

    async clickCancelButton(): Promise<any> {
        return this.elements.cancelButton.click() as Promise<any>;
    }

    async clickPopOverYes(): Promise<any> {
        await browser.wait(ExpectedConditions.visibilityOf(this.elements.confirmYesButton), 10000);
        await this.elements.confirmYesButton.click();
        return await browser.wait(ExpectedConditions.invisibilityOf(this.elements.modalWrapper), 10000);
    }

    async clickPopOverNo(): Promise<any> {
        await browser.wait(ExpectedConditions.visibilityOf(this.elements.confirmNoButton), 10000);
        return this.elements.confirmNoButton.click() as Promise<any>;
    }

    async clickSaveButton(): Promise<any> {
        await this.elements.saveButton.click();
        return await browser.wait(ExpectedConditions.invisibilityOf(this.elements.modalWrapper), 10000);
    }

    async clickAgentCanReviewCheckBox(): Promise<any> {
          await browser.wait(ExpectedConditions.presenceOf(this.elements.agentCanReviewCheckBox), 10000);
          return browser.executeScript('arguments[0].click();', this.elements.agentCanReviewCheckBox) as Promise<any>;
    }

    async clickDisplayScoreToAgentCheckBox(): Promise<any> {
        await browser.wait(ExpectedConditions.presenceOf(this.elements.displayScoreToAgentCheckBox), 10000);
        return browser.executeScript('arguments[0].click();', this.elements.displayScoreToAgentCheckBox) as Promise<any>;
    }

    async clickAgentCanAcknowledgeCheckbox(): Promise<any> {
        await browser.wait(ExpectedConditions.presenceOf(this.elements.agentCanAcknowledgeCheckbox), 10000);
        return browser.executeScript('arguments[0].click();', this.elements.agentCanAcknowledgeCheckbox) as Promise<any>;
    }

    async clickagentCanRequestReviewCheckbox(): Promise<any> {
        await browser.wait(ExpectedConditions.presenceOf(this.elements.agentCanRequestReviewCheckbox), 10000);
        return browser.executeScript('arguments[0].click();', this.elements.agentCanRequestReviewCheckbox) as Promise<any>;
    }

    async clickAssignedEvaluatorRadio(): Promise<any> {
        await browser.wait(ExpectedConditions.presenceOf(this.elements.assignedEvaluatorRadio), 10000);
        return browser.executeScript('arguments[0].click();', this.elements.assignedEvaluatorRadio) as Promise<any>;
    }

    async clickSpecificEvaluatorRadio(): Promise<any> {
        await browser.wait(ExpectedConditions.presenceOf(this.elements.specificEvaluatorRadio), 10000);
        return browser.executeScript('arguments[0].click();', this.elements.specificEvaluatorRadio) as Promise<any>;
    }

    getAgentCanReviewCheckBox() {
        return this.elements.agentCanReviewCheckBox;
    }

    getDisplayScoreToAgentCheckBox() {
        return this.elements.displayScoreToAgentCheckBox;
    }

    getAgentCanAcknowledgeCheckbox() {
        return this.elements.agentCanAcknowledgeCheckbox;
    }

    getagentCanRequestReviewCheckbox() {
        return this.elements.agentCanRequestReviewCheckbox;
    }

    getAssignedEvaluatorRadio() {
        return this.elements.assignedEvaluatorRadio;
    }

    getSpecificEvaluatorRadio() {
        return this.elements.specificEvaluatorRadio;
    }

    getModalWrapper() {
        return this.elements.modalWrapper;
    }

}

