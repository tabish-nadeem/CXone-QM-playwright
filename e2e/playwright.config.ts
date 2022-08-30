import { CommonNoUIUtils } from "../e2e/common/CommonNoUIUtils";
import { AccountUtils } from "../e2e/common/AccountUtils";
import { CommonQMNoUIUtils } from "../e2e/common/CommonQMNoUIUtils";
import { ModuleExports } from "./common/qmDefaultData";
import { DisableProtUtils } from "../e2e/common/disableProtUtil";
import { FeatureToggleUtils } from "../e2e/common/FeatureToggleUtils"
import { Utils } from "./common/utils";
import { Page } from "@playwright/test";

let newDisableProtUtils = new DisableProtUtils();
let licenseDetails = ["QM", "RECORDING", "ACD", "WFM"];
let envToDisable = ['NVIR','TEST']; // ['NVIR','DEV','TEST','STAGING']. Default is ['NONE']. Reset once dev env is stable.
let tmToken: any;
let accountToken: any;
let response: any;

const FEATURE_TOGGLES = {
    navigation_redesign: 'release-navigation-redesign-CXCROSS-21'
};

export class OnPrepare {
    page: Page;
    async OnStart(userDetails: any) {
        try {
            if (newDisableProtUtils.disableExecutionOnEnv(envToDisable)) {
                response = await AccountUtils.createAccount(userDetails.email, userDetails.password, userDetails.orgName, '', '', '', licenseDetails, '', '');
                tmToken = response.tmToken;
                accountToken = await CommonNoUIUtils.login(userDetails.email, userDetails.password, false);
                await ModuleExports.getFormData();
                await CommonQMNoUIUtils.getEvaluations(accountToken,false);
                console.log('Waiting for 60 seconds for flyway process');
                let utils = new Utils(this.page);
                await utils.delay(60000);
                await this.toggleFeatureToggle(FEATURE_TOGGLES.navigation_redesign,false, userDetails.orgName, accountToken);
            }
        } catch(error) {
            console.log('Global Tenant Creation Failed. Exiting Process', error);
            process.exit(1);
        } finally {
            console.log(" Created Global Tenant Successfully");
        }
    }

    async toggleFeatureToggle(featureToggleName: string, turnFTON: any, orgName: string, token: any) {
        let ftStatus = await FeatureToggleUtils.isFeatureToggleTurnedOnForTenant(featureToggleName, orgName, token);
        if (turnFTON && !ftStatus) {
          console.log('---------- Turning on FT : ' + featureToggleName + ' for tenant : ' + orgName);
          await FeatureToggleUtils.addTenantToFeature(featureToggleName, orgName, token)
        }
         else if (!turnFTON && ftStatus) {
          console.log('---------- Turning off FT : ' + featureToggleName + ' for tenant : ' + orgName);
          await FeatureToggleUtils.removeTenantFromFeatureRequest(featureToggleName, orgName, token);
        }
        console.log('---------- FT : ' + featureToggleName + ' is already ' + ftStatus + ' for tenant : ' + orgName);
      }
    };