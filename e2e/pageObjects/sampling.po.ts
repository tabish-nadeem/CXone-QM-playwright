import { Page } from '@playwright/test';
import { CheckboxPO } from 'cxone-components/checkbox.po';
import { SingleselectDropdownPO } from './singleselect-dropdown.po';
import { Utils } from './../common/utils';

export class SamplingPO {
    public interactionsPerAgentDropdown: SingleselectDropdownPO;
    public interactionsFromLastDaysDropdown: SingleselectDropdownPO;
    readonly page:Page;
    public includeInteractionsFromLastCheckbox: CheckboxPO;

    public constructor() {
        this.page = this.page.locator(('.sampling-container'));
        this.interactionsPerAgentDropdown = new SingleselectDropdownPO('num-segments-per-agent-dropdown');
        this.interactionsFromLastDaysDropdown = new SingleselectDropdownPO('num-days-back-dropdown');
        this.includeInteractionsFromLastCheckbox = new CheckboxPO('enable-days-back-checkbox');
    }

    public async getNumberOfInteractionsPerAgent() {
        return await this.interactionsPerAgentDropdown.getPlaceholder();
    }

    public async setNumberOfInteractionsPerAgent(interactions: string) {
        await this.interactionsPerAgentDropdown.selectItemByLabelWithoutSearchBox(interactions);
    }

    public async toggleIncludeInteractionsFromLast() {
        await this.includeInteractionsFromLastCheckbox.click();
    }

    public async isIncludeInteractionsFromLastChecked() {
        await this.includeInteractionsFromLastCheckbox.isChecked();
    }

    public async isIncludeInteractionsFromLastCheckboxEnabled() {
        await this.includeInteractionsFromLastCheckbox.isEnabled();
    }

    public async isIncludeInteractionsFromLastDropdownEnabled() {
        return !(await Utils.isPresent(this.page.locator(('#num-days-back-dropdown .dropdown-button.disabled'))));
    }

    public async getIncludeInteractionsFromLastValue() {
        return await this.interactionsFromLastDaysDropdown.getPlaceholder();
    }

    public async setIncludeInteractionsFromLastValue(days: string) {
        await this.interactionsFromLastDaysDropdown.selectItemByLabelWithoutSearchBox(days);
        await this.interactionsFromLastDaysDropdown.close();
    }

    public async getErrorMessage() {
        return await Utils.getText(this.page.locator(('.error-message')));
    }

    public async isInteractionsPerAgentDropdownEnabled() {
        return !(await Utils.isPresent(this.page.locator(('#num-segments-per-agent-dropdown .dropdown-button.disabled'))));
    }

}
