import { HttpUtils } from '../common/HttpUtils';
import { TmUtils } from 'cxone-playwright-test-utils';
import { EnvUtils } from '../common/EnvUtils';
import { EmailUtils } from '../common/EmailUtils';
import { FeatureToggleUtils } from '../common/FeatureToggleUtils';

let email: string;
let password: string;
let organizationName: string;
let firstName: string;
let lastName: string;
let username: string;
let licenseDetails: [];
let billingId: any;
let clusterId: any;

export class AccountUtils {
  static getUsers(userTokenlToken: any) {
    throw new Error("Method not implemented.");
  }
  static ACCOUNT_NAME_CXONE = 'NICE-inContact CXone'

  static activateUser = async (email: string, password: any, token: string) => {
    try {
      const response = await HttpUtils.sendRequest({
        action: 'POST',
        uri: '/public/user/activate',
        body: {
          email: email,
          password: password,
          token: token
        },
        timeout: 60000
      });
      return response;
    } catch (error) {
      return error;
    }
  };

  static assignDefaultLAIdUser = async (values: { loginAuthenticatorId?: any; }, token: any) => {
    if (!values.loginAuthenticatorId) {
      try {
        const result = await AccountUtils.getDefaultLoginAuthenticatorID(token);
        values.loginAuthenticatorId = result;
        return values;
      } catch (error) {
        return error;
      }
    }
    console.log('Getting the values', values);
  };

  static createAndActivateUser = async (email: string, password: any, userValues: {}, invitationSenderEmail: any, tenantName: any, token: any, accountName = AccountUtils.ACCOUNT_NAME_CXONE) => {
    await AccountUtils.createNewUser(email, userValues, tenantName, token);
    await AccountUtils.inviteUserByEmail(email, invitationSenderEmail, token);
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
    const relativeUrl = await EmailUtils.getRelativeAccountActivationUrl(email, tenantName, accountName);
    // @ts-ignore: Object is possibly 'null'.
    await AccountUtils.activateUser(email, password, /token=([^&]+)/.exec(relativeUrl)[1]);
  };

  static createNewUser = async (myemail = AccountUtils.getRandomEmail(), values = {}, tenantName: string, token: any) => {
    const updatedValues = await AccountUtils.assignDefaultLAIdUser(values, token);
    const isWfoRegisterAPiDeprecated = await FeatureToggleUtils.isFeatureToggleTurnedOnForTenant('release-deprecation-of-wfo-user-manager-api-UH-19591', tenantName, token);
    let uri: string;
    if (isWfoRegisterAPiDeprecated) {
      uri = '/user/register';
    }
    else {
      uri = '/wfo/user/register';
    }
    try {
      await HttpUtils.sendRequest({
        action: 'POST',
        uri: uri,
        body: {
          "acdInfos": [],
          "assignedGroup": "",
          "emailAddress": myemail,
          "firstName": updatedValues.firstName,
          "hireDate":  updatedValues.hireDate,
          "lastName": updatedValues.lastName,
          "mobileNumber": "234534523",
          "rank": "1",
          "role": "Administrator",
          "skills": [],
          "groupIds": []
        },
    authorization: token,
      timeout: 120000
  });
      return myemail;
    } catch (error) {
  return error;
}
  };
  static createAccount = async (email: string, password: string, organizationName: string, firstName: string, lastName: string, username: string, licenseDetails: string[], billingId: any, clusterId: any) => {
  let result = await AccountUtils.createAccountInner(email, password, organizationName, firstName, lastName, username, licenseDetails, billingId, clusterId);
  if (!result || result instanceof Error) {
    result = await AccountUtils.createAccountInner(email, password, organizationName, firstName, lastName, username, licenseDetails, billingId, clusterId);
    if (!result || result instanceof Error) {
      console.log('createAccount: Tenant creation failed after 2 attempts');
    } else {
      console.log('createAccount: Tenant created successfully. Attempt 2');
    }
  } else {
    console.log('createAccount: Tenant created successfully. Attempt 1');
  }
  return result;
};

  static createAccountInner = async (email: string, password: string, organizationName: string, firstName: string, lastName: string, username: string, licenseDetails: string[], billingId: any, clusterId: any) => {
  const tenantDetails = {
    email: email,
    password: password,
    organizationName: organizationName,
    licenses: licenseDetails,
    firstName: firstName,
    lastName: lastName,
    userName: username || email,
    clusterId: clusterId,
    billingId: billingId
  };
  return await AccountUtils.createTenant(tenantDetails);
};

  static createTenant = async (tenantDetails: any) => {
  try {
    let tmToken = '';
    const timestamp = AccountUtils.getRandomString(),
      validRandomChars = 'abcdefghijklmnopqrstuvwxyz',
      pwd = tenantDetails.password || 'Pass1234',
      orgName = tenantDetails.orgName || 'orghttp' + timestamp + AccountUtils.getFullRandomString(5),
      first = tenantDetails.firstName || 'some' + AccountUtils.getFullRandomString(10, validRandomChars),
      last = tenantDetails.lastName || 'some' + AccountUtils.getFullRandomString(10, validRandomChars),
      emailAddress = tenantDetails.email || AccountUtils.getRandomEmail(5),
      userName = tenantDetails.email || AccountUtils.getRandomEmail(5),
      billingId = tenantDetails.billingId || '-1',
      clusterId = tenantDetails.clusterId || '-1',
      licenses = tenantDetails.licenses || ['WFM', 'QM', 'RECORDING'];
    console.log('organizationName: ' + orgName + ' ,emailAddress: ' + emailAddress + ' ,password: ' + pwd + ' via http');

    const res: any = await HttpUtils.sendRequest({
      action: 'POST',
      uri: '/public/authentication/v1/login',
      body: {
        email: EnvUtils.getTmLoginEmailAddress(),
        password: EnvUtils.getTmLoginPassword(),
        userName: EnvUtils.getTmLoginEmailAddress(),
        customAttribute: false
      }
    });
    tmToken = res.token;
    console.log('Successful Login to TM');
    try {
      const response = await HttpUtils.sendRequest({
        action: 'POST',
        uri: '/tenants/v2',
        authorization: res.token,
        body: {
          tenantName: orgName,
          parentId: res.tenantId,
          source: 'protractor-web',
          expirationDate: new Date(2040, 11, 31, 23, 59, 59),
          timeZone: tenantDetails.timeZone || 'America/New_York',
          status: 'ACTIVE',
          tenantType: tenantDetails.tenantType || 'TRIAL',
          customerType: tenantDetails.customerType || 'BASIC',
          clusterId: clusterId,
          billingId: billingId,
          billingCycle: '5',
          billingTelephoneNumber: '123456',
          defaultUser: {
            firstName: first,
            lastName: last,
            email: emailAddress,
            userName: userName
          },
          parameters: {
            UHA_password: pwd
          },
          licenses: TmUtils.getLicenseDataByIds(licenses)
        },
        timeout: 60000
      });
      if (response != null) {
        return ({ success: true, tmToken: tmToken });
      } else {
        return false;
      }
    } catch (error) {
      return (new Error(error));
    }
  } catch (error) {
    return (new Error(error));
  }
}

  static createRandomTenantForTestExecution = async () => {
  const tenantDetailsName = AccountUtils.getRandomTenantName();
  const tenantDetailsUsername = AccountUtils.getRandomEmail(5);
  const tenantDetailsPassword = 'Pass1234';
  EnvUtils.setCustom('tenant_name', tenantDetailsName);
  EnvUtils.setCustom('tenant_username', tenantDetailsUsername);
  EnvUtils.setCustom('tenant_password', tenantDetailsPassword);

  const res = await AccountUtils.createTenant({
    organizationName: tenantDetailsName,
    email: tenantDetailsUsername,
    userName: tenantDetailsUsername,
    password: tenantDetailsPassword
  });

  let tmToken = '';
  if (res) {
    tmToken = (res as any).tmToken;
  }

  return {
    name: tenantDetailsName,
    email: tenantDetailsUsername,
    userName: tenantDetailsUsername,
    password: tenantDetailsPassword,
    tmToken: tmToken
  };
}

  static getDefaultLoginAuthenticatorID = async (token: any) => {
  try {
    const response: any = await HttpUtils.sendRequest({
      action: 'POST',
      uri: '/authorization/v1/login-authenticator/search',
      body: {
        filter: {
          isDefault: ['true']
        },
        page: {
          pageSize: 100,
          pageNo: 0
        }
      },
      authorization: token,
      timeout: 120000
    });
    return response.loginAuthenticators[0].id;
  } catch (error) {
    return error;
  }
};
static  getGroups =  async (token: any) =>{
  try {
    const response = await HttpUtils.sendRequest({
      action: 'GET',
      uri: '/group',
      body: {
        email: email,
        password: password,
        token: token
      },
      timeout: 60000
    });
    return response;
  } catch (error) {
    return error;
  }
};
  static getRandomEmployeeDetails(seq ?: string) {
  return {
    employeeEmailAddress: 'ptor.' + (new Date().getTime()) + (seq || '') + '@wfosaas.com',
    employeePassword: "Password1",
    firstName: 'Luke',
    lastName: 'Skywalker' + this.getRandomString()
  }
}

  static getRandomString(str ?: string) {
  const randVal = Date.now();
  if (str)
    return str + randVal;
  else
    return randVal;
}

  static getFullRandomString(length: number, characterOverride ?: string) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  if (characterOverride) {
    possible = characterOverride;
  }

  for (let i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

  static getRandomEmail(length ?: number, domain ?: string) {
  const defaultLength = 4;
  const timestamp = (new Date()).getTime();

  domain = domain || 'wfosaas.com';
  return AccountUtils.getFullRandomString(length || defaultLength).toLowerCase() + '.' + timestamp + '@' + domain;
}

  static getRandomTenantName(length ?: number) {
  const defaultLength = 5;
  const timestamp = AccountUtils.getRandomString();
  return 'org_' + timestamp + AccountUtils.getFullRandomString(length || defaultLength);
}

  static inviteUserByEmail = async (userEmail: string, adminEmail: string, token: any) => {
  const body = {
    emailAddressesList: [userEmail], senderEmail: adminEmail
  };
  try {
    const response: any = await HttpUtils.sendRequest({
      action: 'POST',
      uri: '/user/invite',
      authorization: token,
      body: body,
      timeout: 120000
    });
    return response;
  } catch (error) {
    return error;
  }
};

  static randomInt(min ?: number, max ?: number) {
  // min = 0, max = 10 ---> returns 0-9
  return Math.floor(Math.random() * (max - min)) + min;
}
}