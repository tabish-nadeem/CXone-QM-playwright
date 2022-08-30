import { Page, Locator } from "@playwright/test";
import { CommonUIUtils } from "cxone-playwright-test-utils";
import { URLs } from "../common/pageIdentifierURLs";
import { Helpers } from "../playwright.helpers";
import { Utils } from "../common/utils";


let utils : any;

export class PerformanceDetailsPO {

    public columnDetails = {
        planName: '',
        formName: '',
        formVersion: '',
        workflowType: '',
        interactionDate: '',
        duration: '',
        evaluationDate: '',
        evaluatedBy: '',
        score: '',
        workflowStatus: '',
        evaluationSubject: ''
    };
    readonly scores: Locator;
    readonly page: Page;
    readonly modal: Locator;
    readonly container: Locator;
    readonly agentAverageScore: Locator;
    readonly l3SideBar: Locator;
    readonly l3MenuToggle: Locator;
    readonly loadingState: Locator;
    readonly selectRowValue: (value: any) => Locator;

    constructor(page: Page) {
        this.page = page;
            this.scores =  page.locator('.score-percentage');
            this.modal = page.locator('.delete-evaluation-reason-modal-wrapper');
            this.container = page.locator('div.ng2-performance-details');
            this.agentAverageScore = page.locator('agent-average-score');
            this.l3SideBar = page.locator('div.cxone-sidebar');
            this.l3MenuToggle = page.locator('div.content-wrapper .header');
            this.loadingState = page.locator('.in-progress-row');
            this.selectRowValue = (value) =>{
                return page.locator(`.//span[text()="${value}"]`);
            }
        };

    async navigate() {
        await this.page.waitForLoadState('load');
        await this.page.goto(await Helpers.getBaseUrl() + URLs.myZone.performanceDetailsPage), { timeout: 20000, waitUntil: "load" };
        await CommonUIUtils.waitUntilIconLoaderDone(this.page);
        await this.page.waitForSelector(`div.ng2-performance-details`);
        console.log("Navigated to perf details page successfully");
    }

    async getGridRowOfMatchingText(columnName, rowValue) {
        await this.page.waitForLoadState('domcontentloaded');
        let row = this.page.locator(`//*[@col-id="${columnName}"]//*[contains(text(),"${rowValue}")]/../../..`);
        const rowIndex = await row.getAttribute('row-index');
        return this.getGridRow(+rowIndex);
    }

    async getGridRow(rowIndex: number) {
        return this.page.locator(`div.ag-center-cols-container div.ag-row[row-index="${rowIndex}"]`);
    }

    async getRowDetails(columnName, rowValue, isEvaluationFT?) {
        utils = new Utils(this.page);

        await this.closeL3Menu();
        if (columnName === 'score') {
            await this.scrollLeft();
        }
        //let row = await this.getAgentRow(columnName, rowValue);
        let row = await this.getGridRowOfMatchingText(columnName, rowValue);
        console.log("Row--",row);


        //await .testUtils.waitUntilDisplayed(row);

        await this.scrollRight();
        console.log("Scrolled Right");
        // let columnInteractionDate = (await row.$('[col-id="dateOfInteraction"]')).textContent();
        // this.columnDetails.interactionDate = await columnInteractionDate;
        this.columnDetails.interactionDate = await row.locator('[col-id="dateOfInteraction"]').textContent();
        this.columnDetails.workflowType = await row.locator('[col-id="workflowType"]').textContent();
        this.columnDetails.duration = await row.locator('[col-id="duration"]').textContent();
        // if (isEvaluationFT) {
        //     this.columnDetails.evaluationSubject = await row.locator('[col-id="evaluationSubject"]').textContent();
        // }
        this.columnDetails.evaluationDate = await row.locator('[col-id="evaluatedOnDate"]').textContent();
        this.columnDetails.evaluatedBy = await row.locator('[col-id="evaluatedBy"]').textContent();
        this.columnDetails.score = await row.locator('[col-id="score"]').textContent();

        await this.scrollLeft();
        console.log("Scrolled Left");
        //let row2 = this.page.locator('.ag-center-cols-clipper [row-index="' + rowIndex + '"]');
        this.columnDetails.workflowStatus = await row.locator('[col-id="workflowStatus"]').textContent();
        this.columnDetails.planName = await row.locator('[col-id="planName"]').textContent();
        this.columnDetails.formName = await row.locator('[col-id="formName"]').textContent();
        this.columnDetails.formVersion = await row.locator('[col-id="formVersion"]').textContent();
        await this.scrollRight();
        console.log("Scrolled Right");
        console.log(this.columnDetails);
        return this.columnDetails;
    }

    async closeL3Menu() {
        if (!(await this.l3SideBar.getAttribute('class')).includes('sidebarCollapsed')) {
            await this.l3MenuToggle.click();
            await utils.delay(2000);
        }
    }

    async getAgentRow(colHeader, colValue) {
        let allRows = await this.page.$$('.ag-center-cols-container [role="row"]');
        for (let row of allRows) {
            let rowagent = (await row.$('[col-id="' + colHeader + '"]')).textContent();
            if (rowagent === colValue) {
                return row;
            }
        }
        console.error('could not find a row with column id : ' + colHeader + ' and column value :' + colValue);
    }

    async scrollLeft() {
        // let pixelsToScroll = scrollLeft ? '+ 1000' : '- 1000';
        // for (let i = 0; i < count; i++) {
        //     let viewport = this.page.locator('div.ag-center-cols-viewport');
        //     await this.page.mouse.move(+1000,0);
        //     await this.page.executeScript('$(arguments[0]).scrollLeft(arguments[0].scrollLeft ' + pixelsToScroll + ')', viewport);
        //     await utils.delay(3000);
        //let horizontalScrollBar = this.page.locator(`div.ag-body-horizontal-scroll`);
        let viewLeft = this.page.locator(`div.ag-cell-label-container div span[aria-colindex="1"]`);
        viewLeft.scrollIntoViewIfNeeded()
        }

    async scrollRight(){
        let viewRight = this.page.locator(`div.ag-cell-label-container div span[aria-colindex="11"]`);
        viewRight.scrollIntoViewIfNeeded()
    }


    public async waitUntilWindowLoad(expectedWindow?, maxRetries?) {
        let expWindow = expectedWindow || 'Form Executor';
        let maximumRetries = maxRetries || 10;
        let windowMatched = false;
        let response;
        console.log('Waiting for Window title : ' + expWindow);
        for (let attempt = 1; attempt <= maximumRetries; attempt++) {
            let allWindows = await this.page.context().pages();
            let windowTitles = [];
            let playerWindow;
            for (let currentWindow of allWindows) {
                //await browser.driver.switchTo().window(currentWindow);
                let windowTitle = await currentWindow.title();
                windowTitles.push(windowTitle);
                if (windowTitle === expWindow) {
                    windowMatched = true;
                    playerWindow = currentWindow;
                    break;
                }
            }
            console.log('| Attempt number => ' + attempt + ' | '+'Currently open windows => ', windowTitles);
            if (!windowMatched) {
                await this.waitABit();
            }
            else {
                console.log('Found Window => ' + expWindow + '. Breaking Loop');
                //await browser.driver.switchTo().window(playerWindow);
                response = await expWindow.getCurrentUrl();
                if (expWindow === 'Form Executor') {
                    response = this.scores.textContent();
                }
                break;
            }
        }
        return response;
    }

    async getListOfOpenWindows() {
        let listOfOpenWindows = this.page.context().pages();
        return listOfOpenWindows.length;
    }

    public async waitABit() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
            }, 3000);
        });
    }

    async clickRowForAgent(score: any) {
        await this.selectRowValue(score).click();
    }

}
