import { Page, locator, expect } from "@playwright/test";
import { SpinnerPO } from './SpinnerPO'
import { MultiSelectDropdownPo } from './MultiselectDropdownPO';
import { SelectedTagsPO } from 'cxone-components/selected-tags.po';
import { SingleselectDropdownPO } from './SingleselectDropdownPO';
import { CommonUIUtils } from "cxone-playwright-test-utils";

export class CreateAutoAnswerRulesPO {
    public categorySelectionDropdown: MultiSelectDropdownPo;
    readonly page: Page;
    public selectedTags: SelectedTagsPO;
    public singleSelectDropDown: SingleselectDropdownPO
    public modalWrapper: locator
    public modalTitle: locator
    public saveBtn: locator
    public cancelBtn: locator
    public ruleContainers: locator
    public autoAnswerPresent: locator
    public categoryRuleType: locator
    public sentimentRuleType: locator
    public behaviourRuleType: locator
    public errorMessage: locator
    public yesBtn: locator
    public noBtn: locator
    public ruleTypeChangeWarningPopup: locator
    public ruleTypeCancelBtn: locator
    public ruleTypeChangeBtn: locator
    public commonUIUtils : CommonUIUtils
    constructor(page:Page) {

           this.page = page
           this.commonUIUtils = new CommonUIUtils()
        this.modalWrapper = this.page.locator(('.create-edit-rule-modal-wrapper * .cxone-modal-wrapper')),
            this.modalTitle = this.page.locator(('headerTitle')),
            this.saveBtn = this.page.locator(('.save-btn')),
            this.cancelBtn = this.page.locator(('.cancel-btn')),
            this.ruleContainers = this.page.locator(('.rule-div')),
            this.autoAnswerPresent = this.page.locator(('.auto-answer-active')),
            this.categoryRuleType = this.page.locator(('.cxone-radio input[value=\'category\']')),
            this.sentimentRuleType = this.page.locator(('.cxone-radio input[value=\'sentiment\']')),
            this.behaviourRuleType = this.page.locator(('.cxone-radio input[value=\'behavior\']')),
            this.errorMessage = this.page.locator(('.embedded-messages-text')),
            this.yesBtn = this.page.locator(('#exit-yes-btn')),
            this.noBtn = this.page.locator(('#close-popover')),
            this.ruleTypeChangeWarningPopup = this.page.locator(('.popover.tooltip-popover-style .popover-content')).textContent(),
            this.ruleTypeCancelBtn = this.page.locator(('#cancel-ruletype-btn')),
            this.ruleTypeChangeBtn = this.page.locator(('#change-ruletype-btn'))
    };
   


    // async waitForSpinnerToDisappear(timeToWait ?: number) {
    // if (!timeToWait) {
    //     timeToWait = 60000;
    // }
    //    const spinner = new SpinnerPO('.apphttpSpinner .cxonespinner');
    //    return await spinner.waitForSpinnerToBeHidden(false, timeToWait);
// }

    public async selectLanguage(label: string, btnLabel: string) {
    let elems = [];
    if (await this.page.locator(('#cxone-dropdown-language')).isPresent()) {
        let languageDropdown = new SingleselectDropdownPO('cxone-dropdown-language');
        await languageDropdown.open();
        elems = await this.page.locator(('cxone-singleselect-dropdown[id="cxone-dropdown-language"] .cxone-singleselect-dropdown' + ' .options-wrapper .item-row')).textContent();
        if (elems.length > 0) {
            // await languageDropdown.pageByLabelWithoutSearchBox(label);
            if (await this.page.locator(('.tooltip-popover-style'))) {
                if (btnLabel.toLocaleLowerCase() === 'yes') {
                    await this.yesBtn.click();
                }
                else {
                    await this.noBtn.click();
                }
            }
        }
        else {
            languageDropdown.close();
        }
    }
    return elems;
}

    public async selectCategories(categoryNames: string[], index: number) {
    this.categorySelectionDropdown = new MultiSelectDropdownPo('category-selection-dropdown_' + index);
    for (let i = 0; i < categoryNames.length; i++) {
        await this.categorySelectionDropdown.selectItem(categoryNames[i]);
        // await this.waitForSpinnerToDisappear();
        await  this.commonUIUtils.waitUntilIconLoaderDone(this.page);
    }
    await this.categorySelectionDropdown.close();
}

    public async removeSelectedCategoriesTag(categoryNames: string[], index: number) {
    let ancestor = this.page.locator(('#selected-categories_' + index));
    this.selectedTags = new SelectedTagsPO(ancestor);
    for (let i = 0; i < categoryNames.length; i++) {
        await this.selectedTags.removeTag(categoryNames[i]);
        // await this.waitForSpinnerToDisappear();
        await  this.commonUIUtils.waitUntilIconLoaderDone(this.page);
    }
}

    public async getSelectedCategories(index: number) {
    this.categorySelectionDropdown = new MultiSelectDropdownPo('category-selection-dropdown_' + index);
    await this.categorySelectionDropdown.open();
    const selection = await this.categorySelectionDropdown.getDisplayedSelection();
    await this.categorySelectionDropdown.close();
    return selection;
}

    public async getSelectedTag(index: number) {
    let ancestor = this.page.locator(('#selected-categories_' + index));
    this.selectedTags = new SelectedTagsPO(ancestor);
    return await this.selectedTags.page.tags.textContent();
}

    public async getShowMoreSelectedText(index: number) {
    let ancestor = this.page.locator(('#selected-categories_' + index));
    this.selectedTags = new SelectedTagsPO(ancestor);
    this.selectedTags.page.showMore = this.page.locator(('.cxone-more button'));
    await this.selectedTags.openShowMorePopup();
    return await this.selectedTags.page.showMoreItemsTags.textContent();
}

    public async isAutoAnswerPresent() {
    return await this.page.autoAnswerPresent.isPresent();
}

    async clickSaveBtn(): Promise < any > {
    await expect(this.page.saveBtn).isVisible(10000);
    await this.page.saveBtn.click();
    await expect(this.page.saveBtn).isVisible(10000);
}

    async clickCancelBtn(): Promise < any > {
    await expect(this.page.cancelBtn).isVisible(10000);

    await this.page.cancelBtn.click();

    await expect(this.page.cancelBtn).isVisible(10000);
}

    public async clickCategoryRuleType() {

    await expect(this.page.categoryRuleType).isVisible(10000);
    await this.page.executeScript('arguments[0].click()', this.page.categoryRuleType);
}

    public async clickSentimentRuleType() {

    await expect(this.page.sentimentRuleType).isVisible(10000);

    await this.page.executeScript('arguments[0].click()', this.page.sentimentRuleType);
}

    public async clickBehaviourRuleType() {
    await expect(this.page.behaviourRuleType).isVisible(10000);
    await this.page.executeScript('arguments[0].click()', this.page.behaviourRuleType);
}

    public async selectBehaviourOption(label: string, index: number) {
    this.singleSelectDropDown = new SingleselectDropdownPO('agent-behaviour-option-' + index);
    await this.singleSelectDropDown.open();
    await this.singleSelectDropDown.selectItemByLabelWithoutSearchBox(label);
}

    public async getSelectedBehaviorOption(index: number) {
    this.singleSelectDropDown = new SingleselectDropdownPO('agent-behaviour-option-' + index);
    return this.singleSelectDropDown.getPlaceholder();
}

    public async selectBehaviorType(typeCode: string, index: number) {
    typeCode = typeCode.concat('-').concat(index.toString());
    await expect((this.page.locator(('#agentBehaviourTypes_' + index + ' #' + typeCode)))).toBeVisible(10000);
    await this.page.executeScript('arguments[0].click();', this.page.locator(('#agentBehaviourTypes_' + index + ' #' + typeCode)));
}

    public async getSelectedBehaviorType(index: number, typeCLassName: string) {
    const type = await this.page.locator(('#agentBehaviourTypes_' + index + ' .behaviour-type-box-' + typeCLassName + '.selected'));
    return (type.getAttribute('class'));
}

    public async selectSentimentType(label: string, index: number) {
    this.singleSelectDropDown = new SingleselectDropdownPO('sentiment_type_selection_' + index);
    await this.singleSelectDropDown.selectItemByLabelWithoutSearchBox(label);
}

    public async selectSentimentSide(label: string, index: number) {
    this.singleSelectDropDown = new SingleselectDropdownPO('sentiment_side_selection_' + index);
    await this.singleSelectDropDown.selectItemByLabelWithoutSearchBox(label);
}

    public async getSelectedSentimentSide(index: number) {
    this.singleSelectDropDown = new SingleselectDropdownPO('sentiment_side_selection_' + index);
    return this.singleSelectDropDown.getPlaceholder();
}

    public async getSelectedSentimentType(index: number) {
    this.singleSelectDropDown = new SingleselectDropdownPO('sentiment_type_selection_' + index);
    return this.singleSelectDropDown.getPlaceholder();
}

    public async clickRuleTypeWarningPopupBtn(btnLabel: string) {
    if (await this.page.locator(('.popover.tooltip-popover-style'))) {
        if (btnLabel.toLocaleLowerCase() === 'cancel') {
            await this.page.ruleTypeCancelBtn.click();
        } else {
            await this.page.ruleTypeChangeBtn.click();
        }
    }
}

    public async getRuleTypeChangeWarningPopupText() {
    return await this.page.ruleTypeChangeWarningPopup.textContent();
}

    public async getErrorText() {
    return await this.page.errorMessage.textContent();
}

}

