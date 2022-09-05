import { browser, by, element, ElementFinder, ExpectedConditions } from 'protractor';
import { SingleselectDropdownPO } from 'cxone-components/singleselect-dropdown.po';
import { Utils } from '../../../../../../../tests/protractor/common/utils';

export class AgentBehaviorPO {
    public ancestor: ElementFinder;
    public defaultTimeoutInMillis: number;
    public elements;
    public agentBehaviorDropdown: SingleselectDropdownPO;

    public constructor(ancestorElement?: ElementFinder, defaultTimeoutInMillis = 20000) {
        this.defaultTimeoutInMillis = defaultTimeoutInMillis;
        this.ancestor = ancestorElement || element(by.css('.agent-behaviour'));
        this.elements = {
            clearButton: this.ancestor.element(by.css('button.filter-clear-btn'))
        };
    }

    public async isFilterPresent() {
        return await Utils.isPresent(this.ancestor);
    }

    public async setAgentBehaviorType(abTypeName,index) {
        this.agentBehaviorDropdown = new SingleselectDropdownPO(`agent-behavior-type_${index}`);
        await this.agentBehaviorDropdown.open();
        await this.agentBehaviorDropdown.selectItemByLabelWithoutSearchBox(abTypeName);
    }

    public async getSelectedAgentBehaviorType(index) {
        this.agentBehaviorDropdown = new SingleselectDropdownPO(`agent-behavior-type_${index}`);
        return this.agentBehaviorDropdown.getPlaceholder();
    }

    public async getSelectedAgentBehaviorScore(index,abScore) {
        const agentScore = await element(by.css(`#agentBehaviourSentiments_${index} > div`));
        return (agentScore.getAttribute('class'));
    }

    public async clearFilter() {
        return await Utils.click(this.elements.clearButton);
    }

    public async selectScore(abScore: string, index: number) {
        await browser.wait(ExpectedConditions.presenceOf(element(by.css(`#agentBehaviourSentiments_${index} #${abScore}`))), 10000);
        await browser.executeScript('arguments[0].click();', element(by.css(`#agentBehaviourSentiments_${index} #${abScore}`)));
    }

    public async deSelectScore(abScore: string, index: number) {
        await Utils.click(element(by.css(`#agentBehaviourSentiments_${index} #${abScore}`)));
    }

    public async addMoreAgentBehavior(index) {
        await browser.wait(ExpectedConditions.presenceOf(element(by.css('#agent-behavior-addBtn_0 .svg-sprite-icon'))), 10000);
        await browser.executeScript('arguments[0].click();', element(by.css('#agent-behavior-addBtn_0 .svg-sprite-icon')));
    }

    public async deleteAgentBehavior(index) {
        await browser.wait(ExpectedConditions.presenceOf(element(by.css(`#agent-behavior-deleteBtn_${index} .svg-sprite-icon`))), 10000);
        await browser.executeScript('arguments[0].click();', element(by.css(`#agent-behavior-deleteBtn_${index} .svg-sprite-icon`)));
    }

}
