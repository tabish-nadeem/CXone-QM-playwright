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
