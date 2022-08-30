import { HttpUtils } from './HttpUtils';

export class LocalizationNoUI {
    public baseUrl: string;

    static getDateStringFormat = async (localLang: string) => {
        let res: any;

        try {
             res = await HttpUtils.sendRequest({
                action: 'GET',
                uri: '/date_time_formats/dateTimeFormats/dateTimeFormats.json',
                gzip: true,
                timeout: 30000
            });

            if (localLang) {
                res = res[localLang];
            }
            console.log('Successfully loaded the [ NEW ] dateTimeFormats.json');
            return res;
        } catch ( error ) {
            console.log('Error loading the dateTimeFormats.json');
            return error;
        }
    };
}