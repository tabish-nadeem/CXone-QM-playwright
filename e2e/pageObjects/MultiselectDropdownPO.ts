import { ElementFinder } from 'protractor';
import {expect, Locator, Page} from "@playwright/test";
import moment from 'moment';
import { CommonUIUtils } from "cxone-playwright-test-utils";
import { fdUtils } from "../common/FdUtils";
import { Utils } from "../common/utils";
import { OmnibarPO } from "./OmnibarPO";
import { RenameFormModalPO } from "./RenameFormModalPO";
import { WarningModalComponentPo } from "./WarningModalComponentPO";
import { DuplicateFormModalPO } from "./DuplicateFormModalPO";
import { UIConstants } from "../common/uiConstants"
import { URLs } from "../common/pageIdentifierURLs"

export class MultiSelectDropdownPo {
   
    public elements:Locator
    readonly page:Page;
    utils: Utils;
   public caret             :Locator
   public allChoiceRows:Locator
   public choicesLabels:Locator
   public inputText:Locator
   public placeholder:Locator
    

    public constructor(page:Page) {
        this.page = Page;
        this.utils = new Utils(this.page);
        this.page = Locator || this.page.locator(('.cxone-multiselect-dropdown'));
        this.caret = this.page.locator(('.icon-carat')),
        this.allChoiceRows = this.page.locator(('.item-row:not([class~="active"])')),
        this.choicesLabels =this.page.locator(('.option-content')),
        this.inputText = this.page.locator(('.search-wrapper input')),
        this.placeholder = this.page.locator(('[class~="button-text"]'))
       
    }

    public async isOpen() {
        return this.page.locator(('.dropdown-popover-wrapper')).isPresent();
    }

    public async toggleOpened() {
        return await this.caret.click();
    }

    public async getSelectedCount() {
        //Assumes the dropdown is in the opened state
        return await this.page.locator(('.dropdown-popover-wrapper input[type="checkbox"]:checked')).count();
    }

    public async open() {
        let temp = await this.isOpen();
        if (!temp) {
            await this.caret.click();
            await Utils.waitUntilVisible(this.page.locator(('.options-wrapper')));
        }
    }

    public async selectItemByLabel(label: any) {
        await this.open();
        await this.inputText.fill('');
        await this.inputText.type(label);
        return await this.allChoiceRows.first().click();
    }

    public async selectItemByLabelNoSearch(label: any) {
        await this.open();
        await this.page.locator((`.item-row:not([class~="active"]) .item-text >> text= ${label}`)).click();
        await this.close();
    }

    public async selectMulitpleItemsByLabels(labels: string | any[],searchEnabled?: any) {
        let promiseArray:any = [];
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
        return await this.placeholder.getText();
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
            await this.caret.click();
        }
    }
}
