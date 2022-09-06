import { Page } from "@playwright/test";

export class DuplicateFormModalPO {
    readonly page: Page;
    readonly elements: any;

    public constructor(pageElement?: Page) {
        this.page = pageElement || this.page.locator('body');
        this.elements = {
            saveModalTitle: this.page.locator('cxone-modal .headerTitle'),
            formNameTextBox: this.page.locator('cxone-modal #form-designer-duplicate-form-name input'),
            saveBtn: this.page.locator('cxone-modal .save-btn'),
            cancelBtn: this.page.locator('cxone-modal .cancel-btn'),
            closeModalBtn: this.page.locator('cxone-modal i.close-button'),
            formSaveErrorMsg: this.page.locator('cxone-modal .error-messages span')
        };
    }

    // Function to verify header title of Save Modal window
    public checkSaveModalHeaderText() {
        return this.elements.saveModalTitle.isPresent();
    }

    public getSaveButton() {
        return this.elements.saveBtn;
    }

    // Function to verify Save button in Save Modal window
    public checkSaveButton() {
        return this.elements.saveBtn.isPresent();
    }

    // Function to click on Save button in Save Modal window
    public clickSaveButton() {
        return this.elements.saveBtn.click();
    }

    // Function to verify Cancel button in Save Modal window
    public checkCancelButton() {
        return this.elements.cancelBtn.isPresent();
    }

    // Function to click on Cancel button in Save Modal window
    public clickCancelButton() {
        return this.elements.cancelBtn.click();
    }

    // Function to verify close(x) button in Save Modal window
    public checkModalCloseButton() {
        return this.elements.closeModalBtn.isPresent();
    }

    // Function to click on close(x) button in Save Modal window
    public clickModalCloseButton() {
        return this.elements.closeModalBtn.click();
    }

    // Function to verify Form Name textbox in Save Modal window
    public checkFormNameTextBox() {
        return this.elements.formNameTextBox.isPresent();
    }

    /* Function to enter form name in text box
     * Parameter - formName - send the form name*/
    public enterFormName(formName : any) {
        return this.elements.formNameTextBox.clear().sendKeys(formName);
    }

    // Function to get save error message
    public verifySaveErrorMsg() {
        return this.elements.formSaveErrorMsg.getText();
    }

    public getFormNameTextBox() {
        return this.elements.formNameTextBox;
    }
}
