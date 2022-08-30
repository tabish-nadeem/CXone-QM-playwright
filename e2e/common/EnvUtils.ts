import {SELECTORS} from "../playwright.helpers";

export class EnvUtils {
  public baseUrl: string;

  static environments = {
    dev: 'dev',
    test: 'test',
    staging: 'staging',
    production: 'nice-incontact'
  };

  static getBaseUrl() {
    //return process.env.PLAYWRIGHT_BASE_URL || process.env.PROTRACTOR_BASE_URL || 'http://na1.dev.localhost:8088';
    return SELECTORS.PLAYWRIGHT_BASE_URL;
  }

  static getCurrentEnvironment(): string {
    if (EnvUtils.getBaseUrl().indexOf('localhost') !== -1) {
      return EnvUtils.environments.dev;
    }
    return EnvUtils.getBaseUrl().split('.')[1];
  }

  static isStagingEnv() {
    return EnvUtils.getBaseUrl().includes('staging');
  }

  static isTestEnv() {
    return EnvUtils.getBaseUrl().includes('test');
  }

  static isDevEnv() {
    return EnvUtils.getBaseUrl().includes('dev');
  }

  static isRunningLocally() {
    return EnvUtils.getBaseUrl().includes('localhost');
  }

  static setBaseUrl(baseUrl: string) {
    process.env.PLAYWRIGHT_BASE_URL = baseUrl;
  }
  static getTmLoginEmailAddress() {
    return process.env.TM_LOGIN_EMAIL_ADDRESS || 'tmadmin@mailinator.com';
  }
  static getTmLoginPassword() {
    return process.env.TM_LOGIN_PASSWORD || 'Ds7Ws53A';
  }

  static getCustomAll() {
    let params = {};
    try {
      params = JSON.parse(process.env.PLAYWRIGHT_CUSTOM_PARAMS as string);
    } catch {
      params = {};
    }
    return params;
  }

  static getCustom(param: string) {
    const params = EnvUtils.getCustomAll();
    return params[param];
  }

  static setCustom(param: string, value: string) {
    const params = EnvUtils.getCustomAll();
    params[param] = value;
    process.env.PLAYWRIGHT_CUSTOM_PARAMS = JSON.stringify(params);
  }

}
