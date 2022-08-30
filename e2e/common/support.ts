import {Page} from "@playwright/test";

export const Credentials = {
    validPassword: 'Pass1234',
    validMailDomain: 'mailinator.com'
}

export class Support
{
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async getText(element: { TextContent: () => string | PromiseLike<string>; }): Promise<string> {
        return await element.TextContent();
      }
}