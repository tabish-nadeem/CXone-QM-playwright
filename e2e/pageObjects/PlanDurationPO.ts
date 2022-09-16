import { Page } from '@playwright/test';
import { SingleselectDropdownPO } from 'cxone-components/singleselect-dropdown.po';
import { DatePickerPO } from 'cxone-components/date-picker.po';
import { by, element, ElementFinder } from 'protractor';
import { RadioPO } from 'cxone-components/radio.po';
import { Utils } from '../common/utils';
import { QualityPlanDetailsPO } from './AualityPlanDetailsPO';

export class PlanDurationPO {
    

    public recurringTypeDropdown: SingleselectDropdownPO;
    public startDatePicker: DatePickerPO;
    public endDatePicker: DatePickerPO;
    public recurringRadio: RadioPO;
    public oneTimeRadio: RadioPO;
    public qualityPlanDetailsPO: QualityPlanDetailsPO;
    readonly page:Page

    public constructor() {
        this.page = this.page.locator(('.plan-duration-container'));
        this.recurringTypeDropdown = new SingleselectDropdownPO('recurring-dropdown');
        this.startDatePicker = new DatePickerPO(element(by.id('startDate')));
        this.endDatePicker = new DatePickerPO(element(by.id('endDate')));
        this.recurringRadio = new RadioPO('type-recurring');
        this.oneTimeRadio = new RadioPO('type-oneTime');
        this.qualityPlanDetailsPO = new QualityPlanDetailsPO();
    }

    public async isRecurringSelected() {
        return await this.recurringRadio.isChecked();
    }

    public async isOneTimeSelected() {
        return await this.oneTimeRadio.isChecked();
    }

    public async setRecurring() {
        return await this.recurringRadio.click();
    }

    public async setOneTime() {
        return await this.oneTimeRadio.click();
    }

    public async getRecurringTypeSelected() {
        return await this.recurringTypeDropdown.getPlaceholder();
    }

    public async setRecurringType(type: string) {
        await this.recurringTypeDropdown.selectItemByLabelWithoutSearchBox(type);
        await this.recurringTypeDropdown.close();
    }

    public async getStartDate() {
        return await this.startDatePicker.getDate();

    }

    public async setStartDate(date: Date) {
        await this.startDatePicker.setDate(date, 'MMM D, YYYY');
        await Utils.click(this.qualityPlanDetailsPO.getPlanNamePageTitleElement());
    }

    public async getEndDate() {
        return await this.endDatePicker.getDate();
    }

    public async setEndDate(date: Date) {
        await this.endDatePicker.setDate(date, 'MMM D, YYYY');
        await Utils.click(this.qualityPlanDetailsPO.getPlanNamePageTitleElement());
    }

    public async isStartDateEnabled() {
        return !(await Utils.isPresent(this.page.locator(('#startDate .cxone-datepicker-container.disabled'))));
    }

    public async isRecurringRadioEnabled() {
        return await this.recurringRadio.isEnabled();
    }

    public async isOneTimeRadioEnabled() {
        return await this.oneTimeRadio.isEnabled();
    }

    public async isEndDateEnabled() {
        return !(await Utils.isPresent(this.page.locator(('#endDate .cxone-datepicker-container.disabled'))));
    }

}
