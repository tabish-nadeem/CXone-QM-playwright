import { expect, Locator, Page } from "@playwright/test";

export class AddMultipleModalPo {
  readonly page: Page;
  readonly modal: Locator;
  readonly modalTitle: Locator;
  readonly txtArea: Locator;
  readonly addBtn: Locator;
  readonly cancelBtn: Locator;
  readonly confirmNo: Locator;
  readonly confirmYes: Locator;
  readonly closeButton: Locator; 
  
   constructor(page: Page) {
    this.page = page;
    this.modal = this.page.locator(".add-multiple-form-modal-wrapper");
    this.modalTitle = this.page.locator(".add-multiple-form-modal-wrapper *.content-wrapper .headerTitle");
    this.txtArea = this.page.locator(".text-area-in-add-multiple-modal");
    this.addBtn = this.page.locator(".modal-footer-wrapper *.btn-primary");
    this.cancelBtn = this.page.locator(".modal-footer-wrapper *.btn-secondary");
    this.confirmNo = this.page.locator(".closing-popup *.btn-secondary");
    this.confirmYes = this.page.locator(".closing-popup *.btn-primary");
    this.closeButton = this.page.locator(".add-multiple-form-modal-wrapper *.close-button");
}

  async getModalTitle() {
    await expect(this.modalTitle).toBeVisible(10000);
    return await this.modalTitle.textContent();
  }

  getModal(): Locator {
    return this.modal;
  }

  async getTextAreaInputField(Choice: any) {
    return await this.txtArea.type(Choice);
  }

  async enterChoice(Choice: any) {
    await this.txtArea.type(Choice);
    return await this.txtArea.type("\n");
  }

  async clickAddButton(): Promise<any> {
    await expect(this.addBtn).isVisible(10000);
    return await this.addBtn.click();
  }

  async clickCancelDismissButton(): Promise<any> {
    await expect(this.confirmNo).isVisible(10000);
    return await this.confirmNo.click();
  }

  async clickCancelConfirmButton(): Promise<any> {
    await expect(this.confirmYes).isVisible(10000);
    return await this.confirmYes.click();
  }

  async clickCloseButton(): Promise<any> {
    await expect(this.closeButton).isVisible(10000);
    return await this.closeButton.click();
  }
}
