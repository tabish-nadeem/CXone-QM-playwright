import {expect, Locator, Page} from "@playwright/test";

export class FormLogoComponentPo {
     readonly defaultTimeoutInMillis: number;
     readonly page:Page;
    ancestor: Locator;
    public elements: Locator;

    constructor() {
     //    this.ancestor = (by.css('.form-logo-component'));
       this.page = Page.locator('.form-logo-component');
        this.elements = {
            formLogo: this.page.locator(('#form-designer-logo-theme-image'))
        };
    }

    getFormLogo() {
        return this.elements.formLogo;
    }
}
