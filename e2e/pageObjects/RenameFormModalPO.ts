import { Page, chromium,Locator } from "@playwright/test";

export class RenameFormModalPO {
    readonly page: Page;
    readonly browser: any;
    public renameModalTitle: Locator;
    public subHeading: Locator;
    public formTextBox: Locator;
    public changeBtn: Locator;
    public cancelBtn: Locator;
    public validationMsg: Locator;
    public closeBtn: Locator;
    public nameValidationMsg: Locator;

    public constructor(pageElement?: Page) {
        this.page = pageElement || this.page.locator('body');
        this.browser = chromium.launch({
            headless: false,
        });
            this.renameModalTitle = this.page.locator('cxone-modal .headerTitle');
            this.subHeading = this.page.locator('cxone-modal .subHeading');
            this.formTextBox = this.page.locator('cxone-modal #form-designer-rename-form input');
            this.changeBtn = this.page.locator('cxone-modal .save-btn');
            this.cancelBtn = this.page.locator('cxone-modal .cancel-btn');
            this.validationMsg = this.page.locator('#manage-forms-error-message-required');
            this.closeBtn = this.page.locator('cxone-modal i.close-button');
            this.nameValidationMsg = this.page.locator('cxone-modal .error-messages span');
    }

    // Function to verify header title of Rename Modal window
    public async verifyRenameModalHeaderText() {
        await this.renameModalTitle.isPresent();
        return await this.renameModalTitle.textContent();
    }
    // Function to verify sub text
    public async verifyRenameModalSubHeading() {
        await this.subHeading.isPresent();
        return await this.subHeading.textContent();
    }

    // Function to verify text box is present
    public async verifyTextBox() {
        return await this.formTextBox.isPresent();
    }

    // Function to clear text box contents
    public async clearTextBox() {
        await this.formTextBox.click();
        await this.formTextBox.keyboard.press('Control+A');
        await this.formTextBox.keyboard.press('BACK_SPACE');
    }

    // Function to enter contents in text box
    public async enterName(formName : any) {
        return await this.formTextBox.type(formName);
    }

    // Function to check validation message
    public async checkValidation() {
        return await this.validationMsg.isPresent();
    }

    // Function to get validation message
    public async getValidation() {
        return await this.validationMsg.textContent();
    }

    // Function to check change button
    public async checkChangeBtn() {
        return await this.changeBtn.isPresent();
    }

    // Function to click change button
    public async clickChangeBtn() {
        await this.browser.wait(this.changeBtn.isVisible(), 5000);
        return await this.changeBtn.click();
    }

    // Function to check cancel button
    public async checkCancelBtn() {
        return await this.cancelBtn.isPresent();
    }

    // Function to check close button
    public async checkCloseBtn() {
        return await this.closeBtn.isPresent();
    }

    //Function to check the name validation message
    public async checkNameValidation() {
        return await this.nameValidationMsg.textContent();
    }

    public async clickCancelBtn() {
        return await this.cancelBtn.click();
    }

    public async getFormNameTextBox() {
        return await this.formTextBox;
    }

    public async clickCloseButton() {
        return await this.closeBtn.click();
    }
}
