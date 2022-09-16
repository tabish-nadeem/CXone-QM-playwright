
import {expect, Locator, Page} from "@playwright/test";
import { SpinnerPO } from './SpinnerPO';
import { DesignerToolbarComponentPO } from "./DesignerToolbarComponentPO";
import { ElementAttributesComponentPo } from "./ElementAttributesComponentPO";
import { FormAreaComponentPo } from "./FormAreaComponentPO";
import { CommonUIUtils } from "cxone-playwright-test-utils";
import { fdUtils } from "../common/FdUtils";
import { UIConstants } from "../common/uiConstants"
import { URLs } from "../common/pageIdentifierURLs"

// const protractorConfig = protHelper.getProtractorHelpers();

export default class FormDesignerPagePO {
    readonly page: Page;
    public locator: Locator;
    public defaultTimeoutInMillis: number;
    public spinner :SpinnerPO;
    readonly uiConstants: UIConstants;
    public elements:any;
    public saveModalWrapperElements:any;

     

    public constructor() {
        this.defaultTimeoutInMillis = 25000;
        this.locator = this.elements.container;
        this.spinner = new SpinnerPO('.apphttpSpinner .cxonespinner');
        this.uiConstants = new UIConstants();
        this.elements =  {
           container: this.page.locator('#ng2FormDesignerPage .cxone-form-designer'),
           sectionFormElement: this.page.locator(`.cxone-form-element .draggable-item.cdk-drag[element-type="section"]`),
           closeButton: this.page.locator('.cxone-form-designer * .close-button'),
           saveAsDraftButton: this.page.locator('#form-designer-save-btn'),
           saveAndActivateButton: this.page.locator('#form-designer-publish-btn'),
           closeFormBtn: this.page.locator('#form-designer-cancel-button'),
           closeButtonForWarning: this.page.locator('.user-warning * .close-button'),
           warningMessageText: this.page.locator('.cxone-modal-wrapper .message'),
           warningFooterNoBtn: this.page.locator('.cxone-modal-wrapper .btn-secondary'),
           warningFooterYesBtn: this.page.locator('.cxone-modal-wrapper .btn-primary'),
       };
       this.saveModalWrapperElements = {
        
        wrapper: this.page.locator('.save-form-modal-wrapper'),
        
        closeButton: this.page.locator('.close-button'),
        
        formName: this.page.locator('input[name="formName"]'),
        
        cancelButton: this.page.locator('.modal-footer-wrapper .btn-secondary'),
        
        saveButton: this.page.locator('.modal-footer-wrapper .btn-primary'),
    }
    }

    get designerToolBarPO() {
        return new DesignerToolbarComponentPO();
    }

    get elementAttributesPO() {
        return new ElementAttributesComponentPo();
    }

    get formAreaPO() {
        return new FormAreaComponentPo();
    }

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
        return await this.elements.closeButton;
    }

    async getSaveFormButton(): Promise<any> {
        return await this.elements.saveAsDraftButton;
    }

    async getSaveAndActivateFormButton(): Promise<any> {
        return await this.elements.saveAndActivateButton;
    }

    async getCloseFormButtonForWarning(): Promise<any> {
        await expect(this.elements.closeButtonForWarning).toBeVisible(10000);
        return await this.elements.closeButtonForWarning;
    }

    async getCloseButtonForActiveForm(): Promise<any> {
        await expect(this.elements.closeFormBtn).toBeVisible(10000);
        return await this.elements.closeFormBtn;
    }

    async getWarningMesaage(): Promise<any> {
        await expect(this.elements.warningMessageText).toBeVisible(10000);
        return await this.elements.warningMessageText.getText();
    }

    async clickOnYesBtnInWarning(): Promise<any> {
        await expect(this.elements.warningFooterYesBtn).toBeVisible(10000);
        await this.elements.warningFooterYesBtn.click();
        await expect(this.elements.warningFooterYesBtn).toBeHidden(10000);
    }

    async clickOnNoBtnInWarning(): Promise<any> {
        await expect(this.elements.warningFooterNoBtn).toBeVisible(10000);
        await this.elements.warningFooterNoBtn.click();
        await expect(this.elements.warningFooterNoBtn).toBeHidden(10000);
    }

    async saveAndActivateForm(formName?: any, isNewForm?: any): Promise<any> {
        await expect(this.elements.saveAndActivateButton).toBeVisible(10000);
        await this.elements.saveAndActivateButton.click();
        if (isNewForm) {
            await expect(this.saveModalWrapperElements.wrapper).toBeVisible(10000);
            await this.saveModalWrapperElements.formName.sendKeys(formName);
            await this.saveModalWrapperElements.saveButton.click();
            await expect(this.saveModalWrapperElements.wrapper).toBeHidden(10000);


        }
        return await this.spinner.waitForSpinnerToBeHidden(false, 60000);
    }

    async saveFormAsDraft(formName?, isNewForm?): Promise<any> {
        await expect(this.elements.saveAsDraftButton).toBeVisible(10000);
        await this.elements.saveAsDraftButton.click();
        if (isNewForm) {
            await expect(this.saveModalWrapperElements.wrapper).toBeVisible(10000);
            await this.saveModalWrapperElements.formName.sendKeys(formName);
            await expect(this.saveModalWrapperElements.saveButton).toBeVisible(10000);
            await this.saveModalWrapperElements.saveButton.click();
        }
        return this.spinner.waitForSpinnerToBeHidden(false, 60000);
    }

    async saveAPublishedForm(): Promise<any> {
        await expect(this.elements.saveAsDraftButton).toBeVisible(10000);
        await this.elements.saveAsDraftButton.click();
        await expect(this.page.locator('.popup-content-wrapper')).toBeVisible(10000);
        await this.page.locator('#popup-ok').click();
        return await this.spinner.waitForSpinnerToBeHidden(false, 60000);
    }

    async clickOnElementsTab(): Promise<any> {
        const elementsTab = this.page.locator('.tab-title >> text = Elements');
        await expect(elementsTab).toBeVisible(10000);
        await elementsTab.click();
        await expect(this.page.locator('.cxone-form-element')).toBeVisible(10000);
        
    }

    async clickOnQuestionBankTab(): Promise<any> {
        const elementsTab = await expect(this.page.locator('.tab-title >> text = Question Bank')).toBeVisible(10000);
        await expect(elementsTab).toBeVisible(10000);
        await elementsTab.click();
        await expect(this.page.locator('.cxone-question-bank')).toBeVisible(10000);
    }
}
