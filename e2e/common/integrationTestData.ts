import * as moment from 'moment'

let suite01: {};
let suite03: {};
let suite04: {};
let suite05: {};
let suite06: {};

export class IntegrationTestData {
    suite01 = {
        "oneTimePlanData": {
            "evaluationType":"Standard",
            "name": "",
            "description": "",
            "state": "Draft",
            "createdBy": "",
            "evaluators": [],
            "groups": [],
            "teams": [],
            "numSegmentsPerAgent": 1,
            "formId": "",
            "numDaysBackDistribution": -1,
            "planDuration": {
                "recurring": null,
                "oneTimeDateRange": {
                    "startDate": moment().utc().subtract(30, 'day').toJSON(),
                    "endDate": moment().utc().add(1, 'day').toJSON()
                }
            },
            "filters": [
                {
                    "name": "CallDuration",
                    "value": "30",
                    "value2": "360",
                    "operation": "Greater",
                    "active": true
                },
                {
                    "name": "DirectionType",
                    "values": [],
                    "operation": "In",
                    "active": false
                },
                {
                    "name": "QpMediaTypeMapper",
                    "values": [],
                    "operation": "In",
                    "active": false
                },
                {
                    "name": "Categories",
                    "values": [],
                    "operation": "In",
                    "active": false
                },
                {
                    "name": "Sentiments",
                    "values": [],
                    "operation": "In",
                    "active": false
                },
                {
                    "name": "Skills",
                    "values": [],
                    "operation": "In",
                    "active": false
                },
                {
                    "name": "Dispositions",
                    "values": [],
                    "operation": "In",
                    "active": false
                },
                {
                    "name": "BusinessData",
                    "values": [],
                    "operation": "In",
                    "active": false
                }
            ],
            "createdDate": "",
            "numInteractionsPerAgent": -1
        },
        "formAnswers" : [
            {
                "id": 10523131354974,
                "type": "section",
                "uuid": "cc54faeb-27cf-4331-b396-02e1eb189fef",
                "score": 0,
                "maxScore": 3
            },
            {
                "id": 4509913374963,
                "uuid": "fbc6bee0-028a-4b85-a2a1-333d9b5a3abb",
                "type": "question",
                "score": 0,
                "answer": "2",
                "criticalQuestionFailure": true,
                "sectionUUID": "cc54faeb-27cf-4331-b396-02e1eb189fef",
                "sectionId": 10523131354974
            },
            {
                "id": 4509913379562,
                "uuid": "7df0bff3-c731-4987-a4fe-c7a10e71546d",
                "type": "question",
                "score": 0,
                "answer": "",
                "criticalQuestionFailure": false,
                "sectionUUID": "cc54faeb-27cf-4331-b396-02e1eb189fef",
                "sectionId": 10523131354974
            },
            {
                "id": 4509924296706,
                "uuid": "9adba622-5f2a-4974-9e41-bcffd5561dea",
                "type": "question",
                "score": 0,
                "answer": "",
                "criticalQuestionFailure": false,
                "sectionUUID": "cc54faeb-27cf-4331-b396-02e1eb189fef",
                "sectionId": 10523131354974
            },
            {
                "id": 7516522236385,
                "type": "section",
                "uuid": "12ecb104-0b12-4305-bbf0-4da0a200b035",
                "score": 0,
                "maxScore": 1
            },
            {
                "id": 10523131548251,
                "uuid": "6ef573d8-20e1-4213-b627-ae82e37b332f",
                "type": "question",
                "score": 0,
                "answer": "",
                "criticalQuestionFailure": false,
                "sectionUUID": "12ecb104-0b12-4305-bbf0-4da0a200b035",
                "sectionId": 7516522236385
            },
            {
                "id": 7516522550965,
                "type": "question",
                "uuid": "48f7a813-e7e5-4311-a1e3-1c411dbfc52b",
                "answer": "",
                "sectionUUID": "12ecb104-0b12-4305-bbf0-4da0a200b035",
                "sectionId": 7516522236385
            },
            {
                "id": 10523131626602,
                "type": "question",
                "uuid": "2e7f5403-828e-42fb-a43b-2879a05a83cb",
                "answer": 1503304518000,
                "sectionUUID": "12ecb104-0b12-4305-bbf0-4da0a200b035",
                "sectionId": 7516522236385
            },
            {
                "id": 3006615390350,
                "type": "section",
                "uuid": "4016c8ac-e22a-4a21-b65f-40614b0a2716",
                "score": 0,
                "maxScore": 0
            },
            {
                "id": 4509930412839,
                "uuid": "386a9988-ea6a-4e45-a7d4-57f84d6f9701",
                "type": "question",
                "score": 0,
                "answer": "",
                "criticalQuestionFailure": false,
                "sectionUUID": "4016c8ac-e22a-4a21-b65f-40614b0a2716",
                "sectionId": 3006615390350
            },
            {
                "id": 10574628951278,
                "uuid": "4322045a-7888-4869-818f-1699fdba5932",
                "type": "question",
                "score": 0,
                "answer": "",
                "criticalQuestionFailure": false,
                "sectionUUID": "4016c8ac-e22a-4a21-b65f-40614b0a2716",
                "sectionId": 3006615390350
            },
            {
                "id": 13529791425753,
                "uuid": "c7b30faa-7011-4f60-97fc-e85c57a19140",
                "type": "question",
                "score": 0,
                "answer": "",
                "criticalQuestionFailure": false,
                "sectionUUID": "4016c8ac-e22a-4a21-b65f-40614b0a2716",
                "sectionId": 3006615390350
            },
            {
                "id": 13529791790352,
                "type": "section",
                "uuid": "b2413f33-9245-4d64-8205-cf4d8c85fd7d",
                "score": 0,
                "maxScore": 3
            },
            {
                "id": 13529791594152,
                "type": "question",
                "uuid": "c8d32c12-5f29-427c-9ec5-aedc5a0a6e38",
                "answer": [],
                "sectionUUID": "b2413f33-9245-4d64-8205-cf4d8c85fd7d",
                "sectionId": 13529791790352
            },
            {
                "id": 15033102635220,
                "uuid": "33df22f3-cdac-4c5f-b384-8c87018e6a0c",
                "type": "question",
                "score": 0,
                "answer": [],
                "criticalQuestionFailure": false,
                "sectionUUID": "b2413f33-9245-4d64-8205-cf4d8c85fd7d",
                "sectionId": 13529791790352
            }
        ]
    }
    suite03 = {
        "calibration1" : {
            "formAnswers" : [
                {
                    "id": 7608661536860,
                    "type": "question",
                    "uuid": "f5279427-01e1-4b4d-bd95-fbce54902142",
                    "answer": "Agent Name"
                },
                {
                    "id": 12173858470680,
                    "type": "question",
                    "uuid": "84e5367e-ee43-4332-92e5-97ac9b1caa2b",
                    "answer": "Address field in the executor form filling with char limit of 130 characto. Checking the max size is should not extends the maximu"
                },
                {
                    "id": 12173858691624,
                    "uuid": "53d9aa08-537b-4f6d-bfda-d766eba7fc74",
                    "type": "question",
                    "score": 1,
                    "answer": "1",
                    "criticalQuestionFailure": false
                },
                {
                    "id": 12173858727360,
                    "uuid": "7edab9af-fcbd-4511-83f1-3eec170dea31",
                    "type": "question",
                    "score": 1,
                    "answer": [
                        "1"
                    ],
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1521732347835,
                    "uuid": "2afafafe-c3df-481c-baf2-8cce52c22562",
                    "type": "question",
                    "score": 1,
                    "answer": "1",
                    "criticalQuestionFailure": false
                },
                {
                    "id": 4565197059156,
                    "type": "question",
                    "uuid": "6ebef9d7-8dbc-44bb-b30e-899aadfef262",
                    "answer": ""
                }
            ]
        },
        "calibration2" : {
            "formAnswers" : [
                {
                    "id": 7608661536860,
                    "type": "question",
                    "uuid": "f5279427-01e1-4b4d-bd95-fbce54902142",
                    "answer": "Agent Name"
                },
                {
                    "id": 12173858470680,
                    "type": "question",
                    "uuid": "84e5367e-ee43-4332-92e5-97ac9b1caa2b",
                    "answer": ""
                },
                {
                    "id": 12173858691624,
                    "uuid": "53d9aa08-537b-4f6d-bfda-d766eba7fc74",
                    "type": "question",
                    "score": 0,
                    "answer": "",
                    "criticalQuestionFailure": false
                },
                {
                    "id": 12173858727360,
                    "uuid": "7edab9af-fcbd-4511-83f1-3eec170dea31",
                    "type": "question",
                    "score": 0,
                    "answer": [],
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1521732347835,
                    "uuid": "2afafafe-c3df-481c-baf2-8cce52c22562",
                    "type": "question",
                    "score": 0,
                    "answer": "",
                    "criticalQuestionFailure": false
                },
                {
                    "id": 4565197059156,
                    "type": "question",
                    "uuid": "6ebef9d7-8dbc-44bb-b30e-899aadfef262",
                    "answer": ""
                }
            ]
        },
        "calibration3" : {
            "formAnswers" : [
                {
                    "id": 7608661536860,
                    "type": "question",
                    "uuid": "f5279427-01e1-4b4d-bd95-fbce54902142",
                    "answer": "Agent Name"
                },
                {
                    "id": 12173858470680,
                    "type": "question",
                    "uuid": "84e5367e-ee43-4332-92e5-97ac9b1caa2b",
                    "answer": "Address field in the executor form filling with char limit of 130 characto. Checking the max size is should not extends the maximu"
                },
                {
                    "id": 12173858691624,
                    "uuid": "53d9aa08-537b-4f6d-bfda-d766eba7fc74",
                    "type": "question",
                    "score": 1,
                    "answer": "1",
                    "criticalQuestionFailure": false
                },
                {
                    "id": 12173858727360,
                    "uuid": "7edab9af-fcbd-4511-83f1-3eec170dea31",
                    "type": "question",
                    "score": 1,
                    "answer": [
                        "2"
                    ],
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1521732347835,
                    "type": "question",
                    "uuid": "2afafafe-c3df-481c-baf2-8cce52c22562",
                    "answer": "na"
                },
                {
                    "id": 4565197059156,
                    "type": "question",
                    "uuid": "6ebef9d7-8dbc-44bb-b30e-899aadfef262",
                    "answer": ""
                }
            ]
        },
        "calibration4" : {
            "formAnswersAdmin" : [
                {
                    "id": 7608661536860,
                    "type": "question",
                    "uuid": "f5279427-01e1-4b4d-bd95-fbce54902142",
                    "answer": "Agent Name"
                },
                {
                    "id": 12173858470680,
                    "type": "question",
                    "uuid": "84e5367e-ee43-4332-92e5-97ac9b1caa2b",
                    "answer": "Address field in the executor form filling with char limit of 130 characto. Checking the max size is should not extends the maximu"
                },
                {
                    "id": 12173858691624,
                    "uuid": "53d9aa08-537b-4f6d-bfda-d766eba7fc74",
                    "type": "question",
                    "score": 1,
                    "answer": "1",
                    "criticalQuestionFailure": false
                },
                {
                    "id": 12173858727360,
                    "uuid": "7edab9af-fcbd-4511-83f1-3eec170dea31",
                    "type": "question",
                    "score": 1,
                    "answer": [
                        "1"
                    ],
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1521732347835,
                    "uuid": "2afafafe-c3df-481c-baf2-8cce52c22562",
                    "type": "question",
                    "score": 1,
                    "answer": "1",
                    "criticalQuestionFailure": false
                },
                {
                    "id": 4565197059156,
                    "type": "question",
                    "uuid": "6ebef9d7-8dbc-44bb-b30e-899aadfef262",
                    "answer": ""
                }
            ],
            "formAnswersManager" : [
                {
                    "id": 7608661536860,
                    "type": "question",
                    "uuid": "f5279427-01e1-4b4d-bd95-fbce54902142",
                    "answer": "Agent Name"
                },
                {
                    "id": 12173858470680,
                    "type": "question",
                    "uuid": "84e5367e-ee43-4332-92e5-97ac9b1caa2b",
                    "answer": "Address field in the executor form filling with char limit of 130 characto. Checking the max size is should not extends the maximu"
                },
                {
                    "id": 12173858691624,
                    "uuid": "53d9aa08-537b-4f6d-bfda-d766eba7fc74",
                    "type": "question",
                    "score": 1,
                    "answer": "1",
                    "criticalQuestionFailure": false
                },
                {
                    "id": 12173858727360,
                    "uuid": "7edab9af-fcbd-4511-83f1-3eec170dea31",
                    "type": "question",
                    "score": 1,
                    "answer": [
                        "2"
                    ],
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1521732347835,
                    "type": "question",
                    "uuid": "2afafafe-c3df-481c-baf2-8cce52c22562",
                    "answer": "na"
                },
                {
                    "id": 4565197059156,
                    "type": "question",
                    "uuid": "6ebef9d7-8dbc-44bb-b30e-899aadfef262",
                    "answer": ""
                }
            ]
        },
        "calibration5" : {
            "formAnswersManager" : [
                {
                    "id": 12181299428632,
                    "uuid": "f3b85401-d6b3-4cdc-955d-858491cda126",
                    "type": "question",
                    "score": 0,
                    "answer": "2",
                    "criticalQuestionFailure": true
                },
                {
                    "id": 12181299440552,
                    "uuid": "a941fd45-0cc2-4a32-8747-7000068095d3",
                    "type": "question",
                    "score": 1,
                    "answer": "1",
                    "criticalQuestionFailure": false
                },
                {
                    "id": 13703961891780,
                    "uuid": "d36191f1-2906-4648-a413-7f2f533db290",
                    "type": "question",
                    "score": 2,
                    "answer": [
                        "4",
                        "5"
                    ],
                    "criticalQuestionFailure": false
                },
                {
                    "id": 3045324869334,
                    "uuid": "058bd2af-5388-4bbf-8379-f6858d688a11",
                    "type": "question",
                    "score": 2,
                    "answer": [
                        "1",
                        "2"
                    ],
                    "criticalQuestionFailure": false
                }
            ],
            "formAnswersAdmin" : [
                {
                    "id": 12181299428632,
                    "uuid": "f3b85401-d6b3-4cdc-955d-858491cda126",
                    "type": "question",
                    "score": 1,
                    "answer": "1",
                    "criticalQuestionFailure": false
                },
                {
                    "id": 12181299440552,
                    "uuid": "a941fd45-0cc2-4a32-8747-7000068095d3",
                    "type": "question",
                    "score": 0,
                    "answer": "2",
                    "criticalQuestionFailure": true
                },
                {
                    "id": 13703961891780,
                    "uuid": "d36191f1-2906-4648-a413-7f2f533db290",
                    "type": "question",
                    "score": 1,
                    "answer": [
                        "4"
                    ],
                    "criticalQuestionFailure": false
                },
                {
                    "id": 3045324869334,
                    "uuid": "058bd2af-5388-4bbf-8379-f6858d688a11",
                    "type": "question",
                    "score": 3,
                    "answer": [
                        "3",
                        "4",
                        "5"
                    ],
                    "criticalQuestionFailure": false
                }
            ]
        },
        "calibration6": {
            "formAnswersAdmin" : [
                {
                    "id": 4568194835187,
                    "uuid": "e8e7640d-d1ee-47a4-9de3-c51e4d57e33f",
                    "type": "question",
                    "score": 20,
                    "answer": [
                        "3"
                    ],
                    "criticalQuestionFailure": false
                },
                {
                    "id": 4568194850508,
                    "uuid": "d15b9222-673b-4377-bf52-622a821955b5",
                    "type": "question",
                    "score": 20,
                    "answer": [
                        "3",
                        "4"
                    ],
                    "criticalQuestionFailure": false
                },
                {
                    "id": 13704584593167,
                    "uuid": "c3ed59e2-4744-47d1-b156-cd874f0adc4e",
                    "type": "question",
                    "score": 0,
                    "answer": [
                        "3"
                    ],
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1522731630024,
                    "type": "question",
                    "uuid": "cd8a646e-306a-400f-b801-3776f4db8e54",
                    "answer": "1"
                },
                {
                    "id": 7613658133730,
                    "uuid": "87cb7c39-2927-4f0b-b08f-bfa28a8a1962",
                    "type": "question",
                    "score": 5,
                    "answer": "3",
                    "criticalQuestionFailure": false
                }
            ],
            "formAnswersEvaluator" : [
                {
                    "id": 4568194835187,
                    "uuid": "815ccfd8-670f-443c-a3eb-4c042161bf24",
                    "type": "question",
                    "score": 40,
                    "answer": [
                        "3",
                        "4"
                    ],
                    "criticalQuestionFailure": false
                },
                {
                    "id": 4568194850508,
                    "uuid": "e9e8f51d-07e4-48ca-bb8d-5ec008c66c8f",
                    "type": "question",
                    "score": 40,
                    "answer": [
                        "3",
                        "4",
                        "5"
                    ],
                    "criticalQuestionFailure": false
                },
                {
                    "id": 13704584593167,
                    "uuid": "e528ca98-d9db-4ebc-93ca-37e4c5493980",
                    "type": "question",
                    "score": 0,
                    "answer": [
                        "4"
                    ],
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1522731630024,
                    "type": "question",
                    "uuid": "413f6664-7b87-41ac-9bea-e221e3475c18",
                    "answer": "1"
                },
                {
                    "id": 7613658133730,
                    "uuid": "fd7107c9-a445-4d33-b854-ada9052236ce",
                    "type": "question",
                    "score": 0,
                    "answer": "4",
                    "criticalQuestionFailure": false
                }
            ]
        }
    }
    suite04 = {
        "selfAssessment1": {
            "formAnswers": [
                {
                    "id": 1002932853190,
                    "type": "question",
                    "uuid": "6e6c7436-fef9-4396-8016-b33ff4f40a00",
                    "answer": "Agent Name"
                },
                {
                    "id": 1021690904633,
                    "type": "question",
                    "uuid": "f5b3c9b5-3d5b-464a-a783-d5358a3e3a79",
                    "answer": "Address field in the executor form filling with char limit of 130 characto. Checking the max size is should not extends the maximu"
                },
                {
                    "id": 1040795801065,
                    "uuid": "649b8d3c-ddf5-486b-a908-884e45bc0829",
                    "type": "question",
                    "score": 1,
                    "answer": "1",
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1088848277763,
                    "uuid": "7d2fc4fb-1624-4dd5-95d4-58de51c31b77",
                    "type": "question",
                    "score": 1,
                    "answer": [
                        "1"
                    ],
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1072686966033,
                    "uuid": "a8f33f16-1145-44fe-bb80-8f42fb93f344",
                    "type": "question",
                    "score": 1,
                    "answer": "1",
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1016007253078,
                    "type": "question",
                    "uuid": "b0099d44-853f-4882-bd58-6d6f4a05179c",
                    "answer": ""
                }
            ]
        }
    }
    suite05 = {
        "evaluationOne": {
            "formAnswersManager": [
                {
                    "id": 1024543639315,
                    "type": "question",
                    "uuid": "607981ab-9cb4-4493-8bef-1f0c9c85a776",
                    "answer": "Agent User name : User 1"
                },
                {
                    "id": 1055237171643,
                    "type": "question",
                    "uuid": "60463820-32f1-40f5-a022-410321358008",
                    "answer": "Based out of New York"
                },
                {
                    "id": 1002268031633,
                    "uuid": "2b36e033-e94b-48c9-92a5-3aa7f08c9171",
                    "type": "question",
                    "score": 1,
                    "answer": "1",
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1028890092462,
                    "uuid": "69822e75-34f2-4de0-a294-c8f66b322319",
                    "type": "question",
                    "score": 1,
                    "answer": [
                        "1"
                    ],
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1083621467974,
                    "uuid": "cec51a20-9fa0-40fe-8c0b-723607b4ae0b",
                    "type": "question",
                    "score": 1,
                    "answer": "1",
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1030535457369,
                    "type": "question",
                    "uuid": "3af479ae-1f5a-4277-90d5-4e4562bdbadd",
                    "answer": "NA"
                }
            ],
            "formAnswersAgent" : [
                {
                    "id": 1024543639315,
                    "type": "question",
                    "uuid": "607981ab-9cb4-4493-8bef-1f0c9c85a776",
                    "answer": "Agent User name : User 1"
                },
                {
                    "id": 1055237171643,
                    "type": "question",
                    "uuid": "60463820-32f1-40f5-a022-410321358008",
                    "answer": "Based out of New York"
                },
                {
                    "id": 1002268031633,
                    "uuid": "2b36e033-e94b-48c9-92a5-3aa7f08c9171",
                    "type": "question",
                    "score": 1,
                    "answer": "1",
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1028890092462,
                    "uuid": "69822e75-34f2-4de0-a294-c8f66b322319",
                    "type": "question",
                    "score": 1,
                    "answer": [
                        "1"
                    ],
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1083621467974,
                    "uuid": "cec51a20-9fa0-40fe-8c0b-723607b4ae0b",
                    "type": "question",
                    "score": 1,
                    "answer": "1",
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1030535457369,
                    "type": "question",
                    "uuid": "3af479ae-1f5a-4277-90d5-4e4562bdbadd",
                    "answer": "NA"
                }
            ]
        },
        "evaluationTwo": {
            "formAnswersEvaluator": [
                {
                    "id": 1024543639315,
                    "type": "question",
                    "uuid": "607981ab-9cb4-4493-8bef-1f0c9c85a776",
                    "answer": "This is the name of the agent : Agent User"
                },
                {
                    "id": 1055237171643,
                    "type": "question",
                    "uuid": "60463820-32f1-40f5-a022-410321358008",
                    "answer": "Based out of New York"
                },
                {
                    "id": 1002268031633,
                    "uuid": "2b36e033-e94b-48c9-92a5-3aa7f08c9171",
                    "type": "question",
                    "score": 1,
                    "answer": "2",
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1028890092462,
                    "uuid": "69822e75-34f2-4de0-a294-c8f66b322319",
                    "type": "question",
                    "score": 1,
                    "answer": [
                        "1"
                    ],
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1083621467974,
                    "type": "question",
                    "uuid": "cec51a20-9fa0-40fe-8c0b-723607b4ae0b",
                    "answer": "na"
                },
                {
                    "id": 1030535457369,
                    "type": "question",
                    "uuid": "3af479ae-1f5a-4277-90d5-4e4562bdbadd",
                    "answer": "NA"
                }
            ],
            "formAnswersAgent": [
                {
                    "id": 1024543639315,
                    "type": "question",
                    "uuid": "607981ab-9cb4-4493-8bef-1f0c9c85a776",
                    "answer": "This is the name of the agent : Agent User"
                },
                {
                    "id": 1055237171643,
                    "type": "question",
                    "uuid": "60463820-32f1-40f5-a022-410321358008",
                    "answer": "Based out of New York"
                },
                {
                    "id": 1002268031633,
                    "uuid": "2b36e033-e94b-48c9-92a5-3aa7f08c9171",
                    "type": "question",
                    "score": 1,
                    "answer": "2",
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1028890092462,
                    "uuid": "69822e75-34f2-4de0-a294-c8f66b322319",
                    "type": "question",
                    "score": 1,
                    "answer": [
                        "1"
                    ],
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1083621467974,
                    "type": "question",
                    "uuid": "cec51a20-9fa0-40fe-8c0b-723607b4ae0b",
                    "answer": "na"
                },
                {
                    "id": 1030535457369,
                    "type": "question",
                    "uuid": "3af479ae-1f5a-4277-90d5-4e4562bdbadd",
                    "answer": "NA"
                }
            ],
            "formAnswersAgentRequestReview" : [{"answer":"Requesting a review"}],
            "formAnswersEvaluatorSecondEvaluation" : [
                {
                    "id": 1024543639315,
                    "type": "question",
                    "uuid": "607981ab-9cb4-4493-8bef-1f0c9c85a776",
                    "answer": "This is the name of the agent : Agent User"
                },
                {
                    "id": 1055237171643,
                    "type": "question",
                    "uuid": "60463820-32f1-40f5-a022-410321358008",
                    "answer": "Based out of New York"
                },
                {
                    "id": 1002268031633,
                    "uuid": "2b36e033-e94b-48c9-92a5-3aa7f08c9171",
                    "type": "question",
                    "score": 1,
                    "answer": "2",
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1028890092462,
                    "uuid": "69822e75-34f2-4de0-a294-c8f66b322319",
                    "type": "question",
                    "score": 1,
                    "answer": [
                        "1"
                    ],
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1083621467974,
                    "uuid": "cec51a20-9fa0-40fe-8c0b-723607b4ae0b",
                    "type": "question",
                    "score": 0,
                    "answer": "2",
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1030535457369,
                    "type": "question",
                    "uuid": "3af479ae-1f5a-4277-90d5-4e4562bdbadd",
                    "answer": "NA"
                }
            ],
            "formAnswersEvaluatorRequestReview" : [{"answer":"Review done again"}]
        }
    }
    suite06 = {
        "evaluationOne": {
            "formAnswersManager": [
                {
                    "id": 1024543639315,
                    "type": "question",
                    "uuid": "ded453fe-731c-4a4c-bfe7-9db9c78d7ef8",
                    "answer": "This is the name of the agent : Agent User"
                },
                {
                    "id": 1055237171643,
                    "type": "question",
                    "uuid": "872397f0-9c02-4e9d-9408-c772fabc4e93",
                    "answer": "Based out of New York"
                },
                {
                    "id": 1002268031633,
                    "uuid": "902124e6-99e8-4f68-8763-e5df07b363c2",
                    "type": "question",
                    "score": 1,
                    "answer": "1",
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1028890092462,
                    "uuid": "b543cadb-f27b-4b6a-969d-1333afe23c5f",
                    "type": "question",
                    "score": 1,
                    "answer": [
                        "1"
                    ],
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1083621467974,
                    "type": "question",
                    "uuid": "0dc67ab3-2659-42f9-8c65-2e5485953968",
                    "answer": "na"
                },
                {
                    "id": 1030535457369,
                    "type": "question",
                    "uuid": "3b4d66e8-6bd0-4fec-aee6-921b2e3f33a8",
                    "answer": "NA"
                }
            ],
            "formAnswersAgent" : [
                {
                    "id": 1024543639315,
                    "type": "question",
                    "uuid": "ded453fe-731c-4a4c-bfe7-9db9c78d7ef8",
                    "answer": "My NAme : Agent User 1"
                },
                {
                    "id": 1055237171643,
                    "type": "question",
                    "uuid": "872397f0-9c02-4e9d-9408-c772fabc4e93",
                    "answer": "I am based out of New York"
                },
                {
                    "id": 1002268031633,
                    "uuid": "902124e6-99e8-4f68-8763-e5df07b363c2",
                    "type": "question",
                    "score": 1,
                    "answer": "1",
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1028890092462,
                    "uuid": "b543cadb-f27b-4b6a-969d-1333afe23c5f",
                    "type": "question",
                    "score": 1,
                    "answer": [
                        "2"
                    ],
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1083621467974,
                    "uuid": "0dc67ab3-2659-42f9-8c65-2e5485953968",
                    "type": "question",
                    "score": 1,
                    "answer": "1",
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1030535457369,
                    "type": "question",
                    "uuid": "3b4d66e8-6bd0-4fec-aee6-921b2e3f33a8",
                    "answer": ""
                }
            ]
        },
        "evaluationTwo": {
            "formAnswersAgent": [
                {
                    "id": 1024543639315,
                    "type": "question",
                    "uuid": "ded453fe-731c-4a4c-bfe7-9db9c78d7ef8",
                    "answer": "This is the name of the agent : Agent User"
                },
                {
                    "id": 1055237171643,
                    "type": "question",
                    "uuid": "872397f0-9c02-4e9d-9408-c772fabc4e93",
                    "answer": "Based out of New York"
                },
                {
                    "id": 1002268031633,
                    "uuid": "902124e6-99e8-4f68-8763-e5df07b363c2",
                    "type": "question",
                    "score": 1,
                    "answer": "1",
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1028890092462,
                    "uuid": "b543cadb-f27b-4b6a-969d-1333afe23c5f",
                    "type": "question",
                    "score": 1,
                    "answer": [
                        "1"
                    ],
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1083621467974,
                    "type": "question",
                    "uuid": "0dc67ab3-2659-42f9-8c65-2e5485953968",
                    "answer": "na"
                },
                {
                    "id": 1030535457369,
                    "type": "question",
                    "uuid": "3b4d66e8-6bd0-4fec-aee6-921b2e3f33a8",
                    "answer": "NA"
                }
            ],
            "formAnswersManager": [
                {
                    "id": 1024543639315,
                    "type": "question",
                    "uuid": "ded453fe-731c-4a4c-bfe7-9db9c78d7ef8",
                    "answer": "My NAme : Agent User 1"
                },
                {
                    "id": 1055237171643,
                    "type": "question",
                    "uuid": "872397f0-9c02-4e9d-9408-c772fabc4e93",
                    "answer": "I am based out of New York"
                },
                {
                    "id": 1002268031633,
                    "uuid": "902124e6-99e8-4f68-8763-e5df07b363c2",
                    "type": "question",
                    "score": 1,
                    "answer": "1",
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1028890092462,
                    "uuid": "b543cadb-f27b-4b6a-969d-1333afe23c5f",
                    "type": "question",
                    "score": 1,
                    "answer": [
                        "2"
                    ],
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1083621467974,
                    "uuid": "0dc67ab3-2659-42f9-8c65-2e5485953968",
                    "type": "question",
                    "score": 1,
                    "answer": "1",
                    "criticalQuestionFailure": false
                },
                {
                    "id": 1030535457369,
                    "type": "question",
                    "uuid": "3b4d66e8-6bd0-4fec-aee6-921b2e3f33a8",
                    "answer": ""
                }
            ]
        }
    }
}


