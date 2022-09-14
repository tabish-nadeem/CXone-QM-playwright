import * as protHelper from '../../../../playwright.helpers';
import { Given, When, BeforeAll } from "cucumber";
import { Page, expect } from "@playwright/test";
import { Utils } from '../../../../common/utils';
import * as moment from 'moment';
import { GlobalTenantUtils } from '../../../../common/globalTenantUtils';
import { FEATURE_TOGGLES } from "../../../../common/uiletants";
import * as _ from 'lodash';
import { FormAreaComponentPo } from '../../../../pageObjects/form-area.component.po';
import FormDesignerPagePO from '../../../../pageObjects/form-designer-page.po';
import { ManageFormsPO } from '../../../../pageObjects/manage-forms.po';
import { CommonNoUIUtils } from '../../../../common/CommonNoUIUtils';
import { FeatureToggleUtils } from '../../../../common/FeatureToggleUtils';
import { ELEMENT_TYPES } from '../../../../common/uiConstants';
import { LoginPage } from '../../../../common/login';

let page: Page;
let globalTenantUtils:GlobalTenantUtils;
let formDesignerPagePO;
let formAreaComponentPo;
let dateTimePropertiesComponentPo;
let manageFormsPO;
let loginPage:LoginPage;

BeforeAll({timeout: 300 * 1000},async ()=>{
        formAreaComponentPo = new FormAreaComponentPo();
        formDesignerPagePO = new FormDesignerPagePO();
        dateTimePropertiesComponentPo = new DateTimePropertiesComponentPo();
        manageFormsPO = new ManageFormsPO(page.locator('#ng2-manage-forms-page'));
        loginPage = new LoginPage(page);
        let userToken;

        let userDetails = globalTenantUtils.getDefaultTenantCredentials();

        const onStart = async () => {
            userToken = await loginPage.login(globalTenantUtils.userDetails.email, globalTenantUtils.userDetails.password);
            await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, globalTenantUtils.userDetails.orgName, userToken)
            await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.RELEASE_NAVIGATION_REDESIGN, globalTenantUtils.userDetails.orgName, userToken)
            await manageFormsPO.navigateTo();
            await formDesignerPagePO.navigateTo();
            await formAreaComponentPo.getFormArea();
        
        };

        const onEnd = async () => {
            await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, globalTenantUtils.userDetails.orgName, userToken);
            await loginPage.logout();
            
        };
});

Given("STEP-1: should set other attributes for date element",{timeout: 60 * 1000 }, async () =>{
            await formAreaComponentPo.dragElementToFormArea(ELEMENT_TYPES.DATETIME);
            await formAreaComponentPo.froalaSetLabel('1. Set question', 'This is a date', ELEMENT_TYPES.DATETIME);
            await dateTimePropertiesComponentPo.enterInstructionsDate('Set the date');
            let subText = await Utils.getAttribute(await dateTimePropertiesComponentPo.getInstructionsTextBoxDate(), 'value');
            expect(subText).toEqual('Set the date');
            await dateTimePropertiesComponentPo.enterDisplayDate(formatDateForDatePicker(new Date(2016, 6, 22), 'DD-MMM-YYYY'));
            let dateResponse = await Utils.getAttribute(await dateTimePropertiesComponentPo.getDisplayDate(), 'value');
            expect(dateResponse).toEqual('22-Jul-2016');
            await dateTimePropertiesComponentPo.clickUseCurrentDateCheckbox();
            const today = formatDateForDatePicker(new Date(), 'DD-MMM-YYYY');
            expect(await Utils.getAttribute(await dateTimePropertiesComponentPo.getDisplayDate(), 'value')).toEqual(today);
            await dateTimePropertiesComponentPo.clickRequiredDateCheckbox();
            let response = await Utils.isSelected(await dateTimePropertiesComponentPo.getRequiredDateCheckbox());
            expect(response).toBeTruthy();
            await formAreaComponentPo.clickDeleteElementIcon('1. This is a date', ELEMENT_TYPES.DATETIME);
});

When("STEP-2: Should drag and drop date/time element inside section and check values",{timeout: 60 * 1000 }, async () =>{
    await formAreaComponentPo.dragElementToFormArea(ELEMENT_TYPES.SECTION);
    await formAreaComponentPo.froalaSetLabel('1. Set Title', 'Section 1', ELEMENT_TYPES.SECTION);
    await formAreaComponentPo.dragElementToSection(ELEMENT_TYPES.DATETIME, '1. Section 1');
    await formAreaComponentPo.froalaSetLabel('1.1 Set question', 'This is a date', ELEMENT_TYPES.DATETIME);
    await dateTimePropertiesComponentPo.clickTimeToggle();
    await formAreaComponentPo.froalaSetLabel('Set Question', 'This is time', 'time');
    await dateTimePropertiesComponentPo.enterDisplayDate(formatDateForDatePicker(new Date(2016, 6, 22), 'DD-MMM-YYYY'));
    await dateTimePropertiesComponentPo.enterStart('8:15 AM');
    let timeResponse = await Utils.getAttribute(await dateTimePropertiesComponentPo.getStartTime(), 'value');
    expect(timeResponse).toEqual('8:15 AM');
    await formAreaComponentPo.clickCopyElementIcon('1. Section 1', ELEMENT_TYPES.SECTION);
    expect(await formAreaComponentPo.getCountOfSectionElementsInForm()).toEqual(2);
    expect(await formAreaComponentPo.getCountOfElementsInForm()).toEqual(2);
});

function formatDateForDatePicker(date, format) {
    return moment(date).format(format);
}