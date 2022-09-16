import { Page, Locator,expect } from "@playwright/test";
import { SingleselectDropdownPO } from './SingleselectDropdownPO';
import { Utils } from '../common/utils';


export class AgentBehaviorPO {
   
    readonly page:Page;
    readonly utils: Utils;
    readonly defaultTimeoutInMillis: number;
    public agentBehaviorDropdown: SingleselectDropdownPO;
    readonly clearButton :Locator

    public constructor(page?: Page, defaultTimeoutInMillis = 20000) {
        this.defaultTimeoutInMillis = defaultTimeoutInMillis;
        this.page = page 
      this.clearButton = this.page.locator('button.filter-clear-btn')
      
       
    }

    public async isFilterPresent() {
        return await this.page.locator('.agent-behaviour').isPresent();
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
        return await this.clearButton.clicK();
    }

    public async selectScore(abScore: string, index: number) {
        // await this.page.wait(ExpectedCondition.presenceOf(this.page.locator(`#agentBehaviourSentiments_${index} #${abScore}`)), 10000);
        await expect(this.page.locator(`#agentBehaviourSentiments_${index} #${abScore}`).waitFor({state:'attached',timeout:10000})).isPresent()
        await this.page.executeScript('arguments[0].click();', this.page.locator(`#agentBehaviourSentiments_${index} #${abScore}`));
    }

    public async deSelectScore(abScore: string, index: number) {
    this.page.locator(`#agentBehaviourSentiments_${index} #${abScore}`).click();
    }

    public async addMoreAgentBehavior(index: any) {
        // await this.page.wait(ExpectedCondition.presenceOf(this.page.locator('#agent-behavior-addBtn_0 .svg-sprite-icon')), 10000);
        await expect(this.page.locator(`#agent-behavior-addBtn_0 .svg-sprite-icon`).waitFor({state:'attached',timeout:10000})).isPresent()
        await this.page.executeScript('arguments[0].click();', this.page.locator('#agent-behavior-addBtn_0 .svg-sprite-icon'));
    }

    public async deleteAgentBehavior(index: any) {
        // await browser.wait(ExpectedConditions.presenceOf(this.page.locator(`#agent-behavior-deleteBtn_${index} .svg-sprite-icon`)), 10000);
        await expect(this.page.locator(`#agent-behavior-deleteBtn_${index} .svg-sprite-icon`).waitFor({state:'attached',timeout:10000})).isPresent()
        await this.page.executeScript('arguments[0].click();', this.page.locator(`#agent-behavior-deleteBtn_${index} .svg-sprite-icon`));
    }

}
