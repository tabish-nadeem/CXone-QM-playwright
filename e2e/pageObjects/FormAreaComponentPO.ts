
import {SpinnerPO} from 'cxone-components/spinner.po';
import {expect, Locator, Page} from "@playwright/test";
import { Utils } from '../common/utils';


export class FormAreaComponentPo {
    readonly page: Page;
    readonly elementLocators: any;
    readonly utils: Utils;
    readonly spinner = new SpinnerPO('.apphttpSpinner .cxonespinner');
    public  formArea                      :Locator
    public  sectionDroppableArea:Locator
    public  dropAreaForm:Locator
    public  inlineToolbar:Locator
    public  formQuestionElements:Locator
    public  sectionQuestionElements:Locator
    public  elementsTooltipBody:Locator
    public  elementsTooltipTitle:Locator
    public  elementsTooltipContent:Locator
    public  elementNumber:Locator
    public  froalaBold:Locator
    public  froalaItalic:Locator
    public  froalaUnderline:Locator
    public  froalaFontFamily:Locator
    public  froalaFontSize:Locator
    public  froalaColorPicker:Locator
    public  froalaAlignment:Locator
    public  froalaColorInputField:Locator
    public  froalaColorCodeSubmit:Locator
    public  questionElement:Locator
    public  requiredIcon:Locator
    public  criticalQuestionIcon:Locator
    public  questionText:Locator
    public  timeElement:Locator
    public  addRulesIcon:Locator
    public  autoResponseIcon:Locator
    public  copyElementIcon:Locator
    public  saveElementIcon:Locator
    public  deleteElementIcon:Locator
    public  hintText:Locator
    public  instructionsText:Locator
    public  sectionDropArea:Locator
    public  singleSelectDropDown:Locator
    public  multiSelectDropDown:Locator
    public  textBox:Locator
    public  textArea:Locator
    public  checkboxWrappers:Locator
    public  yesNoWrappers:Locator
    public  radioWrappers:Locator
    public  datePickerWrapper:Locator
    public  timePickerWrapper:Locator
    public  requiredText:Locator
    constructor(page:Page) {
        this.page = page
        this.page  = this.page.locator('.form-area-wrapper')
        
           this. formArea= this.page.locator('#form-designer-form-area'),
           this. sectionDroppableArea = this.page.locator('.section-droppable-area section-style'),
           this. dropAreaForm = this.page.locator('#droppable-area'),
           this. inlineToolbar = this.page.locator('xpath=//*[contains(@class,"fr-toolbar") and contains(@style, "display: block")]'),
           this. formQuestionElements = this.page.locator('.form-element-div'),
           this. sectionQuestionElements = this.page.locator('.section-form-element-div'),
           this. elementsTooltipBody = this.page.locator('.popover-body'),
           this. elementsTooltipTitle = this.page.locator('.components-tooltip-title'),
           this. elementsTooltipContent = this.page.locator('.components-tooltip-content'),
           this. elementNumber = this.page.locator('.element-numbering'),
           this. froalaBold = this.page.locator('[id*="bold-"] i'),
           this. froalaItalic = this.page.locator('[id*="italic-"] i'),
           this. froalaUnderline = this.page.locator('[id*="underline-"] i'),
           this. froalaFontFamily = this.page.locator('[id*="fontFamily-"] i'),
           this. froalaFontSize = this.page.locator('[id*="fontSize-"] i'),
           this. froalaColorPicker = this.page.locator('[id*="color-"] i'),
           this. froalaAlignment = this.page.locator('[id*="align-"] i'),
           this. froalaColorInputField =this.page.locator('[id*="fr-color-hex-layer-text"]'),
           this. froalaColorCodeSubmit = this.page.locator('.fr-submit >> text = OK')
      
           this. questionElement = this.page.locator('[class*="form-element-div"]'),
           this. formArea = this.page.locator('#form-designer-form-area'),
           this. requiredIcon = this.page.locator('[class="icon mandatory"]'),
           this. criticalQuestionIcon = this.page.locator('[class="icon critical-question"]'),
           this. questionText =this.page.locator('.element-info-question'),
           this. timeElement = this.page.locator('.time-element'),
           this. addRulesIcon =this.page.locator('[iconname="icon-Logic"]'),
           this. autoResponseIcon = this.page.locator('[iconname="icon-Auto-Answer"]'),
           this. copyElementIcon =this.page.locator('[iconname="icon-copy"]'),
           this. saveElementIcon = this.page.locator('[iconname="icon-save"]'),
           this. deleteElementIcon = this.page.locator('[iconname="icon-delete"]'),
           this. hintText = this.page.locator('.textAreaSubTextForCharLimit'),
           this. instructionsText = this.page.locator('.sub-text'),
           this. sectionDropArea = this.page.locator('.section-droppable-area'),
           this. singleSelectDropDown = this.page.locator('.cxone-singleselect-dropdown'),
           this. multiSelectDropDown = this.page.locator('.cxone-multiselect-dropdown'),
           this. textBox = this.page.locator('#form-designer-answer-text-field'),
           this. textArea =this.page.locator('.answer-text-area-in-form-area ng-untouched'),
           this. checkboxWrappers =this.page.locator('.designer-checkbox'),
           this. yesNoWrappers = this.page.locator('.yesno-radio-btn'),
           this. radioWrappers = this.page.locator('[ng-reflect-radio-id*="form-designer-radio-option"]'),
           this. datePickerWrapper = this.page.locator('.cxone-datepicker-container'),
           this. timePickerWrapper =this.page.locator('.cxone-time-picker'),
           this. requiredText = this.page.locator('.element-info-attributes')
       
    }

    /*
    * This function gets the most outer element of any form area element
    * @param <elementText> string
    * @param <elementType> string
    * @return(s) Locator
    * s*/
    async getElementOnFormArea(elementText:string, elementType:string): Promise<any> {
        let currentElement: any;
        let finalElemType = (elementType.toLowerCase() === 'date' || elementType.toLowerCase() === 'time')
            ? 'datetime' : elementType.toLowerCase();
        let allElements = await this.page.formArea.all(this.page.locator('[class*="form-element-div"][element-type=' + finalElemType + ']'));
        for (let elem of allElements) {
            currentElement = elem;
            if (elementType.toLowerCase() === 'time') {
                currentElement = elem.element(this.elementLocators.timeElement);
            }
            if ((await currentElement.element(this.elementLocators.questionText).getText()).replace(/\n/g, ' ').includes(elementText)) {
                await expect(elem).toBeVisible(10000);
                
                return elem as Promise<Locator>;
            }
        }
        return false;
    }   

    async clickElementOnFormArea(elementText:string, elementType:string): Promise<any> {
        return (await this.getElementOnFormArea(elementText, elementType)).click() as Promise<any>;
    }

    async getElementInsideSection(elementText:string, elementType:string): Promise<any> {
        let currentElement;
        let finalElemType = (elementType.toLowerCase() === 'date' || elementType.toLowerCase() === 'time')
            ? 'datetime' : elementType.toLowerCase();
        let allElements = await this.page.formArea.all(this.page.locator('[class*="section-form-element-div"][element-type=' + finalElemType + ']'));
        for (let elem of allElements) {
            currentElement = elem;
            if (elementType.toLowerCase() === 'time') {
                currentElement = elem.element(this.elementLocators.timeElement);
            }
            if ((await currentElement.element(this.elementLocators.questionText).getText()).replace(/\n/g, ' ') === elementText) {
                await expect(elem).toBeVisible(10000);
                return elem as Promise<Locator>;
            }
        }
        return false;
    }

    async clickElementInsideSection(elementText:string, elementType:string): Promise<any> {
        return (await this.getElementInsideSection(elementText, elementType)).click() as Promise<any>;
    }

    async getRequiredIcon(elementText:string, elementType:string): Promise<Locator> {
        let elem = await this.getElementOnFormArea(elementText, elementType);
        return elem.element(this.elementLocators.requiredIcon) as Promise<Locator>;
    }

    async getCriticalQuestionIcon(elementText:string, elementType:string): Promise<Locator> {
        let elem = await this.getElementOnFormArea(elementText, elementType);
        return elem.element(this.elementLocators.criticalQuestionIcon) as Promise<Locator>;
    }

    async getQuestionTextOfAnElement(questionElement:any): Promise<string> {
        return questionElement.element(this.elementLocators.questionText).getText() as Promise<string>;
    }

    async getActualQuestionTextOfAnElement(index:any): Promise<string> {
        let elem = this.page.formQuestionElements.get(index);
        return elem.element(this.elementLocators.actualQuestionText).getText() as Promise<string>;
    }

    async clickQuestionTextOfAnElement(elementText:string, elementType:string): Promise<any> {
        let elem = await this.getElementOnFormArea(elementText, elementType);
        await expect(elem).toBeVisible(10000);
        return elem.element(this.elementLocators.questionText).locator('.froala-element .fr-wrapper').click() as Promise<any>;
    }

    async getAddRulesIcon(elementText:string, elementType:string): Promise<Locator> {
        let elem = await this.getElementOnFormArea(elementText, elementType);
        return elem.element(this.elementLocators.addRulesIcon) as Promise<Locator>;
    }

    async getAutoResponseIcon(elementText:string, elementType:string): Promise<Locator> {
        let elem = await this.getElementOnFormArea(elementText, elementType);
        return elem.element(this.elementLocators.autoResponseIcon) as Promise<Locator>;
    }

    async clickAutoResponseRulesIcon(elementText:string, elementType:string): Promise<any> {
        await (await this.getAutoResponseIcon(elementText, elementType)).click();
        return await expect(this.page.locator('.create-auto-answer-rule-modal-wrapper')).toBeVisible(10000)
    }

    async clickAddRulesIcon(elementText:string, elementType:string): Promise<any> {
        await (await this.getAddRulesIcon(elementText, elementType)).click();
        return await expect(this.page.locator('.create-edit-rule-modal-wrapper')).toBeVisible(10000)
    }

    async getCopyElementIcon(elementText:string, elementType:string): Promise<Locator> {
        await this.clickQuestionTextOfAnElement(elementText, elementType);
        let elem = await this.getElementOnFormArea(elementText, elementType);
        return elem.element(this.elementLocators.copyElementIcon) as Promise<Locator>;
    }

    async clickCopyElementIcon(elementText:string, elementType:string): Promise<any> {
        return (await this.getCopyElementIcon(elementText, elementType)).click() as Promise<any>;
    }

    async getSaveElementIcon(elementText:string, elementType:string): Promise<Locator> {
        await this.clickQuestionTextOfAnElement(elementText, elementType);
        let elem = await this.getElementOnFormArea(elementText, elementType);
        return elem.element(this.elementLocators.saveElementIcon) as Promise<Locator>;
    }

    async clickSaveElementIcon(elementText:string, elementType:string): Promise<any> {
        await (await this.getSaveElementIcon(elementText, elementType)).click();
        return this.spinner.waitForSpinnerToBeHidden(false, 60000);
    }

    async getDeleteElementIcon(elementText:string, elementType:string): Promise<Locator> {
        await this.clickQuestionTextOfAnElement(elementText, elementType);
        let elem = await this.getElementOnFormArea(elementText, elementType);
        return elem.element(this.elementLocators.deleteElementIcon) as Promise<Locator>;
    }

    async clickDeleteElementIcon(elementText:string, elementType:string): Promise<any> {
        return (await this.getDeleteElementIcon(elementText, elementType)).click() as Promise<any>;
    }

    async getHintTextElement(elementText:string, elementType:string): Promise<Locator> {
        let elem = await this.getElementOnFormArea(elementText, elementType);
        return elem.element(this.elementLocators.hintText) as Promise<Locator>;
    }

    async getHintText(elementText:string, elementType:string): Promise<string> {
        return (await this.getHintTextElement(elementText, elementType)).textContent() as Promise<string>;
    }

    async getInstructionsTextElement(elementText:string, elementType:string): Promise<Locator> {
        let elem = await this.getElementOnFormArea(elementText, elementType);
        return elem.element(this.elementLocators.instructionsText) as Promise<Locator>;
    }

    async getInstructionText(elementText:string, elementType:string): Promise<string> {
        return (await this.getInstructionsTextElement(elementText, elementType)).textContent() as Promise<string>;
    }

    async getFormArea(): Promise<Locator> {
        await expect(this.page.formArea).isVisible(10000);
        return this.page.formArea;
    }

    async clickFormArea(): Promise<any> {
        return (await this.getFormArea()).click() as Promise<any>;
    }

    async mouseHoverOnElement(elementType): Promise<any> {
        let elem = '.components-panel *[element-type="' + elementType + '"]';
        await expect(this.page.locator(elem)).isVisible(30000);
        await this.page.mouse.move(this.page.locator(elem));
        await this.page.locator(elem).hover();
    }

    async getElementTooltipTitle(): Promise<string> {
        await expect(this.page.pageTooltipBody).isVisible(5000);
        return await this.page.pageTooltipTitle.textContent();
    }

    async getElementTooltipContent(): Promise<string> {
        await expect(this.page.pageTooltipBody).isVisible(5000);
        return await this.page.pageTooltipContent.textContent();
    }

    // async simulateDragDrop(from: WebElement, to: WebElement) {
    //     await browser.driver.actions().mouseMove(from).perform();
    //     await browser.driver.actions().mouseDown().perform();
    //     await browser.actions().mouseMove({x: 900, y: 0}).perform();
    //     await browser.actions().mouseMove(to, {x: 10, y: 10}).perform();
    //     await browser.actions().mouseUp().perform();
    // }
    
    async simulateDragDrop(from: any, to: any) {
        await this.page.mouse.move(from);
        await this.page.mouse.down();
        await this.page.mouse.move(900,0);
        await this.page.mouse.move(to, {x:10,y:10})
        await this.page.mouse.up();
    }

    async dragElementToFormArea(elementType: string): Promise<any> {
        const from = await this.page.locator(`.cxone-form-element .draggable-item.cdk-drag[element-type="${elementType}"]`).getWebElement();
        const to = await (this.page.dropAreaForm).getWebElement();
        await this.simulateDragDrop(from, to);
    }

    async dragElementToSection(elementType:any, sectionName:string): Promise<any> {
        const from = await this.page.locator(`.cxone-form-element .draggable-item.cdk-drag[element-type="${elementType}"]`).getWebElement();
        const sectionElementDropArea = (await this.getElementOnFormArea(sectionName, 'section')).element(this.elementLocators.sectionDropArea);
        await expect(sectionElementDropArea).toBeVisible(10000);
        await sectionElementDropArea.click();
        await this.simulateDragDrop(from, sectionElementDropArea);
    }

    async dragElementFromFormAreaToSection(elementType:any, sectionName:string): Promise<any> {
        const from = await this.page.locator(`.form-element-div.cdk-drag[element-type="${elementType}"]`).getWebElement();
        const sectionElementDropArea = (await this.getElementOnFormArea(sectionName, 'section')).element(this.elementLocators.sectionDropArea);
        await expect(sectionElementDropArea).isVisible(10000);
        await sectionElementDropArea.click();
        await this.simulateDragDrop(from, sectionElementDropArea);
    }

    async dragElementOutsideSection(fromElementText:string, fromElementType:any): Promise<any> {
        const from = (await this.getElementOnFormArea(fromElementText, fromElementType)).getWebElement();
        const to = await (this.page.dropAreaForm).getWebElement();
        await this.simulateDragDrop(from, to);
    }

    async dragElementSectionToSection(fromElementText:string, fromElementType:any, targetSectionName:string): Promise<any> {
        const from = (await this.getElementInsideSection(fromElementText, fromElementType)).getWebElement();
        const to = (await this.getElementOnFormArea(targetSectionName, 'section')).element(this.elementLocators.sectionDropArea);
        await expect(to).toBeVisible(10000);
        await to.click();
        await this.simulateDragDrop(from, to);
    }

    async moveElementIndexToIndex(startIndex:number, endIndex:number): Promise<any> {
        let start = this.page.formQuestionElements.get(startIndex);
        let end = this.page.formQuestionElements.get(endIndex);
        await this.page.mouse.move(start).down();
        await this.page.mouse.move(end);
        await this.page.mouse.move(0,5);
        await this.page.mouse.up()

        return this.utils.delay(1000);
    }

    async getCountOfElementsInForm(): Promise<any> {
        return await this.page.formQuestionElements.count();
    }

    async getCountOfSectionElementsInForm(): Promise<any> {
        return await this.page.sectionQuestionElements.count();
    }

    async getAllElementInsideASection(sectionName): Promise<Locator[]> {
        let sectionElement = (await this.getElementOnFormArea(sectionName, 'section'));
        return sectionElement.all(this.elementLocators.questionElement) as Promise<Locator[]>;
    }

    async selectQuestionText(): Promise<any> {
        await this.utils.delay(1000);
        await this.page.mouse.down()
        await this.page.keyboard.down('Control+a');
        await expect(this.page.inlineToolbar).toBeVisible(10000);
        return await this.page.keyboard.up('Control') as Promise<any>;
    }

    async setLabel(elementText:string, newElementText:string, elementType:string): Promise<any> {
        await this.clickQuestionTextOfAnElement(elementText, elementType);
        await this.selectQuestionText();
        return await this.page.keyboard.insertText(newElementText) as Promise<any>;
    }

    async getMandatoryText(): Promise<any> {
        await expect(this.elementLocators.requiredText).toBeVisible(10000);
        return await this.elementLocators.requiredText.getText();
    }

    async getNumbering(index:number): Promise<any> {
        return await this.page.elementNumber.get(index).textContent();
    }

    async getQuestionSubElements(elementText:string, elementType:string): Promise<any> {
        let subElements = {
            singleSelectDropDown: undefined,
            multiSelectDropDown: undefined,
            textBox: undefined,
            textArea: undefined,
            checkboxes: undefined,
            yesNoButtons: undefined,
            radioButtons: undefined,
            datePicker: undefined,
            timePicker: undefined
        };
        let elem = await this.getElementOnFormArea(elementText, elementType);
        subElements.singleSelectDropDown = elem.element(this.elementLocators.singleSelectDropDown);
        subElements.multiSelectDropDown = elem.element(this.elementLocators.multiSelectDropDown);
        subElements.textBox = elem.element(this.elementLocators.textBox);
        subElements.textArea = elem.element(this.elementLocators.textArea);
        subElements.checkboxes = await elem.element(this.elementLocators.checkboxWrappers);
        subElements.yesNoButtons = await elem.element(this.elementLocators.yesNoWrappers);
        subElements.radioButtons = await elem.element(this.elementLocators.radioWrappers);
        subElements.datePicker = elem.element(this.elementLocators.datePickerWrapper);
        subElements.timePicker = elem.element(this.elementLocators.timePickerWrapper);
        return subElements;
    }

    async froalaSetLabel(elementText:string, newElementText:string, elementType:string): Promise<any> {
        await this.clickQuestionTextOfAnElement(elementText, elementType);
        await this.selectQuestionText();
        await this.page.keyboard.insertText(newElementText) as Promise<any>;

        await this.utils.delay(500);
    }

    async froalaSetBold(elementText:string, elementType:string): Promise<any> {
        await this.clickQuestionTextOfAnElement(elementText, elementType);
        await this.selectQuestionText();
        await this.page.froalaBold.click();
        await this.utils.delay(500);
    }

    async froalaSetItalic(elementText:string, elementType:string): Promise<any> {
        await this.clickQuestionTextOfAnElement(elementText, elementType);
        await this.selectQuestionText();
        await this.page.froalaItalic.click();
        await this.utils.delay(500);
    }

    async froalaSetUnderLine(elementText:string, elementType:string): Promise<any> {
        await this.clickQuestionTextOfAnElement(elementText, elementType);
        await this.selectQuestionText();
        await this.page.froalaUnderline.click();
        await this.utils.delay(500);
    }

    async froalaSetFontFamily(elementText:string, elementType:string, fontFamily:string): Promise<any> {
        await this.clickQuestionTextOfAnElement(elementText, elementType);
        await this.selectQuestionText();
        await this.page.froalaFontFamily.click();
        await this.selectFromFroalaDropdown(fontFamily);
        await this.utils.delay(500);
    }

    async froalaSetFontSize(elementText:string, elementType:string, fontSize:any): Promise<any> {
        await this.clickQuestionTextOfAnElement(elementText, elementType);
        await this.selectQuestionText();
        await this.page.froalaFontSize.click();
        await this.selectFromFroalaDropdown(fontSize);
    }

    async froalaSetFontAlignment(elementText:string, elementType:string, fontAlignment:any): Promise<any> {
        await this.clickQuestionTextOfAnElement(elementText, elementType);
        await this.selectQuestionText();
        await this.page.froalaAlignment.click();
        await this.selectFromFroalaDropdown(fontAlignment);
    }

    private async selectFromFroalaDropdown(optionToSelect:any): Promise<any> {
        let elem = this.page.locator('.fr-dropdown-list *[role="option"][title="' + optionToSelect + '"]');
        await expect(elem).isVisible(10000);
        await elem.click();
    }

    async froalaSetFontColor(elementText:string, elementType:string, colorHexCode:any): Promise<any> {
        await this.clickQuestionTextOfAnElement(elementText, elementType);
        await this.selectQuestionText();
        await this.page.froalaColorPicker.click();
        await expect(this.page.froalaColorInputField).isVisible(10000);
        await this.page.evaluate('arguments[0].value=""', this.page.froalaColorInputField);
        await this.page.evaluate('arguments[0].value="' + colorHexCode + '"', this.page.froalaColorInputField);
        await this.page.froalaColorCodeSubmit.click();
        await this.utils.delay(500);
    }

    async getElementCssProperties(questionText, type): Promise<any> {
        const elem = await this.getElementOnFormArea(questionText, type);
        return {
            alignment: await elem.locator('.element-info-question .froala-element p').getCssValue('text-align'),
            fontFamily: await elem.locator('.element-info-question .froala-element span').getCssValue('font-family'),
            fontSize: await elem.locator('.element-info-question .froala-element span').getCssValue('font-size'),
            color: await elem.locator('.element-info-question .froala-element span').getCssValue('color'),
            isBold: await elem.locator('.element-info-question .froala-element strong').isPresent(),
            isItalic: await elem.locator('.element-info-question .froala-element em').isPresent(),
            isUnderlined: await elem.locator('.element-info-question .froala-element u').isPresent()
        };
    }

}
