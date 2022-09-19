import {expect, Locator, Page} from "@playwright/test";
import { SingleselectDropdownPO } from "./singleselect-dropdown.po";

export class DateTimePropertiesComponentPo {
    readonly page: Page;
    readonly dateToggle: Locator;
    readonly instructions: Locator;
    readonly requiredCheckbox: Locator;
    readonly useCurrentDate: Locator;
    readonly displayDate: Locator;
    readonly dropdown: Locator;
    readonly timeToggle: Locator;
    readonly dateInstructions: Locator;
    readonly dateRequiredCheckbox: Locator;
    readonly timeInstructions: Locator;
    readonly timeRequiredCheckbox: Locator;
    readonly useCurrentTime: Locator;
    readonly startTime: Locator;

    constructor(page: Page ) {
        this.page = page
        this.dateToggle = this.page.locator('#form-designer-date-toggle');
        this.dateInstructions = this.page.locator('#form-designer-date-attribute-subtext-text * input');
        this.dateRequiredCheckbox = this.page.locator('[checkboxid="form-designer-date-mandatory-text"] input');
        this.useCurrentDate = this.page.locator('[checkbox-id="form-designer-date-picker-current-date"] input');
        this.displayDate = this.page.locator('#form-designer-date-attribute-datePicker * input'),
        this.dropdown = this.page.locator('#set-date-format-dropdown');
        this.timeToggle = this.page.locator('[toggleid="form-designer-time-toggle"]');
        this.timeInstructions = this.page.locator('#form-designer-time-attribute-subtext-text * input');
        this.timeRequiredCheckbox = this.page.locator('#form-designer-time-mandatory-text');
        this.useCurrentTime = this.page.locator('[checkboxid="form-designer-time-picker-current-date"]');
        this.startTime = this.page.locator('#form-designer-date-attribute-timePicker * input');
    }

    async getDateToggle(): Promise<Locator> {
        const elem = this.dateToggle;
        await expect(elem).isVisible(10000);
        return elem;
    }

    async clickDateToggle(): Promise<any> {
        return (await this.getDateToggle()).click() as Promise<any>;
    }

    async getInstructionsTextBoxDate(): Promise<Locator> {
        const elem = this.dateInstructions;
        await expect(elem).isVisible(10000);
        return elem;
    }

    async enterInstructionsDate(text: any): Promise<any> {
        return (await this.getInstructionsTextBoxDate()).type(text) as Promise<any>;
    }

    async getUseCurrentDateCheckbox(): Promise<Locator> {
        const elem = this.useCurrentDate;
        await expect(this.page.locator(elem).waitFor({state:'attached',timeout:10000}));
        return elem;
    }

    async clickUseCurrentDateCheckbox(): Promise<any> {
        return await this.page.evaluate('arguments[0].click();', (await this.getUseCurrentDateCheckbox())) as Promise<any>;

    }

    async getRequiredDateCheckbox(): Promise<Locator> {
        const elem = this.dateRequiredCheckbox;
        await expect(this.page.locator(elem).waitFor({state:'attached',timeout:10000}));
        return elem;
    }

    async clickRequiredDateCheckbox(): Promise<any> {
        return await this.page.evaluate('arguments[0].click();', (await this.getRequiredDateCheckbox())) as Promise<any>;
    }

    async getDisplayDate(): Promise<Locator> {
        const elem = this.displayDate;
        await expect(elem).isVisible(10000);
        return elem;
    }

    async enterDisplayDate(text: any): Promise<any> {
        // await (await this.getDisplayDate()).clear();
        return (await this.getDisplayDate()).type(text) as Promise<any>;
    }

    async getTimeToggle(): Promise<Locator> {
        const elem = this.timeToggle;
        await expect(elem).isVisible(10000);
        return elem;
    }

    async clickTimeToggle(): Promise<any> {
        return (await this.getTimeToggle()).click() as Promise<any>;
    }

    async getInstructionsTextBoxTime(): Promise<Locator> {
        const elem = this.timeInstructions;
        await expect(elem).isVisible(10000);
        return elem;
    }

    async enterInstructionsTime(text: any): Promise<any> {
        return (await this.getInstructionsTextBoxTime()).type(text) as Promise<any>;
    }

    async getUseCurrentTimeCheckbox(): Promise<Locator> {
        const elem = this.useCurrentTime;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async clickUseCurrentTimeCheckbox(): Promise<any> {
        return (await this.getUseCurrentTimeCheckbox()).click() as Promise<any>;
    }

    async getRequiredTimeCheckbox(): Promise<Locator> {
        const elem = this.timeRequiredCheckbox;
        await expect(elem).isVisible(10000);
        return elem;
    }

    async clickRequiredTimeCheckbox(): Promise<any> {
        return (await this.getRequiredTimeCheckbox()).click() as Promise<any>;
    }

    async getStartTime(): Promise<Locator> {
        const elem = this.startTime;
        await expect(elem).isVisible(10000);
        return elem;
    }

    async enterStart(text: any): Promise<any> {
        // await (await this.getStartTime()).clear();
        return (await this.getStartTime()).type(text) as Promise<any>;
    }

    async setDateFormatFromDropdown(labelToSelect: any): Promise<any> {
        await this.dropdown.click();
        let setQuestionsDropdownPO = new SingleselectDropdownPO(this.dropdown);
        return setQuestionsDropdownPO.selectItem(labelToSelect);
    }
}