import { Browser } from "@playwright/test";
import { Utils } from "./utils";

export class fdUtils {
     static removeAllGroups(USER_TOKEN: string) {
          throw new Error('Method not implemented.');
     }
     static waitABit(timeToWait: number) {
          return new Promise<void>((resolve) => {
               setTimeout(() => {
                    resolve();
               }, timeToWait);
          });
     }

     static clearCache = async () => {
          await Browser.executeScript("window.localStorage.clear();");
          await Browser.executeScript("window.sessionStorage.clear();");
          await Browser.driver.manage().deleteAllCookies();
     };

     static isElementDisplayed = async (callbackFunction, text: any) => {
          return callbackFunction(text).isDisplayed();
     };

     static isElementPresent = async (callbackFunction, text) => {
          return callbackFunction(text).isPresent();
     };

     static isElementEnabled = async (
          callbackFunction: (arg0: any) => any,
          text: any
     ) => {
          //    var deferred = protractor.promise.defer();
          var element = callbackFunction(text);
          element.isEnabled().then(function (resp: any) {
               return resp;
          });
     };

     static getElementAttribute = async (
          callbackFunction: (arg0: any) => {
               (): any;
               new(): any;
               getAttribute: { (arg0: any): any; new(): any };
          },
          attributeName: any,
          text: any
     ) => {
          return callbackFunction(text).getAttribute(attributeName);
     };

     static isElementSelected = async (callbackFunction: (arg0: any) => any, text: any) => {
          //    var deferred = protractor.promise.defer();
          var elementToCheck = callbackFunction(text);
          elementToCheck
               .getTagName()
               .then(function (tagName) {
                    if (!(tagName == "input")) {
                         elementToCheck = elementToCheck.element(this.css("input"));
                    }
                    return elementToCheck.isSelected();
               })
               .then(function (resp: any) {
                    return resp;
               });
     };

     static getElementText = async (
          callbackFunction: (arg0: any) => {
               (): any;
               new(): any;
               getText: { (): any; new(): any };
          },
          text: any
     ) => {
          return callbackFunction(text).getText();
     };

     static getExpectedString = async (keyValue: string) => {
          var expectedString = eval("protractor.localizationJson." + keyValue);
          return expectedString;
     };

     static getPageIdentifierUrls = async (keyValue: string) => {
          var expectedString = eval("playWrite.pageIdentifierUrls." + keyValue);
          return expectedString;
     };

     static getRandomEmployeeDetails = async (seq: any) => {


     };

     static getToastMessageWithExtraWait = async () => {
          let utils = new Utils.page();
          const toast = utils.locator(".toast-message");
          await toast.isVisible();
          if (toast === "") {
               await Utils.waitForTime(500);
          }
          return await toast.textContent();
     };
     static createFormWithElementAndPublish = async (
          formName: string,
          formElementInformArea: string | any[]
     ) => {
          //    var i: number, currentElement: any[];
          //    if (formName === '') {
          //        formName = "Form_" + Math.random();
          //    }
          //    formDesigner.navigateTo().then(function () {
          //        for (i = 0; i < formElementInformArea.length; i++) {
          //            currentElement = formElementInformArea[i].split(":");
          //            formAreaComponent.dragAndDropElement(currentElement[0], currentElement[1], currentElement[2]);
          //        }
          //        return formDesigner.clickPublishBtn();
          //    }).then(function () {
          //        return saveForm.enterFormName(formName);
          //    }).then(function () {
          //        return saveForm.clickCreateButton();
          //    }).then(function () {
          //        expect(protractor.fdUtils.getToastMessage()).toEqual(protractor.fdUtils.getExpectedString('successActivate'));
          //        deferred.fulfill();
          //    });
          //    return deferred.promise;
     };
     static generateKinesisStream = async () => {
          return Browser.driver.getCurrentUrl().then(function (url: string | string[]) {
               if (url.indexOf("dev") !== -1) {
                    return "dev";
               } else if (url.indexOf("staging") !== -1) {
                    return "staging";
               } else if (url.indexOf("nvir") !== -1) {
                    return "test_nvir";
               } else {
                    return "test";
               }
          });
     };

     static addInteractionsToElement = async (
          elementObj: any,
          searchString: any
     ) => { };

     static removeAllUsers = async (token: any) => {
          // var usersIds = ids;

     };

     static removeEvaluationPlans = async () => { };
     static clickOnWarning = async () => { };
}
