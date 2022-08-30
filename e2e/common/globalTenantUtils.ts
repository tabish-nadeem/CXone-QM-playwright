import { AccountUtils } from "../common/AccountUtils";

let managerCreds: any;
let managerCreds2: any;
let employee1Creds: any;

export class GlobalTenantUtils {
    userDetails = {
        orgName: 'orghttp' + AccountUtils.getRandomString() + AccountUtils.getFullRandomString(5),
        email: 'ptor.' + AccountUtils.getRandomString() + '@wfosaas.com',
        password: 'Pass1234',
        firstName: 'Admin',
        lastName: 'User',
        managerCreds: {},
        managerCreds2: {},
        employee1Creds: {},
        evaluatorCreds: {},
        employeeCreds: {}
    };

    async getDefaultTenantCredentials() {
        return this.userDetails;
    }
}



