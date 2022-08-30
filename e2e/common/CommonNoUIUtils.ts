import { EnvUtils } from '../common/EnvUtils';
import { HttpUtils } from '../common/HttpUtils';
import { FeatureToggleUtils } from '../common/FeatureToggleUtils';

export class CommonNoUIUtils {
    public baseUrl: string;
    static async createNewRoleByPermissions(name: string, roleDescription: any, myPermissions: string[], token: any) {
        try {
            const response: any = await HttpUtils.sendRequest({
                action: 'POST',
                uri: '/authorization/roleByPermissions',
                body: {
                    displayName: name,
                    description: roleDescription,
                    modifiable: 1,
                    status: 'ACTIVE',
                    permissions: myPermissions
                },
                authorization: token,
                timeout: 30000
            });
            if (response.success) {
                console.log('Role ' + name + ' created');
            } else {
                console.log('Role not created');
            }
            return response;
        } catch (error) {
            return error;
        }
    }

    static createUserWithOrWithoutEmailId = async (myemail: string, values: NewUserValues, tenantName: string, token: any) => {
        const result = {
            responseJson: {},
            firstName: {}
        };

        if (!myemail) {
            myemail = '';
        }

        values = await CommonNoUIUtils.assignDefaultLAIdUser(values, token);

        let uri: string;
        const isWfoRegisterAPiDeprecated = await FeatureToggleUtils.isFeatureToggleTurnedOnForTenant('release-deprecation-of-wfo-user-manager-api-UH-19591', tenantName, token);
        if (isWfoRegisterAPiDeprecated) {
            uri = '/user/register';
        }
        else {
            uri = '/wfo/user/register';
        }

        const response: any = await HttpUtils.sendRequest({
            action: 'POST',
            uri: uri,
            body: {
                acdInfos: values.acdInfos || [], //[{loginId: '123'}]
                assignedGroup: values.assignedGroup || '',
                emailAddress: myemail,
                firstName: values.firstName || 'asfd',
                hireDate: values.hireDate || '2016-06-05',
                lastName: values.lastName || 'asfd',
                mobileNumber: values.mobileNumber || '234534523',
                rank: values.rank || '1',
                role: values.role || 'Employee',
                skills: values.skills || [],
                groupIds: values.groupIds || [],
                customAttributes: values.customAttributes,
                loginAuthenticatorId: values.loginAuthenticatorId
            },
            authorization: token,
            timeout: 30000
        });

        console.log('new user email: ' + myemail);
        console.log(response);
        result.responseJson = response;
        result.firstName = values.firstName || 'asfd';
        return result;
    };

    static assignDefaultLAIdUser = async (values: NewUserValues, token: any) => {
        if (!values.loginAuthenticatorId) {
            const result = await CommonNoUIUtils.getDefaultLoginAuthenticatorID(token);
            values.loginAuthenticatorId = result;
            return values;
        }
        return values;
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
                timeout: 30000
            });
            return response.loginAuthenticators[0].id;
        } catch (error) {
            return error;
        }
    };

    static async getAllRolesDetails(token: any) {
        try {
            const response: any = await HttpUtils.sendRequest({
                action: 'POST',
                uri: '/authorization/roles/search',
                body: { filter: { internal: [0] }, metrices: { columns: ['roleId', 'roleName', 'displayName'] } },
                authorization: token,
                timeout: 30000
            });
            return response;
        } catch (error) {
            return error;
        }
    }

    static async getUsers(token: any) {
        try {
            const response = await HttpUtils.sendRequest({
                action: 'GET',
                uri: '/user-management/v1/users',
                authorization: token,
                timeout: 30000
            });
            return response;
        } catch (error) {
            return error;
        }
    }

    static updateUser = async (values: UpdateUserValues, tenantName: string, token: any) => {
        if (!values) {
            return 'no values';
        }

        let uri: string;
        const isWfoRegisterAPiDeprecated = await FeatureToggleUtils.isFeatureToggleTurnedOnForTenant('release-deprecation-of-wfo-user-manager-api-UH-19591', tenantName, token);
        if (isWfoRegisterAPiDeprecated) {
            uri = '/user/update';
        }
        else {
            uri = '/wfo/user/update';
        }
        const response: any = await HttpUtils.sendRequest({
            action: 'POST',
            uri: uri,
            body: {
                id: values.id,
                acdInfos: values.acdInfos || [], //[{loginId: '123'}]
                assignedGroup: values.assignedGroup || '',
                emailAddress: values.emailAddress,
                userName: values.userName,
                firstName: values.firstName || 'asfd',
                hireDate: values.hireDate || '2016-06-05',
                lastName: values.lastName || 'asfd',
                mobileNumber: values.mobileNumber || '234534523',
                rank: values.rank || '1',
                role: values.role,
                skills: values.skills || [],
                groupIds: values.groupIds || []
            },
            authorization: token,
            timeout: 30000
        });
        console.log('user' + values.firstName + ' ' + values.lastName + 'updated');
        return values.id;
    };

    static deleteUsers = async (userIdsList: string[], token: any) => {
        const response: any = await HttpUtils.sendRequest({
            action: 'POST',
            uri: '/user/deleteUsersById',
            body: {
                userIds: userIdsList
            },
            authorization: token,
            timeout: 30000
        });
        console.log('notDeletedUserIds:', response.notDeletedUserIds);
        return response.notDeletedUserIds;
    };

    static async login(emailAddress: any, password: any, getEntireResponse: any) {
        try {
            const response: any = await HttpUtils.sendRequest({
                action: 'POST',
                uri: '/public/authentication/v1/login',
                body: {
                    email: emailAddress,
                    password: password,
                    userName: emailAddress,
                    customAttribute: false
                },
                timeout: 120000
            });
            return (getEntireResponse ? response : response.token);
        } catch (error) {
            return new Error(error);
        }
    }

    static async logout(token: any) {
        try {
            const response = await HttpUtils.sendRequest({
                action: 'POST',
                uri: '/public/authentication/v1/logout',
                body: {},
                authorization: token,
                timeout: 30000
            });
            return response;
        } catch (error) {
            return error;
        }
    }

    static removeTrailingSlashFromBaseUrl = () => {
        let browserBaseUrl = EnvUtils.getBaseUrl();

        if (browserBaseUrl) {
            if (browserBaseUrl.endsWith('/')) {
                //removing the ending slash as the context will start with a slash
                browserBaseUrl = browserBaseUrl.substring(0, browserBaseUrl.length - 1);
            }
        }

        return browserBaseUrl;
    };

    static async getCurrentTenant(token: any) {
        try {
            const response: any = await HttpUtils.sendRequest({
                action: 'GET',
                uri: '/tenants/current',
                authorization: token,
                timeout: 30000
            });
            return response;
        } catch (error) {
            return error;
        }
    }
}
export interface NewUserValues {
    firstName: string,
    lastName: string,
    skills?: string[],
    [key: string]: any
}

export interface UpdateUserValues {
    id: string,
    emailAddress: string,
    userName: string,
    [key: string]: any
}
