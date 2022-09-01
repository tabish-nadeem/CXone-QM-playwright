import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
import {QualityPlanManagerPO} from "../../../../pageObjects/quality-plan-manager.po"
import {QualityPlanDetailsPO} from "../../../../pageObjects/quality-plan-details.po"
import {OmnibarPO} from 'cxone-components/omnibar.po';
import { GlobalTenantUtils } from '../../../../common/globalTenantUtils';
import { CommonNoUIUtils } from '../../../../common/CommonNoUIUtils';
import { OnPrepare } from '../../../../playwright.config';
import { LoginPage } from "../../../../common/login";
import { FEATURE_TOGGLES } from "../../../../common/uiConstants";
import { FeatureToggleUtils } from '../../../../common/FeatureToggleUtils';
import { CommonUIUtils } from "cxone-playwright-test-utils";
import { CommonQMNoUIUtils } from '../../../../common/CommonQMNoUIUtils';
import { LocalizationNoUI } from '../../../../common/LocalizationNoUI';
import { Utils } from '../../../../common/utils';
import { AdminUtilsNoUI } from '../../../../common/AdminUtilsNoUI';
import { AccountUtils } from "../../../../common/AccountUtils";
import {CallDurationPO} from "../../../../pageObjects/call-duration.po"
import {CheckboxFilterPO} from "../../../../pageObjects/checkbox-filter.po"
import {FeedbackFilterPo} from "../../../../pageObjects/feedback-filter.po"
import {SentimentsPO} from "../../../../pageObjects/sentiment.po"
import {AgentBehaviorPO} from "../../../../pageObjects/agent-behaviour.po"


let page: Page;
let browser: any;
let context: BrowserContext;
let newOnPrepare:any;
let loginPage:any;
let userDetails:any;
let userToken:any;
let tmToken:any;
let utils:any;
let newGlobalTenantUtils:any;

const qualityPlanDetailsPO = new QualityPlanDetailsPO();
const qualityPlanManagerPO = new QualityPlanManagerPO();
newGlobalTenantUtils = new GlobalTenantUtils();
const callDurationPO = new CallDurationPO();
const sentimentsPO = new SentimentsPO();
const agentBehaviourPO = new AgentBehaviorPO();
const interactionPO = new CheckboxFilterPO(page.locator('[id^=recorded-segment-filter]'));
const callDirectionPO = new CheckboxFilterPO(page.locator('#call-direction-filter'));
const feedbackFilterPo = new FeedbackFilterPo(page.locator('#feedback-score-filter'));
utils=new Utils(page);

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
    userDetails=await newGlobalTenantUtils.getDefaultTenantCredentials();

    tmToken = await CommonNoUIUtils.login(protractorConfig.TM_LOGIN_EMAIL_ADDRESS, protractorConfig.TM_LOGIN_PASSWORD,true);
    await protractorConfig.tmUtils.updateTenantLicenses(userDetails.orgName, ['QMP','ACD', 'WFM', 'RECORDING', 'SATMETRIX'], tmToken);
    userToken = await CommonNoUIUtils.login(userDetails.adminCreds.email, userDetails.adminCreds.password,true);
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.MOCK_CATEGORIES, userDetails.orgName, userToken);
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.MOCK_CATEGORIES, userDetails.orgName, userToken);
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.MOCK_CATEGORIES, userDetails.orgName, userToken);
    await qualityPlanDetailsPO.navigate();
});

AfterAll({ timeout: 60 * 1000 }, async () => {
    await qualityPlanDetailsPO.refresh();
    protractorConfig.tmUtils.updateTenantLicenses(userDetails.orgName, ['QMA', 'ACD', 'WFM', 'RECORDING'], tmToken);
    await qualityPlanManagerPO.navigate();
    console.log('Deleting created plans...');
    await qualityPlanManagerPO.deleteAllPlans();
    await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);
    await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);
    await browser.close();
});

Given("Step-1: Should verify default values for call duration", { timeout: 60 * 1000 }, async () => {

    expect(await callDurationPO.isFilterChecked()).toBeTruthy();
    expect(await callDurationPO.getSelectedOperation()).toEqual('Greater than');
    expect(await callDurationPO.getFirstCallDurationValue()).toEqual('00:00:30');
});

When("Step-2: Should verify default values when call duration selector is Less than", { timeout: 60 * 1000 }, async () => {

    await callDurationPO.selectOperation('Less than');
    expect(await callDurationPO.getFirstCallDurationValue()).toEqual('00:00:30');
});

Then("Step-3: Should verify default values when call duration selector is Between", { timeout: 60 * 1000 }, async () => {

    await callDurationPO.selectOperation('Between');
    expect(await callDurationPO.getFirstCallDurationValue()).toEqual('00:00:30');
    expect(await callDurationPO.getSecondCallDurationValue()).toEqual('00:06:00');
});

Then("Step-4: Should show error message when call start is greater than call end", { timeout: 60 * 1000 }, async () => {

    await callDurationPO.selectOperation('Between');
    await callDurationPO.setFirstCallDurationValue('00:10:00');
    console.log('looking for error message');
    expect(await callDurationPO.getErrorText()).toEqual('Maximum call length must be greater than minimum call length');
});

Then("Step-5: should show error message when call length selector is Less than and value is 0", { timeout: 60 * 1000 }, async () => {

    await callDurationPO.selectOperation('Less than');
    await callDurationPO.setFirstCallDurationValue('00:00:00');
    expect(await callDurationPO.getErrorText()).toEqual('Call length must be greater than 0');
});

Then("Step-6: should verify that call duration selector dropdown is disabled when the filter is unselected", { timeout: 60 * 1000 }, async () => {

    await callDurationPO.toggleFilter();
    expect(await callDurationPO.isFilterChecked()).toBeFalsy();
    expect(await callDurationPO.isOperationDropdownEnabled()).toBeFalsy();
});

When("Step-1: should verify With Screen interaction button is selected by default", { timeout: 60 * 1000 }, async () => {

    expect(await callDurationPO.isFilterChecked()).toBeTruthy();
    expect(await callDurationPO.getSelectedOperation()).toEqual('Greater than');
    expect(await callDurationPO.getFirstCallDurationValue()).toEqual('00:00:30');
});

Then("Step-2: should verify all the different types of interaction buttons can be selected", { timeout: 60 * 1000 }, async () => {

    const checkboxFilterPO = new CheckboxFilterPO(page.locator('[id^=recorded-segment-filter]'));
    await checkboxFilterPO.clickWithoutScreenInteractionButton();
    expect(await checkboxFilterPO.getSelectedInteractionButton()).toEqual('Without Screen');
    await checkboxFilterPO.clickAllInteractionsButton();
    expect(await checkboxFilterPO.getSelectedInteractionButton()).toEqual('All');
    await checkboxFilterPO.clickWithScreenInteractionButton();
    expect(await checkboxFilterPO.getSelectedInteractionButton()).toEqual('With Screen');
});

When("Step-1: should check that none of the channel type filters should be selected by default", { timeout: 60 * 1000 }, async () => {

    const checkboxFilterPO = new CheckboxFilterPO(page.locator('[id^=recorded-segment-filter]'));
    expect(checkboxFilterPO.isChannelSelected('Voice')).toBeFalsy();
    expect(checkboxFilterPO.isChannelSelected('Chat')).toBeFalsy();
    expect(checkboxFilterPO.isChannelSelected('Email')).toBeFalsy();
});

Then("Step-2: should check that none of the direction type filters should be selected by default", { timeout: 60 * 1000 }, async () => {

    const checkboxFilterPO = new CheckboxFilterPO(page.locator('#call-direction-filter'));
    expect(checkboxFilterPO.isChannelDirectionSelected('Internal')).toBeFalsy();
    expect(checkboxFilterPO.isChannelDirectionSelected('Incoming')).toBeFalsy();
    expect(checkboxFilterPO.isChannelDirectionSelected('Outgoing')).toBeFalsy();
});

Then("Step-3: should be able to set and clear channel type filters", { timeout: 60 * 1000 }, async () => {

    const checkboxFilterPO = new CheckboxFilterPO(page.locator('[id^=recorded-segment-filter]'));
    await checkboxFilterPO.toggleChannelByName('Voice');
    await checkboxFilterPO.toggleChannelByName('Chat');
    await checkboxFilterPO.toggleChannelByName('Email');
    expect(checkboxFilterPO.isChannelSelected('Voice')).toBeTruthy();
    expect(checkboxFilterPO.isChannelSelected('Chat')).toBeTruthy();
    expect(checkboxFilterPO.isChannelSelected('Email')).toBeTruthy();
    await checkboxFilterPO.clearFilter();
    expect(checkboxFilterPO.isChannelSelected('Voice')).toBeFalsy();
    expect(checkboxFilterPO.isChannelSelected('Chat')).toBeFalsy();
    expect(checkboxFilterPO.isChannelSelected('Email')).toBeFalsy();
});

Then("Step-4: should be able to set and clear direction type filters", { timeout: 60 * 1000 }, async () => {

    const checkboxFilterPO = new CheckboxFilterPO(page.locator('#call-direction-filter'));
    await checkboxFilterPO.toggleCallDirectionByName('Internal');
    await checkboxFilterPO.toggleCallDirectionByName('Incoming');
    await checkboxFilterPO.toggleCallDirectionByName('Outgoing');
    expect(checkboxFilterPO.isChannelDirectionSelected('Internal')).toBeTruthy();
    expect(checkboxFilterPO.isChannelDirectionSelected('Incoming')).toBeTruthy();
    expect(checkboxFilterPO.isChannelDirectionSelected('Outgoing')).toBeTruthy();
    await checkboxFilterPO.clearFilter();
    expect(checkboxFilterPO.isChannelDirectionSelected('Internal')).toBeFalsy();
    expect(checkboxFilterPO.isChannelDirectionSelected('Incoming')).toBeFalsy();
    expect(checkboxFilterPO.isChannelDirectionSelected('Outgoing')).toBeFalsy();
});

When("Step-1: should check that csat score checkbox should not be selected by default", { timeout: 60 * 1000 }, async () => {

    const feedbackFilterPo = new FeedbackFilterPo(page.locator('#feedback-score-filter'));
    expect(feedbackFilterPo.isFeedbackCheckBoxSelected('csat-score-checkbox')).toBeFalsy();
});

Then("Step-2: should be able to select feedback score ranges", { timeout: 60 * 1000 }, async () => {

    const feedbackFilterPo = new FeedbackFilterPo(page.locator('#feedback-score-filter'));
    await feedbackFilterPo.toggleFeedbackCheckBox('csat-score-checkbox');
    expect(feedbackFilterPo.isFeedbackCheckBoxSelected('csat-score-checkbox')).toBeTruthy();
    expect(await feedbackFilterPo.getMinValueScore('.csat-score-filter')).toEqual('0%');
    expect(await feedbackFilterPo.getMaxValueScore('.csat-score-filter')).toEqual('100%');
    expect(await feedbackFilterPo.getRangeText()).toEqual('0% to 100%');
    await utils.delay(2000);
    await feedbackFilterPo.moveFeedBackRangeSlider('.noUi-handle-lower',20);
    await utils.delay(2000);
    await feedbackFilterPo.moveFeedBackRangeSlider('.noUi-handle-upper',-20);
    expect(await feedbackFilterPo.getMinValueScore('.csat-score-filter')).toEqual('13%');
    expect(await feedbackFilterPo.getMaxValueScore('.csat-score-filter')).toEqual('87%');
    expect(await feedbackFilterPo.getRangeText()).toEqual('13% to 87%');
});

When("Step-1: should verify that none of the sentiment filters are selected by default", { timeout: 60 * 1000 }, async () => {

    const state = await sentimentsPO.getSelectedSentimentState();
    expect(state['POSITIVE'].selected).toBeFalsy();
    expect(state['POSITIVE'].enabled).toBeTruthy();
    expect(state['NEGATIVE'].selected).toBeFalsy();
    expect(state['NEGATIVE'].enabled).toBeTruthy();
    expect(state['NEUTRAL'].selected).toBeFalsy();
    expect(state['NEUTRAL'].enabled).toBeTruthy();
    expect(state['MIXED'].selected).toBeFalsy();
    expect(state['MIXED'].enabled).toBeTruthy();
});

Then("Step-2: should be able to set and clear sentiment filters", { timeout: 60 * 1000 }, async () => {

    await sentimentsPO.selectSentiment('Positive', 'Agent AND Customer');
    await sentimentsPO.selectSentiment('Negative', 'Agent side');
    await sentimentsPO.selectSentiment('Neutral', 'Customer side');
    await sentimentsPO.selectSentiment('Mixed', 'Either side');
    let state = await sentimentsPO.getSelectedSentimentState();
    expect(state['POSITIVE'].selected).toBeTruthy();
    expect(state['POSITIVE'].sideSelector).toEqual('Agent AND Customer');
    expect(state['NEGATIVE'].selected).toBeTruthy();
    expect(state['NEGATIVE'].sideSelector).toEqual('Agent side');
    expect(state['NEUTRAL'].selected).toBeTruthy();
    expect(state['NEUTRAL'].sideSelector).toEqual('Customer side');
    expect(state['MIXED'].selected).toBeTruthy();
    expect(state['MIXED'].sideSelector).toEqual('Either side');
    await sentimentsPO.clearFilter();
    state = await sentimentsPO.getSelectedSentimentState();
    expect(state['POSITIVE'].selected).toBeFalsy();
    expect(state['POSITIVE'].sideSelector).toBeUndefined();
    expect(state['NEGATIVE'].selected).toBeFalsy();
    expect(state['NEGATIVE'].sideSelector).toBeUndefined();
    expect(state['NEUTRAL'].selected).toBeFalsy();
    expect(state['NEUTRAL'].sideSelector).toBeUndefined();
    expect(state['MIXED'].selected).toBeFalsy();
    expect(state['MIXED'].sideSelector).toBeUndefined();
});

When("Step-1: should verify that none of the agent behavior filters are selected by default", { timeout: 60 * 1000 }, async () => {

    const agentBehaviour = await agentBehaviourPO.getSelectedAgentBehaviorType(0);
    expect(agentBehaviour).toEqual('Select behavior type');
    const stronglyNegativeScore = await agentBehaviourPO.getSelectedAgentBehaviorScore(0,'strongly-negative');
    expect(stronglyNegativeScore).not.toContain('selected');
    const moderatelyPositiveScore = await agentBehaviourPO.getSelectedAgentBehaviorScore(0,'moderately-positive');
    expect(moderatelyPositiveScore).not.toContain('selected');
    const neutral = await agentBehaviourPO.getSelectedAgentBehaviorScore(0,'neutral');
    expect(neutral).not.toContain('selected');
    const moderatelyNegativeScore = await agentBehaviourPO.getSelectedAgentBehaviorScore(0,'moderately-negative');
    expect(moderatelyNegativeScore).not.toContain('selected');
    const stronglyPositiveScore = await agentBehaviourPO.getSelectedAgentBehaviorScore(0,'strongly-positive');
    expect(stronglyPositiveScore).not.toContain('selected');
});

Then("Step-2: should be able to set and clear agent behaviour filters", { timeout: 60 * 1000 }, async () => {

    await agentBehaviourPO.setAgentBehaviorType('Demonstrate ownership', 0);
    const agentBehaviour = await agentBehaviourPO.getSelectedAgentBehaviorType(0);
    expect(agentBehaviour).toEqual('Demonstrate ownership');
    await agentBehaviourPO.selectScore('strongly-negative', 0);
    const stronglyNegativeScore = await agentBehaviourPO.getSelectedAgentBehaviorScore(0,'strongly-negative');
    expect(stronglyNegativeScore).toContain('selected');
    await agentBehaviourPO.selectScore('strongly-positive', 0);
    const stronglyPositiveScore = await agentBehaviourPO.getSelectedAgentBehaviorScore(0,'strongly-positive');
    expect(stronglyPositiveScore).toContain('selected');
    await agentBehaviourPO.clearFilter();
    const agentBehaviourtype = await agentBehaviourPO.getSelectedAgentBehaviorType(0);
    expect(agentBehaviourtype).toEqual('Select behavior type');
    const stronglyNegativeScore1 = await agentBehaviourPO.getSelectedAgentBehaviorScore(0,'strongly-negative');
    expect(stronglyNegativeScore1).not.toContain('selected');
    const moderatelyPositiveScore = await agentBehaviourPO.getSelectedAgentBehaviorScore(0,'moderately-positive');
    expect(moderatelyPositiveScore).not.toContain('selected');
    const neutralScore = await agentBehaviourPO.getSelectedAgentBehaviorScore(0,'neutral');
    expect(neutralScore).not.toContain('selected');
    const moderatelyNegativeScore = await agentBehaviourPO.getSelectedAgentBehaviorScore(0,'moderately-negative');
    expect(moderatelyNegativeScore).not.toContain('selected');
    const stronglyPositiveScore1 = await agentBehaviourPO.getSelectedAgentBehaviorScore(0,'strongly-positive');
    expect(stronglyPositiveScore1).not.toContain('selected');
});

When("Step-1: should be able to save plan as draft and verify filters are retained", { timeout: 60 * 1000 }, async () => {

    await qualityPlanDetailsPO.enterPlanName('Filters Plan 1');
    await qualityPlanDetailsPO.enterPlanDescription('This is a sample description');
    await callDurationPO.selectOperation('Between');
    await callDurationPO.setFirstCallDurationValue('00:03:00');
    await callDurationPO.setSecondCallDurationValue('00:06:00');
    await interactionPO.clickWithoutScreenInteractionButton();
    await interactionPO.toggleChannelByName('Voice');
    await interactionPO.toggleChannelByName('Chat');
    await callDirectionPO.toggleCallDirectionByName('Incoming');
    await callDirectionPO.toggleCallDirectionByName('Outgoing');
    await feedbackFilterPo.toggleFeedbackCheckBox('csat-score-checkbox');
    expect(feedbackFilterPo.isFeedbackCheckBoxSelected('csat-score-checkbox')).toBeTruthy();
    expect(await feedbackFilterPo.getMinValueScore('.csat-score-filter')).toEqual('0%');
    expect(await feedbackFilterPo.getMaxValueScore('.csat-score-filter')).toEqual('100%');
    expect(await feedbackFilterPo.getRangeText()).toEqual('0% to 100%');
    await utils.delay(2000);
    await feedbackFilterPo.moveFeedBackRangeSlider('.noUi-handle-lower',20);
    await utils.delay(2000);
    await feedbackFilterPo.moveFeedBackRangeSlider('.noUi-handle-upper',-20);
    await sentimentsPO.selectSentiment('MIXED', 'Agent side');
    await agentBehaviourPO.setAgentBehaviorType('Demonstrate ownership', 0);
    await agentBehaviourPO.selectScore('strongly-negative', 0);
    await agentBehaviourPO.selectScore('strongly-positive', 0);
    await qualityPlanDetailsPO.saveAsDraft();
    expect(await qualityPlanManagerPO.verifyPlanPresence('Filters Plan 1')).toBeTruthy();
    await qualityPlanManagerPO.openQualityPlanByName('Filters Plan 1');
    expect(await qualityPlanDetailsPO.getPlanName()).toEqual('Filters Plan 1');
    expect(await qualityPlanDetailsPO.getPlanDescription()).toEqual('This is a sample description');
    expect(await callDurationPO.getFirstCallDurationValue()).toEqual('00:03:00');
    expect(await callDurationPO.getSecondCallDurationValue()).toEqual('00:06:00');
    expect(await interactionPO.getSelectedInteractionButton()).toEqual('Without Screen');
    expect(await interactionPO.isChannelSelected('Voice')).toBeTruthy();
    expect(await interactionPO.isChannelSelected('Chat')).toBeTruthy();
    expect(await interactionPO.isChannelSelected('Email')).toBeFalsy();
    expect(await feedbackFilterPo.getMinValueScore('.csat-score-filter')).toEqual('13%');
    expect(await feedbackFilterPo.getMaxValueScore('.csat-score-filter')).toEqual('87%');
    expect(await feedbackFilterPo.getRangeText()).toEqual('13% to 87%');
    let state = await sentimentsPO.getSelectedSentimentState();
    expect(state['MIXED'].selected).toBeTruthy();
    expect(state['MIXED'].sideSelector).toEqual('Agent side');
    const agentBehaviour = await agentBehaviourPO.getSelectedAgentBehaviorType(0);
    const stronglyNegativeScore = await agentBehaviourPO.getSelectedAgentBehaviorScore(0,'strongly-negative');
    const stronglyPositiveScore = await agentBehaviourPO.getSelectedAgentBehaviorScore(0,'strongly-positive');
    expect(agentBehaviour).toEqual('Demonstrate ownership');
    expect(stronglyNegativeScore).toContain('selected');
    expect(stronglyPositiveScore).toContain('selected');
});

Then("Step-2: should be able to duplicate saved plan and verify the filters are retained", { timeout: 60 * 1000 }, async () => {

    await qualityPlanManagerPO.navigate();
    expect(await qualityPlanManagerPO.verifyPlanPresence('Filters Plan 1')).toBeTruthy();
    await qualityPlanManagerPO.duplicatePlan('Filters Plan 1', 'Filters Plan 1 Duplicate');
    await qualityPlanManagerPO.openQualityPlanByName('Filters Plan 1 Duplicate');
    expect(await qualityPlanDetailsPO.getPlanName()).toEqual('Filters Plan 1 Duplicate');
    expect(await qualityPlanDetailsPO.getPlanDescription()).toEqual('This is a sample description');
    expect(await callDurationPO.getFirstCallDurationValue()).toEqual('00:03:00');
    expect(await callDurationPO.getSecondCallDurationValue()).toEqual('00:06:00');
    expect(await interactionPO.getSelectedInteractionButton()).toEqual('Without Screen');
    expect(await interactionPO.isChannelSelected('Voice')).toBeTruthy();
    expect(await interactionPO.isChannelSelected('Chat')).toBeTruthy();
    expect(await feedbackFilterPo.getMinValueScore('.csat-score-filter')).toEqual('13%');
    expect(await feedbackFilterPo.getMaxValueScore('.csat-score-filter')).toEqual('87%');
    expect(await feedbackFilterPo.getRangeText()).toEqual('13% to 87%');
    let state = await sentimentsPO.getSelectedSentimentState();
    expect(state['MIXED'].selected).toBeTruthy();
    expect(state['MIXED'].sideSelector).toEqual('Agent side');
});

Then("Step-3: should be able to change filters for a draft form and verify that the filters are retained", { timeout: 60 * 1000 }, async () => {

    await qualityPlanManagerPO.navigate();
    expect(await qualityPlanManagerPO.verifyPlanPresence('Filters Plan 1')).toBeTruthy();
    await qualityPlanManagerPO.openQualityPlanByName('Filters Plan 1');
    await sentimentsPO.clearFilter();
    await interactionPO.clickAllInteractionsButton();
    await interactionPO.toggleChannelByName('Email');
    await interactionPO.toggleChannelByName('Chat');
    await agentBehaviourPO.clearFilter();
    await agentBehaviourPO.setAgentBehaviorType('Build rapport', 0);
    await agentBehaviourPO.selectScore('neutral', 0);
    await agentBehaviourPO.selectScore('strongly-positive', 0);
    await agentBehaviourPO.addMoreAgentBehavior(0);
    await agentBehaviourPO.setAgentBehaviorType('Actively listening', 1);
    await agentBehaviourPO.selectScore('neutral', 1);
    await agentBehaviourPO.selectScore('strongly-positive', 1);
    await agentBehaviourPO.selectScore('strongly-negative', 1);
    await agentBehaviourPO.deleteAgentBehavior(0);
    await qualityPlanDetailsPO.saveAsDraft();
    await qualityPlanManagerPO.waitForPageToLoad();
    expect(await qualityPlanManagerPO.verifyPlanPresence('Filters Plan 1')).toBeTruthy();
    await qualityPlanManagerPO.openQualityPlanByName('Filters Plan 1');
    expect(await qualityPlanDetailsPO.getPlanName()).toEqual('Filters Plan 1');
    expect(await qualityPlanDetailsPO.getPlanDescription()).toEqual('This is a sample description');
    expect(await callDurationPO.getFirstCallDurationValue()).toEqual('00:03:00');
    expect(await callDurationPO.getSecondCallDurationValue()).toEqual('00:06:00');
    expect(await interactionPO.getSelectedInteractionButton()).toEqual('All');
    expect(await interactionPO.isChannelSelected('Voice')).toBeTruthy();
    expect(await interactionPO.isChannelSelected('Chat')).toBeFalsy();
    expect(await interactionPO.isChannelSelected('Email')).toBeTruthy();
    expect(await feedbackFilterPo.getMinValueScore('.csat-score-filter')).toEqual('13%');
    expect(await feedbackFilterPo.getMaxValueScore('.csat-score-filter')).toEqual('87%');
    expect(await feedbackFilterPo.getRangeText()).toEqual('13% to 87%');
    let state = await sentimentsPO.getSelectedSentimentState();
    expect(state['POSITIVE'].selected).toBeFalsy();
    expect(state['NEGATIVE'].selected).toBeFalsy();
    expect(state['NEUTRAL'].selected).toBeFalsy();
    expect(state['MIXED'].selected).toBeFalsy();
    const agentBehaviour1 = await agentBehaviourPO.getSelectedAgentBehaviorType(0);
    const neutralScore1 = await agentBehaviourPO.getSelectedAgentBehaviorScore(0,'neutral');
    const stronglyPositiveScore1 = await agentBehaviourPO.getSelectedAgentBehaviorScore(0,'strongly-positive');
    const stronglyNegativeScore1 = await agentBehaviourPO.getSelectedAgentBehaviorScore(0,'strongly-negative');
    expect(agentBehaviour1).toEqual('Actively listening');
    expect(neutralScore1).toContain('selected');
    expect(stronglyPositiveScore1).toContain('selected');
    expect(stronglyNegativeScore1).toContain('selected');
});

When("Step-1: should display interaction button filters and hide acd(email,chat) and voice channel filters when engage recording license is enabled", { timeout: 60 * 1000 }, async () => {

    const recordedSegmentFilterPO = new CheckboxFilterPO(page.locator('[id^=recorded-segment-filter]'));
    await FeatureToggleUtils.addTenantToFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userToken);
    await protractorConfig.tmUtils.updateTenantLicenses(userDetails.orgName, ['QM', 'ENGAGE_RECORDING'], tmToken);
    console.log('Waiting for 125 second because qp service is using in-memory ft-cache which will update in every 2 min');
    await utils.delay(125000);
    await qualityPlanDetailsPO.refresh();

    expect(await recordedSegmentFilterPO.isChannelPresent('Voice')).toBeFalsy();
    expect(await recordedSegmentFilterPO.isChannelPresent('Chat')).toBeFalsy();
    expect(await recordedSegmentFilterPO.isChannelPresent('Email')).toBeFalsy();
    expect(await recordedSegmentFilterPO.getSelectedInteractionButton()).toEqual('With Screen');
    await recordedSegmentFilterPO.clickWithoutScreenInteractionButton();
    expect(await recordedSegmentFilterPO.getSelectedInteractionButton()).toEqual('Without Screen');
    await recordedSegmentFilterPO.clickAllInteractionsButton();
    expect(await recordedSegmentFilterPO.getSelectedInteractionButton()).toEqual('All');
    await recordedSegmentFilterPO.clickWithScreenInteractionButton();
    expect(await recordedSegmentFilterPO.getSelectedInteractionButton()).toEqual('With Screen')
    await protractorConfig.tmUtils.updateTenantLicenses(userDetails.orgName, ['QMA', 'ACD', 'WFM', 'RECORDING'], tmToken);

});

When("Step-1: should be showing only voice filter checkbox", { timeout: 60 * 1000 }, async () => {

    const interactionPO = new CheckboxFilterPO(page.locator('[id^=recorded-segment-filter]'));
    await qualityPlanDetailsPO.navigate();
    await protractorConfig.tmUtils.updateTenantLicenses(userDetails.orgName, ['QM', 'RECORDING'], tmToken);
    await qualityPlanDetailsPO.refresh();
    expect(await interactionPO.isChannelPresent('Voice')).toBeTruthy();
    expect(await interactionPO.isChannelPresent('Chat')).toBeFalsy();
    expect(await interactionPO.isChannelPresent('Email')).toBeFalsy();
});

Then("Step-2: should be showing only chat and email filter checkbox", { timeout: 60 * 1000 }, async () => {

    const interactionPO = new CheckboxFilterPO(page.locator('[id^=recorded-segment-filter]'));
    await qualityPlanDetailsPO.navigate();
    await protractorConfig.tmUtils.updateTenantLicenses(userDetails.orgName, ['QM', 'ACD'], tmToken);
    await qualityPlanDetailsPO.refresh();
    expect(await interactionPO.isChannelPresent('Voice')).toBeFalsy();
    expect(await interactionPO.isChannelPresent('Chat')).toBeTruthy();
    expect(await interactionPO.isChannelPresent('Email')).toBeTruthy();
});