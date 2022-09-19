import {expect, Locator, Page} from "@playwright/test";
import {SingleselectDropdownPO} from 'cxone-qm-library/singleselect-dropdown.po';

export class HeaderPropertiesComponentPo {
    
    public readonly page:Page;
    public  titleFontFamilyDropdown : SingleselectDropdownPO
    public  titleFontSizeDropdown : SingleselectDropdownPO
    public subTitleFontFamilyDropdown : SingleselectDropdownPO
    public  subTitleFontSizeDropdown : SingleselectDropdownPO
   public titleTextBox                  :Locator
   public titleColorPickerTex  :Locator
   public titleBoldFont:Locator
   public titleItalicFont:Locator
   public titleUnderLineFont:Locator
   public titleLeftFont:Locator
   public titleCenterFont:Locator
   public titleRightFont:Locator
   public subTitleTextBox:Locator
   public subTitleColorPickerText:Locator
   public subTitleBoldFont:Locator
   public subTitleItalicFont:Locator
   public subTitleUnderLineFont:Locator
   public subTitleLeftFont:Locator
   public subTitleCenterFont:Locator
   public subTitleRightFont:Locator
   public backgroundColorText:Locator
   public titleText:Locator
   public subTitleText:Locator

    constructor(page:Page) {
        this.page = page
        this.page = this.page.locator('.header-properties');
      
            this.titleTextBox= this.page.locator('#form-designer-name-form-title'),
            this.titleColorPickerTex = this.page.locator('#form-designer-color-picker-title * input'),
            this.titleBoldFont = this.page.locator('#form-designer-title-font-bold'),
            this.titleItalicFont = this.page.locator('#form-designer-title-font-italic'),
            this.titleUnderLineFont = this.page.locator('#form-designer-title-font-underline'),
            this.titleLeftFont = this.page.locator('#form-designer-title-alignment-text-left'),
            this.titleCenterFont = this.page.locator('#form-designer-title-alignment-text-center'),
            this.titleRightFont = this.page.locator('#form-designer-title-alignment-text-right'),
            this.subTitleTextBox = this.page.locator('#form-designer-name-form-subTitle'),
            this.subTitleColorPickerText = this.page.locator('#form-designer-color-picker-subTitle * input'),
            this.subTitleBoldFont =this.page.locator('#form-designer-subTitle-font-bold'),
            this.subTitleItalicFont = this.page.locator('#form-designer-subTitle-font-italic'),
            this.subTitleUnderLineFont = this.page.locator('#form-designer-subTitle-font-underline'),
            this.subTitleLeftFont = this.page.locator('#form-designer-subTitle-alignment-text-left'),
            this.subTitleCenterFont = this.page.locator('#form-designer-subTitle-alignment-text-center'),
            this.subTitleRightFont = this.page.locator('#form-designer-subTitle-alignment-text-right'),
            this.backgroundColorText = this.page.locator('[name="bg-color"]'),
            this.titleText = this.page.locator('#form-designer-name-form-title * input'),
            this.subTitleText = this.page.locato('#form-designer-name-form-subTitle * input')
            this.titleFontFamilyDropdown  = new SingleselectDropdownPO(this.page.locator('#form-designer-header-attribute-fontFamily-title')));
            this.titleFontSizeDropdown = new SingleselectDropdownPO(this.page.locator('#form-designer-header-attribute-fontSize-title')));
            this.subTitleFontFamilyDropdown = new SingleselectDropdownPO(this.page.locator('#form-designer-header-attribute-fontFamily-subTitle')));
            this.subTitleFontSizeDropdown = new SingleselectDropdownPO(this.page.locator('#form-designer-header-attribute-fontSize-subTitle')));
       
    }

    async getTitleTextBox(): Promise<Locator> {
        let elem = this.titleTextBox;
        await expect(elem).isVisible(10000);
        return elem;
    }

    async getTitleText() {
      let titleElement = this.titleText;
      return await titleElement.getAttribute('value');
   }

    async enterTitle(text): Promise<any> {
      await (await this.getTitleTextBox()).click();
      await this.page.actions().type(text).perform();
    }

    async getSubTitleTextBox(): Promise<Locator> {
      let elem = this.subTitleTextBox;
      await expect(elem).isVisible(10000);
      return elem;
    }

    async getSubTitleText() {
      let subTitleElement = this.page.titleText;
      return await subTitleElement.getAttribute('value');
   }

    async enterSubTitle(text): Promise<any> {
      await (await this.getSubTitleTextBox()).click();
      await this.page.actions().sendKeys(text).perform();
    }

    async getTitleColorPickerText(): Promise<Locator> {
        let elem = this.page.titleColorPickerText;
        await expect(elem).isVisible(10000);
        return elem;
    }

    async enterTitleColorPickerText(text): Promise<any> {
        await (await this.getTitleColorPickerText()).clear();
        return (await this.getTitleColorPickerText()).type(text) as Promise<any>;
    }

    async getTitleBoldFontButton(): Promise<Locator> {
        let elem = this.titleBoldFont;
        await expect(elem).toBeVisible(10000);
        return elem;
    }

    async clickTitleBoldFontButton(): Promise<any> {
        return (await this.getTitleBoldFontButton()).click() as Promise<any>;
    }

    async getTitleItalicFontButton(): Promise<Locator> {
        let elem = this.titleItalicFont;
        await expect(elem).isVisible(10000);
        return elem;
    }

    async clickTitleItalicFontButton(): Promise<any> {
        return (await this.getTitleItalicFontButton()).click() as Promise<any>;
    }

    async getTitleUnderLineFontButton(): Promise<Locator> {
        let elem = this.titleUnderLineFont;
        await expect(elem).isVisible(10000);
        return elem;
    }

    async clickTitleUnderLineFontButton(): Promise<any> {
        return (await this.getTitleUnderLineFontButton()).click() as Promise<any>;
    }

    async getTitleLeftFontButton(): Promise<Locator> {
        let elem = this.titleLeftFont;
        await expect(elem).isVisible(10000);
        return elem;
    }

    async clickTitleLeftFontButton(): Promise<any> {
        return (await this.getTitleLeftFontButton()).click() as Promise<any>;
    }

    async getTitleRightFontButton(): Promise<Locator> {
        let elem = this.titleRightFont;
        await expect(elem).isVisible(10000);
        return elem;
    }

    async clickTitleRightFontButton(): Promise<any> {
        return (await this.getTitleRightFontButton()).click() as Promise<any>;
    }

    async getTitleCenterFontButton(): Promise<Locator> {
        let elem = this.titleCenterFont;
        await expect(elem).isVisible(10000);
        return elem;
    }

    async clickTitleCenterFontButton(): Promise<any> {
        return (await this.getTitleCenterFontButton()).click() as Promise<any>;
    }

    async getBackgroundColorTextBox(): Promise<Locator> {
        let elem = this.backgroundColorText;
        await expect(elem).isVisible(10000);
        return elem;
    }

    async enterBackgroundColor(text): Promise<any> {
        return (await this.getBackgroundColorTextBox()).type(text) as Promise<any>;
    }
}
