import { Page, Locator } from "@playwright/test";
import { CheckboxPO } from 'cxone-components/checkbox.po';
import { SingleselectDropdownPO } from 'cxone-components/singleselect-dropdown.po';
import { Utils } from '../common/utils';
import { CategoryManagerPO } from 'cxone-qm-library/category-manager.po';
import { SENTIMENT_TYPE } from '../../quality-plan-models';

export class SentimentsPO {
    public ancestor: Locator;
    readonly page:Page;
    readonly utils: Utils;
    public highConfidenceCheckbox: CheckboxPO;
    public operationDropdown: SingleselectDropdownPO;
    public categoryManagerPO: CategoryManagerPO;

    public constructor() {
        this.ancestor = this.page.locator('.sentiment-filter');
        this.highConfidenceCheckbox = new CheckboxPO('enable-duration-checkbox');
        this.operationDropdown = new SingleselectDropdownPO('operation-dropdown');
        this.categoryManagerPO = new CategoryManagerPO(this.page.locator('.category-list-modal-wrapper'));
    }

    public async isFilterPresent() {
        return await Utils.isPresent(this.ancestor);
    }

    public async clearFilter() {
        return await this.utils.click(this.page.locator('button.filter-clear-btn'));
    }

    public async selectSentiment(sentimentType: string, sideSelectorLabel: string) {
        const sentimentCode = sentimentType.substr(0, 3);
        const checkboxEl = new CheckboxPO(`checkbox-sentiment-${sentimentType.toLowerCase()}`);
        const sideSelectorDropdown = new SingleselectDropdownPO(`side-select-${sentimentCode.toUpperCase()}`);
        await checkboxEl.click();
        await this.page.waitForSelector(this.page.locator(sideSelectorDropdown.selector));
        await this.utils.delay(2000);
        await sideSelectorDropdown.selectItemByLabelWithoutSearchBox(sideSelectorLabel);
        await this.utils.delay(2000);
    }

    public async getSelectedSentimentState() {
        const output = {};
        const sentimentTypes = [SENTIMENT_TYPE.POSITIVE, SENTIMENT_TYPE.NEGATIVE, SENTIMENT_TYPE.NEUTRAL, SENTIMENT_TYPE.MIXED];
        for (let i = 0; i < sentimentTypes.length; i++) {
            const sentimentCode = sentimentTypes[i].substr(0, 3);
            const checkboxEl = new CheckboxPO(`checkbox-sentiment-${sentimentTypes[i].toLowerCase()}`);
            const sideSelectorDropdown = new SingleselectDropdownPO(`side-select-${sentimentCode.toUpperCase()}`);
            const isSentimentSelected = await checkboxEl.isChecked();
            output[sentimentTypes[i]] = {
                selected: isSentimentSelected,
                sideSelector: isSentimentSelected ? await sideSelectorDropdown.getPlaceholder() : undefined,
                enabled: await checkboxEl.isEnabled()
            };
        }
        return output;
    }

}
