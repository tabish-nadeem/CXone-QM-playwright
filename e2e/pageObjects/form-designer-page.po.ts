/* eslint-disable */
// import { ElementFinder, $, element, by, browser, ExpectedConditions } from 'protractor';
// import * as protHelper from '../../../../tests/protractor/config-helpers';
import {expect, Locator, Page} from "@playwright/test";
import { DesignerToolbarComponentPO } from 'cxone-qm-library/designer-toolbar.component.po';
import { ElementAttributesComponentPo } from 'cxone-qm-library/element-attributes.component.po';

// import {
//     navigateTo,
//     navigateQuicklyTo,
//     waitForSpinnerToDisappear
// } from '../../../../tests/protractor/common/prots-utils';

import { SpinnerPO } from 'cxone-components/spinner.po';
import { FormAreaComponentPo } from 'cxone-qm-library/form-area.component.po';

// const protractorConfig = protHelper.getProtractorHelpers();

export default class FormDesignerPagePO {
    public ancestor: Locator;
    readonly page: Page;
    public defaultTimeoutInMillis: number;
    public spinner = new SpinnerPO('.apphttpSpinner .cxonespinner');
    public elements = {
        
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
    public saveModalWrapperElements = {
        
        wrapper: this.page.locator('.save-form-modal-wrapper'),
        
        closeButton: this.page.locator('.close-button'),
        
        formName: this.page.locator('input[name="formName"]'),
        
        cancelButton: this.page.locator('.modal-footer-wrapper .btn-secondary'),
        
        saveButton: this.page.locator('.modal-footer-wrapper .btn-primary'),
    }

    public constructor() {
        this.defaultTimeoutInMillis = 25000;
        this.ancestor = this.elements.container;
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

    async navigateTo(quickly?: boolean) {
        if (quickly) {
            await navigateQuicklyTo(protractorConfig.fdUtils.getPageIdentifierUrls('forms.form_Designer'), this.elements.sectionFormElement);
        } else {
            await navigateTo(protractorConfig.fdUtils.getPageIdentifierUrls('forms.form_Designer'), this.elements.sectionFormElement);
        }
    }

    async navigateToPageThroughBreadcrumb(pageWarningModal: boolean) {
        try {
            await $('li.breadcrumb-item a').click();
            if (pageWarningModal) {
                // await browser.wait(ExpectedConditions.visibilityOf($('.cxone-message-modal')), this.defaultTimeoutInMillis)
                await expect(this.page.locator('.cxone-message-modal')).toBeVisible(this.defaultTimeoutInMillis);
                await this.page.locator('button, input[type="button"], input[type="submit"] >> text = "Yes"').click();
                // await waitForSpinnerToDisappear();
                await this.spinner.waitForSpinnerToBeHidden();
                await this.navigateTo();
            } else {
                await this.navigateTo(true);
            }
        } catch {
            await this.navigateTo(true);
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
        await browser.wait(ExpectedConditions.stalenessOf(this.elements.warningFooterYesBtn), 10000);
    }

    async clickOnNoBtnInWarning(): Promise<any> {
        await expect(this.elements.warningFooterNoBtn).toBeVisible(10000);
        await this.elements.warningFooterNoBtn.click();
        await browser.wait(ExpectedConditions.stalenessOf(this.elements.warningFooterNoBtn), 10000);
    }

    async saveAndActivateForm(formName?, isNewForm?): Promise<any> {
        await expect(this.elements.saveAndActivateButton).toBeVisible(10000);
        await this.elements.saveAndActivateButton.click();
        if (isNewForm) {
            await expect(this.saveModalWrapperElements.wrapper).toBeVisible(10000);
            await this.saveModalWrapperElements.formName.sendKeys(formName);
            await this.saveModalWrapperElements.saveButton.click();
            await browser.wait(ExpectedConditions.stalenessOf(this.saveModalWrapperElements.wrapper), 10000);
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
        const elementsTab = this.page.locator('.tab-title >> Elements');
        await expect(elementsTab).toBeVisible(10000);
        await elementsTab.click();
        await expect(this.page.locator('.cxone-form-element')).toBeVisible(10000);
        
    }

    async clickOnQuestionBankTab(): Promise<any> {
        const elementsTab = await expect(this.page.locator('.tab-title >> Question Bank')).toBeVisible(10000);
        await expect(elementsTab).toBeVisible(10000);
        await elementsTab.click();
        await expect(this.page.locator('.cxone-question-bank')).toBeVisible(10000);

    }
}
