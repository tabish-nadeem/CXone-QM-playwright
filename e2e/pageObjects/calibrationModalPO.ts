import { Page, Locator } from "@playwright/test";
import { CommonUIUtils } from "cxone-playwright-test-utils";

export class CalibrationModalPO {
    readonly page: Page;
    readonly calibrationNameTextBox: Locator;
    readonly calibrateFormRadio: Locator;
    readonly calibrateEvaluationRadio: Locator;
    readonly cancelButton: Locator;
    readonly closeButton: Locator;
    readonly calibrateButton: Locator;
    readonly formsTextbox: Locator;
    readonly dueDate: Locator;
    readonly evaluatorDropdown: Locator;
    readonly dropDownValue: Locator;
    readonly dateInputValue: Locator;
    readonly evaluatorSearchBox: Locator;

    constructor(page: Page) {
        this.page = page;
        this.calibrationNameTextBox = page.locator(`input[placeholder="Calibration Name"]`);
        this.calibrateFormRadio = page.locator(`input[value="calibrateForm"]`);
        this.calibrateEvaluationRadio = page.locator('input[value="calibrateEvaluation"]');
        this.cancelButton = page.locator(`.cxone-btn.btn-medium.btn-secondary`);
        this.closeButton = page.locator(`i[containerclass="closing-popup"]`);
        this.calibrateButton = page.locator(`.cxone-modal-wrapper .btn-primary.save-btn`);
        this.evaluatorDropdown = page.locator(`[name="calibrationEvaluatorsList"] div.dropdown-button`);
        this.formsTextbox = page.locator(`div[title="Form Name"]`);
        this.dueDate = page.locator(`div.button-wrapper.closed-date-picker-button div.cal`);
        this.dropDownValue = page.locator(`.options-wrapper .cxone-multiselect-dropdown-item`);
        this.dateInputValue = page.locator(`[id*='cxone-date-picker']`);
        this.evaluatorSearchBox = page.locator(`div.search-wrapper .cxone-text-input input`);
    }

    async enterCalibrationName(name: any) {
        await this.calibrationNameTextBox.fill("");
        await this.calibrationNameTextBox.fill(name);
    }

    async enterDueDate(date: any) {
        await this.dateInputValue.fill("");
        await this.dateInputValue.fill(date);
    }

    async selectEvaluators(option: string) {
        await this.evaluatorDropdown.click();
        await this.page.waitForSelector(`.options-wrapper .cxone-multiselect-dropdown-item`);
        await this.evaluatorSearchBox.type(option);
        await this.dropDownValue.click();
        await this.evaluatorDropdown.click();
    }

    async getDueDateFieldLabel() {
        return await this.dueDate.innerText();
    }

    async clickCalibrateFormRadio() {
        return this.calibrateFormRadio.click();
    }

    async clickCalibrateEvaluationRadio() {
        return this.calibrateEvaluationRadio.click();
    }

    async clickCancelButton() {
        return this.cancelButton.click();
    }

    async clickCloseButton() {
        return this.closeButton.click();
    }

    async clickCalibrateButton(ignoreWait : boolean) {
        await this.calibrateButton.click();
        if(ignoreWait)
        {
         await CommonUIUtils.waitUntilIconLoaderDone(this.page);
         await this.page.waitForSelector(`div.cxone-grid`);
        }
    }

    async getFormTextBoxValue() {
        return this.formsTextbox.getAttribute('value');
    }

    async getCalibrateButton() {
        return this.calibrateButton;
    }
}