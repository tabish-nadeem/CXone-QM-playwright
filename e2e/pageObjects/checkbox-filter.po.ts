import { by, element, ElementFinder } from 'protractor';
import { CheckboxPO } from 'cxone-components/checkbox.po';
import { SingleselectDropdownPO } from 'cxone-components/singleselect-dropdown.po';
import { Utils } from '../../../../../../../tests/protractor/common/utils';
import { CategoryManagerPO } from 'cxone-qm-library/category-manager.po';

export class CheckboxFilterPO {
    public ancestor: ElementFinder;
    public highConfidenceCheckbox: CheckboxPO;
    public operationDropdown: SingleselectDropdownPO;
    public categoryManagerPO: CategoryManagerPO;

    public constructor(ancestor?: ElementFinder) {
        this.ancestor = ancestor || element(by.css('.checkbox-filter'));
        this.highConfidenceCheckbox = new CheckboxPO('enable-duration-checkbox');
        this.operationDropdown = new SingleselectDropdownPO('operation-dropdown');
        this.categoryManagerPO = new CategoryManagerPO(element(by.css('.category-list-modal-wrapper')));
    }

    public async clickWithScreenInteractionButton() {
        await Utils.click(this.ancestor.element(by.id('interaction-with-screen')));
    }

    public async clickWithoutScreenInteractionButton() {
        await Utils.click(this.ancestor.element(by.id('interaction-without-screen')));
    }

    public async clickAllInteractionsButton() {
        await Utils.click(this.ancestor.element(by.id('all-interaction')));
    }

    public async getSelectedInteractionButton() {
        return await Utils.getText(this.ancestor.element(by.css('.interaction-buttons-wrapper button.active')));
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
        return await Utils.isPresent(element(by.css(channelCheckbox.selector)));
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
        return await Utils.click(this.ancestor.element(by.css('button.filter-clear-btn')));
    }

    private getDirectionTypeSelector(directionLabel: string) {
        switch (directionLabel) {
            case 'Internal': return 'INTERNAL';
            case 'Incoming': return 'IN_BOUND';
            case 'Outgoing': return 'OUT_BOUND';
        }
    }

}
