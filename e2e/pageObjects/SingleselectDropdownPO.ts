/* eslint-disable */
import {expect, Locator, Page} from "@playwright/test";

export class SingleselectDropdownPO {
    pageByLabelWithoutSearchBox(label: string) {
        throw new Error("Method not implemented.");
    }
    public readonly page:Page;
    anscestor: Locator;

    constructor(private dropdownElement?: Locator) {
        if (!this.dropdownElement) {
            this.anscestor = this.page.locator('cxone-singleselect-dropdown .cxone-singleselect-dropdown'));
        } else {
            this.anscestor = dropdownElement;
        }
    }

    toggle() {
        return this.anscestor.locator('.dropdown-button').click() as Promise<any>;
        //return $(this.selector + ' .dropdown-button').click() as Promise<any>;
    }

    getPlaceholder() {
        return this.anscestor.locator('.button-text').click() as Promise<any>;
        //return $(this.selector + ' .button-text').getText() as Promise<string>;
    }

    async isOpen() {
        return this.anscestor.locator('.icon-carat.dropdown-open').click() as Promise<any>;
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
        let elems = await this.anscestor.locator(`.options-wrapper .item-row >> text = ${label}`);
        await this.hasScrollSideBarToClick(elems[0]);
    }

    async selectItem(itemLabel: string) {
        //FIXME:
        await browser.wait(async () => {
            return await this.anscestor.element('.item-row').isDisplayed();
        });
        await this.searchItem(itemLabel);

        //FIXME:
        await browser.wait(async () => {
            return await this.anscestor.element('.item-row').getText() === itemLabel;
            //return await $(this.selector + ' .item-row').getText() === itemLabel;
        });
        return await this.anscestor.element('.options-wrapper .item-row').click();
        //return $(this.selector + ' .options-wrapper .item-row').click();
    }

    async searchItem(query) {
        await this.anscestor.element('.search-wrapper .cxone-text-input input[type="text"]').clear();
        //await $(this.selector + ' .search-wrapper .cxone-text-input input[type="text"]').clear();
        return await this.anscestor.element('.search-wrapper .cxone-text-input input[type="text"]').sendKeys(query);
        //await $(this.selector + ' .search-wrapper .cxone-text-input input[type="text"]').sendKeys(query);
    }

    getTotalRecordCount() {
        return this.anscestor.element('.count-display .total-count').getText() as Promise<any>;
        //return $(this.selector + ' .count-display .total-count').getText() as Promise<any>;
    }

    isDisabledSet() {
        return this.anscestor.element('.dropdown-button.disabled').isPresent() as Promise<any>;
        //return $(this.selector + '.dropdown-button.disabled').isPresent() as Promise<any>;
    }

    isRequiredSet() {
        return this.anscestor.element('.dropdown-button.required').isPresent() as Promise<any>;
        //return $(this.selector + '.dropdown-button.required').isPresent() as Promise<any>;
    }

    clearSearchQuery() {
        return this.anscestor.element('.search-wrapper i.icon-close').click() as Promise<any>;
        //return $(this.selector + ' .search-wrapper i.icon-close').click() as Promise<any>;
    }

}
