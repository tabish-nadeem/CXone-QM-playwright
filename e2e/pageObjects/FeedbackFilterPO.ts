import { Page, Locator } from "@playwright/test";
import {CheckboxPO} from 'cxone-components/checkbox.po';
import {Utils} from '../common/utils';

export class FeedbackFilterPo {
    
    readonly page:Page;
    readonly utils: Utils;


    public constructor(page:Page) {
        this.page = page
        // ancestor || this.page.locator('.csat-score-filter');
    }

    public async toggleFeedbackCheckBox(label: string) {
        const feedbackCheckBox = new CheckboxPO(label);
        await feedbackCheckBox.click();
    }

    public async isFeedbackCheckBoxSelected(label: string) {
        const feedbackCheckBox = new CheckboxPO(label);
        return await feedbackCheckBox.isChecked();
    }

    public async moveFeedBackRangeSlider(pointer: string, pixelsToMove: number) {
        const handle = this.page.locator(pointer);
        await Utils.moveSlider(handle, pixelsToMove);
    }

    public async getMinValueScore(selector: string) {
        const handle = this.page.locator(`${selector} nouislider .noUi-handle.noUi-handle-lower .noUi-tooltip`);
        return await handle.textContent();
    }

    public async getMaxValueScore(selector: string) {
        const handle = this.page.locator(`${selector} nouislider .noUi-handle.noUi-handle-upper .noUi-tooltip`);
        return await handle.textContent();
    }

    public async getRangeText() {
        const handle = this.page.locator('.range-text');
        return await handle.textContent();
    }

}
