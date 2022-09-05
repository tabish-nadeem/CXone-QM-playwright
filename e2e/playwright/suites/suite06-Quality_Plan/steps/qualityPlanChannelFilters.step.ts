import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
import {QualityPlanManagerPO} from "../../../../pageObjects/quality-plan-manager.po"
import {QualityPlanDetailsPO} from "../../../../pageObjects/quality-plan-details.po"
import { CommonNoUIUtils } from '../../../../common/CommonNoUIUtils';
import { OnPrepare } from '../../../../playwright.config';
import { LoginPage } from "../../../../common/login";
import { FEATURE_TOGGLES } from "../../../../common/uiConstants";
import { FeatureToggleUtils } from '../../../../common/FeatureToggleUtils';
import { Utils } from '../../../../common/utils';
import {CallDurationPO} from "../../../../pageObjects/call-duration.po"
import {CheckboxFilterPO} from "../../../../pageObjects/checkbox-filter.po"
import {UserDetails } from '../../../../../tests/protractor/common/prots-utils';
import moment from 'moment';
import {SELECTORS} from "../../../../playwright.helpers"

let page: Page;
let browser: any;
let context: BrowserContext;
let newOnPrepare:any;
let loginPage:any;
let userDetails:UserDetails;
let shouldUseTestCreds:any;
let userToken:any;
let planNameSuffix:any;
let brandEmbassyTenant:any={};
let channels:any;
let utils:any;

const qualityPlanDetailsPO = new QualityPlanDetailsPO();
const qualityPlanManagerPO = new QualityPlanManagerPO();
const callDurationPO = new CallDurationPO();
const interactionPO = new CheckboxFilterPO(page.locator('[id^=recorded-segment-filter2]'));
const callDirectionPO = new CheckboxFilterPO(page.locator('#call-direction-filter'));
utils=new Utils(Page);

BeforeAll({ timeout: 400 * 1000 }, async () => {
    browser = await chromium.launch({
        headless: false,
        args: ['--window-position=-8,0']
    });
    context = await browser.newContext();
    page = await context.newPage();
    newOnPrepare = new OnPrepare();
    await newOnPrepare.OnStart(userDetails);
    loginPage = new LoginPage(page);

    brandEmbassyTenant = {
        testCreds: {
            /*
                these are creds with which *facebook* has been added as a channel
                email: 'prot.branembassy.test@gmail.com',
                Pass: 'Brandembassy@1'
            */
            adminCreds: {
                email: 'prot_branembassy_test_admin@nice.com',
                password: 'Password1'
            },
            orgName: 'perm_qm_brandembassy_sms_testing58533664',
            firstName: 'Protractor',
            lastName: 'Admin'
        },
        stagingCreds: {
            /*
                these are creds with which *twitter* has been added as a channel
                email: 'prot.branembassy.test@gmail.com',
                Pass: 'Brandembassy@1'
            */
            adminCreds: {
                email: 'prot_branembassy_staging_admin@nice.com',
                password: 'Password1'
            },
            orgName: 'perm_s032_qm_qp_be_115924903',
            firstName: 'Protractor',
            lastName: 'Admin'
        }
    };

    channels = {
        EMAIl: 'EMAIL',
        CHAT: 'CHAT',
        VOICE: 'VOICE',
        FACEBOOK_CHAT: 'FB_PRIVATE',
        TWITTER_CHAT: 'TW_PRIVATE',
        WORKITEM : 'WORKITEM',
        CUSTOM_CHAT: 'CUSTOM_PRIVATE'

    };

    shouldUseTestCreds = SELECTORS.AUTH_APP_URL.includes('test') ? true : false;
    userDetails = shouldUseTestCreds ? brandEmbassyTenant.testCreds : brandEmbassyTenant.stagingCreds;
    planNameSuffix = moment().valueOf().toString();
    console.log(planNameSuffix);
    userToken = await CommonNoUIUtils.login(userDetails.adminCreds.email, userDetails.adminCreds.password,true);
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);
    await qualityPlanDetailsPO.navigate();
});

AfterAll({ timeout: 60 * 1000 }, async () => {
    await qualityPlanDetailsPO.refresh();
    await qualityPlanManagerPO.navigate();
    console.log('Deleting created plans...');
    await qualityPlanManagerPO.deleteAllPlans();
    await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);
    await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);
    await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);
    await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);
    await loginPage.logout();
    await browser.close();
});

Given("Step-1: should be able to save plan as draft and verify all filters are retained", { timeout: 60 * 1000 }, async () => {

    const planName = `Filter Test Plan ${planNameSuffix}`;
    await qualityPlanDetailsPO.enterPlanName(planName);
    await qualityPlanDetailsPO.enterPlanDescription('This is a sample description');
    await callDurationPO.selectOperation('Between');
    await callDurationPO.setFirstCallDurationValue('00:03:00');
    await callDurationPO.setSecondCallDurationValue('00:06:00');
    await interactionPO.clickWithoutScreenInteractionButton();
    await interactionPO.toggleChannelByName(channels.VOICE);
    await interactionPO.toggleChannelByName(channels.CHAT);
    await interactionPO.toggleChannelByName(channels.WORKITEM);
    if (shouldUseTestCreds) {
        await interactionPO.toggleChannelByName(channels.FACEBOOK_CHAT);
        await interactionPO.toggleChannelByName(channels.CUSTOM_CHAT);
    } else {
        await interactionPO.toggleCallDirectionByName(channels.TWITTER_CHAT);
    }
    await callDirectionPO.toggleCallDirectionByName('Incoming');
    await callDirectionPO.toggleCallDirectionByName('Outgoing');
    await utils.delay(2000);
    await utils.delay(2000);
    await qualityPlanDetailsPO.saveAsDraft();
    expect(await qualityPlanManagerPO.verifyPlanPresence(planName)).toBeTruthy();
    await qualityPlanManagerPO.openQualityPlanByName(planName);
    expect(await qualityPlanDetailsPO.getPlanName()).toEqual(planName);
    expect(await qualityPlanDetailsPO.getPlanDescription()).toEqual('This is a sample description');
    expect(await callDurationPO.getFirstCallDurationValue()).toEqual('00:03:00');
    expect(await callDurationPO.getSecondCallDurationValue()).toEqual('00:06:00');
    expect(await interactionPO.getSelectedInteractionButton()).toEqual('Without Screen');
    expect(await interactionPO.isChannelSelected(channels.VOICE)).toBeTruthy();
    expect(await interactionPO.isChannelSelected(channels.CHAT)).toBeTruthy();
    expect(await interactionPO.isChannelSelected(channels.WORKITEM)).toBeTruthy();
    if (shouldUseTestCreds) {
        expect(await interactionPO.isChannelSelected(channels.FACEBOOK_CHAT)).toBeTruthy();
        expect(await interactionPO.isChannelSelected(channels.CUSTOM_CHAT)).toBeTruthy();
    } else {
        expect(await interactionPO.isChannelSelected(channels.EMAIl)).toBeFalsy();
    }
});

When("Step-2: should be able to duplicate saved plan and verify the filters are retained", { timeout: 60 * 1000 }, async () => {

    const planName = `Filter Test Plan ${planNameSuffix}`;
    const duplicatePlanName = `Filter Test Plan ${planNameSuffix} Duplicate`;
    await qualityPlanManagerPO.navigate();
    expect(await qualityPlanManagerPO.verifyPlanPresence(planName)).toBeTruthy();
    await qualityPlanManagerPO.duplicatePlan(planName, duplicatePlanName);
    await qualityPlanManagerPO.openQualityPlanByName(duplicatePlanName);
    expect(await qualityPlanDetailsPO.getPlanName()).toEqual(duplicatePlanName);
    expect(await qualityPlanDetailsPO.getPlanDescription()).toEqual('This is a sample description');
    expect(await callDurationPO.getFirstCallDurationValue()).toEqual('00:03:00');
    expect(await callDurationPO.getSecondCallDurationValue()).toEqual('00:06:00');
    expect(await interactionPO.getSelectedInteractionButton()).toEqual('Without Screen');
    expect(await interactionPO.isChannelSelected(channels.VOICE)).toBeTruthy();
    expect(await interactionPO.isChannelSelected(channels.CHAT)).toBeTruthy();
    expect(await interactionPO.isChannelSelected(channels.WORKITEM)).toBeTruthy();
    if (shouldUseTestCreds) {
        expect(await interactionPO.isChannelSelected(channels.FACEBOOK_CHAT)).toBeTruthy();
        expect(await interactionPO.isChannelSelected(channels.CUSTOM_CHAT)).toBeTruthy();
    } else {
        expect(await interactionPO.isChannelSelected(channels.EMAIl)).toBeFalsy();
    }

});

Then("Step-3: should be able to change filters for a draft form and verify that the filters are retained", { timeout: 60 * 1000 }, async () => {

    const planName = `Filter Test Plan ${planNameSuffix}`;
    await qualityPlanManagerPO.navigate();
    expect(await qualityPlanManagerPO.verifyPlanPresence(planName)).toBeTruthy();
    await qualityPlanManagerPO.openQualityPlanByName(planName);
    await interactionPO.clickAllInteractionsButton();
    await interactionPO.toggleChannelByName(channels.EMAIl);
    await interactionPO.toggleChannelByName(channels.CHAT);
    await qualityPlanDetailsPO.saveAsDraft();
    await qualityPlanManagerPO.waitForPageToLoad();
    expect(await qualityPlanManagerPO.verifyPlanPresence(planName)).toBeTruthy();
    await qualityPlanManagerPO.openQualityPlanByName(planName);
    expect(await qualityPlanDetailsPO.getPlanName()).toEqual(planName);
    expect(await qualityPlanDetailsPO.getPlanDescription()).toEqual('This is a sample description');
    expect(await callDurationPO.getFirstCallDurationValue()).toEqual('00:03:00');
    expect(await callDurationPO.getSecondCallDurationValue()).toEqual('00:06:00');
    expect(await interactionPO.getSelectedInteractionButton()).toEqual('All');
    expect(await interactionPO.isChannelSelected(channels.VOICE)).toBeTruthy();
    expect(await interactionPO.isChannelSelected(channels.CHAT)).toBeFalsy();
    expect(await interactionPO.isChannelSelected(channels.EMAIl)).toBeTruthy();
    expect(await interactionPO.isChannelSelected(channels.WORKITEM)).toBeTruthy();
    if (shouldUseTestCreds) {
        expect(await interactionPO.isChannelSelected(channels.FACEBOOK_CHAT)).toBeTruthy();
        expect(await interactionPO.isChannelSelected(channels.CUSTOM_CHAT)).toBeTruthy();
    } else {
        expect(await interactionPO.isChannelSelected(channels.EMAIl)).toBeFalsy();
    }
});