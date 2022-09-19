import {expect, Locator, Page} from "@playwright/test";

import { SingleselectDropdownPO } from './SingleselectDropdownPO';

export class ScoringModalComponentPo {
    readonly page: Page;
    public locators : any;
    public modalWrapper;
    public scoringModalTitle;
    public resetButton;
    public saveBtn;
    public cancelBtn;
    public cancelWarning;
    public cancelNoPopup;
    public cancelYesPopup;
    public closeButton;
    public closeWarning;
    public closeNoPopup;
    public closeYesPopup;
    public enableScoringCheckbox;
    public enableRankingCheckbox;
    public rankingLabel;
    public addRange;
    public scoringValidationMsg;
    public calculatedScore;
    public currentPoints;
    public formElements;
    public questionText;
    public scorableCheckbox;
    public maxPointSeletionLabel;
    public options;
    public scoreTextBox;
    public sectionScore;
    public requiredIcon;
    constructor(){
            this.modalWrapper= this.page.locator('.scoring-modal-wrapper * .cxone-modal-wrapper');
            this.scoringModalTitle= this.page.locator('.headerTitle');
            this.resetButton= this.page.locator('#scoring-modal-reset-btn');
            this.saveBtn= this.page.locator('#scoring-modal-footer-save-btn');
            this.cancelBtn= this.page.locator('#scoring-modal-footer-cancel-btn');
            this.cancelWarning= this.page.locator('cancel-popover-wrapper');
            this.cancelNoPopup= this.page.locator('#popup-cancel-no');
            this.cancelYesPopup= this.page.locator('#popup-cancel-yes');
            this.closeButton= this.page.locator('.modal-header-wrapper *.close-button');
            this.closeWarning= this.page.locator('.popover-content .closing-popup');
            this.closeNoPopup= this.page.locator('#close-popover');
            this.closeYesPopup= this.page.locator('#exit-yes-btn');
            this.enableScoringCheckbox= this.page.locator('[checkboxid="form-designer-enable-scoring-chk-box"] .cxone-checkbox input');
            this.enableRankingCheckbox= this.page.locator('[checkboxid="form-designer-ranking-enable-checkbox"] .cxone-checkbox');
            this.rankingLabel= this.page.locator('.note-ms-lbl');
            this.addRange= this.page.locator('#form-designer-ranking-add-btn');
            this.scoringValidationMsg= this.page.locator('[class*="error-label"]');
            this.calculatedScore= this.page.locator('.calculated-score');
            this.currentPoints= this.page.locator('.current-points');
            this.formElements= this.page.locator('.scoring-area .element-outer-wrapper');
            this.questionText= this.page.locator('.element-info-question');
            this.scorableCheckbox= this.page.locator('input[name*="scorableCheckbox"]');
            this.maxPointSeletionLabel= this.page.locator('.max-points-section');
            this.options= this.page.locator('.choice-row * input[id*="form-designer"]');
            this.scoreTextBox= this.page.locator('.numeric-selector-value');
            this.sectionScore= this.page.locator('.section-score-value'),
            this.requiredIcon= this.page.locator('[class="icon mandatory"]')

    }


    getScoringModal() {
        return this.modalWrapper;
    }

    async getValidationMessages(): Promise<string> {
        return this.scoringValidationMsg.textContent();
    }

    async getResetButton(): Promise<Locator> {
        await expect(this.resetButton).toBeVisible(10000);
        return this.resetButton;
    }

    async clickResetButton(): Promise<any> {
        await expect(this.resetButton).toBeVisible(10000);
        await this.resetButton.click();
    }

    async clickEnableScoring(): Promise<any> {
        await expect(this.enableScoringCheckbox).toBeVisible(10000);
        await this.page.evaluate('arguments[0].click();',this.enableScoringCheckbox)
        await expect(this.page.locator('.modal-body-wrapper *[disabled="false"]')).toBeVisible(10000);
    }

    async clickEnableRanking(): Promise<any> {
        await expect(this.enableRankingCheckbox).toBeVisible(10000);
        await this.page.evaluate('arguments[0].click();',this.enableRankingCheckbox);
    }

    async getSaveButton(): Promise<Locator> {
        return this.saveBtn;
    }

    async clickSaveButton(): Promise<any> {
        await expect(this.saveBtn).toBeVisible(10000);
        await this.saveBtn.click();
        await expect(this.saveBtn).toBeHidden(10000);
    }

    async clickCloseModalButton(isDirty:boolean, clickOnYes:boolean): Promise<any> {
        await this.closeButton.click();
        if (isDirty) {
            await expect(this.closeWarning).toBeVisible(10000);
            if (clickOnYes) {
                await this.closeYesPopup.click();
            } else {
                return this.closeNoPopup.click();
            }
        }
        await expect(this.modalWrapper).toBeHidden(10000);
    }

    async getCancelModalButton(): Promise<any> {
        return this.cancelBtn;
    }

    async clickCancelModalButton(isDirty:boolean, clickOnYes:boolean): Promise<any> {
        await this.cancelBtn.click();
        if (isDirty) {
            if (clickOnYes) {
                await expect(this.cancelYesPopup).toBeVisible(10000);
                await this.cancelYesPopup.click();
            } else {
                await expect(this.cancelNoPopup).toBeVisible(10000);
                return this.cancelNoPopup.click();
            }
        }
        await expect(this.modalWrapper).toBeHidden(10000);

    }

    async setFromRange(index:any, labelToSelect:any): Promise<any> {
        let fromRangeDD = this.page.locator('#form-designer-rank-from-drop-down-' + index);
        await expect(fromRangeDD).toBeVisible(10000);
        let fromRangeDDPO = new SingleselectDropdownPO(fromRangeDD);
        return fromRangeDDPO.selectItem(labelToSelect);
    }

    async setToRange(index:any, labelToSelect:any): Promise<any> {
        let toRangeDD = this.page.locator('#form-designer-rank-to-drop-down-' + index);
        await expect(toRangeDD).toBeVisible(10000);
        let fromRangeDDPO = new SingleselectDropdownPO(toRangeDD);
        return fromRangeDDPO.selectItem(labelToSelect);
    }

    async enterDisplayText(index:any, displayText:string): Promise<any> {
        let displayTextBox = this.page.locator('#form-designer-rank-display-text-' + index + ' * input');
        await expect(displayTextBox).toBeVisible(10000);
        await displayTextBox.clear();
        await displayTextBox.type(displayText);
    }

    async clickRemoveRangeButton(index:any): Promise<any> {
        let removeRangeButton = this.page.locator('#form-designer-rank-remove-range-' + index);
        await expect(removeRangeButton).toBeVisible(10000);
        await removeRangeButton.click();
    }

    async clickAddARangeButton(): Promise<any> {
        await expect(this.addRange).toBeVisible(10000);
        await this.addRange.click();
    }

    async addARange(index:any, fromRange:any, toRange:any, displayText:string): Promise<any> {
        await this.clickAddARangeButton();
        await this.setFromRange(index, fromRange);
        await this.setToRange(index, toRange);
        await this.enterDisplayText(index, displayText);
    }

    async getRangeValues(index:any): Promise<string[]> {
        let values: string[] = [];
        values.push(await this.page.locator('#form-designer-rank-from-drop-down-' + index + ' * .button-text').textContent());
        values.push(await this.page.locator('#form-designer-rank-to-drop-down-' + index + ' * .button-text').textContent());
        values.push(await this.page.locator('#form-designer-rank-display-text-' + index + ' * input').getAttribute('value'));
        return values;
    }

    async getAllFromRangeSelections(): Promise<any> {
        return this.page.locator('[id*="form-designer-rank-from-drop-down"] *.button-text').textContent();
    }

    async getAllToRangeSelections(): Promise<any> {
        return this.page.locator('[id*="form-designer-rank-from-drop-down"] *.button-text').textContent();
    }

    private async getQuestionElement(questionText:string): Promise<Locator> {
        let allElements = await this.formElements;
        for (let elem of allElements) {
            if ((await elem.element(this.locators.questionText).textContent()).replace(/\n/g, ' ').includes(questionText)) {
                return elem as Promise<Locator>;
            }
        }
    }

    async isQuestionRequired(questionText:string): Promise<boolean> {
        let questionElement = await this.getQuestionElement(questionText);
        return questionElement.element(this.locators.requiredIcon).isPresent();
    }

    async getScorableCheckboxOfAQuestion(questionText:string): Promise<Locator> {
        let questionElement = await this.getQuestionElement(questionText);
        return questionElement.element(this.locators.scorableCheckbox);
    }

    async clickScorableCheckboxOfAQuestion(questionText:string): Promise<any> {
        let questionElement = await this.getQuestionElement(questionText);
        await this.page.evaluate('arguments[0].scrollIntoView()',questionElement.getWebElement());
        await this.page.evaluate('arguments[0].click();',questionElement.element(this.locators.scorableCheckbox));
    }

    async selectQuestionOption(questionText:string, optionIndex:any): Promise<any> {
        let questionElement = await this.getQuestionElement(questionText);
        await this.page.evaluate('arguments[0].scrollIntoView()',questionElement.getWebElement());
        await (await questionElement.all(this.locators.options))[optionIndex].click();
    }

    async setScoringToQuestionOption(questionText:string, optionIndex:any, score:any): Promise<any> {
      let questionElement = await this.getQuestionElement(questionText);
      await this.page.evaluate('arguments[0].scrollIntoView()', questionElement.getWebElement());
      await (await questionElement.all(this.locators.scoreTextBox))[optionIndex].click();
      await (await questionElement.all(this.locators.scoreTextBox))[optionIndex].keyboard.press('Control+A');
      await (await questionElement.all(this.locators.scoreTextBox))[optionIndex].type(score);
    }
    async getScoringOfQuestionOption(questionText:string, optionIndex:any): Promise<any> {
        let questionElement = await this.getQuestionElement(questionText);
        await this.page.evaluate('arguments[0].scrollIntoView()', questionElement.getWebElement());
        return (await questionElement.all(this.locators.scoreTextBox))[optionIndex].getAttribute('value');
    }

    async getMaxPointsOfQuestion(questionText:string): Promise<string> {
        let questionElement = await this.getQuestionElement(questionText);
        return questionElement.element(this.locators.maxPointSeletionLabel).textContent();
    }

    async getSectionScoreAndPointsValue(sectionText:string): Promise<string> {
        let sectionElement = await this.getQuestionElement(sectionText);
        return sectionElement.all(this.locators.sectionScore).textContent();
    }

    async clickSetRecordingTab(): Promise<any> {
        await this.modalWrapper.locator('.tab-title >> text = SET SCORING').click();
        await expect(this.enableScoringCheckbox).toBeVisible(10000);
        
    }

    async clickSetRankingTab(): Promise<any> {
        await this.modalWrapper.locator('.tab-title', 'SET RANKING').click();
        await expect(this.enableRankingCheckbox).toBeVisible(10000);
    }

    async getCalculatedScore(): Promise<string> {
        return (await this.calculatedScore.textContent()).replace(/\n/g, ' ');
    }

    async getCurrentPoints(): Promise<string> {
        return (await this.currentPoints.textContent()).replace(/\n/g, ' ');
    }

    async clickQuestionOption(questionText:string, optionIndex:any): Promise<any> {
        let questionElement = await this.getQuestionElement(questionText);
        await this.page.evaluate('arguments[0].scrollIntoView()', questionElement.getWebElement());
        await this.page.evaluate('arguments[0].click();', (await questionElement.all(this.locators.options))[optionIndex]);
        
    }

}

