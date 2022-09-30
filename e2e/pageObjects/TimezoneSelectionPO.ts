import {SingleselectDropdownPO} from 'cxone-components/singleselect-dropdown.po';
import {by, element, ElementFinder} from 'protractor';
import {Utils} from '../common/utils';
import { Page, Locator } from "@playwright/test";

export class TimezoneSelectionPO {
    // public ancestor: Locator;
    readonly page:Page;
    readonly utils: Utils;
    public elements: {
        includeInteractionsFromLastCheckbox: Locator;
    };
    public timezoneSelectionDropdown: SingleselectDropdownPO;
    selector: string;

    public constructor() {
        // this.ancestor = this.page.locator('.timezone-selection-container');
        this.timezoneSelectionDropdown = new SingleselectDropdownPO('timezone-selection-dropdown');
        this.selector = 'cxone-singleselect-dropdown[id="timezone-selection-dropdown"] .cxone-singleselect-dropdown';
    }

    public async getSelectedTimezone() {
        return await this.timezoneSelectionDropdown.getPlaceholder();
    }

    public async setTimezoneValue(timezoneName: string) {
        await this.timezoneSelectionDropdown.open();
        await this.timezoneSelectionDropdown.selectItemByLabelWithoutSearchBox(timezoneName);
        await this.timezoneSelectionDropdown.close();
    }

    public async isTimezoneFieldEnabled() {
        return !(await Utils.isPresent(this.page.locator('#timezone-selection-dropdown .dropdown-button.disabled')));
    }

    public async isTimezoneDropdownPresent() {
        return (await Utils.isPresent(this.page.locator('#timezone-selection-dropdown')));
    }

}
