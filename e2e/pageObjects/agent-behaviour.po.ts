import { Page, Locator } from "@playwright/test";
import { SingleselectDropdownPO } from 'cxone-components/singleselect-dropdown.po';
import { Utils } from '../../../../../../../tests/protractor/common/utils';

export class AgentBehaviorPO {
    public ancestor: Locator;
    readonly page:Page;
    readonly utils: Utils;
    public defaultTimeoutInMillis: number;
    public elements:any;
    public agentBehaviorDropdown: SingleselectDropdownPO;

    public constructor(ancestorElement?: Locator, defaultTimeoutInMillis = 20000) {
        this.defaultTimeoutInMillis = defaultTimeoutInMillis;
        this.ancestor = ancestorElement || this.page.locator('.agent-behaviour');
        this.elements = {
            clearButton: this.page.locator('button.filter-clear-btn')
        };
    }

    public async isFilterPresent() {
        return await this.utils.isPresent(this.ancestor);
    }

    public async setAgentBehaviorType(abTypeName: any,index: any) {
        this.agentBehaviorDropdown = new SingleselectDropdownPO(`agent-behavior-type_${index}`);
        await this.agentBehaviorDropdown.open();
        await this.agentBehaviorDropdown.selectItemByLabelWithoutSearchBox(abTypeName);
    }

    public async getSelectedAgentBehaviorType(index: any) {
        this.agentBehaviorDropdown = new SingleselectDropdownPO(`agent-behavior-type_${index}`);
        return this.agentBehaviorDropdown.getPlaceholder();
    }

    public async getSelectedAgentBehaviorScore(index,abScore) {
        const agentScore = await this.page.locator(`#agentBehaviourSentiments_${index} > div`);
        return (agentScore.getAttribute('class'));
    }

    public async clearFilter() {
        return await this.utils.click(this.elements.clearButton);
    }

    public async selectScore(abScore: string, index: number) {
        await browser.wait(ExpectedConditions.presenceOf(this.page.locator(`#agentBehaviourSentiments_${index} #${abScore}`)), 10000);
        await browser.executeScript('arguments[0].click();', this.page.locator(`#agentBehaviourSentiments_${index} #${abScore}`));
    }

    public async deSelectScore(abScore: string, index: number) {
        await Utils.click(this.page.locator(`#agentBehaviourSentiments_${index} #${abScore}`));
    }

    public async addMoreAgentBehavior(index: any) {
        await browser.wait(ExpectedConditions.presenceOf(this.page.locator('#agent-behavior-addBtn_0 .svg-sprite-icon')), 10000);
        await browser.executeScript('arguments[0].click();', this.page.locator('#agent-behavior-addBtn_0 .svg-sprite-icon'));
    }

    public async deleteAgentBehavior(index: any) {
        await browser.wait(ExpectedConditions.presenceOf(this.page.locator(`#agent-behavior-deleteBtn_${index} .svg-sprite-icon`)), 10000);
        await browser.executeScript('arguments[0].click();', this.page.locator(`#agent-behavior-deleteBtn_${index} .svg-sprite-icon`));
    }

}
