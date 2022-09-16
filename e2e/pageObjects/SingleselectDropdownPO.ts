/* eslint-disable */
import { Locator, Page } from "@playwright/test";

export class SingleselectDropdownPO {
<<<<<<< HEAD:e2e/pageObjects/SingleselectDropdownPO.ts
    pageByLabelWithoutSearchBox(label: string) {
        throw new Error("Method not implemented.");
    }
    public readonly page:Page;
    anscestor: Locator;
=======
    readonly page:Page;
    // anscestor: Locator;
>>>>>>> a0841378b1914d760ac30d26bc2227cc9099a671:e2e/pageObjects/singleselect-dropdown.po.ts

    constructor(page?: Page) {
        this.page = page;
        // if (!this.dropdownElement) {
        //     this.anscestor = this.page.locator('cxone-singleselect-dropdown .cxone-singleselect-dropdown'));
        // } else {
        //     this.anscestor = dropdownElement;
        // }
    }

    toggle() {
        return this.page.locator('.dropdown-button').click() as Promise<any>;
        //return $(this.selector + ' .dropdown-button').click() as Promise<any>;
    }

    getPlaceholder() {
        return this.page.locator('.button-text').click() as Promise<any>;
        //return $(this.selector + ' .button-text').textContent() as Promise<string>;
    }

    async isOpen() {
        return this.page.locator('.icon-carat.dropdown-open').click() as Promise<any>;
        //return await $(this.selector + ' .icon-carat.dropdown-open').isPresent();
    }

    async open() {
        const isOpen = await this.isOpen();
        if (!isOpen) {
            return await this.toggle();
        } else {
            return;
        }
    }

    close() {
        return this.isOpen().then(isOpen => {
            if (isOpen) {
                return this.toggle();
            } else {
                return;
            }
        });
    }

    async hasScrollSideBarToClick(elem) {
        let webElem = await elem.getWebElement();
        await this.page.evaluate('arguments[0].scrollIntoView()', webElem); // if no scrollbar this just stays
        //FIXME:
        await ExpectedConditions.elementToBeClickable(elem);
        await elem.click();
    }

    async selectItemByLabelWithoutSearchBox(label: string) {
        await this.open();
        let elems = await this.page.locator(`.options-wrapper .item-row >> text = ${label}`);
        await this.hasScrollSideBarToClick(elems[0]);
    }

    async selectItem(itemLabel: string) {
        //FIXME:
        await browser.wait(async () => {
<<<<<<< HEAD
            return await this.page.locator('.item-row').isVisible();
            //return await $(this.selector + ' .item-row').isDisplayed();
=======
            return await this.anscestor.element('.item-row').isDisplayed();
>>>>>>> 5a0b6e045481adf24ea28f2bd6f46488873f795d
        });
        await this.searchItem(itemLabel);

        //FIXME:
        await browser.wait(async () => {
            return await this.page.locator('.item-row').textContent() === itemLabel;
            //return await $(this.selector + ' .item-row').textContent() === itemLabel;
        });
        return await this.page.locator('.options-wrapper .item-row').click();
        //return $(this.selector + ' .options-wrapper .item-row').click();
    }

    async searchItem(query) {
        await this.page.locator('.search-wrapper .cxone-text-input input[type="text"]').clear();
        //await $(this.selector + ' .search-wrapper .cxone-text-input input[type="text"]').clear();
        return await this.page.locator('.search-wrapper .cxone-text-input input[type="text"]').sendKeys(query);
        //await $(this.selector + ' .search-wrapper .cxone-text-input input[type="text"]').sendKeys(query);
    }

    getTotalRecordCount() {
        return this.page.locator('.count-display .total-count').textContent() as Promise<any>;
        //return $(this.selector + ' .count-display .total-count').textContent() as Promise<any>;
    }

    isDisabledSet() {
        return this.page.locator('.dropdown-button.disabled').isPresent() as Promise<any>;
        //return $(this.selector + '.dropdown-button.disabled').isPresent() as Promise<any>;
    }

    isRequiredSet() {
        return this.page.locator('.dropdown-button.required').isPresent() as Promise<any>;
        //return $(this.selector + '.dropdown-button.required').isPresent() as Promise<any>;
    }

    clearSearchQuery() {
        return this.page.locator('.search-wrapper i.icon-close').click() as Promise<any>;
        //return $(this.selector + ' .search-wrapper i.icon-close').click() as Promise<any>;
    }

}
