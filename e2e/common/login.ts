import { Locator, Page, expect } from "@playwright/test";

export class LoginPage {
    readonly page: Page;
    readonly signoutPopupText: Locator;
    readonly homePageLogo: Locator;

    constructor(page: Page) {
        this.page = page;
        this.signoutPopupText = page.locator(`span[class="text"]:has-text("Sign out?")`);
        this.homePageLogo = page.locator(`div[login-logo-style='na1']`);
    }

    async login(username: string, password: string) {
        await this.page.fill('input[id="emailFieldNext"]', username);
        await this.page.click('button[id="nextBtn"]');
        await this.page.waitForSelector('input[id="mfaPassField"]');
        await this.page.fill('input[id="mfaPassField"]', password);
        await this.page.click('button[id="mfaLoginBtn"]');
        await this.page.waitForNavigation();
    }
    
    async logout() {
        await this.page.click('div[class="user-panel"]');
        await this.page.click('button[id="logout"]');
        await this.page.click('.cxone-btn.btn-medium.btn-primary');
        console.log("Logged out successfully");
        await this.page.waitForNavigation();
        expect(this.homePageLogo.isVisible());
    }
}