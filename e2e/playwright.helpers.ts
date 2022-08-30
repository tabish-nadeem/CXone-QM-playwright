export const SELECTORS = {
    envToDisable: ['NVIR'], // ['NVIR','DEV','TEST','STAGING']. Default is ['NONE']. Reset once dev env is stable.
    ES_URI: " ",
    suiteDir: 'target/chrome-reports',
    TM_LOGIN_EMAIL_ADDRESS: "tmadmin@mailinator.com",
    TM_LOGIN_PASSWORD: "Ds7Ws53A",
    AUTH_APP_URL: "https://na1.test.nice-incontact.com",
    PLAYWRIGHT_BASE_URL: "https://na1.dev.nice-incontact.com",
    APP_CONTEXT: "/qm/monitoring",
    SYNTHETIC_MONITOR_ACCOUNT_EMAIL: "syntheticadmin6@nice.com",
    SYNTHETIC_MONITOR_ACCOUNT_NAME: "perm_syntheticmonitortenant_30052018_qm",
    SYNTHETIC_MONITOR_ACCOUNT_PASSWORD: "Pass123456",
    SYNTHETIC_MONITOR_ACCOUNT: false,
    SYNTHETIC_MONITOR_WITH_DATA: true,
    SYNTHETIC_MONITOR_BROWSER_CONSOLE_LOGS: false
    }

    
export class Helpers {
    static commonOnPrepare: any;
    
    static async getBaseUrl(){
        return SELECTORS.PLAYWRIGHT_BASE_URL;
    }
}
