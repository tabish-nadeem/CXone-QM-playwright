import { browser, by, element, ElementFinder } from 'protractor';
import { CheckboxPO } from 'cxone-components/checkbox.po';
import { SingleselectDropdownPO } from 'cxone-components/singleselect-dropdown.po';
import { Utils } from '../../../../../../../tests/protractor/common/utils';
import { CategoryManagerPO } from 'cxone-qm-library/category-manager.po';

export class CategoriesPO {
    public ancestor: ElementFinder;
    public highConfidenceCheckbox: CheckboxPO;
    public operationDropdown: SingleselectDropdownPO;
    public categoryManagerPO: CategoryManagerPO;

    public constructor() {
        this.ancestor = element(by.css('.categories-filter'));
        this.highConfidenceCheckbox = new CheckboxPO('enable-duration-checkbox');
        this.operationDropdown = new SingleselectDropdownPO('operation-dropdown');
        this.categoryManagerPO = new CategoryManagerPO(element(by.css('.category-list-modal-wrapper')));
    }

    public async isFilterPresent() {
        return await Utils.isPresent(this.ancestor);
    }

    public async clearFilter() {
        return await Utils.click(this.ancestor.element(by.css('button.filter-clear-btn')));
    }

    public async isHighConfidenceChecked() {
        return await this.highConfidenceCheckbox.isChecked();
    }

    public async toggleHighConfidence() {
        return await this.highConfidenceCheckbox.click();
    }

    public async getTotalSelectedCategories() {
        return await Utils.getText(this.ancestor.element(by.css('.header-row span')));
    }

    public async openCategoryModal() {
        await Utils.click(this.ancestor.element(by.id('add-categories-btn')));
        await Utils.waitUntilVisible(element(by.css('.category-list-modal-wrapper')));
        await browser.sleep(2000);
    }

    public async deleteCategory(categoryLabel: string) {
        const categoryRow = this.ancestor.element(by.cssContainingText('.category-item', categoryLabel));
        const deleteIcon = categoryRow.element(by.id('categories-remove-btn'));
        await Utils.click(deleteIcon);
    }

    public async selectCategories(categoryNames: string[]) {
        await this.categoryManagerPO.selectMultipleCategories(categoryNames);
    }

    public async submitAndCloseModal() {
        await Utils.click(element(by.css('.category-list-modal-wrapper .modal-footer-wrapper button.save-btn')));
    }

    public async dismissModal() {
        await Utils.click(element(by.css('.category-list-modal-wrapper .modal-footer-wrapper button.cancel-btn')));
        if (await Utils.isPresent(element(by.id('exit-yes-btn')))) {
            await Utils.click(element(by.id('exit-yes-btn')));
        }
        await Utils.waitUntilInvisible(element(by.css('.category-list-modal-wrapper')));
        await browser.sleep(2000);
    }

}
