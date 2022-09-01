import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
import { FEATURE_TOGGLES } from "../../../assets/CONSTANTS";
import { Utils } from "../../../../common/utils";
import { CommonNoUIUtils } from "../../../../common/CommonNoUIUtils";
import { GlobalTenantUtils } from "../../../../common/globalTenantUtils";
import { LoginPage } from "../../../../common/login";
import { FEATURE_TOGGLES } from "../../../../common/uiConstants";
import { FeatureToggleUtils } from "../../../../common/FeatureToggleUtils";
import { CommonQMNoUIUtils } from "../../../../common/CommonQMNoUIUtils";
import { LocalizationNoUI } from "../../../../common/LocalizationNoUI";
import { Credentials } from "../../../../common/support";
import { AdminUtilsNoUI } from "../../../../common/AdminUtilsNoUI";
import { UserDefaultPermissions } from "../../../../common/userDefaultPermissions";
import { IntegrationTestData } from "../../../../common/integrationTestData";
import { PerformanceMonitoringPo } from "../../../../pageObjects/performanceMonitoringPO";
import { PerformanceDetailsPO } from "../../../../pageObjects/performanceDetailsPO";
import { PlansMonitoringPagePO } from "../../../../pageObjects/plansMonitoringPO";
import { OnPrepare } from "../../../../playwright.config";
import { Helpers } from "../../../../playwright.helpers";
import * as moment from "moment";
import * as _ from "lodash";
import { CommonUIUtils } from "cxone-playwright-test-utils";

let page: Page;
let browser: any;
let context: BrowserContext;
let loginPage: any;
let responseDisInt: any;
let responsePlanOcc: any;
let utils: any;
let plansMonitoringPO: any;
let performanceMonitoring: any;
let performanceDetails: any;
let getAllTeams1: any;
let newGlobalTenantUtils = new GlobalTenantUtils();
let userDefaultPermissions = new UserDefaultPermissions();
let integrationTestData = new IntegrationTestData();

let localeString = "en-US",
  dateFormat: any = {};

let testDataUsed: any = {
  adminUser: {},
  agentUser: {},
  managerUser: {},
  evaluatorUser: {},
  tenantId: "",
  agentToken: "",
  formData: {},
  userGroup: {
    name: "GROUP_1",
    groupId: "",
    employees: [],
  },
  planData: {
    name: "",
    description: "",
    state: "Active",
    numDaysBackDistribution: -1,
    planDuration: {
      oneTimeDateRange: {
        startDate: "",
        endDate: "",
      },
    },
    filters: [
      {
        name: "QpMediaTypeMapper",
        value: "",
        operation: "Equal", //We are creating QP with old payload with equal operation on purpose. Do no change in QP payload
        active: false,
      },
      {
        name: "DirectionType",
        value: "IN_BOUND",
        operation: "Equal",
        active: false,
      },
      {
        name: "CallDuration",
        value: 30,
        value2: 360,
        operation: "Greater",
        active: true,
        valid: true,
      },
    ],
  },
  team: [],
  task: {},
};

let userDetails: any = {};
let data: any;
let responseCreatePlan: any;
let response: any;
let response2: any;
let response3: any;
let response4: any;
let response5: any;
let newOnPrepare: any;
let getElementLists: any;
let responseManager: any;
let baseUrl: any;
let rowElements1: any;
let responseEvaluator: any;
let rowElements2: any;
let rowColumnValues1: any;
let rowColumnValues2: any;

BeforeAll({ timeout: 300 * 1000 }, async () => {
  browser = await chromium.launch({
    headless: false,
    args: ["--window-position=-8,0"],
  });
  context = await browser.newContext();
  page = await context.newPage();
  userDetails = await newGlobalTenantUtils.getDefaultTenantCredentials(); //!
  console.log(
    "userDetails.email",
    userDetails.email + "userDetails.password",
    userDetails.password
  );
  response = await CommonNoUIUtils.login(
    userDetails.email,
    userDetails.password,
    true
  );
  console.log("Response login", response);
  //! DataCreator.setToken(USER_TOKEN); // not got file
  await FeatureToggleUtils.addTenantToFeature(
    FEATURE_TOGGLES.ANGULAR8_MIGRATION_SUMMER21,
    userDetails.orgName,
    response
  );
  await FeatureToggleUtils.addTenantToFeature(
    FEATURE_TOGGLES.RELEASE_NAVIGATION_REDESIGN,
    userDetails.orgName,
    response
  );
  await FeatureToggleUtils.removeTenantFromFeature(
    FEATURE_TOGGLES.FT_EXCLUDE_INACTIVE_USERS,
    userDetails.orgName,
    testDataUsed.adminUser.userToken
  );
  response;

  // testDataUsed.adminUser = response.user;
  // testDataUsed.tenantId = response.tenantId;
  // testDataUsed.adminUser.userToken = response.token;
  // testDataUsed.adminUser.password = userDetails.password;
  console.log(
    "testDataUsed.adminUser",
    testDataUsed.adminUser + "testDataUsed.tenantId",
    testDataUsed.tenantId + "testDataUsed.adminUser.userToken",
    testDataUsed.adminUser.userToken + "testDataUsed.adminUser.password",
    testDataUsed.adminUser.password
  );
  getElementLists = getElementList();
  await CommonQMNoUIUtils.addElementToBank(
    getElementLists,
    testDataUsed.adminUser.userToken
  );
  await createGroup(testDataUsed.adminUser.userToken);
  await createUsersAndGetDetails(testDataUsed.adminUser.userToken);
  await createAndActivateEvaluationForm(testDataUsed.adminUser.userToken);
  getAllTeams1 = await AdminUtilsNoUI.getAllTeams(
    testDataUsed.adminUser.userToken
  );
  testDataUsed.team = getAllTeams1.teams[0];
  console.log("testDataUsed.team", testDataUsed.team);
  responseManager = await CommonNoUIUtils.login(
    testDataUsed.managerUser.emailAddress,
    Credentials.validPassword,
    true
  );
  console.log("testDataUsed.managerUser.userToken", responseManager.token);
  testDataUsed.managerUser.userToken = responseManager.token;
  await FeatureToggleUtils.addTenantToFeature(
    FEATURE_TOGGLES.ANGULAR8_MIGRATION_SUMMER21,
    userDetails.orgName,
    testDataUsed.adminUser.userToken
  );
  baseUrl = await Helpers.getBaseUrl();
  await page.goto(baseUrl, { timeout: 30000, waitUntil: "load" });
  await loginPage.login(
    testDataUsed.managerUser.emailAddress,
    Credentials.validPassword
  );
  await pushInteractionData(
    [testDataUsed.agentUser.id],
    moment().utc().subtract(1, "day"),
    moment().utc(),
    16,
    testDataUsed.adminUser.userToken
  );
  dateFormat = await LocalizationNoUI.getDateStringFormat(localeString);
  console.log("DateTime formats to use", dateFormat);
  await createQualityPlan("QPOne", "Standard");
  await FeatureToggleUtils.addTenantToFeature(
    FEATURE_TOGGLES.ANGULAR8_MIGRATION_SUMMER21,
    userDetails.orgName,
    testDataUsed.adminUser.userToken
  );
  await FeatureToggleUtils.addTenantToFeature(
    FEATURE_TOGGLES.FT_EMPLOYEE_EVALUATION,
    userDetails.orgName,
    testDataUsed.adminUser.userToken
  );
  await FeatureToggleUtils.removeTenantFromFeature(
    FEATURE_TOGGLES.FT_EXCLUDE_INACTIVE_USERS,
    userDetails.orgName,
    testDataUsed.adminUser.userToken
  );
  utils = new Utils(page);
  performanceMonitoring = new PerformanceMonitoringPo(page);
  performanceDetails = new PerformanceDetailsPO(page);
  plansMonitoringPO = new PlansMonitoringPagePO(page);
});

function enablingFeatureToggle(
  ANGULAR8_MIGRATION_SUMMER21: string,
  orgName: any,
  response: any
) {
  throw new Error("Function not implemented.");
}
