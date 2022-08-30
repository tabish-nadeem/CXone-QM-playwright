import { AccountUtils } from '../common/AccountUtils';
import { HttpUtils } from '../common/HttpUtils';
import * as moment_ from 'moment-timezone';
import { ModuleExports } from './qmDefaultData';
import * as uuid from 'uuid4';
import { cssNumber } from 'jquery';

const moment = moment_;
const uuidv4 = uuid;
let ListOfElementsRes = new Array();

export class CommonQMNoUIUtils {
    userToken = '';

    getToken(token: any) {
        if (!token) {
            return window.localStorage.getItem('wfo_saas.userToken');
        } else {
            return token;
        }
    }

    getQMContext() {
        return '/qm';
    }

    static async addElementToBank(ElementLists: any[], token: any) {
        ElementLists.forEach(async function (element: any) {
            const body = {
                elementType: element.elementType,
                elementTitle: element.elementTitle,
                elementJson: element.elementJson
            };
            let response = await HttpUtils.sendRequest({
                action: 'POST',
                uri: '/form-designer/bank/element',
                authorization: token,
                body: body,
                timeout: 120000
            });
            ListOfElementsRes.push(response);
        });
        return ListOfElementsRes;
    }

    static async createForm(formDetails: { formId?: string; formStatus: any; workflowConfigType: any; formName: any; formData: any; formType: any; dispute_resoluter?: any; }, token: any) {
        const requestData = {
            elementData: {
                formId: '',
                formStatus: formDetails.formStatus ? formDetails.formStatus : 'Draft',
                formName: formDetails.formName ? formDetails.formName : 'QM_Form',
                formType: formDetails.formType ? formDetails.formType : 'EVALUATION',
                formData: formDetails.formData ? formDetails.formData : JSON.stringify(ModuleExports.getFormData()),
                workflowType: 'EVALUATIONS',
                configuration: this.getWorkflowConfigurationByType(formDetails.workflowConfigType, formDetails.dispute_resoluter)
            }
        };
        return await HttpUtils.sendRequest({
            action: 'POST',
            uri: '/form-designer/v2/create?elementType=FORM',
            authorization: token,
            body: requestData,
            timeout: 120000
        });
    }

    static async createFormV2(formDetails: { formStatus: any; formName: any; formType: any; formData: any; autoAnswerRules: any; workflowConfigType: any; dispute_resoluter: any; }, token: any) {
        const requestData = {
            elementData: {
                formId: '',
                formStatus: formDetails.formStatus ? formDetails.formStatus : 'Draft',
                formName: formDetails.formName ? formDetails.formName : 'QM_Form',
                formType: formDetails.formType ? formDetails.formType : 'EVALUATION',
                formData: formDetails.formData ? formDetails.formData : JSON.stringify(ModuleExports.getFormData()),
                workflowType: 'EVALUATIONS',
                autoAnswerRules: formDetails.autoAnswerRules,
                configuration: this.getWorkflowConfigurationByType(formDetails.workflowConfigType, formDetails.dispute_resoluter)
            }

        };
        return HttpUtils.sendRequest({
            action: 'POST',
            uri: '/form-designer/v3/create?elementType=FORM',
            authorization: token,
            body: requestData,
            timeout: 120000
        });
    }

    static getWorkflowConfigurationByType(workflowConfigType: any, dispute_resoluter: string) {
        dispute_resoluter = dispute_resoluter ? dispute_resoluter : 'SELF';
        let WF_CONFIG = JSON.stringify(ModuleExports.workflowConfigV1(workflowConfigType));
        WF_CONFIG = WF_CONFIG.replace('{{dispute_resoluter_id}}', dispute_resoluter);
        return JSON.parse(WF_CONFIG);
    }

    static async createWorkflowConfig(formId: string, workflowConfigType: any, dispute_resoluter: string, token: any) {
        dispute_resoluter = dispute_resoluter ? dispute_resoluter : 'SELF';
        let WF_CONFIG = JSON.stringify(ModuleExports.workflowConfig(workflowConfigType));
        while (WF_CONFIG.indexOf('{{FORM_ID}}') !== -1) {
            WF_CONFIG = WF_CONFIG.replace('{{FORM_ID}}', formId);
        }
        WF_CONFIG = WF_CONFIG.replace('{{dispute_resoluter_id}}', dispute_resoluter);
        const requestData = {
            workflowType: 'EVALUATIONS',
            configuration: WF_CONFIG
        };
        return await HttpUtils.sendRequest({
            action: 'POST',
            uri: '/workflow/configuration',
            authorization: token,
            body: requestData
        });
    }

    static async updateForm(updateRequestData: { elementData: any; }, token: any) {
        const requestData = {
            elementData: [{
                elementData: updateRequestData.elementData
            }]
        };
        return await HttpUtils.sendRequest({
            action: 'PUT',
            uri: '/form-designer/update?elementType=FORM',
            authorization: token,
            body: requestData,
            timeout: 120000
        });
    }

    static async distributeInteractions(endDate: string, token: any, tenantName: string) {
        let url = '';
        if (endDate !== undefined) {
            console.log('Distribution string is specified: ' + endDate);
            url = '/qp/distribution/distribute?distributionTimeStr=' + endDate;
        } else {
            console.log('Performing distribute without distribution time');
            url = '/qp/distribution/distribute';
        }
        if (tenantName) {
            const tenantString = endDate ? '&tenant=' + tenantName : '?tenant=' + tenantName;
            url = url + tenantString;
            console.log('Performing distribution for tenant', tenantName);
        }
        console.log('distribution url is ' + url);
        const response = await HttpUtils.sendRequest({
            action: 'GET',
            uri: url,
            authorization: token,
            timeout: 300000
        });
        console.log(response);
        return response;
    }

    static async createPlan(planData: any, token: any) {
        return await HttpUtils.sendRequest({
            action: 'POST',
            uri: '/qp/plans',
            body: {
                plan: planData
            },
            authorization: token,
            timeout: 120000
        });
    }

    static async getPlanOccurrences(planId: string, token: any) {
        return await HttpUtils.sendRequest({
            action: 'GET',
            uri: '/qp/plansinfo/distributions/occurrences/' + planId,
            authorization: token,
            timeout: 120000
        });
    }

    static async getForms(attributes: { formType: any; wd: any; }, token: any) {
        const formType = attributes.formType ? attributes.formType : 'EVALUATION';
        const withData = attributes.wd ? attributes.wd : 'false';
        return await HttpUtils.sendRequest({
            action: 'GET',
            uri: '/form-designer/get?elementType=FORM&wd=' + withData + '&formType=' + formType,
            authorization: token,
            timeout: 120000
        });
    }

    static async getAllPlans(planUUID: any, token: any) {
        const endPoint = (planUUID === undefined) ? '?deleted=false' : planUUID;
        return await HttpUtils.sendRequest({
            action: 'GET',
            uri: '/qp/plans/' + endPoint,
            authorization: token,
            timeout: 120000
        });
    }

    static async getDataOfSelectedPlan(planUUID: string, token: any) {
        return await HttpUtils.sendRequest({
            action: 'GET',
            uri: '/qp/plans/' + planUUID,
            authorization: token,
            timeout: 120000
        });
    }

    static async createCoachingPackage(formData: any, token: any) {
        return await HttpUtils.sendRequest({
            action: 'POST',
            uri: '/form-designer/create?elementType=FORM',
            body: {
                elementData: formData
            },
            authorization: token,
            timeout: 120000
        });
    }

    static async getAllForms(token: any) {
        return await HttpUtils.sendRequest({
            action: 'GET',
            uri: '/form-designer/get?elementType=FORM&wd=true&formType=EVALUATION',
            authorization: token,
            timeout: 120000
        });
    }

    static async createCoachingPlan(coachingPlan: { planName: any; coachingPackageUUID: any; startDate: any; endDate: any; status: any; assignees: any; }, token: any) {
        const coachingPlanData = {
            planName: coachingPlan.planName,
            coachingPackageUUID: coachingPlan.coachingPackageUUID,
            startTime: moment(coachingPlan.startDate).utc(),
            endTime: moment(coachingPlan.endDate).utc(),
            status: coachingPlan.status,
            assignees: coachingPlan.assignees // user array
        };
        return await HttpUtils.sendRequest({
            action: 'POST',
            uri: '/coaching-manager/plan',
            body: {
                coachingPlan: coachingPlanData
            },
            authorization: token,
            timeout: 120000
        });
    }

    static async getSegmentFromSearch(agentName: any, fromDate: any, toDate: any, token: any) {
        return await HttpUtils.sendRequest({
            action: 'POST',
            uri: '/search-service/v1/segments/query',
            body: {
                from: 0,
                size: 50,
                query: agentName,
                sortClauses: [{ field: 'startTime', order: 'desc' }],
                filters: [{
                    field: 'startTime',
                    from: fromDate,
                    to: toDate
                }],
                facets: [{ field: 'channelAndMediaTypeMask' }, { field: 'directionType' }, {
                    field: 'duration',
                    interval: 30
                }],
                highlights: false
            },
            authorization: token,
            timeout: 120000
        });

    }

    static async createCalibrationWorkflowConfiguration(evaluatorIds: any[], formId: any, dueDate: any, token: any) {
        const evaluators: any = [];
        for (let i = 0; i < evaluatorIds.length; i++) {
            evaluators.push({
                evaluatorId: evaluatorIds[i]
            });
        }
        const requestData = {
            workflowType: 'CALIBRATION',
            configuration: JSON.stringify({
                evaluators: evaluators,
                formId: formId,
                formVersion: '0',
                dueDate: dueDate
            })
        };
        return await HttpUtils.sendRequest({
            action: 'POST',
            uri: '/workflow/configuration',
            body: requestData,
            authorization: token,
            timeout: 120000
        });
    }

    static async startCalibrationWorkflow(workflowConfigUUID: any, calibrationName: any, segmentId: any, agentId: any, closeTimeoutDate: any, masterEvaluationId: any, masterEvaluationScore: any, assignmentDate: any, calibratorId: any, formId: any, token: any) {
        const workflowMetadata: any = {
            name: calibrationName,
            IMSegmentId: segmentId,
            agentUserUuid: agentId,
            assignmentDate: assignmentDate,
            calibratorId: calibratorId
        };
        if (masterEvaluationScore && masterEvaluationId) {
            workflowMetadata.masterEvaluationId = masterEvaluationId;
            workflowMetadata.masterEvaluationScore = masterEvaluationScore;
        } else if (formId) {
            workflowMetadata.formId = formId;
        }
        const requestData = {
            workflowMetadata: JSON.stringify(workflowMetadata),
            wfVersion: '1.0',
            workflowConfigUUID: workflowConfigUUID,
            closeTimeoutDate: closeTimeoutDate
        };
        return await HttpUtils.sendRequest({
            action: 'POST',
            uri: '/evaluation/workflow/calibration',
            body: requestData,
            authorization: token,
            timeout: 120000
        });
    }

    static validateEvaluationData(current: { tenantId: any; segmentId: any; workflowInstanceId: any; formId: any; userId: any; evaluatorId: any; workflowStatus: any; }) {
        //Check if all mandatory fields are present
        return current.tenantId && current.segmentId && current.workflowInstanceId
            && current.formId && current.userId && current.evaluatorId && current.workflowStatus;
    }

    static validateCoachingData(current: { tenantId: any; coachingWFInstId: any; assigneeId: any; completionTime: any; coachingPlanId: any; coachingPackageId: any; coachingPackageName: any; coachingPackageVersion: any; status: any; assignedBy: any; receivedTime: any; }) {
        //Check if all mandatory fields are present
        return current.tenantId && current.coachingWFInstId && current.assigneeId &&
            current.completionTime && current.coachingPlanId && current.coachingPackageId &&
            current.coachingPackageName && current.coachingPackageVersion && current.status
            && current.assignedBy && current.receivedTime;
    }

    static async updateWorkflowConfig(workflowConfigurationId: string, fieldToUpdate: string, fieldValue: any, stepName: any, token: any) {
        let response: any = await HttpUtils.sendRequest({
            action: 'GET',
            uri: '/workflow/configuration?workflowConfigurationUUID=' + workflowConfigurationId,
            authorization: token,
            timeout: 120000
        });
        const config = JSON.parse(response.configuration);
        if (fieldToUpdate === 'isScoringVisibleToAgent' && stepName === undefined) {
            config.isScoringVisibleToAgent = fieldValue;
        } else {
            for (let i = 0; i < config.steps.length; i++) {
                if (stepName === config.steps[i].step_name) {
                    config.steps[i][fieldToUpdate] = fieldValue;
                }
            }
        }
        response = await HttpUtils.sendRequest({
            action: 'PUT',
            uri: '/workflow/configuration',
            body: {
                workflowConfigurationUUID: workflowConfigurationId,
                workflowType: 'EVALUATIONS',
                configuration: JSON.stringify(config)
            },
            authorization: token,
            timeout: 120000
        });
        return response;
    }

    static async getPlanData(token: any) {
        return await HttpUtils.sendRequest({
            action: 'GET',
            uri: '/qp/plans?deleted=false',
            authorization: token,
            timeout: 120000
        });
    }

    static async getCoachingPlans(token: any) {
        return await HttpUtils.sendRequest({
            action: 'GET',
            uri: '/coaching-manager/plan',
            authorization: token,
            timeout: 120000
        });
    }

    static async deleteQualityPlan(planData: { id: string; }, action: string, token: any) {
        if (action === undefined) {
            action = 'DELETE';
        }
        return await HttpUtils.sendRequest({
            action: action,
            uri: '/qp/plans/' + planData.id,
            authorization: token,
            timeout: 120000
        });
    }

    static async bulkDeletionOfExpiredCoachingPlans(coachingPlans: any[], token: any) {
        let apiResponse: string | any[];
        let allPlanDeletionPromises: Promise<unknown>[];
        let listOfCoachingPlan: any = [];
        if (coachingPlans.length > 0) {
            // Getting details of all EXPIRED coaching plans
            listOfCoachingPlan = coachingPlans.filter((plan: { status: string; }) => plan.status === 'CLOSED');
            listOfCoachingPlan = listOfCoachingPlan.map((plan: { coachingPlanId: any; }) => plan.coachingPlanId);
            console.log('Coaching Plans to be Deleted', listOfCoachingPlan);
            console.log('Total Plans', listOfCoachingPlan.length);
            const arrayChunk = listOfCoachingPlan.map((i: number) => {
                return i % 15 === 0 ? listOfCoachingPlan.slice(i, i + 15) : null;
            }).filter((e: any) => {
                return e;
            });
            arrayChunk.forEach(function (planIdList: any) {
                if (!allPlanDeletionPromises) {
                    allPlanDeletionPromises = [];
                }
                allPlanDeletionPromises.push(CommonQMNoUIUtils.deleteExpiredCoachingPlanFromDB(planIdList, token));
            });

            await Promise.all(allPlanDeletionPromises).then(function (res) {
                let response: any = {};
                res.forEach(function (resItem: {}) {
                    response = { ...response, ...resItem };
                });
                response.status.forEach(function (status: string, planId: string) {
                    if (status !== 'wfo_coaching_manager_service_batch_delete_1') {
                        console.log('Plan deletion failed : ' + planId + ' : ' + status);
                    }
                });
                apiResponse = res;
            });
        } else {
            apiResponse = '';
        }
        return apiResponse;
    }

    static async deleteExpCoachingPlan(planId: string, token: any) {
        console.log('In delete expired coaching plans', planId);
        return await HttpUtils.sendRequest({
            action: 'DELETE',
            uri: '/coaching-manager/plan/' + planId,
            authorization: token,
            timeout: 120000
        });
    }

    static async deleteExpiredCoachingPlanFromDB(coachingPlanIds: any, token: any) {
        console.log('Deleting plans at a time -', coachingPlanIds);
        return await HttpUtils.sendRequest({
            action: 'DELETE',
            uri: '/coaching-manager/plan/',
            authorization: token,
            body: {
                coachingPlanIds: coachingPlanIds
            },
            timeout: 120000
        });
    }

    static async getPlanMonitoringData(token: any) {
        const url = '/qm-reporting/monitor/plans';
        console.log('Retrieving plan Monitoring data');
        return await HttpUtils.sendRequest({
            action: 'GET',
            uri: url,
            authorization: token,
            timeout: 120000
        });
    }

    //Function to get a list of all the evaluation tasks assigned to a user
    static async getTasks(token: any, taskDetails: { taskStates: any; taskTypes: any; }) {
        const url = '/evaluation/tasks';
        return await HttpUtils.sendRequest({
            action: 'POST',
            uri: url,
            authorization: token,
            timeout: 120000,
            body: {
                taskStates: taskDetails.taskStates,
                taskTypes: taskDetails.taskTypes
            }
        });
    }

    //Function to get a list of all the evaluations assigned to a user
    static async getEvaluations(token: any, bodyJSON: boolean) {
        const url = '/qm-task-manager/user/evaluations';
        return await HttpUtils.sendRequest({
            action: 'POST',
            uri: url,
            authorization: token,
            timeout: 120000,
            body: bodyJSON ? bodyJSON : {
                filter: { filterName: 'status', values: [] },
                order: [],
                offset: 0,
                size: 50
            }
        });
    }

    //Function to get a list of all the tasks from QM Task Manager
    static async getAllTasks(token: any, bodyJSON: any) {
        const url = '/qm-task-manager/user/tasks';
        return await HttpUtils.sendRequest({
            action: 'POST',
            uri: url,
            authorization: token,
            timeout: 120000,
            body: bodyJSON ? bodyJSON : { 
                filter: {},
                order: [],
                offset: -1
            }
        });
    }

    //Function to get list of all the coachings assigned to a user
    static async getMyCoachings(token: any) {
        const url = '/coaching-manager/mycoachings';
        return await HttpUtils.sendRequest({
            action: 'GET',
            uri: url,
            authorization: token,
            timeout: 120000
        });
    }

    //Function to delete multiple tasks(evaluation and coaching) with an array of taskIDs
    static async deleteTasks(taskIds: any, token: any) {
        const url = '/task-manager/task';
        return await HttpUtils.sendRequest({
            action: 'DELETE',
            uri: url,
            authorization: token,
            timeout: 120000,
            body: taskIds
        });
    }

    //function to delete a collaborative evaluation
    static async deleteCollaborativeEvalaution(taskId: string, token: any) {
        const url = '/qm-task-manager/tasks/collaborative-evaluations/' + taskId;
        return await HttpUtils.sendRequest({
            action: 'DELETE',
            uri: url,
            authorization: token,
            timeout: 120000
        });
    }

    //function to delete a standard evaluation
    static async deleteStandardEvalaution(taskId: string, token: any) {
        const url = '/qm-task-manager/tasks/evaluations/' + taskId;
        return await HttpUtils.sendRequest({
            action: 'DELETE',
            uri: url,
            authorization: token,
            timeout: 120000
        });
    }

    //Function to get a list of all types of tasks assigned to a user
    static async getAllTasksTypes(token: any) {
        const url = '/task-manager/task';
        return await HttpUtils.sendRequest({
            action: 'GET',
            uri: url,
            authorization: token,
            timeout: 120000
        });
    }

    static async getCategorySet(token: string) {
        const url = '/apq-gateway/category-sets';
        return await HttpUtils.sendRequest({
            action: 'GET',
            uri: url,
            authorization: 'cxone-' + token,
            timeout: 60000
        });
    }

    static async pushMultipleTypeInteractions(segmentDetails, injectCategories, highConfidence,
        sameCategoryInAllSegments, token, injectSentiments) {
        const shouldInjectSentiments = injectSentiments === undefined ? false : injectSentiments;
        const url = '/injector/segments?injectCategories=' + injectCategories +
            '&highConfidence=' + highConfidence + '&sameCategoryInAllSegments=' + sameCategoryInAllSegments + '&injectSentiments=' + shouldInjectSentiments;
         return await HttpUtils.sendRequest({
            action: 'POST',
            uri: url,
            authorization: token,
            timeout: 60000,
            body: {
                minDateTime: moment(segmentDetails.minDateTime).format('YYYY-MM-DDTHH:mm:ss+00:00'),
                maxDateTime: moment(segmentDetails.maxDateTime).format('YYYY-MM-DDTHH:mm:ss+00:00'),
                noOfSegmentsPerAgent: segmentDetails.noOfSegmentsPerAgent,
                agentIds: segmentDetails.agentIds,
                durationRange: segmentDetails.durationRange,
                mediaTypes: segmentDetails.mediaTypes,
                directionTypes: segmentDetails.directionTypes,
                categories: segmentDetails.categories,
                sentiment: segmentDetails.sentiment,
                categoriesPerSegment: segmentDetails.categoriesPerSegment
            }
        });
    }

    static async getCoachingWidgetDetails(userId: string, fromDate: string, toDate: string, token: any) {
        const url = '/qm-reporting/coaching/widget?fromDate=' + fromDate + '&toDate=' + toDate + '&userIds=' + userId;
        return await HttpUtils.sendRequest({
            action: 'GET',
            uri: url,
            authorization: token,
            timeout: 60000
        });
    }

    static async getAgentScoringWidgetDetails(request: any, token: any) {
        return await HttpUtils.sendRequest({
            action: 'POST',
            uri: '/qm-reporting/dashboard/v1/agentscoring',
            body: request,
            authorization: token,
            timeout: 60000
        });
    }

    static async getCalibrationWidgetDetails(calibrationId: string, token: any) {
        let url = '';
        if (calibrationId === undefined) {
            url = '/qm-reporting/dashboard/calibration';
        } else {
            url = '/qm-reporting/dashboard/calibration/' + calibrationId;
        }
        return await HttpUtils.sendRequest({
            action: 'GET',
            uri: url,
            authorization: token,
            timeout: 60000
        });
    }

    static async getFormDetails(formId: string, token: any) {
        return await HttpUtils.sendRequest({
            action: 'GET',
            uri: '/form-designer/get?elementType=FORM&id=' + formId,
            authorization: token,
            timeout: 120000
        });
    }

    static async submitCalibration(workflowInstanceId: any, formId: any, score: any, answer: any, buttonRef: any, formVersion: any, formMaxScore: any, token: any) {
        const requestData = {
            answersVersion: 2,
            executionData: JSON.stringify({
                workflowInstanceId: workflowInstanceId,
                score: score,
                formMaxScore: formMaxScore
            }),
            formId: formId,
            formVersion: formVersion || 0,
            formData: answer,
            buttonRef: buttonRef
        };
        return await HttpUtils.sendRequest({
            action: 'POST',
            uri: '/form-executor/execution',
            authorization: token,
            body: requestData
        });
    }

    static async deleteCalibration(calibrationId: string, token: any) {
        return await HttpUtils.sendRequest({
            action: 'DELETE',
            uri: '/qm-reporting/calibration/' + calibrationId,
            authorization: token,
            timeout: 120000
        });
    }

    static async deleteElementsFromQuestionBank(elementUUID: string, token: any) {
        return await HttpUtils.sendRequest({
            action: 'DELETE',
            uri: '/form-designer/bank/element?elementUUID=' + elementUUID,
            authorization: token,
            timeout: 120000
        });
    }

    static async getBankElements(token: any) {
        return await HttpUtils.sendRequest({
            action: 'GET',
            uri: '/form-designer/bank/element?sortBy=lastModified&sortOrder=desc',
            authorization: token,
            timeout: 120000
        });
    }

    static async createBulkDummyEvaluations(tasks: any, token: any) {
        return await HttpUtils.sendRequest({
            action: 'POST',
            uri: '/qm-task-manager/tasks/v1/evaluations',
            authorization: token,
            body: tasks
        });
    }

    static async createBulkSelfAssessmentTasks(tasks: { tasks: any[]; }, token: any) {
        return await HttpUtils.sendRequest({
            action: 'POST',
            uri: '/qm-task-manager/tasks/v1/self-assessments',
            authorization: token,
            body: tasks
        });
    }

    static async pushComplexInteractions(segmentDetails: { minDateTime: any; maxDateTime: any; mediaTypes: any; agentIds: any; directionTypes: any; teamIds: any; teamNames: any; agentNames: any; acdContactId: any; }, noOfSegments: string, token: any) {
        const url = '/injector/segments/complex?noOfSegments=' + noOfSegments;
        return await HttpUtils.sendRequest({
            action: 'POST',
            uri: url,
            authorization: token,
            timeout: 60000,
            body: {
                startTime: segmentDetails.minDateTime,
                endTime: segmentDetails.maxDateTime,
                mediaTypes: segmentDetails.mediaTypes,
                agentIds: segmentDetails.agentIds,// 'agent1;agent2'
                directionType: segmentDetails.directionTypes,
                teamIds: segmentDetails.teamIds,// Optional - 'team1Id;team2Id'
                teamNames: segmentDetails.teamNames,// Optional - 'teamName1;teamName2'
                agentNames: segmentDetails.agentNames,// Optional - 'agentName1;agentName2'
                acdContactId: segmentDetails.acdContactId// Optional - for contact
            }
        });
    }

    /**
     * Purpose of this method is to create tasks at MyTask page.
     * All parameters are mandatory. No random values allowed.
     */
    static async createEvaluationTasks(numberOfEntries: number, requestParameters: { type: any; evaluatorId: any; formId: any; assignmentDate: any; dueDate: any; state: any; status: any; segmentId: any; segmentStartTime: any; segmentDuration: any; segmentMediaTypes: any; segmentChannelType: any; agentId: any; agentName: any; createdBy: any; createdDateTime: any; lastModifiedDateTime: any; initiator: any; isScoringVisibleToAgent: any; }, token: any) {
        const allTasks: any = [];
        for (let index = 0; index < numberOfEntries; index++) {
            const task = {
                type: requestParameters.type,
                assignedUserId: requestParameters.evaluatorId,
                referenceId: uuidv4(),
                formId: requestParameters.formId,
                formName: 'TestForm' + AccountUtils.getRandomString(),
                assignmentDate: requestParameters.assignmentDate,
                dueDate: requestParameters.dueDate,
                state: requestParameters.state,
                status: requestParameters.status,
                segmentId: requestParameters.segmentId,
                segmentStartTime: requestParameters.segmentStartTime,
                segmentDuration: requestParameters.segmentDuration,
                segmentMediaTypes: requestParameters.segmentMediaTypes,
                segmentChannelType: requestParameters.segmentChannelType,
                agentId: requestParameters.agentId,
                agentName: requestParameters.agentName,
                evaluatorId: requestParameters.evaluatorId,
                createdBy: requestParameters.createdBy,
                createdDateTime: requestParameters.createdDateTime,
                lastModifiedBy: requestParameters.evaluatorId,
                lastModifiedDateTime: requestParameters.lastModifiedDateTime,
                initiator: requestParameters.initiator,
                isScoringVisibleToAgent: requestParameters.isScoringVisibleToAgent,
                mediaLocation: 'India'
            };
            allTasks.push(task);
        }
        return await HttpUtils.sendRequest({
            action: 'POST',
            uri: '/qm-task-manager/tasks/v1/evaluations',
            authorization: token,
            body: { tasks: allTasks }
        });
    }

    static async createCollaborativeWorkflowConfiguration(requestPayload: any, token: any) {
        return await HttpUtils.sendRequest({
            action: 'POST',
            uri: '/workflow/configuration',
            authorization: token,
            timeout: 60000,
            body: requestPayload
        });
    }

    static async startCollaborativeWorkflow(requestPayload: any, token: any) {
        return await HttpUtils.sendRequest({
            action: 'POST',
            uri: '/evaluation/workflow/collaborative',
            authorization: token,
            timeout: 60000,
            body: requestPayload
        });
    }

    static async submitEvaluation(workflowInstanceId: any, formId: any, score: any, answer: any, buttonRef: any, formVersion: any, formMaxScore: any,isRankingEnabled: any, rankingResult: any, comments: any, token: any) {
        const requestData = {
            answersVersion: 2,
            executionData: JSON.stringify({
                workflowInstanceId: workflowInstanceId, score: score, formMaxScore: formMaxScore,
                isRankingEnabled: isRankingEnabled || false, rankingResult: rankingResult || ''
            }),
            formId: formId,
            formVersion: formVersion || 0,
            formData: JSON.stringify(answer),
            buttonRef: buttonRef,
            comments: comments || []
        };
        return await HttpUtils.sendRequest({
            action: 'POST',
            uri: '/form-executor/execution',
            authorization: token,
            body: requestData
        });
    }

    static async submitRequestReviewModalExecution(workflowInstanceId: any, formId: any, formData: any, token: any) {
        const requestData = {
            executionData: JSON.stringify({ workflowInstanceId: workflowInstanceId }),
            formId: formId,
            formData: JSON.stringify(formData)
        };
        return await HttpUtils.sendRequest({
            action: 'POST',
            uri: '/form-executor/execution',
            authorization: token,
            body: requestData
        });
    }

    static async getPerformanceMonitoringData(fromDate: any, toDate: any, groupIds: any, teamIds: any, token: any) {
        const url = '/qm-reporting/monitor/v1/performance';
        return await HttpUtils.sendRequest({
            action: 'POST',
            uri: url,
            body: {
                fromDate: fromDate,
                toDate: toDate,
                groupdIds: groupIds,
                teamIds: teamIds
            },
            authorization: token,
            timeout: 120000
        });
    }

    static async getPerformanceMonitoringDetailsForAgent(agentId: string, fromDate: any, toDate: any, groupIds: any, teamIds: any, token: any) {
        const url = '/qm-reporting/monitor/v2/performance/' + agentId;
        return await HttpUtils.sendRequest({
            action: 'POST',
            uri: url,
            body: {
                fromDate: fromDate,
                toDate: toDate,
                groupdIds: groupIds,
                teamIds: teamIds
            },
            authorization: token,
            timeout: 120000
        });
    }

    static async createGroup(groupName: string, token: any) {
        return await HttpUtils.sendRequest({
            action: 'POST',
            uri: '/group',
            authorization: token,
            body: {
                'id': '',
                'name': groupName
            }
        });
    }

    static async assignUsersToTeam(teamId: string, usersList: any[], token: any) {
        try {
            const responseteam : any = await HttpUtils.sendRequest({
                action: 'PATCH',
                uri: '/user/v1/team/' + teamId,
                body: usersList, // array of userIds
                authorization: token,
                timeout: 50000
            });
            console.log('Users added to Team Successfully');
            return responseteam;
        } catch (error) {
            return error;
        }
    }

    static async getAllTeams(token: any) {
        return await HttpUtils.sendRequest({
            action: 'POST',
            uri: '/user-management/v1/teams/search',
            authorization: token,
            body:{}
        })
    }
}