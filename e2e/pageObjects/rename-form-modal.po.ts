import { Page, chromium } from "@playwright/test";

export class RenameFormModalPO {
    readonly page: Page;
    readonly elements: any;
    readonly browser: any;

    public constructor(pageElement?: Page) {
        this.page = pageElement || this.page.locator('body');
        this.browser = chromium.launch({
            headless: false,
        });
        this.elements = {
            renameModalTitle: this.page.locator('cxone-modal .headerTitle'),
            subHeading: this.page.locator('cxone-modal .subHeading'),
            formTextBox: this.page.locator('cxone-modal #form-designer-rename-form input'),
            changeBtn: this.page.locator('cxone-modal .save-btn'),
            cancelBtn: this.page.locator('cxone-modal .cancel-btn'),
            validationMsg: this.page.locator('#manage-forms-error-message-required'),
            closeBtn: this.page.locator('cxone-modal i.close-button'),
            nameValidationMsg: this.page.locator('cxone-modal .error-messages span')
        };
    }

    // Function to verify header title of Rename Modal window
    public async verifyRenameModalHeaderText() {
        await this.elements.renameModalTitle.isPresent();
        return await this.elements.renameModalTitle.textContent();
    }
    // Function to verify sub text
    public async verifyRenameModalSubHeading() {
        await this.elements.subHeading.isPresent();
        return await this.elements.subHeading.textContent();
    }

    // Function to verify text box is present
    public async verifyTextBox() {
        return await this.elements.formTextBox.isPresent();
    }

    // Function to clear text box contents
    public async clearTextBox() {
        await this.elements.formTextBox.click();
        await this.elements.formTextBox.keyboard.press('Control+A');
        await this.elements.formTextBox.keyboard.press('BACK_SPACE');
    }

    // Function to enter contents in text box
    public async enterName(formName : any) {
        return await this.elements.formTextBox.type(formName);
    }

    // Function to check validation message
    public async checkValidation() {
        return await this.elements.validationMsg.isPresent();
    }

    // Function to get validation message
    public async getValidation() {
        return await this.elements.validationMsg.textContent();
    }

    // Function to check change button
    public async checkChangeBtn() {
        return await this.elements.changeBtn.isPresent();
    }

    // Function to click change button
    public async clickChangeBtn() {
        await this.browser.wait(this.elements.changeBtn.isVisible(), 5000);
        return await this.elements.changeBtn.click();
    }

    // Function to check cancel button
    public async checkCancelBtn() {
        return await this.elements.cancelBtn.isPresent();
    }

    // Function to check close button
    public async checkCloseBtn() {
        return await this.elements.closeBtn.isPresent();
    }

    //Function to check the name validation message
    public async checkNameValidation() {
        return await this.elements.nameValidationMsg.textContent();
    }

    public async clickCancelBtn() {
        return await this.elements.cancelBtn.click();
    }

    public async getFormNameTextBox() {
        return await this.elements.formTextBox;
    }

    public async clickCloseButton() {
        return await this.elements.closeBtn.click();
    }
}
