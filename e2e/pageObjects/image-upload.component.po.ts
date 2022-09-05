import { expect, Locator, Page } from "@playwright/test";

import {MultiselectDropdownPO} from 'cxone-components/multiselect-dropdown.po';
import * as path from 'path';
import { Utils } from "../common/utils";

export class ImageUploadComponentPo {
    ancestor: Locator;
    public readonly page: Page;
    headerFieldsDropdown = new MultiselectDropdownPO('form-designer-header-fields');
    public elements: any;
    readonly utils: Utils;

    constructor() {
        this.elements = {
            browseImageButton: this.page.locator('#element-attributes-select-file-input'),
            fileName: this.page.locator('.fileName'),
            inputFile: this.page.locator('#element-attributes-select-file-input'),
            widthTextBox: this.page.locator('.image-width * input'),
            heightTextBox: this.page.locator('.image-height * input'),
            lockAspectRatioCheckBox: this.page.locator('#form-designer-aspect-ratio-checkbox'),
            deleteIcon: this.page.locator('[iconname="icon-delete"]')
        };
    }

    async getBrowseImageButton(): Promise<Locator> {
        let elem = this.elements.browseImageButton;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async uploadRequiredFile(fileToUpload:any): Promise<any> {
        await expect(this.elements.fileName).toBeVisible(10000);
        let absolutePath = path.resolve(fileToUpload);
        await this.elements.inputFile.sendKeys(absolutePath);
        await this.utils.delay(2000);
    }

    async clickBrowseImageButton(): Promise<any> {
        return (await this.getBrowseImageButton()).click() as Promise<any>;
    }

    async clickDeleteUploadedFile(): Promise<any> {
        await expect(this.page.locator(this.elements.deleteIcon).waitFor({ state: "attached", timeout: 10000 }));
        return this.elements.deleteIcon.click() as Promise<any>;
    }

    async getFileName(): Promise<string> {
        let elem = this.elements.fileName;
        await expect(elem).toBeVisible(10000);
        return elem.getText() as Promise<string>;
    }

    async getWidthTextBox(): Promise<Locator> {
        let elem = this.elements.widthTextBox;
        await expect(this.page.locator(elem).waitFor({ state: "attached", timeout: 10000 }));
        return elem;
    }

    async enterWidth(text:string): Promise<any> {
      await this.page.evaluate('arguments[0].scrollIntoView()', (await this.getWidthTextBox()));
      await (await this.getWidthTextBox()).click();
      await (await this.getWidthTextBox()).sendKeys(Key.chord(Key.CONTROL, 'a'));
      return (await this.getWidthTextBox()).sendKeys(text) as Promise<any>;
    }

    async getHeightTextBox(): Promise<Locator> {
        let elem = this.elements.heightTextBox;
        await expect(this.page.locator(elem).waitFor({ state: "attached", timeout: 10000 }));
        return elem;
    }

    async enterHeight(text:string): Promise<any> {
      await this.page.evaluate('arguments[0].scrollIntoView()', (await this.getHeightTextBox()));
      await (await this.getHeightTextBox()).click();
      await (await this.getHeightTextBox()).sendKeys(Key.chord(Key.CONTROL, 'a'));
      return (await this.getHeightTextBox()).sendKeys(text) as Promise<any>;
    }

    async getLockAspectRatioCheckBox(): Promise<Locator> {
        let elem = this.elements.lockAspectRatioCheckBox;
        await expect(this.page.locator(elem).waitFor({ state: "attached", timeout: 10000 }));
        return elem;
    }

    async clickLockAspectRatioCheckBox(): Promise<any> {
        await this.page.evaluate('arguments[0].scrollIntoView()', (await this.getLockAspectRatioCheckBox()));
        await this.page.evaluate('arguments[0].scrollIntoView()', (await this.getHeightTextBox()));
        
    }
}
