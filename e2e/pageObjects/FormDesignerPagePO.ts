import {expect, Locator, Page} from "@playwright/test";
import { SpinnerPO } from './SpinnerPO';
import { CommonUIUtils } from "cxone-playwright-test-utils";
import { UIConstants } from "../common/uiConstants"
import { URLs } from "../common/pageIdentifierURLs"

// const protractorConfig = protHelper.getProtractorHelpers();

export default class FormDesignerPagePO {
    readonly page: Page;
    public locator: Locator;
    public defaultTimeoutInMillis: number;
    public spinner :SpinnerPO;
    readonly uiConstants: UIConstants;
    public saveModalWrapperElements:any;
    public container: Locator;
     public   sectionFormElement          : Locator;
     public   closeButton  : Locator;
     public   saveAsDraftButton  : Locator;
     public   saveAndActivateButton  : Locator;
     public   closeFormBtn  : Locator;
     public   closeButtonForWarning  : Locator;
     public   warningMessageText  : Locator;
     public   warningFooterNoBtn  : Locator;
     public   warningFooterYesBtn  : Locator;
     public   wrapper       :Locator;
     public   formName:Locator;
     public   cancelButton:Locator;
     public   saveButton:Locator;
     

    public constructor() {
        this.defaultTimeoutInMillis = 25000;
        this.locator = this.container;
        this.spinner = new SpinnerPO('.apphttpSpinner .cxonespinner');
        this.uiConstants = new UIConstants();
           this.container = this.page.locator('#ng2FormDesignerPage .cxone-form-designer'),
           this.sectionFormElement = this.page.locator(`.cxone-form-element .draggable-item.cdk-drag[element-type="section"]`),
           this.closeButton = this.page.locator('.cxone-form-designer * .close-button'),
           this.saveAsDraftButton = this.page.locator('#form-designer-save-btn'),
           this.saveAndActivateButton = this.page.locator('#form-designer-publish-btn'),
           this.closeFormBtn = this.page.locator('#form-designer-cancel-button'),
           this.closeButtonForWarning = this.page.locator('.user-warning * .close-button'),
           this.warningMessageText = this.page.locator('.cxone-modal-wrapper .message'),
           this.warningFooterNoBtn = this.page.locator('.cxone-modal-wrapper .btn-secondary'),
           this.warningFooterYesBtn = this.page.locator('.cxone-modal-wrapper .btn-primary'),
           this.wrapper = this.page.locator('.save-form-modal-wrapper'),
            this.closeButton = this.page.locator('.close-button'),
            this.formName = this.page.locator('input[name="formName"]'),
            this.cancelButton = this.page.locator('.modal-footer-wrapper .btn-secondary'),
            this.saveButton = this.page.locator('.modal-footer-wrapper .btn-primary')

    }

    // get designerToolBarPO() {
    //     return new DesignerToolbarComponentPO();
    // }

    // get elementAttributesPO() {
    //     return new ElementAttributesComponentPo();
    // }

    // get formAreaPO() {
    //     return new FormAreaComponentPo();
    // }

    async navigate() {
        let baseUrl = this.uiConstants.URLS.LOCALHOST
        await this.page.goto(baseUrl + URLs.forms.form_Designer);
        await this.page.waitForURL('**\/#/formDesigner');
        await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        await this.page.waitForSelector(`#ng2FormDesignerPage .cxone-form-designer`);
    }

    async navigateToPageThroughBreadcrumb(pageWarningModal: boolean) {
        try {
            await this.page.locator('li.breadcrumb-item a').click();
            if (pageWarningModal) {
                // await browser.wait(ExpectedConditions.visibilityOf($('.cxone-message-modal')), this.defaultTimeoutInMillis)
                await expect(this.page.locator('.cxone-message-modal')).toBeVisible(this.defaultTimeoutInMillis);
                await this.page.locator('button, input[type="button"], input[type="submit"] >> text = "Yes"').click();
                // await waitForSpinnerToDisappear();
                await this.spinner.waitForSpinnerToBeHidden(false, 60000);
                await this.navigate();
            } else {
                await this.navigate();
            }
        } catch {
            await this.navigate();
        }
    }

    async getCloseFormButton(): Promise<any> {
        return await this.closeButton;
    }

    async getSaveFormButton(): Promise<any> {
        return await this.saveAsDraftButton;
    }

    async getSaveAndActivateFormButton(): Promise<any> {
        return await this.saveAndActivateButton;
    }

    async getCloseFormButtonForWarning(): Promise<any> {
        await expect(this.closeButtonForWarning).isVisible(10000);
        return await this.closeButtonForWarning;
    }

    async getCloseButtonForActiveForm(): Promise<any> {
        await expect(this.closeFormBtn).isVisible(10000);
        return await this.closeFormBtn;
    }

    async getWarningMesaage(): Promise<any> {
        await expect(this.warningMessageText).isVisible(10000);
        return await this.warningMessageText.getText();
    }

    async clickOnYesBtnInWarning(): Promise<any> {
        await expect(this.warningFooterYesBtn).isVisible(10000);
        await this.warningFooterYesBtn.click();
        await expect(this.warningFooterYesBtn).toBeHidden(10000);
    }

    async clickOnNoBtnInWarning(): Promise<any> {
        await expect(this.warningFooterNoBtn).isVisible(10000);
        await this.warningFooterNoBtn.click();
        await expect(this.warningFooterNoBtn).toBeHidden(10000);
    }

    async saveAndActivateForm(formName?: any, isNewForm?: any): Promise<any> {
        await expect(this.saveAndActivateButton).isVisible(10000);
        await this.saveAndActivateButton.click();
        if (isNewForm) {
            await expect(this.saveModalWrapperElements.wrapper).isVisible(10000);
            await this.saveModalWrapperElements.formName.type(formName);
            await this.saveModalWrapperElements.saveButton.click();
            await expect(this.saveModalWrapperElements.wrapper).toBeHidden(10000);


        }
        return await this.spinner.waitForSpinnerToBeHidden(false, 60000);
    }

    async saveFormAsDraft(formName?, isNewForm?): Promise<any> {
        await expect(this.page.saveAsDraftButton).isVisible(10000);
        await this.page.saveAsDraftButton.click();
        if (isNewForm) {
            await expect(this.saveModalWrapperElements.wrapper).isVisible(10000);
            await this.saveModalWrapperElements.formName.sendKeys(formName);
            await expect(this.saveModalWrapperElements.saveButton).isVisible(10000);
            await this.saveModalWrapperElements.saveButton.click();
        }
        return this.spinner.waitForSpinnerToBeHidden(false, 60000);
    }

    async saveAPublishedForm(): Promise<any> {
        await expect(this.page.saveAsDraftButton).isVisible(10000);
        await this.page.saveAsDraftButton.click();
        await expect(this.page.locator('.popup-content-wrapper')).isVisible(10000);
        await this.page.locator('#popup-ok').click();
        return await this.spinner.waitForSpinnerToBeHidden(false, 60000);
    }

    async clickOnElementsTab(): Promise<any> {
        const elementsTab = this.page.locator('.tab-title >> text = Elements');
        await expect(elementsTab).isVisible(10000);
        await elementsTab.click();
        await expect(this.page.locator('.cxone-form-element')).isVisible(10000);
        
    }

    async clickOnQuestionBankTab(): Promise<any> {
        const elementsTab = await expect(this.page.locator('.tab-title >> text = Question Bank')).isVisible(10000);
        await expect(elementsTab).isVisible(10000);
        await elementsTab.click();
        await expect(this.page.locator('.cxone-question-bank')).isVisible(10000);
    }
}
