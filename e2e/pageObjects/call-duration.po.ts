import { by, element, ElementFinder } from 'protractor';
import { CheckboxPO } from 'cxone-components/checkbox.po';
import { SingleselectDropdownPO } from 'cxone-components/singleselect-dropdown.po';
import { QualityPlanDetailsPO } from '../../quality-plan-details.po';
import { Utils } from '../../../../../../../tests/protractor/common/utils';

export class CallDurationPO {
    public ancestor: ElementFinder;
    public elements: {
        lowerInput: ElementFinder;
        upperInput: ElementFinder;
    }
    public filterCheckbox: CheckboxPO;
    public operationDropdown: SingleselectDropdownPO;
    public qualityPlanDetailsPO: QualityPlanDetailsPO;

    public constructor() {
        this.qualityPlanDetailsPO = new QualityPlanDetailsPO();
        this.ancestor = element(by.css('.qp-call-duration-filter'));
        this.filterCheckbox = new CheckboxPO('call-duration-checkbox');
        this.operationDropdown = new SingleselectDropdownPO('operation-dropdown');
        this.elements = {
            lowerInput: this.ancestor.element(by.css('#duration-input-lower-value input')),
            upperInput: this.ancestor.element(by.css('#duration-input-upper-value input'))
        };
    }

    public async isFilterEnabled() {
        return await this.filterCheckbox.isEnabled();
    }

    public async isOperationDropdownEnabled() {
        return !(await Utils.isPresent(this.ancestor.element(by.css('#operation-dropdown .dropdown-button.disabled'))));
    }

    public async isFilterChecked() {
        return await this.filterCheckbox.isChecked();
    }

    public async toggleFilter() {
        return await this.filterCheckbox.click();
    }

    public async getSelectedOperation () {
        return this.operationDropdown.getPlaceholder();
    }

    public async selectOperation(operation: string) {
        await this.operationDropdown.selectItemByLabelWithoutSearchBox(operation);
    }

    public async getFirstCallDurationValue() {
        return await this.elements.lowerInput.getAttribute('value');
    }

    public async getSecondCallDurationValue() {
        return await this.elements.upperInput.getAttribute('value');
    }

    public async setFirstCallDurationValue(value: string) {
        await this.elements.lowerInput.clear();
        await this.elements.lowerInput.sendKeys(value);
        await Utils.click(this.qualityPlanDetailsPO.getPlanNamePageTitleElement());
    }

    public async setSecondCallDurationValue(value: string) {
        await this.elements.upperInput.clear();
        await this.elements.upperInput.sendKeys(value);
        await Utils.click(this.qualityPlanDetailsPO.getPlanNamePageTitleElement());
    }

    public async getErrorText() {
        return await Utils.getText(this.ancestor.element(by.css('.error-message')));
    }

}
