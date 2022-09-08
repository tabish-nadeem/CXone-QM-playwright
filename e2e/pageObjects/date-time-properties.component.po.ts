import {expect, Locator, Page} from "@playwright/test";
import { SingleselectDropdownPO } from "./singleselect-dropdown.po";

export class DateTimePropertiesComponentPo {
    ancestor: Locator;
    public dateElements: any;
    public timeElements: any;
    public readonly page:Page;

    constructor() {
        this.ancestor = this.page.locator('.cxone-date-time-properties');
        this.dateElements = {
            dateToggle: this.ancestor.locator('#form-designer-date-toggle'),
            instructions: this.ancestor.locator('#form-designer-date-attribute-subtext-text * input'),
            requiredCheckbox: this.ancestor.locator('[checkboxid="form-designer-date-mandatory-text"] input'),
            useCurrentDate: this.ancestor.locator('[checkbox-id="form-designer-date-picker-current-date"] input'),
            displayDate: this.ancestor.locator('#form-designer-date-attribute-datePicker * input'),
            dropdown: this.ancestor.locator('#set-date-format-dropdown')
        };

        this.timeElements = {
            timeToggle: this.ancestor.locator('[toggleid="form-designer-time-toggle"]'),
            instructions: this.ancestor.locator('#form-designer-time-attribute-subtext-text * input'),
            requiredCheckbox: this.ancestor.locator('#form-designer-time-mandatory-text'),
            useCurrentTime: this.ancestor.locator('[checkboxid="form-designer-time-picker-current-date"]'),
            startTime: this.ancestor.locator('#form-designer-date-attribute-timePicker * input')
        };
    }

    async getDateToggle(): Promise<Locator> {
        const elem = this.dateElements.dateToggle;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async clickDateToggle(): Promise<any> {
        return (await this.getDateToggle()).click() as Promise<any>;
    }

    async getInstructionsTextBoxDate(): Promise<Locator> {
        const elem = this.dateElements.instructions;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async enterInstructionsDate(text): Promise<any> {
        return (await this.getInstructionsTextBoxDate()).sendKeys(text) as Promise<any>;
    }

    async getUseCurrentDateCheckbox(): Promise<Locator> {
        const elem = this.dateElements.useCurrentDate;
        await expect(this.page.locator(elem).waitFor({state:'attached',timeout:10000}));
        return elem;
    }

    async clickUseCurrentDateCheckbox(): Promise<any> {
        return await this.page.evaluate('arguments[0].click();', (await this.getUseCurrentDateCheckbox())) as Promise<any>;

    }

    async getRequiredDateCheckbox(): Promise<Locator> {
        const elem = this.dateElements.requiredCheckbox;
        await expect(this.page.locator(elem).waitFor({state:'attached',timeout:10000}));
        return elem;
    }

    async clickRequiredDateCheckbox(): Promise<any> {
        return await this.page.evaluate('arguments[0].click();', (await this.getRequiredDateCheckbox())) as Promise<any>;
    }

    async getDisplayDate(): Promise<Locator> {
        const elem = this.dateElements.displayDate;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async enterDisplayDate(text): Promise<any> {
        await (await this.getDisplayDate()).clear();
        return (await this.getDisplayDate()).sendKeys(text) as Promise<any>;
    }

    async getTimeToggle(): Promise<Locator> {
        const elem = this.timeElements.timeToggle;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async clickTimeToggle(): Promise<any> {
        return (await this.getTimeToggle()).click() as Promise<any>;
    }

    async getInstructionsTextBoxTime(): Promise<Locator> {
        const elem = this.timeElements.instructions;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async enterInstructionsTime(text): Promise<any> {
        return (await this.getInstructionsTextBoxTime()).sendKeys(text) as Promise<any>;
    }

    async getUseCurrentTimeCheckbox(): Promise<Locator> {
        const elem = this.timeElements.useCurrentTime;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async clickUseCurrentTimeCheckbox(): Promise<any> {
        return (await this.getUseCurrentTimeCheckbox()).click() as Promise<any>;
    }

    async getRequiredTimeCheckbox(): Promise<Locator> {
        const elem = this.timeElements.requiredCheckbox;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async clickRequiredTimeCheckbox(): Promise<any> {
        return (await this.getRequiredTimeCheckbox()).click() as Promise<any>;
    }

    async getStartTime(): Promise<Locator> {
        const elem = this.timeElements.startTime;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async enterStart(text): Promise<any> {
        await (await this.getStartTime()).clear();
        return (await this.getStartTime()).sendKeys(text) as Promise<any>;
    }

    async setDateFormatFromDropdown(labelToSelect): Promise<any> {
        await this.dateElements.dropdown.click();
        let setQuestionsDropdownPO = new SingleselectDropdownPO(this.dateElements.dropdown);
        return setQuestionsDropdownPO.selectItem(labelToSelect);
    }
}