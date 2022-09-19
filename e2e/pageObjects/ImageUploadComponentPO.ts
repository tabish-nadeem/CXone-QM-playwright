import { expect, Locator, Page } from "@playwright/test";
import {MultiselectDropdownPO} from './MultiselectDropdownPO';
 import * as path from 'path';
import { Utils } from "../common/utils";

export class ImageUploadComponentPo {
    public readonly page: Page;
    headerFieldsDropdown : MultiselectDropdownPO;
    public browseImageButton            : Locator
    public fileName  : Locator
    public inputFile  : Locator
    public widthTextBox  : Locator
    public heightTextBox  : Locator
    public lockAspectRatioCheckBox  : Locator
    public deleteIcon  : Locator
    readonly utils: Utils;

    constructor(page:Page) {
            this.page = page       
           this.browseImageButton =this.page.locator('#element-attributes-select-file-input'),
           this.fileName = this.page.locator('.fileName'),
           this.inputFile = this.page.locator('#element-attributes-select-file-input'),
           this.widthTextBox = this.page.locator('.image-width * input'),
           this.heightTextBox = this.page.locator('.image-height * input'),
           this.lockAspectRatioCheckBox = this.page.locator('#form-designer-aspect-ratio-checkbox'),
           this.deleteIcon = this.page.locator('[iconname="icon-delete"]')
           this.headerFieldsDropdown = new MultiselectDropdownPO('form-designer-header-fields');
    }

    async getBrowseImageButton(): Promise<Locator> {
        let elem = this.page.browseImageButton;
        await expect(elem).isVisible(10000);
        return elem;
    }

    async uploadRequiredFile(fileToUpload:any): Promise<any> {
        await expect(this.page.fileName).isVisible(10000);
        let absolutePath = path.resolve(fileToUpload);
        await this.page.inputFile.type(absolutePath);
        await this.utils.delay(2000);
    }

    async clickBrowseImageButton(): Promise<any> {
        return (await this.getBrowseImageButton()).click() as Promise<any>;
    }

    async clickDeleteUploadedFile(): Promise<any> {
        await expect(this.page.locator(this.page.deleteIcon).waitFor({ state: "attached", timeout: 10000 }));
        return this.page.deleteIcon.click() as Promise<any>;
    }

    async getFileName(): Promise<string> {
        let elem = this.page.fileName;
        await expect(elem).isVisible(10000);
        return elem.getText() as Promise<string>;
    }

    async getWidthTextBox(): Promise<Locator> {
        let elem = this.page.widthTextBox;
        await expect(this.page.locator(elem).waitFor({ state: "attached", timeout: 10000 }));
        return elem;
    }

    async enterWidth(text:string): Promise<any> {
      await this.page.evaluate('arguments[0].scrollIntoView()', (await this.getWidthTextBox()));
      await (await this.getWidthTextBox()).click();
      await (await this.getWidthTextBox()).type(Key.chord(Key.CONTROL, 'a'));
      return (await this.getWidthTextBox()).type(text) as Promise<any>;
    }

    async getHeightTextBox(): Promise<Locator> {
        let elem = this.page.heightTextBox;
        await expect(this.page.locator(elem).waitFor({ state: "attached", timeout: 10000 }));
        return elem;
    }

    async enterHeight(text:string): Promise<any> {
      await this.page.evaluate('arguments[0].scrollIntoView()', (await this.getHeightTextBox()));
      await (await this.getHeightTextBox()).click();
      await (await this.getHeightTextBox()).type(Key.chord(Key.CONTROL, 'a'));
      return (await this.getHeightTextBox()).type(text) as Promise<any>;
    }

    async getLockAspectRatioCheckBox(): Promise<Locator> {
        let elem = this.page.lockAspectRatioCheckBox;
        await expect(this.page.locator(elem).waitFor({ state: "attached", timeout: 10000 }));
        return elem;
    }

    async clickLockAspectRatioCheckBox(): Promise<any> {
        await this.page.evaluate('arguments[0].scrollIntoView()', (await this.getLockAspectRatioCheckBox()));
        await this.page.evaluate('arguments[0].scrollIntoView()', (await this.getHeightTextBox()));
        
    }
}
