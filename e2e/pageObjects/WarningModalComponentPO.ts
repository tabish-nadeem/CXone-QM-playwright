/* eslint-disable */
import { expect, Locator, Page } from "@playwright/test";
import { Utils } from '../common/utils';

export class WarningModalComponentPo {
    readonly browser: any;
    readonly page: Page;
    readonly utils = new Utils(this.page)
    readonly modal:Locator;
    readonly modalTitle:Locator;
    readonly message:Locator;
    readonly yesBtn:Locator;
    readonly noBtn:Locator;
    readonly closeButton:Locator;
    public constructor(page:Page) {
        this.page = this.page;
        this.modal= this.page.locator(('.cxone-message-modal')),
        this.modalTitle= this.page.locator(('.cxone-message-modal .text')),
        this.message= this.page.locator(('.cxone-message-modal .message')),
        this.yesBtn= this.page.locator(('.cxone-message-modal *.btn-primary')),
        this.noBtn= this.page.locator(('.cxone-message-modal .btn-secondary'));
        this.closeButton= this.page.locator(('.cxone-message-modal *.close-button'))
    };

    async getModalTitle() {
        await expect(this.page.locator(this.modalTitle).toBeVisible(5000))
        return await this.modalTitle.textContent();
    }

    getModal() {
        return this.modal;
    }

    async getMessage(Choice: any) {
        return await this.message.type(Choice);
    }

    async clickYesButton(): Promise<any> {
        await Utils.click(this.yesBtn);
        await this.page.waitForSelector('#form-designer-form-area');
    }

    async clickNoButton(): Promise<any> {
        await Utils.click(this.noBtn);
        await this.page.waitForSelector('#form-designer-form-area');
    }

    async clickCloseButton(): Promise<any> {
        await Utils.click(this.closeButton);
        await this.page.waitForSelector('#form-designer-form-area');
    }

    async isVisible(): Promise<boolean> {
        return await this.page.locator('.cxone-message-modal').isVisible()
    }

}
function timeout(timeout: any, arg1: number): any {
    throw new Error("Function not implemented.");
}

