import { expect, Locator, Page } from "@playwright/test";
import { Utils } from "../common/utils";

export class SpinnerPO {
  readonly page: Page;
  readonly locator: Locator;
//   readonly utils: Utils;
//   readonly elements: any;
//   readonly defaultTimeoutInMillis: number;

  constructor(selector: any ) {
    this.locator = this.page.locator(selector);
  }

  async waitForSpinnerToBeHidden(arg0: any, arg1: any) { }
}