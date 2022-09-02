import {expect, Locator, Page} from "@playwright/test";

import {SingleselectDropdownPO} from 'cxone-qm-library/singleselect-dropdown.po';

export class HeaderPropertiesComponentPo {
    ancestor: Locator;
    public readonly page:Page;
    titleFontFamilyDropdown = new SingleselectDropdownPO(this.page.locator('#form-designer-header-attribute-fontFamily-title')));
    titleFontSizeDropdown = new SingleselectDropdownPO(this.page.locator('#form-designer-header-attribute-fontSize-title')));
    subTitleFontFamilyDropdown = new SingleselectDropdownPO(this.page.locator('#form-designer-header-attribute-fontFamily-subTitle')));
    subTitleFontSizeDropdown = new SingleselectDropdownPO(this.page.locator('#form-designer-header-attribute-fontSize-subTitle')));
    public elements;

    constructor() {
        this.ancestor = this.page.locator('.header-properties');
        this.elements = {
            titleTextBox: this.ancestor.locator('#form-designer-name-form-title'),
            titleColorPickerText: this.ancestor.locator('#form-designer-color-picker-title * input'),
            titleBoldFont: this.ancestor.locator('#form-designer-title-font-bold'),
            titleItalicFont: this.ancestor.locator('#form-designer-title-font-italic'),
            titleUnderLineFont: this.ancestor.locator('#form-designer-title-font-underline'),
            titleLeftFont: this.ancestor.locator('#form-designer-title-alignment-text-left'),
            titleCenterFont: this.ancestor.locator('#form-designer-title-alignment-text-center'),
            titleRightFont: this.ancestor.locator('#form-designer-title-alignment-text-right'),
            subTitleTextBox: this.ancestor.locator('#form-designer-name-form-subTitle'),
            subTitleColorPickerText: this.ancestor.locator('#form-designer-color-picker-subTitle * input'),
            subTitleBoldFont: this.ancestor.locator('#form-designer-subTitle-font-bold'),
            subTitleItalicFont: this.ancestor.locator('#form-designer-subTitle-font-italic'),
            subTitleUnderLineFont: this.ancestor.locator('#form-designer-subTitle-font-underline'),
            subTitleLeftFont: this.ancestor.locator('#form-designer-subTitle-alignment-text-left'),
            subTitleCenterFont: this.ancestor.locator('#form-designer-subTitle-alignment-text-center'),
            subTitleRightFont: this.ancestor.locator('#form-designer-subTitle-alignment-text-right'),
            backgroundColorText: this.ancestor.locator('[name="bg-color"]'),
            titleText: this.ancestor.locator('#form-designer-name-form-title * input'),
            subTitleText: this.ancestor.locator('#form-designer-name-form-subTitle * input')
        };
    }

    async getTitleTextBox(): Promise<Locator> {
        let elem = this.elements.titleTextBox;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async getTitleText() {
      let titleElement = this.elements.titleText;
      return await titleElement.getAttribute('value');
   }

    async enterTitle(text): Promise<any> {
      await (await this.getTitleTextBox()).click();
      await browser.actions().sendKeys(text).perform();
    }

    async getSubTitleTextBox(): Promise<Locator> {
      let elem = this.elements.subTitleTextBox;
      await expect(elem).toBeVisible(10000);
      return elem;
    }

    async getSubTitleText() {
      let subTitleElement = this.elements.titleText;
      return await subTitleElement.getAttribute('value');
   }

    async enterSubTitle(text): Promise<any> {
      await (await this.getSubTitleTextBox()).click();
      await browser.actions().sendKeys(text).perform();
    }

    async getTitleColorPickerText(): Promise<Locator> {
        let elem = this.elements.titleColorPickerText;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async enterTitleColorPickerText(text): Promise<any> {
        await (await this.getTitleColorPickerText()).clear();
        return (await this.getTitleColorPickerText()).sendKeys(text) as Promise<any>;
    }

    async getTitleBoldFontButton(): Promise<Locator> {
        let elem = this.elements.titleBoldFont;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async clickTitleBoldFontButton(): Promise<any> {
        return (await this.getTitleBoldFontButton()).click() as Promise<any>;
    }

    async getTitleItalicFontButton(): Promise<Locator> {
        let elem = this.elements.titleItalicFont;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async clickTitleItalicFontButton(): Promise<any> {
        return (await this.getTitleItalicFontButton()).click() as Promise<any>;
    }

    async getTitleUnderLineFontButton(): Promise<Locator> {
        let elem = this.elements.titleUnderLineFont;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async clickTitleUnderLineFontButton(): Promise<any> {
        return (await this.getTitleUnderLineFontButton()).click() as Promise<any>;
    }

    async getTitleLeftFontButton(): Promise<Locator> {
        let elem = this.elements.titleLeftFont;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async clickTitleLeftFontButton(): Promise<any> {
        return (await this.getTitleLeftFontButton()).click() as Promise<any>;
    }

    async getTitleRightFontButton(): Promise<Locator> {
        let elem = this.elements.titleRightFont;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async clickTitleRightFontButton(): Promise<any> {
        return (await this.getTitleRightFontButton()).click() as Promise<any>;
    }

    async getTitleCenterFontButton(): Promise<Locator> {
        let elem = this.elements.titleCenterFont;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async clickTitleCenterFontButton(): Promise<any> {
        return (await this.getTitleCenterFontButton()).click() as Promise<any>;
    }

    async getBackgroundColorTextBox(): Promise<Locator> {
        let elem = this.elements.backgroundColorText;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async enterBackgroundColor(text): Promise<any> {
        return (await this.getBackgroundColorTextBox()).sendKeys(text) as Promise<any>;
    }
}
