
/* eslint-disable */
import { Utils } from '../common/utils';
import { ExpectedCondition as EC } from 'expected-condition-playwright';
import { Page, Locator } from "@playwright/test";
import { Helpers } from "../playwright.helpers";
import { URLs } from "../common/pageIdentifierURLs";

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

    async getModalTitle() {
        await page.wait(EC.visibilityOf(this.elements.modalTitle), 10000);
        return await this.elements.modalTitle.getText();
    }

    getModal() {
        return this.elements.modal;
    }

    async getMessage(Choice: any) {
        return await this.elements.message.sendKeys(Choice);
    }

    async clickYesButton(): Promise<any> {
        await Utils.click(this.elements.yesBtn);
        await Utils.waitUntilInvisible(this.getModal());
    }

    async clickNoButton(): Promise<any> {
        await Utils.click(this.elements.noBtn);
        await Utils.waitUntilInvisible(this.getModal());
    }

    async clickCloseButton(): Promise<any> {
        await Utils.click(this.elements.closeButton);
        await Utils.waitUntilInvisible(this.getModal());
    }

    async isVisible(): Promise<boolean> {
        return await Utils.isPresent(this.elements.modal);
    }

}
