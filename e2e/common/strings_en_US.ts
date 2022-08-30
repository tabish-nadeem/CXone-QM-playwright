var moment = require('moment');

export class Strings {
    selectFormEvalError = "Select a form for the evaluation."
    successAdd = "Form added successfully."
    successDup = "Form duplicated successfully."
    sampleFormData: "{\"formTitle\":\"\",\"elements\":[{\"id\":10624625963063,\"uuid\":\"acea9ba5-6629-4d9b-bf58-35bdf945c013\",\"type\":\"text\",\"elementData\":{\"attributes\":{\"isScorable\":false,\"question\":\"First_Name\",\"answer\":\"\",\"required\":false,\"prePopulatedHintText\":\"\",\"showErrorMsg\":false,\"fontStyling\":{\"font\":\"OpenSans\",\"fontSize\":14,\"fontColor\":\"#000000\",\"fontIndent\":\"left\",\"bold\":{\"isLabelBold\":true,\"fontWeight\":\"bold\"},\"italic\":{\"isLabelItalic\":false,\"fontStyle\":\"normal\"},\"underline\":{\"isLabelUnderline\":false,\"textDecoration\":\"none\"}},\"visible\":true,\"appliedRuleCount\":0,\"numbering\":1,\"showNumbering\":true,\"showNumberingDot\":true}},\"$$hashKey\":\"object:572\"}],\"theme\":{\"themeId\":\"\",\"themeName\":\"\",\"isDefault\":true,\"themeLogo\":\"\",\"themeData\":{\"imgWidth\":243,\"imgHeight\":30,\"isAspectRatioChecked\":true,\"logoAspectRatio\":8.1,\"bgColor\":\"#ffffff\",\"numberingEnabled\":true,\"title\":{\"text\":\"\",\"font\":\"OpenSans\",\"fontSize\":18,\"fontStyling\":{\"fontColor\":\"#2e2e2e\",\"italic\":{\"isLabelItalic\":false,\"fontStyle\":\"normal\"},\"bold\":{\"isLabelBold\":true,\"fontWeight\":\"bold\"},\"underline\":{\"isLabelUnderline\":false,\"textDecoration\":\"none\"}}},\"subTitle\":{\"text\":\"\",\"font\":\"OpenSans\",\"fontSize\":14,\"fontStyling\":{\"fontColor\":\"#707070\",\"italic\":{\"isLabelItalic\":false,\"fontStyle\":\"normal\"},\"bold\":{\"isLabelBold\":false,\"fontWeight\":\"normal\"},\"underline\":{\"isLabelUnderline\":false,\"textDecoration\":\"none\"}}}}},\"ranking\":{\"isRankingEnabled\":false,\"totalCoverage\":101,\"ranges\":[{\"from\":\"0%\",\"to\":\"50%\",\"coverage\":51,\"displayText\":\"Failed\"},{\"from\":\"51%\",\"to\":\"100%\",\"coverage\":50,\"displayText\":\"Passed\"}]},\"themeId\":\"\",\"elementCount\":1,\"rules\":{},\"rulesAssociation\":{},\"headerFields\":[],\"formMaxScore\":0,\"currentScore\":0,\"percentage\":null}"
    qualityPlanData = {
        name: "",
        description: "",
        state: "Draft",
        createdBy: "11e6d243-d9f6-c9d0-b7e6-0242ac110006",
        evaluators: ["11e6d243-d9f6-c9d0-b7e6-0242ac110006"],
        groups: ["11e6d244-16a7-2280-b7e6-0242ac110006"],
        numSegmentsPerAgent: 1,
        formId: "11e6d244-2260-14b0-92f6-0242ac110007",
        numDaysBackDistribution: -1,
        planDuration: {
            recurring: null,
            oneTimeDateRange: {
                startDate: moment.utc().subtract(4, 'day').toJSON(),
                endDate: moment.utc().add(1, 'day').toJSON()
            }
        },
        filters: [
            {
                name: "QpMediaTypeMapper",
                values: [],
                operation: "In",
                active: false
            },
            {
                name: "DirectionType",
                values: ['IN_BOUND'],
                operation: "In",
                active: true
            },
            {
                name: "CallDuration",
                value: "30",
                value2: "360",
                operation: "Greater",
                active: false,
                valid: true
            },
            {
                name: "Categories",
                operation: "In",
                values: [],
                active: true
            }
        ],
        createdDate: "2017-03-21T13:07:25.672Z",
        numInteractionsPerAgent: -1
        //teams: []
    }
    planTeamsAndGroups = {
        agentGroupsHeader : "Agents",
        teams : "Teams",
        groups : "Groups",
        noTeamsSelected : "No teams selected yet",
        selectedTeams : "{{selectedCount}} Teams",
        selectedGroups : "{{selectedCount}} Groups",
        selectTeams : "Select teams",
        selectGroups : "Select groups",
        selectedAgents : "Current total number of agents: ",
        errorMessages : {
            required : "You must select atleast one team"
        }
    }
    }
