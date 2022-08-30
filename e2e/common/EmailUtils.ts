import {HttpUtils} from './HttpUtils';
import {FeatureToggleUtils} from './FeatureToggleUtils';
import { EnvUtils } from './EnvUtils';

export class EmailUtils {
    static INBOX_CHECK_RETRY_COUNT_LIMIT = 10;
    static INBOX_CHECK_RETRY_SLEEP_MILLIS = 15000;
    static TEST_EMAIL_HOST = 'gxhbx2e8ua.execute-api.us-west-2.amazonaws.com';
    static TEST_EMAIL_PATH = '/prod/ReadProtractorEmail';
    static TEST_EMAIL_API_KEY = 'gTU6UDsZf13AOCDERT4In4sawqNDjOXt5QTmlxeo';

    static SUBJECT_ACCOUNT_ACTIVATION_PREFIX = 'Activate your';
    static ACCOUNT_NAME_CXONE = 'NICE-inContact CXone'
    static ACCOUNT_NAME_CXONE_NEW = 'NICE CXone'
    static SCHEDULE_HAS_BEEN_PUBLISHED = 'New schedules have been published';
    static TIME_OFF_REQUEST_APPROVED = 'Time off request approved';
    static TIME_OFF_REQUEST_DECLINED = 'Time off request declined';
    static NEW_DEFAULT_BRANDING_NAME_FT = 'global-tm-new-default-branding-profile-name-TM-4222';

    static convertMimeChars(emailContent: string) {
        return emailContent.replace(/=3D/g, '=').replace(/=\r\n/g, '').replace(/=\n/g, '');
    }

    static checkFTForBrandName = async (accountName: string) => {
        const res: any = await HttpUtils.sendRequest({
            action: 'POST',
            uri: '/public/authentication/v1/login',
            body: {
                email: EnvUtils.getTmLoginEmailAddress(),
                password: EnvUtils.getTmLoginPassword(),
                userName: EnvUtils.getTmLoginEmailAddress(),
                customAttribute: false
            },
            timeout: 60000
        });
        const tmToken = res.token;
        if (!accountName || accountName === EmailUtils.ACCOUNT_NAME_CXONE) {
            const newDefaultBrandingFt: any = await FeatureToggleUtils.getFeature(EmailUtils.NEW_DEFAULT_BRANDING_NAME_FT, tmToken);

            if (newDefaultBrandingFt && newDefaultBrandingFt.toggled) {
                accountName = EmailUtils.ACCOUNT_NAME_CXONE_NEW;
            } else {
                accountName = EmailUtils.ACCOUNT_NAME_CXONE;
            }
        }
        return accountName;
    }

    static getRelativeAccountActivationUrl = async (emailAddress: string, orgName: string, accountName: string) => {
        accountName = await EmailUtils.checkFTForBrandName(accountName);
        const SUBJECT_ACCOUNT_ACTIVATION = EmailUtils.SUBJECT_ACCOUNT_ACTIVATION_PREFIX + ' ' + accountName;
        try {
            const response: any = await EmailUtils.readTestEmail(emailAddress, SUBJECT_ACCOUNT_ACTIVATION + ' ' + orgName);
            const content = EmailUtils.convertMimeChars(response.content);
            const matchResults = content.match(/href="(.*?setPassword.*?)"/);
            if (!matchResults || matchResults.length < 2) {
                return;
            }
            return matchResults[1].substring(matchResults[1].indexOf('/#'));
        } catch {
            console.log('Error retrieving account activation email');
        }
    };

    static readTestEmail = async (toEmailAddress: any, subject: string) => {
        let tryCount = 0;
        const read = async (toEmailAddressRead: any, subjectRead: any) => {
            try {
                const response = await EmailUtils.readTestEmailNoRetry(toEmailAddressRead, subjectRead);
                return response;
            } catch (errorResponse) {
                tryCount += 1;
                if (tryCount < EmailUtils.INBOX_CHECK_RETRY_COUNT_LIMIT) {
                    console.log('Test email not yet present, trying again in ' + (EmailUtils.INBOX_CHECK_RETRY_SLEEP_MILLIS / 1000) + ' seconds...', 'to=', toEmailAddress, 'subject=', subject);
                    setTimeout(() => {
                        read(toEmailAddressRead, subjectRead);
                    }, EmailUtils.INBOX_CHECK_RETRY_SLEEP_MILLIS);
                } else {
                    console.log('Error retrieving test email after ' + EmailUtils.INBOX_CHECK_RETRY_COUNT_LIMIT + ' tries, giving up!', 'to=', toEmailAddress, 'subject=', subject);
                }
            }
        };
        return await read(toEmailAddress, subject);
    }

    static readTestEmailNoRetry = async (toEmailAddress: any, subject: any) => {
        const query = new URLSearchParams({to: toEmailAddress, subject: subject, delete: 'true'});
        const requestOptions = {
            hostname: 'https://' + EmailUtils.TEST_EMAIL_HOST,
            path: EmailUtils.TEST_EMAIL_HOST,
            uri: EmailUtils.TEST_EMAIL_PATH + '?' + query,
            method: 'GET',
            action: 'GET',
            headers: {
                'x-api-key': EmailUtils.TEST_EMAIL_API_KEY
            },
            optionalHeaders: {
                'x-api-key': EmailUtils.TEST_EMAIL_API_KEY
            }
        };

        try {
            const response = await HttpUtils.sendRequest(requestOptions, requestOptions.hostname);
            return response;
        } catch (response) {
            console.log('Error in Read Test Email HTTP request', requestOptions, response);
        }
    }
}
