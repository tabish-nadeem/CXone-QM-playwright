import { Page } from '@playwright/test';
import { ExpectedCondition as EC } from 'expected-condition-playwright';
import { Strings } from './strings_en_US';

let strings: any


const DEFAULT_WAIT_TIME = 25000;

export class Utils {
    static enablingFeatureToggle(ENHANCED_EVALUATOR_MODAL_FT: string, orgName: any, USER_TOKEN: string) {
         throw new Error('Method not implemented.');
    }
    static delay(arg0: number) {
        throw new Error('Method not implemented.');
    }
    static page: any;
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    static getAttribute(arg0: any, arg1: string) {
        throw new Error('Method not implemented.');
    }

    static click(arg0: any) {
         throw new Error('Method not implemented.');
    }

    static waitForSpinnerToDisappear() {
        throw new Error("Method not implemented.");
    }

    static getText(arg0: any) {
         throw new Error('Method not implemented.');
    }

    static waitForTime(arg0: number) {
         throw new Error('Method not implemented.');
    }

    static isSelected(arg0: any): any {
        throw new Error("Method not implemented.");
    }

    static isPresent(arg0: any): any {
        throw new Error("Method not implemented.");
    }

    static isEnabled(arg0: any): any {
        throw new Error("Method not implemented.");
    }

    static waitUntilVisible(arg0: any) {
        throw new Error('Method not implemented.');
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

    async waitForItemToBeClickable (elem: any, timeout: any) {
        var time = timeout || 5000;
        await this.page.waitForFunction(EC.elementToBeClickable(elem), elem, { timeout: time });
    }

    // need to define
    async waitUntilVisible (elem: any, time: any) {
        // var deferred = protractor.promise.defer();
        // var timeToWait = 10000;
        // if (time) {
        //     timeToWait = time;
        // }
        // browser.wait(EC.presenceOf(elem), timeToWait).then(function () {
        //     deferred.fulfill();
        // }, function () {
        //     console.log(waitTimeOutMessage(elem, timeToWait, 'Until Visible'));
        //     deferred.fulfill();
        // });
        // return deferred.promise;
    }

    // need to define
    async waitUntilNotVisible (elem: any, time: any) {
        // var deferred = protractor.promise.defer();
        // var timeToWait = 10000;
        // if (time) {
        //     timeToWait = time;
        // }
        // browser.wait(function () {
        //     return elem.isPresent().then(function (isVisible) {
        //         return !isVisible;
        //     });
        // }, timeToWait).then(function () {
        //     deferred.fulfill();
        // }, function () {
        //     console.log(waitTimeOutMessage(elem, timeToWait, 'Until Not Visible'));
        //     deferred.fulfill();
        // });
        // return deferred.promise;
    }

    async waitUntilInvisible(element: any, timeToWait?: number): Promise<void> {
        try {
          const waitTime = timeToWait ? timeToWait : DEFAULT_WAIT_TIME;
          await this.delay(waitTime);
        } catch (ex) {
          console.error('failed while waiting for element to be invisible');
          throw ex;
        }
    }

    async waitForPageToLoad (element: any) {
        await this.page.wait(EC.visibilityOf(element), 60000);
        this.waitForSpinnerToDisappear();
    };
    
}

