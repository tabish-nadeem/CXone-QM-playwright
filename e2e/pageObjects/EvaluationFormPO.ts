import { SingleselectDropdownPO } from './SingleselectDropdownPO';
import { Page, Locator } from "@playwright/test";
import { Utils } from '../common/utils';

export class EvaluationFormPO {
    readonly page:Page;
    readonly utils: Utils;
    
    public includeInteractionsFromLastCheckbox: Locator;

    public evaluationFormDropdown: SingleselectDropdownPO;

    public constructor() {
        this.page = this.page.locator('.evaluation-form-container');
       
        this.includeInteractionsFromLastCheckbox = this.page.locator('#enable-days-back-checkbox')
       
        this.evaluationFormDropdown = new SingleselectDropdownPO('evaluation-form-dropdown');
    }

    public async getEvaluationFormSelected() {
        return await this.evaluationFormDropdown.getPlaceholder();
    }

    public async setEvaluationForm(formName: string) {
        await this.evaluationFormDropdown.open();
        await this.evaluationFormDropdown.selectItemByLabelWithoutSearchBox(formName);
        await this.evaluationFormDropdown.close();
    }

    public async isEnabled() {
        return !(await this.page.locator('#evaluation-form-dropdown .dropdown-button.disabled')).isPresent();
    }

}
