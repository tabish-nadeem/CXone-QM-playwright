import {expect, Locator, Page} from "@playwright/test";

import {SingleselectDropdownPO} from 'cxone-qm-library/singleselect-dropdown.po';

export class ScoringModalComponentPo {
    readonly page: Page;
    public elements : any;
    public locators : any;

    constructor(){
        this.elements = {
            modalWrapper: this.page.locator('.scoring-modal-wrapper * .cxone-modal-wrapper'),
            scoringModalTitle: this.page.locator('.headerTitle'),
            resetButton: this.page.locator('#scoring-modal-reset-btn'),
            saveBtn: this.page.locator('#scoring-modal-footer-save-btn'),
            cancelBtn: this.page.locator('#scoring-modal-footer-cancel-btn'),
            cancelWarning: this.page.locator('cancel-popover-wrapper'),
            cancelNoPopup: this.page.locator('#popup-cancel-no'),
            cancelYesPopup: this.page.locator('#popup-cancel-yes'),
            closeButton: this.page.locator('.modal-header-wrapper *.close-button'),
            closeWarning: this.page.locator('.popover-content .closing-popup'),
            closeNoPopup: this.page.locator('#close-popover'),
            closeYesPopup: this.page.locator('#exit-yes-btn'),
            enableScoringCheckbox: this.page.locator('[checkboxid="form-designer-enable-scoring-chk-box"] .cxone-checkbox input'),
            enableRankingCheckbox: this.page.locator('[checkboxid="form-designer-ranking-enable-checkbox"] .cxone-checkbox'),
            rankingLabel: this.page.locator('.note-ms-lbl'),
            addRange: this.page.locator('#form-designer-ranking-add-btn'),
            scoringValidationMsg: this.page.locator('[class*="error-label"]'),
            calculatedScore: this.page.locator('.calculated-score'),
            currentPoints: this.page.locator('.current-points'),
            formElements: this.page.locator('.scoring-area .element-outer-wrapper')
        }
        this.locators = {
            questionText: this.page.locator('.element-info-question'),
            scorableCheckbox: this.page.locator('input[name*="scorableCheckbox"]'),
            maxPointSeletionLabel: this.page.locator('.max-points-section'),
            options: this.page.locator('.choice-row * input[id*="form-designer"]'),
            scoreTextBox: this.page.locator('.numeric-selector-value'),
            sectionScore: this.page.locator('.section-score-value'),
            requiredIcon: this.page.locator('[class="icon mandatory"]')
        }

    }


    getScoringModal() {
        return this.elements.modalWrapper;
    }

    async getValidationMessages(): Promise<string> {
        return this.elements.scoringValidationMsg.textContent();
    }

    async getResetButton(): Promise<Locator> {
        await expect(this.elements.resetButton).toBeVisible(10000);
        return this.elements.resetButton;
    }

    async clickResetButton(): Promise<any> {
        await expect(this.elements.resetButton).toBeVisible(10000);
        await this.elements.resetButton.click();
    }

    async clickEnableScoring(): Promise<any> {
        await expect(this.elements.enableScoringCheckbox).toBeVisible(10000);
        await this.page.evaluate('arguments[0].click();',this.elements.enableScoringCheckbox)
        await expect(this.page.locator('.modal-body-wrapper *[disabled="false"]')).toBeVisible(10000);
    }

    async clickEnableRanking(): Promise<any> {
        await expect(this.elements.enableRankingCheckbox).toBeVisible(10000);
        await this.page.evaluate('arguments[0].click();',this.elements.enableRankingCheckbox);
    }

    async getSaveButton(): Promise<Locator> {
        return this.elements.saveBtn;
    }

    async clickSaveButton(): Promise<any> {
        await expect(this.elements.saveBtn).toBeVisible(10000);
        await this.elements.saveBtn.click();
        await expect(this.elements.saveBtn).toBeHidden(10000);
    }

    async clickCloseModalButton(isDirty:boolean, clickOnYes:boolean): Promise<any> {
        await this.elements.closeButton.click();
        if (isDirty) {
            await expect(this.elements.closeWarning).toBeVisible(10000);
            if (clickOnYes) {
                await this.elements.closeYesPopup.click();
            } else {
                return this.elements.closeNoPopup.click();
            }
        }
        await expect(this.elements.modalWrapper).toBeHidden(10000);
    }

    async getCancelModalButton(): Promise<any> {
        return this.elements.cancelBtn;
    }

    async clickCancelModalButton(isDirty:boolean, clickOnYes:boolean): Promise<any> {
        await this.elements.cancelBtn.click();
        if (isDirty) {
            if (clickOnYes) {
                await expect(this.elements.cancelYesPopup).toBeVisible(10000);
                await this.elements.cancelYesPopup.click();
            } else {
                await expect(this.elements.cancelNoPopup).toBeVisible(10000);
                return this.elements.cancelNoPopup.click();
            }
        }
        await expect(this.elements.modalWrapper).toBeHidden(10000);

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
        await expect(this.elements.addRange).toBeVisible(10000);
        await this.elements.addRange.click();
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
        let allElements = await this.elements.formElements;
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
      //FIXME:
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
        await this.elements.modalWrapper.locator('.tab-title >> text = SET SCORING').click();
        await expect(this.elements.enableScoringCheckbox).toBeVisible(10000);
        
    }

    async clickSetRankingTab(): Promise<any> {
        await this.elements.modalWrapper.locator('.tab-title', 'SET RANKING').click();
        await expect(this.elements.enableRankingCheckbox).toBeVisible(10000);
    }

    async getCalculatedScore(): Promise<string> {
        return (await this.elements.calculatedScore.textContent()).replace(/\n/g, ' ');
    }

    async getCurrentPoints(): Promise<string> {
        return (await this.elements.currentPoints.textContent()).replace(/\n/g, ' ');
    }

    async clickQuestionOption(questionText:string, optionIndex:any): Promise<any> {
        let questionElement = await this.getQuestionElement(questionText);
        await this.page.evaluate('arguments[0].scrollIntoView()', questionElement.getWebElement());
        await this.page.evaluate('arguments[0].click();', (await questionElement.all(this.locators.options))[optionIndex]);
        
    }

}

