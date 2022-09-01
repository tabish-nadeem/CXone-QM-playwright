import {by, element, ElementFinder} from 'protractor';
import {CheckboxPO} from 'cxone-components/checkbox.po';
import {Utils} from '../../../../../../../tests/protractor/common/utils';

export class FeedbackFilterPo {
    public ancestor: ElementFinder;

    public constructor(ancestor?: ElementFinder) {
        this.ancestor = ancestor || element(by.css('.csat-score-filter'));
    }

    public async toggleFeedbackCheckBox(label: string) {
        const feedbackCheckBox = new CheckboxPO(label);
        await feedbackCheckBox.click();
    }

    public async isFeedbackCheckBoxSelected(label: string) {
        const feedbackCheckBox = new CheckboxPO(label);
        return await feedbackCheckBox.isChecked();
    }

    public async moveFeedBackRangeSlider(pointer, pixelsToMove) {
        const handle = this.ancestor.element(by.css(pointer));
        await Utils.moveSlider(handle, pixelsToMove);
    }

    public async getMinValueScore(selector) {
        const handle = this.ancestor.element(by.css(`${selector} nouislider .noUi-handle.noUi-handle-lower .noUi-tooltip`));
        return await Utils.getText(handle);
    }

    public async getMaxValueScore(selector) {
        const handle = this.ancestor.element(by.css(`${selector} nouislider .noUi-handle.noUi-handle-upper .noUi-tooltip`));
        return await Utils.getText(handle);
    }

    public async getRangeText() {
        const handle = this.ancestor.element(by.css('.range-text'));
        return await Utils.getText(handle);
    }

}
