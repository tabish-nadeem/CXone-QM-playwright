import { Page, Locator } from "@playwright/test";
import { CheckboxPO } from 'cxone-components/checkbox.po'; //? NEED TO ASK
import { SingleselectDropdownPO } from './SingleselectDropdownPO';
import { QualityPlanDetailsPO } from './QualityPlanDetailsPO';
import { Utils } from '../common/utils';

export class CallDurationPO {
  
    readonly page:Page;
    readonly utils: Utils;
    readonly  lowerInput: Locator;
    readonly  upperInput: Locator;
    public filterCheckbox: CheckboxPO;
    public operationDropdown: SingleselectDropdownPO;
    public qualityPlanDetailsPO: QualityPlanDetailsPO;

    public constructor(page:Page) {
        this.qualityPlanDetailsPO = new QualityPlanDetailsPO();
        this.page = page
        // this.page = this.page.locator('.qp-call-duration-filter');
        this.filterCheckbox = new CheckboxPO('call-duration-checkbox'); //? NEED TO ASK
        this.operationDropdown = new SingleselectDropdownPO('operation-dropdown');
        this.lowerInput =this.page.locator('#duration-input-lower-value input'),
        this.upperInput= this.page.locator('#duration-input-upper-value input')
       
    }

    public async isFilterEnabled() {
        // return await this.filterCheckbox.isEnabled();
        return await this.page.isEnabled('call-duration-checkbox')
    }

    public async isOperationDropdownEnabled() {
        return !(await this.page.locator('#operation-dropdown .dropdown-button.disabled')).isPresent();
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
        return await this.lowerInput.getAttribute('value');
    }

    public async getSecondCallDurationValue() {
        return await this.upperInput.getAttribute('value');
    }

    public async setFirstCallDurationValue(value: string) {
        // await this.lowerInput.clear();
        await this.lowerInput.sendKeys(value);
        await this.qualityPlanDetailsPO.getPlanNamePageTitleElement().click();
    }

    public async setSecondCallDurationValue(value: string) {
        // await this.upperInput.clear();
        await this.upperInput.type(value);
        await this.qualityPlanDetailsPO.getPlanNamePageTitleElement().click();
    }

    public async getErrorText() {
        return await this.page.locator('.error-message').textContent();
    }

}
