import {HttpUtils} from './HttpUtils';

export class AdminUtilsNoUI {
    static getRandomEmail(arg0: number) {
        throw new Error("Method not implemented.");
    }
    static async createTeam (teamName, description, leadUserId, token) {
        try {
            const response: any = await HttpUtils.sendRequest({
                action: 'POST',
                uri: '/user-management/v1/teams',
                body: {
                    name: teamName,
                    description: description,
                    leadUserId: leadUserId,
                    status: 'ACTIVE'
                },
                authorization: token,
                timeout: 30000
            });
            console.log('Team ' + teamName + ' created');
            return response;
        } catch (error) {
            return error;
        }
    }

    static async getAllTeams(token: any) {
        console.log('STEP-56 A coming into getAllTeams');
        console.log('STEP-56 B coming into getAllTeams token');
        return await HttpUtils.sendRequest({
            action: 'POST',
            uri: '/user-management/v1/teams/search',
            authorization: token,
            body:{}
        })
    }
}
