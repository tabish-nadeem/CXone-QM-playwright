// import * as protHelper from '../../../tests/protractor/config-helpers';
import { HttpUtils } from '../common/HttpUtils';
const protractorConfig = protHelper.getProtractorHelpers();

export class DataCreator {
    private static TOKEN: string;

    static setToken(token: string) {
        this.TOKEN = token;
    }

    static async createAccount(emailId: string, password: string, organisationName: string, firstName: string, lastName: string, licenses: string[]) {
        emailId = emailId || protractorConfig.testUtils.getRandomEmail(5);
        password = password || 'Pass1234';
        organisationName = organisationName || `orghttp` + protractorConfig.testUtils.getRandomString() + protractorConfig.testUtils.getFullRandomString(5);
        firstName = firstName || 'FirstName';
        lastName = lastName || 'LastName';
        const response = await protractorConfig.testUtilsNoUI.createAccount(emailId, password, organisationName, firstName, lastName, emailId, licenses);
        const output = {
            orgName: organisationName,
            firstName,
            lastName,
            adminCreds: {
                email: emailId,
                password
            },
            tmToken: response.tmToken
        };
        return output;
    }

    static async createRandomAccountWithLicenses(firstName: string, lastName: string, licenses: string[]) {
        const emailId = protractorConfig.testUtils.getRandomEmail(5);
        const password = 'Pass1234';
        const organisationName = `orghttp` + protractorConfig.testUtils.getRandomString() + protractorConfig.testUtils.getFullRandomString(5);
        return await this.createAccount(emailId, password, organisationName, firstName, lastName, licenses);
    }

    static async createGroup(groupName: string): Promise<DCGroup> {
        const response = await protractorConfig.adminUtilsNoUI.createGroup(groupName, this.TOKEN);
        return {
            groupId: response.groupId,
            groupName
        };
    }

    static async createTeam(teamName: string, teamDescription: string = '', leadUserId: string = ''): Promise<DCTeam> {
        const output = await protractorConfig.adminUtilsNoUI.createTeam(teamName, teamDescription, leadUserId, this.TOKEN);
        return output.team;
    }

    static async createRandomGroups(count: number = 1, suffix: string = 'NAME'): Promise<DCGroup[]> {
        const response = [];
        for (let i = 1; i <= count; i++) {
            response.push(await this.createGroup(`GROUP${i}-${suffix}`));
        }
        return response;
    }

    static async createRandomTeams(count: number = 1, suffix: string = 'NAME'): Promise<DCTeam[]> {
        const response = [];
        for (let i = 1; i <= count; i++) {
            const generatedString = `TEAM${i}-${suffix}`;
            response.push(await this.createTeam(generatedString, generatedString, ''));
        }
        return response;
    }

    static async createUser(emailAddress: string, values: any) {
        return await protractorConfig.adminUtilsNoUI.createNewUser(emailAddress, values, this.TOKEN);
    }

    static async createRandomUsers(count: number = 1, values: any = {}) {
        const response = [];
        for (let i = 1; i <= count; i++) {
            const generatedString = protractorConfig.testUtils.getRandomEmail(5);
            response.push(await this.createUser(generatedString, values));
        }
        return response;
    }

    static async createForm(formName: string, formStatus: string, formType: string = 'EVALUATION', workflowConfigType: string = 'AGENT_NO_REVIEW') {
        return await protractorConfig.qmUtils.createForm({
            formName,
            formStatus,
            formType,
            workflowConfigType
        }, this.TOKEN);
    }
}

export interface DCGroup {
  groupId: string;
  groupName: string;
}

export interface DCTeam {
  id: string;
  name: string;
  description: string;
}
