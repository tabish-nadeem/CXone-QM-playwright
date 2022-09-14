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