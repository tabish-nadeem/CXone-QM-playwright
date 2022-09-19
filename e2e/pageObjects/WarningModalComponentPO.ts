/* eslint-disable */
import { Page ,expect} from "@playwright/test";
import { Utils } from '../common/utils';

let browser: any;
let page: Page;
let utils = new Utils(page)
export class WarningModalComponentPo {

    elements = {
        modal: page.locator(('.cxone-message-modal')),
        modalTitle: page.locator(('.cxone-message-modal .text')),
        message: page.locator(('.cxone-message-modal .message')),
        yesBtn: page.locator(('.cxone-message-modal *.btn-primary')),
        noBtn: page.locator(('.cxone-message-modal .btn-secondary')),
        closeButton: page.locator(('.cxone-message-modal *.close-button'))
    };
    page: any;

    async getModalTitle() {
        await expect(this.page.locator(this.elements.modalTitle).toBeVisible(5000))
        return await this.elements.modalTitle.textContent();
    }

    getModal() {
        return this.elements.modal;
    }

    async getMessage(Choice: any) {
        return await this.elements.message.type(Choice);
    }

    async clickYesButton(): Promise<any> {
        await Utils.click(this.elements.yesBtn);
        await utils.waitUntilInvisible(this.getModal());
    }

    async clickNoButton(): Promise<any> {
        await Utils.click(this.elements.noBtn);
        await utils.waitUntilInvisible(this.getModal());
    }

    async clickCloseButton(): Promise<any> {
        await Utils.click(this.elements.closeButton);
        await utils.waitUntilInvisible(this.getModal());
    }

    async isVisible(): Promise<boolean> {
        return await Utils.isPresent(this.elements.modal);
    }

}
function timeout(timeout: any, arg1: number): any {
    throw new Error("Function not implemented.");
}

