import { Utils } from './../../../../common/utils';
import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { expect, page } from "@playwright/test";
// import { FEATURE_TOGGLES } from '../../../assets/CONSTANTS';
import { CommonNoUIUtils } from '../../../../common/CommonNoUIUtils';
import { GlobalTenantUtils } from '../../../../common/globalTenantUtils';
import { FEATURE_TOGGLES } from "../../../../common/uiConstants";
import { FeatureToggleUtils } from '../../../../common/FeatureToggleUtils';
import { OnPrepare } from '../../../../playwright.config';
import * as moment from 'moment';
import * as _ from 'lodash';
import FormDesignerPagePO from "../../../../pageObjects/form-designer-page.po";
import { FormAreaComponentPo } from "../../../../pageObjects/form-area.component.po";
import { ManageFormsPO } from '../../../../pageObjects/manage-forms.po';
import { ModuleExports } from '../../../../common/qmDefaultData';

let browser: any;
let newGlobalTenantUtils = new GlobalTenantUtils();
let USER_TOKEN: string;
let userDetails: any = {}
let newOnPrepare: any;
let calibrationPO: any;
let getElementLists: any;

const getElementList = () => {
     return [
          {
               elementType: 'text',
               elementTitle: 'Agent Name',
               elementJson: '{"type":"text","elementData":{"attributes":{"question":"Agent Name","answer":"","required":true,"visible":true,"prePopulatedHintText":""}}}'
          },
          {
               elementType: 'textarea',
               elementTitle: 'Agent Address',
               elementJson: '{"type":"textarea","elementData":{"attributes":{"question":"Agent Address","answer":"","required":true,"visible":true,"subText":"","prePopulatedHintText":"","limitCharacters":true,"limitCharactersText":"130"}}}'
          },
          {
               elementType: 'radio',
               elementTitle: 'Gender',
               elementJson: '{"type":"radio","elementData":{"attributes":{"question":"Gender","answer":"","required":true,"layout":"vertical","visible":true,"subText":"","choiceList":[{"label":"Male","value":"1","score":1,"$$hashKey":"object:510"},{"label":"Female","value":"2","score":1,"$$hashKey":"object:511"}],"elementType":"radio"}}}'
          },
          {
               elementType: 'checkbox',
               elementTitle: 'Agent focus area?',
               elementJson: '{"type":"checkbox","elementData":{"attributes":{"question":"Agent focus area?","answer":[],"required":true,"layout":"vertical","visible":true,"subText":"","choiceList":[{"label":"Front End","value":"1","score":1,"selected":false,"$$hashKey":"object:823"},{"label":"Back End","value":"2","score":1,"selected":false,"$$hashKey":"object:824"}],"elementType":"checkbox"}}}'
          },
          {
               elementType: 'yesno',
               elementTitle: 'Passed?',
               elementJson: '{"type":"yesno","elementData":{"attributes":{"question":"Passed?","answer":"","required":true,"layout":"vertical","visible":true,"subText":"","choiceList":[{"label":"Yes","value":"1","score":1,"$$hashKey":"object:1148"},{"label":"No","value":"2","score":0,"$$hashKey":"object:1149"},{"label":"N/A","value":"na","naElement":true,"score":0,"$$hashKey":"object:1185"}],"elementType":"yes/no","isNAChecked":true}}}'
          },
          {
               elementType: 'text',
               elementTitle: 'Reason code',
               elementJson: '{"type":"text","elementData":{"attributes":{"question":"Reason code","answer":"","required":false,"visible":true,"prePopulatedHintText":""}}}'
          },
          {
               elementType: 'dropdown',
               elementTitle: 'Multi Dropdown Outside Section',
               elementJson: '{"type":"dropdown","elementData":{"attributes":{"question":"Multi Dropdown","answer":[],"required":true,"visible":true,"subText":"","elementType":"dropdown","itemList":[{"id":"ABCD","label":"ABCD","value":"ABCD"},{"id":"EFGH","label":"EFGH","value":"EFGH"},{"id":"IJKL","label":"IJKL","value":"IJKL"},{"id":"MNOP","label":"MNOP","value":"MNOP"},{"id":"QRST","label":"QRST","value":"QRST"},{"id":"UVWX","label":"UVWX","value":"UVWX"}],"dropdownType":"multiple"}}}'
          },
          {
               elementType: 'checkbox',
               elementTitle: 'Checkbox1',
               elementJson: '{"type":"checkbox","elementData":{"attributes":{"question":"Checkbox1","answer":[],"required":true,"layout":"vertical","visible":true,"subText":"","choiceList":[{"label":"Choice 1","value":"1","score":1,"selected":false,"$$hashKey":"object:983"},{"label":"Choice 2","value":"2","score":1,"selected":false,"$$hashKey":"object:984"},{"label":"CBValue1","value":"3","selected":false,"score":1,"$$hashKey":"object:985"}],"elementType":"checkbox"}}}'
          },
          {
               elementType: 'dropdown',
               elementTitle: 'Multi Dropdown Inside Section',
               elementJson: '{"type":"dropdown","elementData":{"attributes":{"question":"Multi Dropdown Inside Section","answer":[],"required":true,"visible":true,"subText":"","elementType":"dropdown","itemList":[{"id":"ABCDInside Section","label":"ABCDInside Section","value":"ABCDInside Section"},{"id":"EFGHInside Section","label":"EFGHInside Section","value":"EFGHInside Section"},{"id":"IJKLInside Section","label":"IJKLInside Section","value":"IJKLInside Section"},{"id":"MNOPInside Section","label":"MNOPInside Section","value":"MNOPInside Section"},{"id":"QRSTInside Section","label":"QRSTInside Section","value":"QRSTInside Section"},{"id":"UVWXInside Section","label":"UVWXInside Section","value":"UVWXInside Section"}],"dropdownType":"multiple"}}}'
          },
          {
               elementType: 'checkbox',
               elementTitle: 'CheckboxInsideSection',
               elementJson: '{"type":"checkbox","elementData":{"attributes":{"question":"CheckboxInsideSection","answer":[],"required":true,"layout":"vertical","visible":true,"subText":"","choiceList":[{"label":"Choice 1","value":"1","score":1,"selected":false,"$$hashKey":"object:1033"},{"label":"Choice 2","value":"2","score":1,"selected":false,"$$hashKey":"object:1034"},{"label":"CBValue1InsideSection","value":"3","selected":false,"score":1,"$$hashKey":"object:1035"}],"elementType":"checkbox"}}}'
          },
          {
               elementType: 'dropdown',
               elementTitle: 'Single Dropdown',
               elementJson: '{"type":"dropdown","elementData":{"attributes":{"question":"Single Dropdown","answer":[],"required":true,"visible":true,"subText":"","elementType":"dropdown","itemList":[{"id":"ABCD Single","label":"ABCD Single","value":"ABCD Single"},{"id":"EFGH Signle","label":"EFGH Signle","value":"EFGH Signle"},{"id":"IJKL Signle","label":"IJKL Signle","value":"IJKL Signle"},{"id":"MNOP Single","label":"MNOP Single","value":"MNOP Single"},{"id":"QRST Single","label":"QRST Single","value":"QRST Single"},{"id":"UVWX Single","label":"UVWX Single","value":"UVWX Single"}],"dropdownType":"single"}}}'
          }
     ];
};

const formDesignerPage = new FormDesignerPagePO();
const formArea = new FormAreaComponentPo();
const manageFormsPO = new ManageFormsPO(page.locator(('ng2-manage-forms-page')));


let formNames = [
     'FormVersion_0_' + moment(),
     'FormVersion_1_' + + moment()
];

BeforeAll({ timeout: 300 * 1000 }, async () => {
     const protractorConfig = ModuleExports.getFormData();
     userDetails = await newGlobalTenantUtils.getDefaultTenantCredentials();
     const manageFormsPO = new ManageFormsPO(page.locator(('ng2-manage-forms-page')));
     newOnPrepare = new OnPrepare();
     await newOnPrepare.OnStart();
     getElementLists = getElementList();
     USER_TOKEN = await CommonNoUIUtils.login(userDetails.adminCreds.email, userDetails.adminCreds.password, true);
     await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, USER_TOKEN);
     await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.RELEASE_NAVIGATION_REDESIGN, userDetails.orgName, USER_TOKEN);
     await manageFormsPO.navigateTo();




});



AfterAll({ timeout: 60 * 1000 }, async () => {
     await browser.close();
});


Given("Step 1: should verify new version", { timeout: 60 * 1000 }, async () => {

     await formDesignerPage.navigateTo();
     await Utils.waitUntilVisible(await formArea.getFormArea());
     await formArea.dragElementToFormArea('yesno');
     await formDesignerPage.saveFormAsDraft(formNames[0], true);
     await manageFormsPO.navigateTo();
     await manageFormsPO.searchFormInGrid(formNames[0]);
     expect((await manageFormsPO.getFormRowElements(formNames[0])).version).toEqual('0.0');



});

When("Step-2: should verify editing and saving draft does not change version", { timeout: 180 * 1000 }, async () => {
     await manageFormsPO.openParticularForm(formNames[0]);
     await formArea.dragElementToFormArea('yesno');
     await formDesignerPage.saveFormAsDraft();
     await manageFormsPO.navigateTo();
     await manageFormsPO.searchFormInGrid(formNames[0]);
     expect((await manageFormsPO.getFormRowElements(formNames[0])).version).toEqual('0.0');


});

Then("Step-3:should verify activating a draft form does not change version", { timeout: 180 * 1000 }, async () => {
     await manageFormsPO.openParticularForm(formNames[0]);
     await formDesignerPage.saveAndActivateForm();
     await manageFormsPO.waitForSpinnerToDisappear();
     await manageFormsPO.searchFormInGrid(formNames[0]);
     expect((await manageFormsPO.getFormRowElements(formNames[0])).version).toEqual('0.0');

});
Then("Step-4: should verify editing an active form increments draft version", { timeout: 180 * 1000 }, async () => {
     await manageFormsPO.openParticularForm(formNames[0]);
     await formArea.dragElementToFormArea('yesno');
     await formDesignerPage.saveAPublishedForm();
     await manageFormsPO.navigateTo();
     await manageFormsPO.searchFormInGrid(formNames[0]);
     expect((await manageFormsPO.getFormRowElements(formNames[0])).version).toEqual('1.0');

});
Then("Step-5: should verify editing an inactive form increments draft version", { timeout: 180 * 1000 }, async () => {
     await manageFormsPO.deactivateForm(formNames[0]);
     await manageFormsPO.openParticularForm(formNames[0]);
     await formArea.dragElementToFormArea('yesno');
     await formDesignerPage.saveFormAsDraft();
     await manageFormsPO.navigateTo();
     await manageFormsPO.searchFormInGrid(formNames[0]);
     expect((await manageFormsPO.getFormRowElements(formNames[0])).version).toEqual('2.0');

});
Then("Step-6:should verify for version is 0 if new form created with a deleted form\'s name", { timeout: 180 * 1000 }, async () => {
     await manageFormsPO.deleteForm(formNames[0]);
     await formDesignerPage.navigateTo();
     await formArea.dragElementToFormArea('yesno');
     await formDesignerPage.saveAndActivateForm(formNames[0], true);
     await manageFormsPO.waitForSpinnerToDisappear();
     expect((await manageFormsPO.getFormRowElements(formNames[0])).version).toEqual('0.0');

});

