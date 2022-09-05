import { CheckboxPO } from 'cxone-components/checkbox.po';
import { SingleselectDropdownPO } from 'cxone-components/singleselect-dropdown.po';
import { by, element, ElementFinder } from 'protractor';
import { Utils } from './../common/utils';

export class SamplingPO {
    public ancestor: ElementFinder;
    public interactionsPerAgentDropdown: SingleselectDropdownPO;
    public interactionsFromLastDaysDropdown: SingleselectDropdownPO;
    public includeInteractionsFromLastCheckbox: CheckboxPO;

    public constructor() {
        this.ancestor = element(by.css('.sampling-container'));
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
        return !(await Utils.isPresent(this.ancestor.element(by.css('#num-days-back-dropdown .dropdown-button.disabled'))));
    }

    public async getIncludeInteractionsFromLastValue() {
        return await this.interactionsFromLastDaysDropdown.getPlaceholder();
    }

    public async setIncludeInteractionsFromLastValue(days: string) {
        await this.interactionsFromLastDaysDropdown.selectItemByLabelWithoutSearchBox(days);
        await this.interactionsFromLastDaysDropdown.close();
    }

    public async getErrorMessage() {
        return await Utils.getText(this.ancestor.element(by.css('.error-message')));
    }

    public async isInteractionsPerAgentDropdownEnabled() {
        return !(await Utils.isPresent(this.ancestor.element(by.css('#num-segments-per-agent-dropdown .dropdown-button.disabled'))));
    }

}
