import { Browser } from '@playwright/test';
// import { async } from "@angular/core/testing";
import { CommonNoUIUtils } from "./../../src/lib/commonNoUI/CommonNoUIUtils";
// import { Browser } from "@playwright/test";
import { EnvUtils } from "../common/EnvUtils";
import { HttpUtils } from "../common/HttpUtils";
import { FeatureToggleUtils } from "../common/FeatureToggleUtils";
import { AccountUtils } from "./AccountUtils";
import { Utils } from "./utils";
import { expect } from "src";
import { ApiUrl } from "src/ng2/assets/api-url";

export class fdUtils {
     static waitABit(timeToWait: number){
          return new Promise<void>((resolve) => {
               setTimeout(() => {
                    resolve();
               }, timeToWait);
          });
     };

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

     static isElementEnabled = async (callbackFunction: (arg0: any) => any, text: any) => {
          //    var deferred = protractor.promise.defer();
          var element = callbackFunction(text);
          element.isEnabled().then(function (resp: any) {
               return resp;
          });
     };

     static getElementAttribute = async (
          callbackFunction: (arg0: any) => { (): any; new(): any; getAttribute: { (arg0: any): any; new(): any; }; },
          attributeName: any,
          text: any
     ) => {
          return callbackFunction(text).getAttribute(attributeName);
     };

     static isElementSelected = async (callbackFunction, text) => {
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
          var expectedString = eval("protractor.pageIdentifierUrls." + keyValue);
          return expectedString;
     };

     static getRandomEmployeeDetails = async (seq: any) => {
          return {
               employeeEmailAddress:
                    "ptor." + new Date().getTime() + (seq || "") + "@wfosaas.com",
               employeePassword: "Password1",
               firstName: "Luke",
               lastName: "Skywalker" + AccountUtils.getRandomString(),
          };
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
          return Browser.driver.getCurrentUrl().then(function (url) {
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
     ) => {

     };

     static removeAllUsers = async (token: any, ids: any) => {
          var usersIds = ids;
          if (ids) {
               CommonNoUIUtils.getUsers(token)
                    .then(function (users) {
                         var nonAdminUsers = this.filter(users, function (user) {
                              return user.role !== "Administrator";
                         });
                         return this.map(nonAdminUsers, "id");
                    })
                    .then(function (nonAdmins) {
                         if (this.isEmpty(nonAdmins)) {
                              return nonAdmins;
                         } else {
                              return CommonNoUIUtils.deleteUsers(nonAdmins, token);
                         }
                    })
                    .then(function () {
                         return;
                    });
          } else {
               CommonNoUIUtils.deleteUsers(usersIds, token).then(function () {
                    console.log("all users removed: ", usersIds);
                    return;
               });
          }
     };
     removeAllGroups = async (token: any, ids: any) => {
          //! wont work
          //    var groupsIds = ids;
          //    if (this.isEmpty(ids)) {
          //        AccountUtils.getGroups(token).then(function (groups) { // commonnoUI
          //            return _.map(groups, 'id');
          //        }).then(function (groupIds) {
          //            if (_.isEmpty(groupIds)) {
          //                deferred.fulfill();
          //            } else {
          //                return protractor.testUtilsNoUI.deleteGroups(groupIds, token);
          //            }
          //        }).then(function () {
          //            deferred.fulfill();
          //        });
          //    } else {
          //        protractor.testUtilsNoUI.deleteGroups(groupsIds, token).then(function () {
          //            console.log('all groups removed: ', groupsIds);
          //            deferred.fulfill();
          //        });
          //    }
          //    return deferred.promise;
     };
     static removeEvaluationPlans = async () => {

     };
     static clickOnWarning = async () => {
          //         var warningElement = element(by.css('.nice-message-modal-wrapper [ng-click="$ctrl.primaryBtnClick()"]'));
          //         await protractor.testUtils.waitUntilVisible(warningElement, 40000);
          //         return await warningElement.click();
          //     }
     };
}