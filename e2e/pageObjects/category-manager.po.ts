import { Page, Locator } from "@playwright/test";
import { CommonUIUtils } from "cxone-playwright-test-utils";
import { UIConstants } from "../common/uiConstants"
import { URLs } from "../common/pageIdentifierURLs"
import { Utils } from "../common/utils";

export class CategoryManagerPO {
    
    readonly page: Page;
    readonly elements: any;
    readonly utils: Utils;
    readonly uiConstants: UIConstants;

    constructor(page: Page) {
        this.page = page || this.page.locator('body');
        this.uiConstants = new UIConstants();
        this.utils = new Utils(this.page);
        this.elements = {
            body: this.page.locator('body'),
            // saveAndApplyButton: this.page.locator('div.cat-category-list__commitControls button', { hasText: 'Save & Apply' }),
            saveAndApplyButton: this.page.locator("div.cat-category-list__commitControls button : has-text('Save & Apply')"),
            cancelButton: this.page.locator('div.cat-category-list__commitControls button', { hasText: 'Cancel' }),
            searchInputField: this.page.locator('div.cat-category-list__search input'),
            editMode: {
              newCategoryNameInputField: this.page.locator('article.dirty * div.cat-category-list__catTitle input'),
              newCategoryRulesInputField: this.page.locator('article.dirty div.cat-category-list__rules * input'),
              deleteButtonEditMode: this.page.locator('article.dirty div.cat-category-list__controls * i.icon-delete'),
              confirmDeleteButtonEditMode: this.page.locator('article.dirty div.cat-category-list__confirmDelete__controls button', { hasText: 'Yes' }),
              loadingState: this.page.locator('.cat-category-list__loading>div', { hasText: 'Loading...' })
            },
        
            getCategory: (name: any, isFolder: any) => {
              const article = this.page.locator('//article[contains(@class, "cat-category-list__article")]//span[text()="' + name + '"]/../../..');
              if (!isFolder) {
                return {
                  icon: article.locator('i.glyphicon glyphicon-certificate'),
                  title: article.locator('div.cat-category-list__catTitle span'),
                  rules: article.locator('div.cat-category-list__rule'),
                  editButton: article.locator('i.icon-edit'),
                  deleteButton: article.locator('i.icon-delete'),
                  confirmDeleteButton: article.locator('div.cat-category-list__confirmDelete__controls button', { hasText: 'Yes' })
                };
              } else {
                return {
                  icon: article.locator('i.glyphicon glyphicon-certificate'),
                  title: article.locator('div.cat-category-list__catTitle span'),
                  rules: article.locator('div.cat-category-list__rule'),
                  editButton: article.locator('i.icon-edit'),
                  deleteButton: article.locator('i.icon-delete'),
                  confirmDeleteButton: article.locator('div.cat-category-list__confirmDelete__controls button', { hasText: 'Yes' }),
                  addSubCategoryButton: article.locator('i.icon-Sub_category'),
                  addNewFolderButton: article.locator('i.icon-new-folder')
                };
              }
            }
          };
    }

    getCategory(categoryName: any) {
    return this.elements.getCategory(categoryName, false);
    }

    getCategoryFolder(folderName: any) {
    return this.elements.getCategory(folderName, true);
    }

    getSearchInputField() {
        return this.elements.searchInputField;
    }

    isElementVisible (elem : any) {
        return elem.isPresent().then((isPresent: any) => {
            if (isPresent) {
                return elem.isDisplayed();
            }
            else {
                return false;
            }
        }).then((isDisplayed: any) => {
            return isDisplayed;
        });
    }

    async addCustomCategory(customCategoryName: any, rules: any, folderElement: any): Promise<any> {
        await folderElement.addSubCategoryButton.click();
        await this.elements.editMode.newCategoryNameInputField.clear();
        await this.elements.editMode.newCategoryNameInputField.type(customCategoryName);
        for (let i = 0; i < rules.length; i++) {
            await this.elements.editMode.newCategoryRulesInputField.type(rules[i]);
            await this.elements.searchInputField.click();
        }
        await this.elements.saveAndApplyButton.click();
        // return await browser.sleep(1000);
        await this.utils.delay(1000)
    }

    async updateCustomCategory( newCategoryName: any, newRules: any, categoryElement: any): Promise<any> {
    await categoryElement.editButton.click();
    await this.elements.editMode.newCategoryNameInputField.clear();
    await this.elements.editMode.newCategoryNameInputField.type(
        newCategoryName
    );
    return await this.elements.saveAndApplyButton.click();
    }

    async updateCustomCategoryFolder(newFolderName: any, folderElement: any): Promise<any> {
    await folderElement.editButton.click();
    await this.elements.editMode.newCategoryNameInputField.clear();
    await this.elements.editMode.newCategoryNameInputField.type(
        newFolderName
    );
    return await this.elements.saveAndApplyButton.click();
    }

    async addCustomFolder(customFolderName: any, folderElement: any): Promise<any> {
    await folderElement.addNewFolderButton.click();
    await this.elements.editMode.newCategoryNameInputField.clear();
    await this.elements.editMode.newCategoryNameInputField.type(
        customFolderName
    );
    return await this.elements.saveAndApplyButton.click();
    }

    async deleteCustomCategory(customCategory: any): Promise<any> {
    await customCategory.deleteButton.click();
    return await customCategory.confirmDeleteButton.click();
    }

    async selectMultipleCategories(categoryNames: string[]) {
    for (let i = 0; i < categoryNames.length; i++) {
        await this.getSearchInputField().type(categoryNames[i]);
    //   await browser.sleep(1000);
        await this.utils.delay(1000);
        await this.page.locator('.cat-category-list__catTitle span', categoryNames[i]);
        const categoryRow = this.page.locator(`//article[contains(@class, "cat-category-list__article")]//span[text()="${categoryNames[i]}"]/../../..`);
        const categoryId = await categoryRow.getAttribute('categoryId');
        await this.page.locator(`#inlineCheckbox${categoryId} ~ label`).click();
        await this.getSearchInputField().clear();
    //   await browser.sleep(1000);
        await this.utils.delay(1000);
    }
    }

    async navigate() {
        let baseUrl = this.uiConstants.URLS.LOCALHOST
        await this.page.goto(baseUrl + URLs.qualityManagement.categoryManager);
        await this.page.waitForURL('**\/#/categoryManager');
        await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        await this.page.waitForSelector(`.nice-cat-category-list`);
    }
}