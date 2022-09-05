import { expect, Locator, Page } from "@playwright/test";

export class AddMultipleModalPo {
  public readonly page: Page;
  public elements;

  constructor() {
    this.elements = {
      modal: this.page.locator(".add-multiple-form-modal-wrapper"),
      modalTitle: this.page.locator(
        ".add-multiple-form-modal-wrapper *.content-wrapper .headerTitle"
      ),
      txtArea: this.page.locator(".text-area-in-add-multiple-modal"),
      addBtn: this.page.locator(".modal-footer-wrapper *.btn-primary"),
      cancelBtn: this.page.locator(".modal-footer-wrapper *.btn-secondary"),
      confirmNo: this.page.locator(".closing-popup *.btn-secondary"),
      confirmYes: this.page.locator(".closing-popup *.btn-primary"),
      closeButton: this.page.locator(
        ".add-multiple-form-modal-wrapper *.close-button"
      ),
    };
  }

  async getModalTitle() {
    await expect(this.elements.modalTitle).toBeVisible(10000);
    return await this.elements.modalTitle.getText();
  }

  getModal(): Locator {
    return this.elements.modal;
  }

  async getTextAreaInputField(Choice: any) {
    return await this.elements.txtArea.sendKeys(Choice);
  }

  async enterChoice(Choice: any) {
    await this.elements.txtArea.sendKeys(Choice);
    return await this.elements.txtArea.sendKeys("\n");
  }

  async clickAddButton(): Promise<any> {
    await expect(this.elements.addBtn).toBeVisible(10000);
    return await this.elements.addBtn.click();
  }

  async clickCancelDismissButton(): Promise<any> {
    await expect(this.elements.confirmNo).toBeVisible(10000);
    return await this.elements.confirmNo.click();
  }

  async clickCancelConfirmButton(): Promise<any> {
    await expect(this.elements.confirmYes).toBeVisible(10000);
    return await this.elements.confirmYes.click();
  }

  async clickCloseButton(): Promise<any> {
    await expect(this.elements.closeButton).toBeVisible(10000);
    return await this.elements.closeButton.click();
  }
}
