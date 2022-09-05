
import { Page, Locator } from "@playwright/test";
import { CheckboxPO } from 'cxone-components/checkbox.po';
import { SingleselectDropdownPO } from 'cxone-components/singleselect-dropdown.po';
import { Utils } from '../../../../../../../tests/protractor/common/utils';
import { CategoryManagerPO } from 'cxone-qm-library/category-manager.po';

export class CategoriesPO {
    ancestor: Locator;
    readonly page:Page;
    readonly utils: Utils;
    public highConfidenceCheckbox: CheckboxPO;
    public operationDropdown: SingleselectDropdownPO;
    public categoryManagerPO: CategoryManagerPO;

    public constructor() {
        this.ancestor = this.page.locator('.categories-filter');
        this.highConfidenceCheckbox = new CheckboxPO('enable-duration-checkbox');
        this.operationDropdown = new SingleselectDropdownPO('operation-dropdown');
        this.categoryManagerPO = new CategoryManagerPO(this.page.locator('.category-list-modal-wrapper'));
    }

    public async isFilterPresent() {
        return await Utils.isPresent(this.page.locator);
    }

    public async clearFilter() {
        return await Utils.click(this.page.locator('button.filter-clear-btn'));
    }

    public async isHighConfidenceChecked() {
        return await this.highConfidenceCheckbox.isChecked();
    }

    public async toggleHighConfidence() {
        return await this.highConfidenceCheckbox.click();
    }

    public async getTotalSelectedCategories() {
        return await this.utils.getText(this.page.locator('.header-row span'));
    }

    public async openCategoryModal() {
        await this.utils.click(this.page.locator('#add-categories-btn'));
        await this.utils.waitUntilVisible(this.page.locator('.category-list-modal-wrapper'));
        await this.utils.delay(2000);
    }

    public async deleteCategory(categoryLabel: string) {
        const categoryRow = this.page.locator('.category-item', categoryLabel);
        const deleteIcon = categoryRow.this.page.locator('#categories-remove-btn');
        await this.utils.click(deleteIcon);
    }

    public async selectCategories(categoryNames: string[]) {
        await this.categoryManagerPO.selectMultipleCategories(categoryNames);
    }

    public async submitAndCloseModal() {
        await this.utils.click(this.page.locator('.category-list-modal-wrapper .modal-footer-wrapper button.save-btn'));
    }

    public async dismissModal() {
        await this.utils.click(this.page.locator('.category-list-modal-wrapper .modal-footer-wrapper button.cancel-btn')));
        if (await this.utils.isPresent(this.page.locator('#exit-yes-btn'))) {
            await this.utils.click(this.page.locator('#exit-yes-btn'));
        }
        await this.utils.waitUntilInvisible(this.page.locator('.category-list-modal-wrapper'));
        await this.utils.delay(2000);
    }

}
