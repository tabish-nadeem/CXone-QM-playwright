//import { _ } from "lodash"

export class DisableProtUtils {

    async disableExecutionOnEnv(envList) {
        let AUTH_APP_URL = "https://na1.dev.nice-incontact.com";
        let shouldRun = true;
        envList.forEach(function (name: string) {
            if (AUTH_APP_URL.includes(name.toLowerCase())) {
                shouldRun = false;
                return shouldRun;
            }
        });
        return false;
    }

    async getEnvName() {
        let AUTH_APP_URL = "https://na1.dev.nice-incontact.com";
        return AUTH_APP_URL.split('.')[1];
    }
};