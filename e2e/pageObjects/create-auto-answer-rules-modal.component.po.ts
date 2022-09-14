import { Page, locator,expect } from "@playwright/test";
import {SpinnerPO} from 'cxone-components/spinner.po';
import {MultiSelectDropdownPo} from './multiselectDropdown.po';
import {SelectedTagsPO} from 'cxone-components/selected-tags.po';
import {SingleselectDropdownPO} from './singleselect-dropdown.po';
let browser: any;
let page: Page;
export class CreateAutoAnswerRulesPO {
    public categorySelectionDropdown: MultiSelectDropdownPo;
    readonly page:Page;
    public selectedTags: SelectedTagsPO;
    public singleSelectDropDown: SingleselectDropdownPO

    elements = {
        modalWrapper: page.locator (('.create-edit-rule-modal-wrapper * .cxone-modal-wrapper')),
        modalTitle: page.locator(('headerTitle')),
        saveBtn: page.locator(('.save-btn')),
        cancelBtn: page.locator(('.cancel-btn')),
        ruleContainers: page.locator(('.rule-div')),
        autoAnswerPresent: page.locator(('.auto-answer-active')),
        categoryRuleType: page.locator(('.cxone-radio input[value=\'category\']')),
        sentimentRuleType: page.locator(('.cxone-radio input[value=\'sentiment\']')),
        behaviourRuleType: page.locator(('.cxone-radio input[value=\'behavior\']')),
        errorMessage: page.locator(('.embedded-messages-text')),
        yesBtn: page.locator(('#exit-yes-btn')),
        noBtn: page.locator(('#close-popover')),
        ruleTypeChangeWarningPopup: page.locator(('.popover.tooltip-popover-style .popover-content')).textContent(),
        ruleTypeCancelBtn: page.locator(('#cancel-ruletype-btn')),
        ruleTypeChangeBtn: page.locator(('#change-ruletype-btn'))
    };
    Page: any;

    async waitForSpinnerToDisappear(timeToWait?: number) {
        if (!timeToWait) {
            timeToWait = 60000;
        }
     //    const spinner = new SpinnerPO('.apphttpSpinner .cxonespinner');
     //    return await spinner.waitForSpinnerToBeHidden(false, timeToWait);
    }

    public async selectLanguage(label: string,btnLabel: string) {
        let elems = [];
        if (await this.page.locator(('#cxone-dropdown-language')).isPresent()) {
            let languageDropdown = new SingleselectDropdownPO('cxone-dropdown-language');
            await languageDropdown.open();
            elems = await this.page.locator(('cxone-singleselect-dropdown[id="cxone-dropdown-language"] .cxone-singleselect-dropdown' + ' .options-wrapper .item-row')).textContent();
            if (elems.length > 0) {
                await languageDropdown.selectItemByLabelWithoutSearchBox(label);
                if (await this.page.locator(('.tooltip-popover-style'))) {
                    if (btnLabel.toLocaleLowerCase() === 'yes') {
                    await this.elements.yesBtn.click();
                    }
                    else {
                        await this.elements.noBtn.click();
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
            await this.waitForSpinnerToDisappear();
        }
        await this.categorySelectionDropdown.close();
    }

    public async removeSelectedCategoriesTag(categoryNames: string[], index: number) {
        let ancestor = this.page.locator(('#selected-categories_' + index));
        this.selectedTags = new SelectedTagsPO(ancestor);
        for (let i = 0; i < categoryNames.length; i++) {
            await this.selectedTags.removeTag(categoryNames[i]);
            await this.waitForSpinnerToDisappear();
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
        return await this.selectedTags.elements.tags.textContent();
    }

    public async getShowMoreSelectedText(index: number) {
        let ancestor = this.page.locator(('#selected-categories_' + index));
        this.selectedTags = new SelectedTagsPO(ancestor);
        this.selectedTags.elements.showMore = this.page.locator(('.cxone-more button'));
        await this.selectedTags.openShowMorePopup();
        return await this.selectedTags.elements.showMoreItemsTags.textContent();
    }

    public async isAutoAnswerPresent() {
        return await this.elements.autoAnswerPresent.isPresent();
    }

    async clickSaveBtn(): Promise<any> {
        await expect(this.elements.saveBtn).toBeVisible(10000);
        await this.elements.saveBtn.click();
        await expect(this.elements.saveBtn).toBeVisible(10000);
    }

    async clickCancelBtn(): Promise<any> {
        await expect(this.elements.cancelBtn).toBeVisible(10000);
        
        await this.elements.cancelBtn.click();

        await expect(this.elements.cancelBtn).toBeVisible(10000);
    }

    public async clickCategoryRuleType() {
     
        await expect(this.elements.categoryRuleType).toBeVisible(10000);
        await this.page.executeScript('arguments[0].click()', this.elements.categoryRuleType);
    }

    public async clickSentimentRuleType() {
        
        await expect(this.elements.sentimentRuleType).toBeVisible(10000);
        
        await this.page.executeScript('arguments[0].click()', this.elements.sentimentRuleType);
    }

    public async clickBehaviourRuleType() {
        await expect(this.elements.behaviourRuleType).toBeVisible(10000);
        await this.page.executeScript('arguments[0].click()', this.elements.behaviourRuleType);
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
                await this.elements.ruleTypeCancelBtn.click();
            } else {
                await this.elements.ruleTypeChangeBtn.click();
            }
        }
    }

    public async getRuleTypeChangeWarningPopupText() {
        return await this.elements.ruleTypeChangeWarningPopup.getText();
    }

    public async getErrorText() {
        return await this.elements.errorMessage.getText();
    }

}

