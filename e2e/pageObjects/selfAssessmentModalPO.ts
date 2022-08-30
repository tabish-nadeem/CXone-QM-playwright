import {Page, Locator} from "@playwright/test";

export class SelfAssessmentModalPO {
    readonly page: Page;
    readonly modalElement: Locator;
    readonly modalTitle: Locator;
    readonly modalSubtext: Locator;
    readonly selectFormLabel: Locator;
    readonly dueDateLabel: Locator;
    readonly createButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.modalElement = page.locator(`div[class='cxone-modal-wrapper modal-size-sm']`);
        this.modalTitle = page.locator(`div[class="headerTitle ng-star-inserted"]`);
        this.modalSubtext = page.locator(`div[class="self-assessment-subText"]`);
        this.selectFormLabel = page.locator(`div[class="self-assessment-select-form-label"]`);
        this.dueDateLabel = page.locator(`div[class="self-assessment-due-date-label"]`);
        this.createButton = page.locator(`.cxone-btn.btn-medium.btn-primary`);
    }

    async getModalContainer() {
        return this.modalElement;
    }

    async getModalTitle() {
        return this.modalTitle.innerText();
    }

    async getModalSubtext() {
        return this.modalSubtext.innerText();
    }

    async getSelectFormDropdownLabel() {
        return this.selectFormLabel.innerText();
    }

    async getDueDateFieldLabel() {
        return this.dueDateLabel.innerText();
    }

    async clickCreateButton() {
        await this.createButton.click();
    }
}