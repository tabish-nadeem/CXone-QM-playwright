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
        this.page = this.page.locator('.header-properties');
        this.elements = {
            titleTextBox: this.page.locator('#form-designer-name-form-title'),
            titleColorPickerText: this.page.locator('#form-designer-color-picker-title * input'),
            titleBoldFont: this.page.locator('#form-designer-title-font-bold'),
            titleItalicFont: this.page.locator('#form-designer-title-font-italic'),
            titleUnderLineFont: this.page.locator('#form-designer-title-font-underline'),
            titleLeftFont: this.page.locator('#form-designer-title-alignment-text-left'),
            titleCenterFont: this.page.locator('#form-designer-title-alignment-text-center'),
            titleRightFont: this.page.locator('#form-designer-title-alignment-text-right'),
            subTitleTextBox: this.page.locator('#form-designer-name-form-subTitle'),
            subTitleColorPickerText: this.page.locator('#form-designer-color-picker-subTitle * input'),
            subTitleBoldFont: this.page.locator('#form-designer-subTitle-font-bold'),
            subTitleItalicFont: this.page.locator('#form-designer-subTitle-font-italic'),
            subTitleUnderLineFont: this.page.locator('#form-designer-subTitle-font-underline'),
            subTitleLeftFont: this.page.locator('#form-designer-subTitle-alignment-text-left'),
            subTitleCenterFont: this.page.locator('#form-designer-subTitle-alignment-text-center'),
            subTitleRightFont: this.page.locator('#form-designer-subTitle-alignment-text-right'),
            backgroundColorText: this.page.locator('[name="bg-color"]'),
            titleText: this.page.locator('#form-designer-name-form-title * input'),
            subTitleText: this.page.locato('#form-designer-name-form-subTitle * input')
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
      await this.page.actions().sendKeys(text).perform();
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
      await this.page.actions().sendKeys(text).perform();
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
