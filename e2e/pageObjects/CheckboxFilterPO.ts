import { Page, Locator } from "@playwright/test";
import { CheckboxPO } from 'cxone-components/checkbox.po';
import { SingleselectDropdownPO } from './SingleselectDropdownPO';
import { Utils } from '../common/utils';
import { CategoryManagerPO } from './CategoryManagerPO';

export class CheckboxFilterPO {
   
    readonly page:Page;
    readonly utils: Utils;
    public highConfidenceCheckbox: CheckboxPO;
    public operationDropdown: SingleselectDropdownPO;
    public categoryManagerPO: CategoryManagerPO;

    public constructor(page:Page) {
        this.page= page
        // this.ancestor = ancestor || this.page.locator('.checkbox-filter');
        this.highConfidenceCheckbox = new CheckboxPO('enable-duration-checkbox');
        this.operationDropdown = new SingleselectDropdownPO('operation-dropdown');
        this.categoryManagerPO = new CategoryManagerPO(this.page.locator('.category-list-modal-wrapper'));
    }

    public async clickWithScreenInteractionButton() {
        await this.page.locator('#interaction-with-screen').click();
    }

    public async clickWithoutScreenInteractionButton() {
        await this.page.locator('#interaction-without-screen').click();
    }

    public async clickAllInteractionsButton() {
        await this.page.locator('#all-interaction').click();
    }

    public async getSelectedInteractionButton() {
        return await this.page.locator('.interaction-buttons-wrapper button.active').textContent();
    }

    public async toggleChannelByName(channelTypeLabel: string) {
        const channelCheckbox = new CheckboxPO(`QpMediaTypeMapper-checkbox-${channelTypeLabel.toUpperCase()}`);
        await channelCheckbox.click();
    }

    public async isChannelSelected(channelTypeLabel: string) {
        const channelCheckbox = new CheckboxPO(`QpMediaTypeMapper-checkbox-${channelTypeLabel.toUpperCase()}`);
        return await channelCheckbox.isChecked();
    }

    public async isChannelPresent(channelTypeLabel: string) {
        const channelCheckbox = new CheckboxPO(`QpMediaTypeMapper-checkbox-${channelTypeLabel.toUpperCase()}`);
        return await this.page.locator(channelCheckbox.selector).isPresent();
    }

    public async toggleCallDirectionByName(directionLabel: string) {
        let selector = this.getDirectionTypeSelector(directionLabel);
        const directionCheckbox = new CheckboxPO(`DirectionType-checkbox-${selector}`);
        await directionCheckbox.click();
    }

    public async isChannelDirectionSelected(directionLabel: string) {
        let selector = this.getDirectionTypeSelector(directionLabel);
        const directionCheckbox = new CheckboxPO(`DirectionType-checkbox-${selector}`);
        return await directionCheckbox.isChecked();
    }

    public async clearFilter() {
        return await this.page.locator('button.filter-clear-btn').click();
    }

    private getDirectionTypeSelector(directionLabel: string) {
        switch (directionLabel) {
            case 'Internal': return 'INTERNAL';
            case 'Incoming': return 'IN_BOUND';
            case 'Outgoing': return 'OUT_BOUND';
        }
    }

}
