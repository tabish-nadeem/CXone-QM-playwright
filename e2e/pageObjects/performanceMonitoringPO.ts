import { Page, Locator } from "@playwright/test";
import { Utils } from '../common/utils';
import { Helpers } from '../playwright.helpers';
import { URLs } from '../common/pageIdentifierURLs';
import { CommonUIUtils } from 'cxone-playwright-test-utils';
import { delay } from "rxjs/operators";


let utils: any;

export class PerformanceMonitoringPo {
    readonly pageHeader: any;
    readonly page: Page;
    readonly gridPO: any;
    readonly fromText: any;
    readonly toText: any;
    readonly avgScore: any;
    readonly teamsFilter: any;
    readonly groupsFilter: any;
    readonly fromDatePicker: any;
    readonly toDatePicker: any;
    readonly generateReport: any;
    readonly evaluateEmployee: any;
    readonly spinner: any;
    readonly reportModal: any;
    readonly evaluationEmployeeModal: Locator;
    readonly searchText: Locator;
    readonly inputText: Locator;
    readonly allChoiceRows: Locator;
    readonly firstChoice: Locator;
    readonly evaluateButton: Locator;
    readonly evaluatorsDropDown: Locator;
    readonly employeeDropDown: Locator;
    readonly selectEmployeeOption: Locator;
    readonly dropdownSearchText: Locator;
    readonly toastMessage: Locator;
    readonly toastCloseIcon: Locator;
    readonly formDropdownOptions: Locator;
    readonly formSearchText: Locator;
    readonly allOptions: Locator;
    readonly selectAll: Locator;
    readonly clearAll: Locator;
    readonly teamsDropdown: Locator;
    readonly groupsDropdown: Locator;
    readonly highlightedOptions: Locator;
    readonly selectDropdownOption: (options: String) => Locator;
    readonly selectEvaluatorOption: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pageHeader = page.locator('pm-page-title'),
            this.fromText = page.locator('#date-from input'),
            this.toText = page.locator('#date-to input'),
            this.avgScore = page.locator('#average-score'),
            this.fromDatePicker = page.locator('#date-from input'),
            this.toDatePicker = page.locator('#date-to input'),
            this.generateReport = page.locator('#generate-Report'),
            this.evaluateEmployee = page.locator('button[id="employee-evaluation-btn"]'),
            this.spinner = page.locator('div.spinner.spinner-bounce-middle'),
            this.reportModal = page.locator('.evaluation-report-modal-wrapper .cxone-modal-wrapper'),
            this.evaluationEmployeeModal = page.locator('.cxone-qm-evaluation-helper-component .cxone-modal-wrapper'),
            this.searchText = page.locator('#search-txt');
            this.firstChoice = page.locator(`.form-selection-row`);

            this.evaluateButton = page.locator(`.cxone-qm-evaluation-helper-component .save-btn`);
            this.evaluatorsDropDown = page.locator(`#evaluators-dropdown div div.dropdown-button`);
            this.employeeDropDown = page.locator(`#employee-dropdown div div.dropdown-button`);
            this.dropdownSearchText = page.locator(`.dropdown-popover-wrapper [class="cxone-text-input"] input`);
            this.highlightedOptions = page.locator(`div.options-wrapper span.highlighted`);
            this.selectDropdownOption = (options: String) => {
                return page.locator(`div.options-wrapper .item-row.div:has-text("${options}")`);
            }
            this.selectEvaluatorOption = page.locator(`div.item-row .item-text span`);
            this.selectEmployeeOption = page.locator(`div.item-row .item-text span`);
            this.formDropdownOptions = page.locator(`div.form-selection-row`);
            this.formSearchText = page.locator(`input[name=searchTxt]`);
            this.toastMessage = page.locator(`.toast-bottom-right.toast-container`);
            this.toastCloseIcon = page.locator(`.toast-close-button`);
            this.allOptions = page.locator(`div.options-wrapper`);
            this.selectAll = page.locator(`div span.select-all-btn`);
            this.clearAll = page.locator(`div span.clear-all-btn`);
            this.teamsDropdown = page.locator(`#teams-filter div.dropdown-button`);
            this.groupsDropdown = page.locator(`#groups-filter div.dropdown-button`);

        this.groupsFilter = page.locator('#groups-filter');
        this.teamsFilter = page.locator('#teams-filter');
        //////////////
        this.inputText = page.locator('.search-wrapper input');
        this.allChoiceRows = page.locator('.item-row:not([class~="active"])');
    }

    async navigate() {
        await this.page.waitForLoadState('load');
        let baseUrl = await Helpers.getBaseUrl();
        await this.page.goto( baseUrl + URLs.myZone.performanceMonitoring), { timeout: 20000, waitUntil: "load" };
        await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        await this.page.waitForSelector(`#ng2-performance-monitoring`);
        console.log("Navigated to perf page successfully");
    }

    async navigateToMySchedule() {
        await this.page.waitForLoadState('load');
        await this.page.goto(await Helpers.getBaseUrl() + URLs.wfm.mySchedule), { timeout: 20000, waitUntil: "load" };
        await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        await this.page.waitForSelector(`.container-fluid`);
        console.log("Navigated to my schedule page successfully");
    }

    async getFromDateValue() {
        // let fromDateVal = await this.fromText.getAttribute('value');
        // let fromDateVal = await this.page.locator('input[id="cxone-date-picker-1"]').inputValue();
        // let fromDateVal = await this.page.inputValue('input[id="cxone-date-picker-1"]');
        let fromDateVal = await this.page.locator('input[id="cxone-date-picker-1"]').inputValue();
        console.log('fromDateVal()--->', fromDateVal);
        return fromDateVal;
    }

    async getToDateValue() {
        // let toDateVal = await this.toText.getAttribute('value');
        // let toDateVal = await this.page.inputValue('input[id="cxone-date-picker-2"]');
        let toDateVal = await this.page.locator('input[id="cxone-date-picker-2"]').inputValue();
        return toDateVal;
    }

    async setFromDate(fromDate: any) {
        await this.fromDatePicker.isVisible();
        await this.fromDatePicker.fill(fromDate);
        await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        await this.page.keyboard.press('Tab');
        await this.page.waitForTimeout(3000);
    }

    async setToDate(toDate: any) {
        await this.toDatePicker.isVisible();
        await this.toDatePicker.fill(toDate);
        await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        await this.page.keyboard.press('Tab');
        await this.page.waitForTimeout(3000);
    }

    async getPerfMonitoringRowElements(value: string) {
        let row = this.page.locator(`//*[@col-id="pm_agentName"]//*[contains(text(),"${value}")]/../../../../..//*[@role='gridcell']`);
        // let row = this.page.locator('//*[@col-id="pm_agentName"]//*[@class="name" and text()="' + value + '"]/../../../..');
        let rowEle = await row.allTextContents();
        console.log('ROWELE------>', rowEle);
        await this.page.waitForTimeout(3000);
        return {
            // teams: await this.page.locator('[col-id="pm_teams"]').textContent(),
            // groups: await this.page.locator('[col-id="pm_groups"]').textContent(),
            // avgScore: await this.page.locator('[col-id="pm_averageScore"]').textContent(),
            // noOfEvaluations: await this.page.locator('[col-id="pm_numberOfEvaluations"]').textContent()
            teams: rowEle[1],
            groups: rowEle[2],
            avgScore: rowEle[3],
            noOfEvaluations: rowEle[4]
        };
    }

    async getAvgScore() {
        await this.page.waitForSelector('#average-score');
        return this.avgScore.textContent();
    }

    async getFilterComponentForTeams() {
        return this.teamsFilter;
    }

    getFilterComponentForGroups() {
        return this.groupsFilter;
    }

    async getTeamPlaceHolderValue() {
        return await this.teamsFilter.getPlaceholderText();
    }

    async getGroupPlaceHolderValue() {
        return await this.page.locator('div[class="button-text ng-tns-c12-6 ng-star-inserted"]').innerText();
    }
    public async selectAllClickGroup() {
        await this.openGroup();
        await this.page.locator('.select-all-btn').click();
    }

    async clearAllClickGroup() {
        let xyz = this.page.locator('#groups-filter');
        await xyz.click();
        console.log('CLICKED CLEAR GROUP');
        await this.page.locator('span[class="clear-all-btn"]').click();
        console.log('CLICKED CLEAR for Group');
    }
    async clearAllClickTeam() {
        let xyz = this.page.locator('#teams-filter');
        await xyz.click();
        console.log('CLICKED CLEAR TEAM')
        await this.page.locator('.clear-all-btn').click();
        console.log('CLICKED CLEAR for Team');
    }
    

    async clearAllSelectedGroups() {
        await this.clearAllClickGroup();
        console.log('clearAllClickGroup() is working');
        await this.page.locator('cxone-multiselect-dropdown[id="groups-filter"]').click();
        console.log('groupToSelect--->CLOSED');
    }

    async clearAllSelectedTeams() {
        await this.clearAllClickTeam();
        await this.page.locator('cxone-multiselect-dropdown[id="teams-filter"]').click();
        console.log('teamToSelect--->CLOSED');
    }

    async clickOnGenerateReportBtn() {
        await this.generateReport.click();
        await this.page.waitForTimeout(3000);
        await this.reportModal.isVisible();
    }

    async selectTeam(teamToSelect: any) {
        await this.selectItemByLabelTeam(teamToSelect);
        await this.page.locator('cxone-multiselect-dropdown[id="teams-filter"]').click();
        console.log('teamToSelect--->CLOSED');
    }

    async selectGroup(groupToSelect: any) {
        utils = new Utils(this.page);
        console.log('CHECKING if selectGroup is Work', groupToSelect);
        await this.selectItemByLabelGroup(groupToSelect);
        await utils.delay(4000);
        await this.page.locator('cxone-multiselect-dropdown[id="groups-filter"]').click();
        console.log('groupToSelect--->CLOSED');
    }
    /////////////
    async isOpen() {
        return this.page.locator('.dropdown-popover-wrapper').isVisible();
    }
    async openGroup() {
        let temp = await this.isOpen();
        console.log('OPEN TEMP GROUP', temp);
        if (!temp) {
            let xyz = this.page.locator('#groups-filter');
            await xyz.click();
            console.log('openGroup() is clicked');
            await this.page.locator('.dropdown-popover-wrapper.ng-tns-c12-6').isVisible();
        }
    }
    async openTeam() {
        let temp = await this.isOpen();
        console.log('OPEN TEMP TEAM', temp);
        if (!temp) {
            let xyz = this.page.locator('div[class="cxone-multiselect-dropdown"] div[aria-label="Select Teams"]');
            await xyz.click();
            await this.page.locator('.dropdown-popover-wrapper.ng-tns-c12-5').isVisible();
        }
    }
    async selectItemByLabelGroup(label: any) {
        console.log('selectItemByLabelGroup-LABEL -->', label);
        await this.openGroup();
        await this.inputText.fill("");
        await this.inputText.fill(label);
        await utils.delay(2000);
        return await this.allChoiceRows.first().click();
    }
    async selectItemByLabelTeam(label: any) {
        console.log('selectItemByLabelTeam-LABEL -->', label);
        await this.openTeam();
        await this.inputText.fill("");
        await this.inputText.fill(label);
        return await this.allChoiceRows.first().click();
    }
//------------------------------------------------------------------
    async startEmployeeEvaluation() {
        await this.evaluateEmployee.click();
        CommonUIUtils.waitUntilIconLoaderDone(this.page);
        await this.page.waitForSelector(`.cxone-qm-evaluation-helper-component .cxone-modal-wrapper`);
        console.log("Clicked New evaluate button");
    }

    async setEvaluator(name: string) {
        await this.evaluatorsDropDown.click();
        await this.allOptions.isVisible();
        await this.dropdownSearchText.type(name);
        CommonUIUtils.waitUntilIconLoaderDone(this.page);
        await this.selectEvaluatorOption.click();
    }

    async setEmployee(name: string) {
        await this.employeeDropDown.click();
        await this.allOptions.isVisible();
        await this.dropdownSearchText.type(name);
        CommonUIUtils.waitUntilIconLoaderDone(this.page);
        await this.selectEmployeeOption.click();
    }

    async selectForm(formName: string) {
        await this.formSearchText.type(formName);
        await this.formDropdownOptions.click({delay: 2000});
        await this.evaluateButton.click();
        CommonUIUtils.waitUntilIconLoaderDone(this.page);
    }

    async getToastMessage() {
        await this.page.waitForSelector(`.toast-bottom-right.toast-container`);
        return await this.toastMessage.textContent();
    }

    async toastClose() {
        await this.toastCloseIcon.click();
    }

    async selectAllSelectedTeams() {
        await this.teamsDropdown.click();
        await this.page.waitForSelector(`div.options-wrapper`);
        await this.selectAll.click({delay: 2000});
        CommonUIUtils.waitUntilIconLoaderDone(this.page);
        //await this.teamsDropdownIcon.click();
    }

    async selectAllSelectedGroups() {
        await this.groupsDropdown.click();
        await this.page.waitForSelector(`div.options-wrapper`);
        await this.selectAll.click({delay: 2000});
        CommonUIUtils.waitUntilIconLoaderDone(this.page);
        await this.groupsDropdown.click();
    }

    async clickRowByAgentName(agentName: string) {
        let row = this.page.locator('//*[@col-id="pm_agentName"]//*[contains(text(),"' + agentName + '")]/../../..');
        await row.click();
        await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        //await this.page.waitForLoadState('load');
        //await this.page.waitForNavigation({ timeout: 4000 });
    }
}