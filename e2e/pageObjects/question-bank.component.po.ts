import { Utils } from './../common/utils';
import { browser, by, element, ElementFinder, ExpectedConditions, WebElement } from 'protractor';
import { SpinnerPO } from 'cxone-components/spinner.po';

import {expect, Locator, Page} from "@playwright/test";
import { ExpectedCondition as EC } from 'expected-condition-playwright';

export class QuestionBankComponentPo {
    public ancestor: Locator;
    readonly page:Page;
    // public spinner = new SpinnerPO('.apphttpSpinner .cxonespinner');
    public spinner = Page.waitForSelector('[class="spinner spinner-bounce-middle"]'); //! need to ask   

    elements = {
        questionBankTab:Page.locator(('.tab-title')).textContent(),
        searchBox: Page.locator(('.cxone-question-bank .search-box * input')),
        searchboxClearBtn: Page.locator(('.search-box [iconname="icon-Close"]')),
        questionWrappers: element.all(('.cxone-question-bank * .question-wrapper')),
        noButtonDeletePopOver: Page.locator(('#btn-no')),
        yesButtonDeletePopOver: Page.locator(('#btn-yes')),
        dropAreaForm: Page.locator(('#droppable-area')),
        questionPopover: Page.locator(('.popover-content'))
    }
    locators = {
        questionTitle: Page.locator('.question-title'),
        deleteQuestion: Page.locator('[iconname="icon-Close"] .svg-sprite-icon')
    }

    async getAQuestionElement(questionText: any): Promise<ElementFinder> {
        const allQuestions = await this.elements.questionWrappers;
        for (let question of allQuestions) {
            if (await question.this.page.locator(this.locators.questionTitle).textContent() === questionText) {
                return question;
            }
        }
    }

    async getAllQuestionElement(): Promise<ElementFinder[]> {
        return this.elements.questionWrappers;
    }

    async clickQuestionBankTab(): Promise<any> {
        // await browser.wait(ExpectedConditions.visibilityOf(this.elements.questionBankTab), 10000);
        await this.page.waitForFunction(EC.invisibilityOf(this.elements.questionBankTab), { timeout: 10000 });
        return this.elements.questionBankTab.click();
    }

    async searchAQuestion(questionText: any): Promise<any> {
        // await browser.wait(ExpectedConditions.visibilityOf(this.elements.searchBox), 10000);
        await this.page.waitForFunction(EC.invisibilityOf(this.elements.searchBox), { timeout: 10000 });
        await this.elements.searchBox.clear();
        // await this.elements.searchBox.type(questionText);
        await this.page.keyboard.press(questionText);
        await Utils.delay(3000);
    }
    async clearSearchQuestionTextBox(): Promise<any> {
        // await browser.wait(ExpectedConditions.visibilityOf(this.elements.searchBox), 10000);
        await this.page.waitForFunction(EC.invisibilityOf(this.elements.searchBox), { timeout: 10000 });
        if (this.elements.searchboxClearBtn.isvisible()) {
            await this.page.evaluate('arguments[0].click();', this.elements.searchboxClearBtn);
        } else {
            await this.elements.searchBox.clear();
        }
        // await browser.sleep(3000);
        await Utils.delay(3000);
    }

    async getTooltipOfQuestionText(questionText: any): Promise<string> {
        let questionElem = await this.getAQuestionElement(questionText);
        // await browser.executeScript('arguments[0].scrollIntoView()', questionElem.getWebElement());
        await this.page.evaluate('arguments[0].scrollIntoView()', questionElem.getWebElement());
        // await browser.actions().mouseMove(questionElem).perform();
        await this.page.locator(questionElem).hover();
        await this.page.waitForFunction(EC.invisibilityOf(this.elements.questionPopover), { timeout: 10000 });
        return this.elements.questionPopover.textContent();
    }

    async deleteAQuestion(questionText: any, clickYes: any): Promise<any> {
        let questionElem = await this.getAQuestionElement(questionText);
        // await browser.executeScript('arguments[0].scrollIntoView()', questionElem.getWebElement());
        await this.page.evaluate('arguments[0].scrollIntoView()', questionElem.getWebElement());
        await this.page.waitForFunction(EC.invisibilityOf(questionElem.element(this.locators.deleteQuestion)), { timeout: 10000 });
        await this.page.evaluate('arguments[0].click();', questionElem.element(this.locators.deleteQuestion));
        if (clickYes) {
            // await browser.wait(ExpectedConditions.visibilityOf(this.elements.yesButtonDeletePopOver), 10000);
            await this.page.waitForFunction(EC.invisibilityOf(this.elements.yesButtonDeletePopOver), { timeout: 10000 });
            await this.elements.yesButtonDeletePopOver.click();
        } else {
            // await browser.wait(ExpectedConditions.visibilityOf(this.elements.noButtonDeletePopOver), 10000);
            await this.page.waitForFunction(EC.invisibilityOf(this.elements.noButtonDeletePopOver), { timeout: 10000 });
            await this.elements.noButtonDeletePopOver.click();
        }
        return this.spinner.waitForSpinnerToBeHidden(false, 60000);   //! need to ask 
    }

    async dragAQuestionToFormArea(questionText: any): Promise<any> {
        let questionElem = await this.getAQuestionElement(questionText);
        // await browser.executeScript('arguments[0].scrollIntoView()', questionElem.getWebElement());
        await this.page.evaluate('arguments[0].scrollIntoView()', questionElem.getWebElement());
        return this.simulateDragDrop(questionElem.getWebElement(), this.elements.dropAreaForm);
    }

    async simulateDragDrop(from: any, to: any) {
        await this.page.mouse.move(from);
        await this.page.mouse.down();
        await this.page.mouse.move(900,0);
        await this.page.mouse.move(to, {x:10,y:10})
        await this.page.mouse.up();
    }
}
