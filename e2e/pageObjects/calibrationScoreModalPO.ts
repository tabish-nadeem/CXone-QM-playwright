import { Page, Locator } from "@playwright/test";
import{ Utils } from "../common/utils";

let utils: any;

export class CalibrationScoreModalPO {
    readonly page: Page;
    readonly modalTitle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.modalTitle = page.locator(`div.headerTitle`);
    }

    async getTitle() {
        return await this.modalTitle.textContent();
    }

    async getScoreRowElements(value: any) {
        utils = new Utils(this.page);
        let rowCells = this.page.locator(`//*[@col-id="questions"]/span[contains(text(),"${value}")]/../..`);
        await utils.delay(6000);
        return {
            questions: await rowCells.locator(`[col-id="questions"]`).textContent(),
            maxScore: await rowCells.locator(`[col-id="maxScore"]`).textContent(),
            originalScore: await rowCells.locator(`[col-id="originalScore"]`).textContent(),
            calibrationScore: await rowCells.locator(`[col-id="calibrationScore"]`).textContent(),
            variance: await rowCells.locator(`[col-id="variance"]`).textContent()
        } 
    }
}