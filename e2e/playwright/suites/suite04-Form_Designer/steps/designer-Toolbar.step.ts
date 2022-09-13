import { Utils } from "./../../../../common/utils";
import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
// import { FEATURE_TOGGLES } from '../../../assets/CONSTANTS';
import { CommonNoUIUtils } from "../../../../common/CommonNoUIUtils";
import { GlobalTenantUtils } from "../../../../common/globalTenantUtils";
import { FEATURE_TOGGLES } from "../../../../common/uiConstants";
import { FeatureToggleUtils } from "../../../../common/FeatureToggleUtils";
import { OnPrepare } from "../../../../playwright.config";
import * as moment from "moment";
import * as _ from "lodash";
import FormDesignerPagePO from "../../../../pageObjects/form-designer-page.po";
import { FormAreaComponentPo } from "../../../../pageObjects/form-area.component.po";
import { ManageFormsPO } from "../../../../pageObjects/manage-forms.po";
import { DesignerToolbarComponentPO } from "../../../../pageObjects/designer-toolbar.component.po";
import { FormLogoComponentPo } from "../../../../pageObjects/form-logo.component.po";
import { ElementAttributesComponentPo } from "../../../../pageObjects/element-attributes.component.po";
import { DisableProtUtils } from "../../../../common/disableProtUtil";
import { ModuleExports } from "../../../../common/qmDefaultData";
import { LoginPage } from "../../../../common/login";

let browser: any;
let newGlobalTenantUtils = new GlobalTenantUtils();
let USER_TOKEN: string;
let userDetails: any = {};
let newOnPrepare: any;
let login:LoginPage
let page: Page;
let context: BrowserContext;


const formArea = new FormAreaComponentPo();
const designerToolbar = new DesignerToolbarComponentPO();
const formLogoComponentPo = new FormLogoComponentPo();
const elementAttributes = new ElementAttributesComponentPo();

const getElementList = () => {
     return [
          {
               elementType: "text",
               elementTitle: "Agent Name",
               elementJson:
                    '{"type":"text","elementData":{"attributes":{"question":"Agent Name","answer":"","required":true,"visible":true,"prePopulatedHintText":""}}}',
          },
          {
               elementType: "textarea",
               elementTitle: "Agent Address",
               elementJson:
                    '{"type":"textarea","elementData":{"attributes":{"question":"Agent Address","answer":"","required":true,"visible":true,"subText":"","prePopulatedHintText":"","limitCharacters":true,"limitCharactersText":"130"}}}',
          },
          {
               elementType: "radio",
               elementTitle: "Gender",
               elementJson:
                    '{"type":"radio","elementData":{"attributes":{"question":"Gender","answer":"","required":true,"layout":"vertical","visible":true,"subText":"","choiceList":[{"label":"Male","value":"1","score":1,"$$hashKey":"object:510"},{"label":"Female","value":"2","score":1,"$$hashKey":"object:511"}],"elementType":"radio"}}}',
          },
          {
               elementType: "checkbox",
               elementTitle: "Agent focus area?",
               elementJson:
                    '{"type":"checkbox","elementData":{"attributes":{"question":"Agent focus area?","answer":[],"required":true,"layout":"vertical","visible":true,"subText":"","choiceList":[{"label":"Front End","value":"1","score":1,"selected":false,"$$hashKey":"object:823"},{"label":"Back End","value":"2","score":1,"selected":false,"$$hashKey":"object:824"}],"elementType":"checkbox"}}}',
          },
          {
               elementType: "yesno",
               elementTitle: "Passed?",
               elementJson:
                    '{"type":"yesno","elementData":{"attributes":{"question":"Passed?","answer":"","required":true,"layout":"vertical","visible":true,"subText":"","choiceList":[{"label":"Yes","value":"1","score":1,"$$hashKey":"object:1148"},{"label":"No","value":"2","score":0,"$$hashKey":"object:1149"},{"label":"N/A","value":"na","naElement":true,"score":0,"$$hashKey":"object:1185"}],"elementType":"yes/no","isNAChecked":true}}}',
          },
          {
               elementType: "text",
               elementTitle: "Reason code",
               elementJson:
                    '{"type":"text","elementData":{"attributes":{"question":"Reason code","answer":"","required":false,"visible":true,"prePopulatedHintText":""}}}',
          },
          {
               elementType: "dropdown",
               elementTitle: "Multi Dropdown Outside Section",
               elementJson:
                    '{"type":"dropdown","elementData":{"attributes":{"question":"Multi Dropdown","answer":[],"required":true,"visible":true,"subText":"","elementType":"dropdown","itemList":[{"id":"ABCD","label":"ABCD","value":"ABCD"},{"id":"EFGH","label":"EFGH","value":"EFGH"},{"id":"IJKL","label":"IJKL","value":"IJKL"},{"id":"MNOP","label":"MNOP","value":"MNOP"},{"id":"QRST","label":"QRST","value":"QRST"},{"id":"UVWX","label":"UVWX","value":"UVWX"}],"dropdownType":"multiple"}}}',
          },
          {
               elementType: "checkbox",
               elementTitle: "Checkbox1",
               elementJson:
                    '{"type":"checkbox","elementData":{"attributes":{"question":"Checkbox1","answer":[],"required":true,"layout":"vertical","visible":true,"subText":"","choiceList":[{"label":"Choice 1","value":"1","score":1,"selected":false,"$$hashKey":"object:983"},{"label":"Choice 2","value":"2","score":1,"selected":false,"$$hashKey":"object:984"},{"label":"CBValue1","value":"3","selected":false,"score":1,"$$hashKey":"object:985"}],"elementType":"checkbox"}}}',
          },
          {
               elementType: "dropdown",
               elementTitle: "Multi Dropdown Inside Section",
               elementJson:
                    '{"type":"dropdown","elementData":{"attributes":{"question":"Multi Dropdown Inside Section","answer":[],"required":true,"visible":true,"subText":"","elementType":"dropdown","itemList":[{"id":"ABCDInside Section","label":"ABCDInside Section","value":"ABCDInside Section"},{"id":"EFGHInside Section","label":"EFGHInside Section","value":"EFGHInside Section"},{"id":"IJKLInside Section","label":"IJKLInside Section","value":"IJKLInside Section"},{"id":"MNOPInside Section","label":"MNOPInside Section","value":"MNOPInside Section"},{"id":"QRSTInside Section","label":"QRSTInside Section","value":"QRSTInside Section"},{"id":"UVWXInside Section","label":"UVWXInside Section","value":"UVWXInside Section"}],"dropdownType":"multiple"}}}',
          },
          {
               elementType: "checkbox",
               elementTitle: "CheckboxInsideSection",
               elementJson:
                    '{"type":"checkbox","elementData":{"attributes":{"question":"CheckboxInsideSection","answer":[],"required":true,"layout":"vertical","visible":true,"subText":"","choiceList":[{"label":"Choice 1","value":"1","score":1,"selected":false,"$$hashKey":"object:1033"},{"label":"Choice 2","value":"2","score":1,"selected":false,"$$hashKey":"object:1034"},{"label":"CBValue1InsideSection","value":"3","selected":false,"score":1,"$$hashKey":"object:1035"}],"elementType":"checkbox"}}}',
          },
          {
               elementType: "dropdown",
               elementTitle: "Single Dropdown",
               elementJson:
                    '{"type":"dropdown","elementData":{"attributes":{"question":"Single Dropdown","answer":[],"required":true,"visible":true,"subText":"","elementType":"dropdown","itemList":[{"id":"ABCD Single","label":"ABCD Single","value":"ABCD Single"},{"id":"EFGH Signle","label":"EFGH Signle","value":"EFGH Signle"},{"id":"IJKL Signle","label":"IJKL Signle","value":"IJKL Signle"},{"id":"MNOP Single","label":"MNOP Single","value":"MNOP Single"},{"id":"QRST Single","label":"QRST Single","value":"QRST Single"},{"id":"UVWX Single","label":"UVWX Single","value":"UVWX Single"}],"dropdownType":"single"}}}',
          },
     ];
};

BeforeAll({ timeout: 300 * 1000 }, async () => {
     browser = await chromium.launch({
          headless: false,
          args: ['--window-position=-8,0']
     });
     context = await browser.newContext();
     page = await context.newPage();
     const protractorConfig = ModuleExports.getFormData();
     userDetails = await newGlobalTenantUtils.getDefaultTenantCredentials();
     const manageFormsPO = new ManageFormsPO(
          page.locator("ng2-manage-forms-page")
     );
     newOnPrepare = new OnPrepare();
     await newOnPrepare.OnStart();
     USER_TOKEN = await CommonNoUIUtils.login(
          userDetails.adminCreds.email,
          userDetails.adminCreds.password,
          true
     );
     // await FeatureToggleUtils.addTenantToFeature(
     //      FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20,
     //      userDetails.orgName,
     //      USER_TOKEN
     // );
     // await FeatureToggleUtils.addTenantToFeature(
     //      FEATURE_TOGGLES.RESTRICT_QUESTION_LENGTH_FT,
     //      userDetails.orgName,
     //      USER_TOKEN
     // );
     await manageFormsPO.navigateTo();

});


//! need to ask
AfterAll({ timeout: 60 * 1000 }, async () => {
     await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, USER_TOKEN);
     await  login.logout()
});

Given(
     "Step 1: should verify undo redo for froala fuctions",
     { timeout: 60 * 1000 },
     async () => {
          await formArea.dragElementToFormArea("yesno");
          await formArea.froalaSetFontColor("1. Set question", "yesno", "#B8312F");
          await formArea.froalaSetBold("1. Set question", "yesno");
          await formArea.froalaSetItalic("1. Set question", "yesno");
          await formArea.froalaSetUnderLine("1. Set question", "yesno");
          await formArea.froalaSetFontSize("1. Set question", "yesno", "30");
          await formArea.froalaSetFontFamily("1. Set question", "yesno", "Impact");
          await formArea.froalaSetFontAlignment(
               "1. Set question",
               "yesno",
               "Align Right"
          );
          let cssProperties = await formArea.getElementCssProperties(
               "1. Set question",
               "yesno"
          );
          expect(cssProperties.alignment).toEqual("right");
          expect(cssProperties.fontFamily).toContain("Impact");
          expect(cssProperties.fontSize).toEqual("30px");
          expect(cssProperties.color).toEqual("rgba(184, 49, 47, 1)");
          expect(cssProperties.isBold).toBeFalsy();
          expect(cssProperties.isItalic).toBeTruthy();
          expect(cssProperties.isUnderlined).toBeTruthy();
          await designerToolbar.undo(7);
          cssProperties = await formArea.getElementCssProperties(
               "1. Set question",
               "yesno"
          );
          expect(cssProperties.alignment).toEqual("start");
          expect(cssProperties.fontFamily).toContain("OpenSans");
          expect(cssProperties.fontSize).toEqual("13px");
          expect(cssProperties.color).toEqual("rgba(0, 0, 0, 1)");
          expect(cssProperties.isBold).toBeTruthy();
          expect(cssProperties.isItalic).toBeFalsy();
          expect(cssProperties.isUnderlined).toBeFalsy();
          await designerToolbar.redo(7);
          cssProperties = await formArea.getElementCssProperties(
               "1. Set question",
               "yesno"
          );
          expect(cssProperties.alignment).toEqual("right");
          expect(cssProperties.fontFamily).toContain("Impact");
          expect(cssProperties.fontSize).toEqual("30px");
          expect(cssProperties.color).toEqual("rgba(184, 49, 47, 1)");
          expect(cssProperties.isBold).toBeFalsy();
          expect(cssProperties.isItalic).toBeTruthy();
          expect(cssProperties.isUnderlined).toBeTruthy();
     }
);

When("Step-2: should verify undo redo for copy action", { timeout: 180 * 1000 }, async () => {
     expect(await designerToolbar.isUndoButtonDisabled()).toBeTruthy();
     expect(await designerToolbar.isRedoButtonDisabled()).toBeTruthy();
     await formArea.dragElementToFormArea('yesno');
     await formArea.clickCopyElementIcon('1. Set question', 'yesno');
     await formArea.clickCopyElementIcon('1. Set question', 'yesno');
     expect(await formArea.getCountOfElementsInForm()).toEqual(3);
     await designerToolbar.undo(2);
     expect(await formArea.getCountOfElementsInForm()).toEqual(1);
     expect(await designerToolbar.isUndoButtonDisabled()).toBeTruthy();
     await designerToolbar.redo(2);
     expect(await formArea.getCountOfElementsInForm()).toEqual(3);
     expect(await designerToolbar.isRedoButtonDisabled()).toBeTruthy();


});

Then("Step-3: should able to undo and redo a deleted element with keyboard shortcuts", { timeout: 180 * 1000 }, async () => {
     await formArea.dragElementToFormArea('yesno');
     await formArea.clickCopyElementIcon('1. Set question', 'yesno');
     await formArea.clickCopyElementIcon('1. Set question', 'yesno');
     await formArea.clickDeleteElementIcon('3. Set question', 'yesno');
     await formArea.clickDeleteElementIcon('2. Set question', 'yesno');
     expect(await formArea.getCountOfElementsInForm()).toEqual(1);
     await designerToolbar.undo(1);
     // await browser.actions().keyDown(protractor.Key.CONTROL).sendKeys('z').keyUp(protractor.Key.CONTROL).perform();
     await page.keyboard.down('CONTROL+ z').up('CONTROL')

     await page.keyboard.press('CONTROL');
     expect(await formArea.getCountOfElementsInForm()).toEqual(3);
     await designerToolbar.redo(1);
     // await browser.actions().keyDown(protractor.Key.CONTROL).sendKeys('y').keyUp(protractor.Key.CONTROL).perform();
     await page.keyboard.down('CONTROL+ y').up('CONTROL')
     await page.keyboard.press('CONTROL');
     expect(await formArea.getCountOfElementsInForm()).toEqual(1);


});

Then("Step-4: should work undo redo for subtext", { timeout: 180 * 1000 }, async () => {
     await formArea.dragElementToFormArea('yesno');
     await elementAttributes.enterInstructions('Testing instructions123');
     expect(await formArea.getInstructionText('1. Set question', 'yesno')).toEqual('Testing instructions123');
     await designerToolbar.undo(1);
     expect(await formArea.getInstructionText('1. Set question', 'yesno')).toEqual('Testing instructions12');
     await designerToolbar.redo(1);
     expect(await formArea.getInstructionText('1. Set question', 'yesno')).toEqual('Testing instructions123');


});

Then("Step-5:should undo redo should work for form logo and form title properties    ", { timeout: 180 * 1000 }, async () => {
     await formArea.dragElementToFormArea('yesno');
     await formArea.clickCopyElementIcon('1. Set question', 'yesno');
     await formArea.clickCopyElementIcon('1. Set question', 'yesno');
     await formArea.clickDeleteElementIcon('3. Set question', 'yesno');
     await formArea.clickDeleteElementIcon('2. Set question', 'yesno');
     expect(await formArea.getCountOfElementsInForm()).toEqual(1);
     await designerToolbar.undo(1);
     // await browser.actions().keyDown(protractor.Key.CONTROL).sendKeys('z').keyUp(protractor.Key.CONTROL).perform();  
     await page.keyboard.down('CONTROL+ z').up('CONTROL')
     await page.keyboard.down()
     expect(await formArea.getCountOfElementsInForm()).toEqual(3);
     await designerToolbar.redo(1);
     // await browser.actions().keyDown(protractor.Key.CONTROL).sendKeys('y').keyUp(protractor.Key.CONTROL).perform();
     await page.keyboard.down('CONTROL+ z').up('CONTROL')
     expect(await formArea.getCountOfElementsInForm()).toEqual(1);


});

Then("Step-6: should able to undo and redo a deleted element with keyboard shortcuts", { timeout: 180 * 1000 }, async () => {
     await elementAttributes.imageUploadComponentPo.clickLockAspectRatioCheckBox();
     await elementAttributes.imageUploadComponentPo.enterWidth('10');
     await elementAttributes.imageUploadComponentPo.enterHeight('10');
     expect(await Utils.getAttribute(await formLogoComponentPo.getFormLogo(), 'style')).toEqual('height: 10px; width: 10px;');
     await designerToolbar.undo(5); // CTRL+A event is captured while entering heigth and width due to which undo operation needs to be performed 5 times instead of 4.
     expect(await Utils.getAttribute(await formLogoComponentPo.getFormLogo(), 'style')).toEqual('height: 30px; width: 243px;');
     await designerToolbar.redo(5); // CTRL+A event is captured while entering heigth and width due to which redo operation needs to be performed 5 times instead of 4.
     expect(await Utils.getAttribute(await formLogoComponentPo.getFormLogo(), 'style')).toEqual('height: 10px; width: 10px;');


});
