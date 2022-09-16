<<<<<<< HEAD:e2e/pageObjects/OmnibarPO.ts
import { Page } from "@playwright/test";
import { Utils } from "../common/utils";
import { URLs } from '../common/pageIdentifierURLs';
import { Helpers } from "../playwright.helpers";
import { CommonUIUtils } from "cxone-playwright-test-utils";

export class OmnibarPO {
    readonly page: Page;
    readonly defaultTimeoutInMillis: number;
    readonly elements: any;

    constructor(pageElement?: Page, defaultTimeoutInMillis = 20000){
        this.defaultTimeoutInMillis = defaultTimeoutInMillis;
        this.page = pageElement || this.page.locator(`#ng2-manage-forms-page`)
        this.elements = {
            container: this.page.locator(`#ng2-manage-forms-page`),
            gridComponent: this.page.locator(`cxone-grid`),
            itemsCountLabel: this.page.locator(`<need to mention>`),
            header: this.page.locator(`#manage-forms-page-title`),
            newFormBtn: this.page.locator(`#createForm`),
            currentUserName: this.page.locator(`#simple-dropdown div.titleText`),
            publishBtn: this.page.locator(`#bulk-btn-activate`),
            unpublishBtn: this.page.locator(`#bulk-btn-deactivate`),
            bulkDeleteBtn: this.page.locator(`#bulk-btn-delete`),
            spinner: this.page.locator(`.cxonespinner .spinner.spinner-bounce-middle`),
            delPublishFormPopover: this.page.locator(`popover-container.tooltip-popover-style`),
            clickConfirmDelete: this.page.locator(`button:has-text("Yes")`),
            confirmCancelBtn: this.page.locator(`#popup-cancel`),
            row: this.page.locator(`#manage-forms-grid div.ag-center-cols-viewport div[row-index]`),
            noMatchfoundMsg: this.page.locator(`#manage-forms-grid span.no-rows-overlay-text`)
        }
    }

    async getItemCountLabel() {
        return await this.elements.itemsCountLabel.textContent();
    };

    // need to define this function
    async typeSearchQuery(formName: any) {
        // need to define
    };
}
=======
import {Page} from "@playwright/test";

export class OmnibarPO {
    page: Page;

    constructor(page: Page) {
        this.page = page
    }

    getHeaderText(): Promise<string> {
        return this.page.locator('.cxone-omnibar .header-wrapper .title-wrapper .title').textContent() as Promise<string>;
    }

    getItemCountLabel(): Promise<string> {
        return this.page.locator('.cxone-omnibar .count-wrapper .count').textContent()as Promise<string>;
    }

    getSelectedItemCountLabel(): Promise<string> {
        return this.page.locator('.cxone-omnibar .count-wrapper .selected-count').textContent() as Promise<string>;
    }

    async typeSearchQuery(searchQuery: string) {
        // await this.page.locator('.cxone-omnibar .header-wrapper .search-wrapper input[type="text"]').clear();
        // tslint:disable-next-line: max-line-length
        return this.page.locator('.cxone-omnibar .header-wrapper .search-wrapper input[type="text"]').type(searchQuery) as Promise<any>;
    }

    toggleFilter() {
        return this.page.locator('.cxone-omnibar .header-wrapper .filter-wrapper').click() as Promise<any>;
    }
}
>>>>>>> a0841378b1914d760ac30d26bc2227cc9099a671:e2e/pageObjects/omnibar.po.ts
