import { Page, Locator } from "@playwright/test";
import { CheckboxPO } from 'cxone-components/checkbox.po';
import { SingleselectDropdownPO } from 'cxone-components/singleselect-dropdown.po';
import { Utils } from '../../../../../../../tests/protractor/common/utils';
import { CategoryManagerPO } from 'cxone-qm-library/category-manager.po';

export class CheckboxFilterPO {
    ancestor: Locator;
    readonly page:Page;
    readonly utils: Utils;
    public highConfidenceCheckbox: CheckboxPO;
    public operationDropdown: SingleselectDropdownPO;
    public categoryManagerPO: CategoryManagerPO;

    public constructor(ancestor?: Locator) {
        this.ancestor = ancestor || this.page.locator('.checkbox-filter');
        this.highConfidenceCheckbox = new CheckboxPO('enable-duration-checkbox');
        this.operationDropdown = new SingleselectDropdownPO('operation-dropdown');
        this.categoryManagerPO = new CategoryManagerPO(this.page.locator('.category-list-modal-wrapper'));
    }

    public async clickWithScreenInteractionButton() {
        await this.utils.click(this.page.locator('#interaction-with-screen'));
    }

    public async clickWithoutScreenInteractionButton() {
        await this.utils.click(this.page.locator('#interaction-without-screen'));
    }

    public async clickAllInteractionsButton() {
        await this.utils.click(this.page.locator('#all-interaction'));
    }

    public async getSelectedInteractionButton() {
        return await this.utils.getText(this.page.locator('.interaction-buttons-wrapper button.active'));
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
        return await this.utils.isPresent(this.page.locator(channelCheckbox.selector));
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
        return await this.utils.click(this.page.locator('button.filter-clear-btn'));
    }

    private getDirectionTypeSelector(directionLabel: string) {
        switch (directionLabel) {
            case 'Internal': return 'INTERNAL';
            case 'Incoming': return 'IN_BOUND';
            case 'Outgoing': return 'OUT_BOUND';
        }
    }

}
