import { Page,Locator } from "@playwright/test";

export class DuplicateFormModalPO {
    // enterPlanName(newPlanName: string) {
    //     throw new Error('Method not implemented.');
    // }
    readonly page: Page;
    // readonly elements: any;
       public  saveModalTitle         : Locator
       public  formNameTextBox      : Locator
       public  saveBtn: Locator
       public  cancelBtn: Locator
       public  closeModalBtn: Locator
       public  formSaveErrorMsg: Locator

    public constructor(page:Page) {
         this.page = page
        // this.page = pageElement || this.page.locator('body');
    
            this.saveModalTitle = this.page.locator('cxone-modal .headerTitle'),
            this.formNameTextBox = this.page.locator('cxone-modal #form-designer-duplicate-form-name input'),
            this.saveBtn = this.page.locator('cxone-modal .save-btn'),
            this.cancelBtn =this.page.locator('cxone-modal .cancel-btn'),
            this.closeModalBtn =this.page.locator('cxone-modal i.close-button'),
            this.formSaveErrorMsg= this.page.locator('cxone-modal .error-messages span')
       
    }

    // Function to verify header title of Save Modal window
    public checkSaveModalHeaderText() {
        return this.saveModalTitle.isPresent();
    }

    public getSaveButton() {
        return this.saveBtn;
    }

    // Function to verify Save button in Save Modal window
    public checkSaveButton() {
        return this.saveBtn.isPresent();
    }

    // Function to click on Save button in Save Modal window
    public clickSaveButton() {
        return this.saveBtn.click();
    }

    // Function to verify Cancel button in Save Modal window
    public checkCancelButton() {
        return this.cancelBtn.isPresent();
    }

    // Function to click on Cancel button in Save Modal window
    public clickCancelButton() {
        return this.cancelBtn.click();
    }

    // Function to verify close(x) button in Save Modal window
    public checkModalCloseButton() {
        return this.closeModalBtn.isPresent();
    }

    // Function to click on close(x) button in Save Modal window
    public clickModalCloseButton() {
        return this.closeModalBtn.click();
    }

    // Function to verify Form Name textbox in Save Modal window
    public checkFormNameTextBox() {
        return this.formNameTextBox.isPresent();
    }

    /* Function to enter form name in text box
     * Parameter - formName - send the form name*/
    public enterFormName(formName : any) {
        return this.formNameTextBox.type(formName);
    }

    // Function to get save error message
    public verifySaveErrorMsg() {
        return this.formSaveErrorMsg.textContent();
    }

    public getFormNameTextBox() {
        return this.formNameTextBox;
    }
}
