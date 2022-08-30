import * as request from 'request-promise-native';
import { EnvUtils } from '../common/EnvUtils';

export class HttpUtils {
    static sendRequest(requestParameters: any, overrideBaseApiUrl?: string) {
        let baseApiUrl = EnvUtils.getBaseUrl();
        if (overrideBaseApiUrl) {
            baseApiUrl = overrideBaseApiUrl;
        }
        if (requestParameters.isEsQuery) {
            baseApiUrl = ''; //Remove the prefix which is not relevant to the ES base URL
        }

        if (requestParameters.isAnalyticsUrl) {
            const urlParts = baseApiUrl.split('://');
            baseApiUrl = urlParts[0] + '://analytics-' + urlParts[1];
        }

        let fullUrl = baseApiUrl + requestParameters.uri;
        if (requestParameters.xrayIntegration) {
            fullUrl = requestParameters.uri;
        }

        const requestOptions: any = {
            url: fullUrl,
            method: requestParameters.action,
            body: requestParameters.body,
            json: true,
            headers: requestParameters.optionalHeaders || {}
        };

        if (requestParameters.gzip) {
            requestOptions.gzip = requestParameters.gzip;
        }

        if (requestParameters.timeout) { //if no timeout it uses default
            requestOptions.timeout = requestParameters.timeout;
        }

        if (requestParameters.authorization) {
            requestOptions.headers.Authorization = 'bearer ' + requestParameters.authorization;
        }

        if (requestParameters.xrayauthorization) {
            requestOptions.headers.Authorization = requestParameters.xrayauthorization;
        }

        if (requestParameters.queryStringParams) {
            requestOptions.qs = requestParameters.queryStringParams;
        }

        if (requestParameters.ignoreError) {
            requestOptions.simple = false;
        }

        return new Promise((fulfill, reject) => {
            const startTime = new Date().toUTCString();
            let doRequest = request.get;
            if (requestOptions.method === 'POST') doRequest = request.post;
            if (requestOptions.method === 'PUT') doRequest = request.put;
            if (requestOptions.method === 'DELETE') doRequest = request.delete;
            if (requestOptions.method === 'PATCH') doRequest = request.patch;
            doRequest(requestOptions, (error: any, response: any, body: any) => {
                console.log('=== sent: ' + JSON.stringify(requestOptions));
                console.log('=== got: ' + error + ', response:' + JSON.stringify(response) + ', body:' + JSON.stringify(body));
                console.log('Http request, Start time(UTC): ' + startTime + ', End time(UTC): ' + (new Date()).toUTCString() + ', URL: ' + requestOptions.url);
                if (!error && (response.statusCode === 200 || response.statusCode === 201 || response.statusCode === 202 || response.statusCode === 204)) {
                    fulfill(body);
                } else if (requestParameters.ignoreError && (response.statusCode === 404 || response.statusCode === 400)) {
                    reject(body);
                    console.log("fail----");
                } else {
                    reject(error);
                }
            });
        });
    }

}
