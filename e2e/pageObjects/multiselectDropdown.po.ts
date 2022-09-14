import { ElementFinder } from 'protractor';
import {expect, Locator, Page} from "@playwright/test";
import moment from 'moment';
import { CommonUIUtils } from "cxone-playwright-test-utils";
import { fdUtils } from "../common/FdUtils";
import { Utils } from "../common/utils";
import { OmnibarPO } from "./omnibar.po";
import { RenameFormModalPO } from "./rename-form-modal.po";
import { WarningModalComponentPo } from "./warning-modal.component.po";
import { DuplicateFormModalPO } from "./duplicate-form-modal.po";
import { UIConstants } from "../common/uiConstants"
import { URLs } from "../common/pageIdentifierURLs"

export class MultiSelectDropdownPo {
    getDisplayedSelection() {
        throw new Error("Method not implemented.");
    }
    public elements:Locator
    readonly page:Page;
    utils: Utils;

    public constructor(ancestorElement?: any) {
        this.page = Page;
        this.utils = new Utils(this.page);
        this.page = Locator || this.page.locator(('.cxone-multiselect-dropdown'));
        this.elements = {,
            caret: this.page.locator(('.icon-carat')),
            allChoiceRows: this.page.locator(('.item-row:not([class~="active"])')),
            choicesLabels: this.page.locator(('.option-content')),
            inputText: this.page.locator(('.search-wrapper input')),
            placeholder: this.page.locator(('[class~="button-text"]'))
        };
    }

    public async isOpen() {
        return this.page.locator(('.dropdown-popover-wrapper')).isPresent();
    }

    public async toggleOpened() {
        return await this.elements.caret.click();
    }

    public async getSelectedCount() {
        //Assumes the dropdown is in the opened state
        return await this.page.locator(('.dropdown-popover-wrapper input[type="checkbox"]:checked')).count();
    }

    public async open() {
        let temp = await this.isOpen();
        if (!temp) {
            await this.elements.caret.click();
            await Utils.waitUntilVisible(this.page.locator(('.options-wrapper')));
        }
    }

    public async selectItemByLabel(label: any) {
        await this.open();
        await this.elements.inputText.clear();
        await this.elements.inputText.sendKeys(label);
        return await this.elements.allChoiceRows.first().click();
    }

    public async selectItemByLabelNoSearch(label: any) {
        await this.open();
        await this.page.locator((`.item-row:not([class~="active"]) .item-text >> text= ${label}`)).click();
        await this.close();
    }

    public async selectMulitpleItemsByLabels(labels: string | any[],searchEnabled?: any) {
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
        await this.page.locator(('.select-all-btn')).click();
    }

    public async clearAllClick() {
        await this.open();
        await this.page.locator(('.clear-all-btn')).click();
    }

    public async close() {
        let isOpened = await this.isOpen();
        if (isOpened) {
            await this.elements.caret.click();
        }
    }
}
