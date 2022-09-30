import { by, element, ElementFinder } from 'protractor';
import { MultiselectDropdownPO } from 'cxone-components/multiselect-dropdown.po';
import { waitForSpinnerToDisappear } from '../../../../../../tests/protractor/common/prots-utils';
import { Utils } from '../common/utils';
import { Page, Locator } from "@playwright/test";

export class TeamsAndGroupsPO {
    // public ancestor: Locator;
    readonly page:Page;
    readonly utils: Utils;
    public teamsDropdown: MultiselectDropdownPO;
    public groupsDropdown: MultiselectDropdownPO;

    public constructor() {
        // this.ancestor = this.page.locator('.teams-and-groups-container');
        this.teamsDropdown = new MultiselectDropdownPO('teams-dropdown');
        this.groupsDropdown = new MultiselectDropdownPO('groups-dropdown');
    }

    public async selectTeams(teamNames: string[]) {
        await this.teamsDropdown.open();
        for (let i = 0; i < teamNames.length; i++) {
            await this.teamsDropdown.selectItem(teamNames[i], true);
            await waitForSpinnerToDisappear();
        }
        await this.teamsDropdown.close();
    }

    public async deselectGroups(groupNames: string[]) {
        await this.groupsDropdown.open();
        for (let i = 0; i < groupNames.length; i++) {
            await this.groupsDropdown.deselectItem(groupNames[i], true);
            await waitForSpinnerToDisappear();
        }
        await this.groupsDropdown.close();
    }

    public async deselectTeams(teamNames: string[]) {
        await this.teamsDropdown.open();
        for (let i = 0; i < teamNames.length; i++) {
            await this.teamsDropdown.deselectItem(teamNames[i], true);
            await waitForSpinnerToDisappear();
        }
        await this.teamsDropdown.close();
    }

    public async selectGroups(groupNames: string[]) {
        await this.groupsDropdown.open();
        for (let i = 0; i < groupNames.length; i++) {
            await this.groupsDropdown.selectItem(groupNames[i], true);
            await waitForSpinnerToDisappear();
        }
        await this.groupsDropdown.close();
    }

    public async getSelectedTeams() {
        const selection = await this.teamsDropdown.getPlaceholder();
        return selection;
    }

    public async getSelectedGroups() {
        const selection = await this.groupsDropdown.getPlaceholder();
        return selection;
    }

    public async getUsersCount() {
        return this.page.locator('.user-count-area .count').textContent();
    }

    public async isTeamsDropdownEnabled() {
        return !(await Utils.isPresent(this.page.locator('#teams-dropdown .dropdown-button.disabled')));
    }

    public async isGroupsDropdownEnabled() {
        return !(await Utils.isPresent(this.page.locator('#groups-dropdown .dropdown-button.disabled')));
    }

    public async clearFilters() {
        return Utils.click(this.page.locator('filter-clear-btn'));
    }

    public async getErrorMessage() {
        return this.page.locator('.error-message').textContent();
    }

    public async waitUntilVisible() {
         this.page.waitForSelector(this.page.locator(this.teamsDropdown.selector));
         this.page.waitForSelector(this.page.locator(this.groupsDropdown.selector));
         this.page.waitForSelector(this.page.locator('.user-count-area .count'));
    }
}
