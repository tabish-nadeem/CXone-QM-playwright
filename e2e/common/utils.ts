import { Page } from '@playwright/test';
import { ExpectedCondition as EC } from 'expected-condition-playwright';
import { Locator, Page } from '@playwright/test';
import { Strings } from './strings_en_US';
import { FeatureToggleUtils } from './FeatureToggleUtils';

let strings: any


const DEFAULT_WAIT_TIME = 25000;

export class Utils {
     static waitUntilInvisible(arg0: any) {
          throw new Error('Method not implemented.');
     }
     static enablingFeatureToggle(ENHANCED_EVALUATOR_MODAL_FT: string, orgName: any, USER_TOKEN: string) {
          throw new Error('Method not implemented.');
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
    static getText(arg0: any[]) {
         throw new Error('Method not implemented.');
    }
    static waitForTime(arg0: number) {
         throw new Error('Method not implemented.');
    }
    static page: any;
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

    
   async refresh () {
    await this.page.refresh();
    
};
  async refreshpage (elementVisibilityToWaitFor: undefined) {
    await this.page.refresh()
    await this.waitForPageToLoad(elementVisibilityToWaitFor);
}


 async waitUntilDisplayed (elem: any) {
    var timeToWait = 10000;
    setTimeout(()=>{

    },timeToWait)
    
    
}

 async waitForPageToLoad (element: Locator) {
    await this.page.wait(EC.visibilityOf(element), 60000);
    this. waitForSpinnerToDisappear();
};
 async enablingFeatureToggle (toggleName: string, tenantName: string, token: any, retryCount: number = 1) {
    console.log(`ADDING FEATURE TOGGLE ${toggleName} for ${tenantName}`);
    if (!(await FeatureToggleUtils.isFeatureToggleTurnedOnForTenant(toggleName, tenantName, token))) {
        await FeatureToggleUtils.addTenantToFeature(toggleName, tenantName, token);
        const featureToggleStatus = await FeatureToggleUtils.isFeatureToggleTurnedOnForTenant(toggleName, tenantName, token);
        if (!featureToggleStatus && retryCount <= 5) {
            console.log(`Feature toggle not yet enabled across all instances. Retry Count ${retryCount}`);
            await this.page.delay(10000);
            await this.enablingFeatureToggle(toggleName, tenantName, token, retryCount + 1);
        } else if (retryCount > 5) {
            console.log('Failed to add feature toggle from config manager. Failing Test Case.');
            throw 'Failed to get updated feature toggle from config manager. Failing Test Case.';
        } else {
            console.log('Feature toggle added successfully.');
        }
    }
};

 
async waitUntilInvisible(element: any, timeToWait?: number): Promise<void> {
    try {
      const waitTime = timeToWait ? timeToWait : DEFAULT_WAIT_TIME;
      await this.page.wait(EC.invisibilityOf(element), waitTime);
    } catch (ex) {
      console.error('failed while waiting for element to be invisible');
      throw ex;
    }
  }


}


