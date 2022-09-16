
import { Page, Locator } from "@playwright/test";
import { CheckboxPO } from 'cxone-components/checkbox.po'; //?
import { SingleselectDropdownPO } from './SingleselectDropdownPO';
import { Utils } from '../common/utils';
import { CategoryManagerPO } from './CategoryManagerPO';

export class CategoriesPO {
    readonly page:Page;
    readonly utils: Utils;
    public highConfidenceCheckbox: CheckboxPO;
    public operationDropdown: SingleselectDropdownPO;
    public categoryManagerPO: CategoryManagerPO;

    public constructor(page:Page) {
        this.page = page
        // this.page = this.page.locator('.categories-filter');
        this.highConfidenceCheckbox = new CheckboxPO('enable-duration-checkbox');
        this.operationDropdown = new SingleselectDropdownPO('operation-dropdown');
        this.categoryManagerPO = new CategoryManagerPO(this.page.locator('.category-list-modal-wrapper'));
    }

    public async isFilterPresent() {
        return await this.page.locator('.categories-filter');  //? check it ones 
    }

    public async clearFilter() {
        return this.page.locator('button.filter-clear-btn').click();
    }

    public async isHighConfidenceChecked() {
        return await this.highConfidenceCheckbox.isChecked();
    }

    public async toggleHighConfidence() {
        return await this.highConfidenceCheckbox.click();
    }

    public async getTotalSelectedCategories() {
        return await this.page.locator('.header-row span').textContent();
    }

    public async openCategoryModal() {
        await this.page.locator('#add-categories-btn').click();
        await this.page.waitForSelector(this.page.locator('.category-list-modal-wrapper'));
        await this.utils.delay(2000);
    }

    public async deleteCategory(categoryLabel: string) {
        const categoryRow = this.page.locator('.category-item', categoryLabel);
        const deleteIcon = categoryRow.this.page.locator('#categories-remove-btn');
        await deleteIcon.click();
    }

    public async selectCategories(categoryNames: string[]) {
        await this.categoryManagerPO.selectMultipleCategories(categoryNames);
    }

    public async submitAndCloseModal() {
        await this.page.locator('.category-list-modal-wrapper .modal-footer-wrapper button.save-btn').click();
    }

    public async dismissModal() {
        await this.page.locator('.category-list-modal-wrapper .modal-footer-wrapper button.cancel-btn').click();
        if (await this.page.locator('#exit-yes-btn').isPresent()) {
            await this.page.locator('#exit-yes-btn').click();
        }
        await this.utils.waitUntilInvisible(this.page.locator('.category-list-modal-wrapper'));
        await this.utils.delay(2000);
    }

}
