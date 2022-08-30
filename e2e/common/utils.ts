import { Locator, Page } from '@playwright/test';
import { Strings } from './strings_en_US';

let strings: any


const DEFAULT_WAIT_TIME = 25000;

export class Utils {
    readonly page: Page;
   
    constructor(page: Page) {
        this.page = page;
    }

    async waitForSpinnerToDisappear() {
        const spinner = this.page.waitForSelector('[class="spinner spinner-bounce-middle"]');
        (await spinner).waitForElementState("hidden");
    }

    async getExpectedString(keyValue: string) {
        strings = new Strings();
        var expectedString = eval(strings + keyValue);
        return (expectedString);
    }

    async delay(time: number) {
        return new Promise(function (resolve) {
            setTimeout(resolve, time)
        });
    }

    async click(element: any): Promise<any> {
        await this.page.click(element, { timeout: 10000 });
    }

    async randomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    async getToastMessage() {
        let utils = new Utils(this.page);
        const toast = this.page.locator('.toast-message');
        await toast.isVisible();
        // if (toast === '') {
        //   await Utils.waitForTime(500);
        // }
        return await toast.textContent();
    };
    
}

