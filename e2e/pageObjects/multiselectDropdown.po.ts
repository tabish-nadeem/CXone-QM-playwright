import {element, by, ElementFinder} from 'protractor';
import {Utils} from '../../../../tests/protractor/common/utils';
import * as protHelper from '../../../../tests/protractor/config-helpers';

export class MultiSelectDropdownPo {
    public ancestor: ElementFinder;
    public elements;

    public constructor(ancestorElement?) {
        this.ancestor = ancestorElement || element(by.css('.cxone-multiselect-dropdown'));
        this.elements = {
            wrapper: this.ancestor,
            caret: this.ancestor.element(by.css('.icon-carat')),
            allChoiceRows: this.ancestor.all(by.css('.item-row:not([class~="active"])')),
            choicesLabels: this.ancestor.all(by.css('.option-content')),
            inputText: this.ancestor.element(by.css('.search-wrapper input')),
            placeholder: this.ancestor.element(by.css('[class~="button-text"]'))
        };
    }

    public async isOpen() {
        return this.ancestor.element(by.css('.dropdown-popover-wrapper')).isPresent();
    }

    public async toggleOpened() {
        return await this.elements.caret.click();
    }

    public async getSelectedCount() {
        //Assumes the dropdown is in the opened state
        return await this.elements.all(by.css('.dropdown-popover-wrapper input[type="checkbox"]:checked')).count();
    }

    public async open() {
        let temp = await this.isOpen();
        if (!temp) {
            await this.elements.caret.click();
            await Utils.waitUntilVisible(this.ancestor.element(by.css('.options-wrapper')));
        }
    }

    public async selectItemByLabel(label) {
        await this.open();
        await this.elements.inputText.clear();
        await this.elements.inputText.sendKeys(label);
        return await this.elements.allChoiceRows.first().click();
    }

    public async selectItemByLabelNoSearch(label) {
        await this.open();
        await element(by.cssContainingText('.item-row:not([class~="active"]) .item-text', label)).click();
        await this.close();
    }

    public async selectMulitpleItemsByLabels(labels,searchEnabled?) {
        let promiseArray = [];
        await this.open();
        for (let i = 0; i < labels.length; i += 1) {
            if (searchEnabled) {
                promiseArray.push(this.selectItemByLabel(labels[i]));
            } else {
                promiseArray.push(this.selectItemByLabelNoSearch(labels[i]));
            }
        }
        return Promise.all(promiseArray);
    }

    public async getPlaceholderText() {
        return await this.elements.placeholder.getText();
    }

    public async selectAllClick() {
        await this.open();
        await this.ancestor.element(by.css('.select-all-btn')).click();
    }

    public async clearAllClick() {
        await this.open();
        await this.ancestor.element(by.css('.clear-all-btn')).click();
    }

    public async close() {
        let isOpened = await this.  ();
        if (isOpened) {
            await this.elements.caret.click();
        }
    }
}
