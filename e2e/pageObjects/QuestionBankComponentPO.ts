import { Utils } from '../common/utils';
import { expect, Locator, Page } from "@playwright/test";

let allQuestions: any;
export class QuestionBankComponentPo {
    readonly page: Page;
    readonly questionBankTab: Locator;
    readonly searchBox: Locator;
    readonly searchboxClearBtn: Locator;
    readonly questionWrappers: Locator;
    readonly noButtonDeletePopOver: Locator;
    readonly yesButtonDeletePopOver: Locator;
    readonly dropAreaForm: Locator;
    readonly questionPopover: Locator;
    readonly questionTitle: Locator;
    readonly deleteQuestion: Locator;

    // public spinner = Page.waitForSelector('[class="spinner spinner-bounce-middle"]'); //! need to ask   

    constructor(page: Page) {
        this.questionBankTab = this.page.locator(('.tab-title')),
            this.searchBox = this.page.locator(('.cxone-question-bank .search-box * input')),
            this.searchboxClearBtn = this.page.locator(('.search-box [iconname="icon-Close"]')),
            this.questionWrappers = this.page.locator(('.cxone-question-bank * .question-wrapper')),
            this.noButtonDeletePopOver = this.page.locator(('#btn-no')),
            this.yesButtonDeletePopOver = this.page.locator(('#btn-yes')),
            this.dropAreaForm = this.page.locator(('#droppable-area')),
            this.questionPopover = this.page.locator(('.popover-content')),
            this.questionTitle = this.page.locator('.question-title'),
            this.deleteQuestion = this.page.locator('[iconname="icon-Close"] .svg-sprite-icon')
    }

    async getAQuestionElement(questionText: any) {
        allQuestions = this.questionWrappers;
        for (let question of allQuestions) {
            if (await question.this.page.locator(this.questionTitle).textContent() === questionText) {
                return question;
            }
        }
    }

    async getAllQuestionElement() {
        return this.questionWrappers;
    }

    async clickQuestionBankTab() {
        // await browser.wait(ExpectedConditions.visibilityOf(this.questionBankTab), 10000);
        //await expect(this.page.locator(this.questionBankTab)).waitForSelector({ state: 'attached', timeout: 10000 }));
        return this.questionBankTab.click();
    }

    async searchAQuestion(questionText: any) {
        // await browser.wait(ExpectedConditions.visibilityOf(this.searchBox), 10000);

       // await expect(this.page.locator(this.searchBox).waitFor({ state: 'attached', timeout: 10000 }));
       // await this.searchBox.clear();
        // await this.searchBox.type(questionText);
        await this.page.keyboard.press(questionText);
        // await Utils.delay(3000);
    }
    async clearSearchQuestionTextBox() {
        // await browser.wait(ExpectedConditions.visibilityOf(this.searchBox), 10000);
       // await expect(this.page.locator(this.searchBox).waitFor({ state: 'attached', timeout: 10000 }));
        // if (this.searchboxClearBtn.isvisible()) {
        //     await this.page.evaluate('arguments[0].click();', this.searchboxClearBtn);
        // } else {
        //     await this.searchBox.clear();
        // }
        // await browser.sleep(3000);
        // await Utils.delay(3000);
    }

    async getTooltipOfQuestionText(questionText: any): Promise<string> {
        let questionElem = await this.getAQuestionElement(questionText);
        // await browser.executeScript('arguments[0].scrollIntoView()', questionElem.getWebElement());
        await this.page.evaluate('arguments[0].scrollIntoView()', questionElem.getWebElement());
        // await browser.actions().mouseMove(questionElem).perform();
        await this.page.locator(questionElem).hover();
        //await expect(this.page.locator(this.questionPopover).waitFor({ state: 'attached', timeout: 10000 }))
        return this.questionPopover.textContent();
    }

    async deleteAQuestion(questionText: any, clickYes: any) {
        let questionElem = await this.getAQuestionElement(questionText);
        // await browser.executeScript('arguments[0].scrollIntoView()', questionElem.getWebElement());
        await this.page.evaluate('arguments[0].scrollIntoView()', questionElem.getWebElement());
        //await expect(this.page.locator(this.deleteQuestion).waitFor({ state: 'attached', timeout: 10000 }))
        await this.page.evaluate('arguments[0].click();', questionElem.element(this.deleteQuestion));
        if (clickYes) {
            // await browser.wait(ExpectedConditions.visibilityOf(this.yesButtonDeletePopOver), 10000);
            //await expect(this.page.locator(this.yesButtonDeletePopOver).waitFor({ state: 'attached', timeout: 10000 }))
            await this.yesButtonDeletePopOver.click();
        } else {
            // await browser.wait(ExpectedConditions.visibilityOf(this.noButtonDeletePopOver), 10000);
            //await expect(this.page.locator(this.noButtonDeletePopOver).waitFor({ state: 'attached', timeout: 10000 }))
            await this.noButtonDeletePopOver.click();
        }
        // return this.spinner.waitForSpinnerToBeHidden(false, 60000);   //! need to ask 
    }

    async dragAQuestionToFormArea(questionText: any) {
        let questionElem = await this.getAQuestionElement(questionText);
        // await browser.executeScript('arguments[0].scrollIntoView()', questionElem.getWebElement());
        await this.page.evaluate('arguments[0].scrollIntoView()', questionElem.getWebElement());
        return this.simulateDragDrop(questionElem.getWebElement(), this.dropAreaForm);
    }

    async simulateDragDrop(from: any, to: any) {
       // await this.page.mouse.move(from);
        await this.page.mouse.down();
        await this.page.mouse.move(900, 0);
       // await this.page.mouse.move(to, { x: 10, y: 10 })
        await this.page.mouse.up();
    }
}