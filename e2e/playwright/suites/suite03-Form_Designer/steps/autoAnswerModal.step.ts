import { LoginPage } from './../../../../common/login';
import { CommonUIUtils } from 'cxone-playwright-test-utils';
import { AccountUtils } from '../../../../common/AccountUtils';
import { Utils } from '../../../../common/utils';
import { Given, When, Then, BeforeAll, AfterAll } from "cucumber";
import { BrowserContext, Page, expect, chromium } from "@playwright/test";
import { CommonNoUIUtils } from '../../../../common/CommonNoUIUtils';
import { GlobalTenantUtils } from '../../../../common/globalTenantUtils';
import { FEATURE_TOGGLES } from "../../../../common/uiConstants";
import { FeatureToggleUtils } from '../../../../common/FeatureToggleUtils';
import { OnPrepare } from '../../../../playwright.config';
import * as moment from 'moment';
import * as _ from 'lodash';
import FormDesignerPagePO from "../../../../pageObjects/FormDesignerPagePO";
import { FormAreaComponentPo } from "../../../../pageObjects/FormAreaComponentPO";
import { ManageFormsPO } from '../../../../pageObjects/ManageFormsPO';
import { DuplicateFormModalPO } from '../../../../pageObjects/DuplicateFormModalPO';
import { ElementAttributesComponentPo } from '../../../../pageObjects/ElementAttributesComponentPO';
import * as userPermissions from '../../../../common/userDefaultPermissions';
import { CreateAutoAnswerRulesPO } from '../../../../pageObjects/CreateAutoAnswerRulesModalComponentPO';


let browser: any;
let newGlobalTenantUtils = new GlobalTenantUtils();
let USER_TOKEN: string;
let newOnPrepare: any;
let calibrationPO: any;
let getElementLists: any;
let tmToken: any;
let tmUtils:any;
let page: Page;
let context: BrowserContext;
let Login :LoginPage
const formName = 'autoAnswerForm';
const userDefaultPermissions = userPermissions;
const duplicateFormName = 'autoAnswerFormDuplicate'; let userDetails: any = {
     adminCreds: {
          email: 'adminptor.' + AccountUtils.getRandomEmail(0),
          password: 'Password1'
     },
     managerCreds: {
          firstName: 'Manager',
          lastName: 'User',
          role: '',
          email: 'ptor.' + AccountUtils.getRandomEmail(0),
          password: 'Password1'
     }
}

const formDetails = {
     formName: formName,
     formStatus: 'Draft',
     formType: 'EVALUATION',
     formData: JSON.stringify({
          formTitle: '',
          themeId: '',
          theme: {
               themeId: '',
               themeName: '',
               isDefault: true,
               themeLogo: '',
               themeData: {
                    imgWidth: 243,
                    imgHeight: 30,
                    isAspectRatioChecked: true,
                    logoAspectRatio: 8.1,
                    bgColor: '#ffffff',
                    numberingEnabled: true,
                    title: {
                         text: '',
                         font: 'OpenSans',
                         fontSize: 18,
                         fontIndent: 'left',
                         fontStyling: {
                              fontColor: '#2e2e2e',
                              italic: { isLabelItalic: false, fontStyle: 'normal' },
                              bold: { isLabelBold: true, fontWeight: 'bold' },
                              underline: { isLabelUnderline: false, textDecoration: 'none' }
                         }
                    },
                    subTitle: {
                         text: '',
                         font: 'OpenSans',
                         fontSize: 13,
                         fontIndent: 'left',
                         fontStyling: {
                              fontColor: '#707070',
                              italic: { isLabelItalic: false, fontStyle: 'normal' },
                              bold: { isLabelBold: false, fontWeight: 'normal' },
                              underline: { isLabelUnderline: false, textDecoration: 'none' }
                         }
                    }
               }
          },
          elementCount: 11,
          elements: [{
               id: 1007671790468,
               uuid: '950544e6-a75f-4e05-a73b-44e344610cfc',
               type: 'section',
               elementData: {
                    sectionElementData: [],
                    attributes: {
                         isScorable: false,
                         question: 'Set Title',
                         backgroundColor: '#ffffff',
                         visible: true,
                         appliedRuleCount: 0,
                         questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:18px;color:#5b788e;">Set Title</span><strong></p>',
                         numbering: 1,
                         showNumbering: true,
                         showNumberingDot: true
                    }
               }
          }, {
               id: 1002534595182,
               uuid: 'fef28647-7f1d-4183-8d4e-fb93d6216fcb',
               type: 'yesno',
               elementData: {
                    attributes: {
                         visible: true,
                         question: 'Set question',
                         isScorable: true,
                         appliedRuleCount: 0,
                         elementType: 'yes/no',
                         maxScore: 1,
                         answer: '',
                         required: false,
                         layout: 'vertical',
                         showErrorMsg: false,
                         logic: true,
                         subText: '',
                         choiceList: [{
                              label: 'Yes',
                              value: '1',
                              criticalQuestionCorrectChoice: true,
                              score: 1
                         }, { label: 'No', value: '2', criticalQuestionCorrectChoice: true, score: 0 }],
                         isCritical: false,
                         isScoringEnabledForQuestion: true,
                         questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:13px;color:#000000;">Set question</span></strong></p>',
                         numbering: 2,
                         showNumbering: true,
                         showNumberingDot: true
                    }
               }
          }, {
               id: 1032685724194,
               uuid: 'ed4e342a-455b-4c9b-a8fa-b4c863f2e5de',
               type: 'radio',
               elementData: {
                    attributes: {
                         visible: true,
                         question: 'Set question',
                         isScorable: true,
                         appliedRuleCount: 0,
                         elementType: 'radio',
                         maxScore: 1,
                         answer: '',
                         required: false,
                         layout: 'vertical',
                         showErrorMsg: false,
                         logic: true,
                         subText: '',
                         choiceList: [{
                              label: 'Choice 1',
                              value: '1',
                              criticalQuestionCorrectChoice: true,
                              score: 1
                         }, {
                              label: 'Choice 2',
                              value: '2',
                              criticalQuestionCorrectChoice: true,
                              score: 1
                         }],
                         isCritical: false,
                         isScoringEnabledForQuestion: true,
                         questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:13px;color:#000000;">Set question</span></strong></p>',
                         numbering: 3,
                         showNumbering: true,
                         showNumberingDot: true
                    }
               }
          }, {
               id: 1085066169482,
               uuid: 'b14f1806-464c-4e44-b06e-19315f2aed3e',
               type: 'checkbox',
               elementData: {
                    attributes: {
                         visible: true,
                         question: 'Set question',
                         isScorable: true,
                         appliedRuleCount: 0,
                         elementType: 'checkbox',
                         maxScore: 2,
                         answer: [],
                         required: false,
                         layout: 'vertical',
                         showErrorMsg: false,
                         logic: true,
                         subText: '',
                         choiceList: [{
                              label: 'Choice 1',
                              value: '1',
                              criticalQuestionCorrectChoice: true,
                              score: 1,
                              selected: false
                         }, {
                              label: 'Choice 2',
                              value: '2',
                              criticalQuestionCorrectChoice: true,
                              score: 1,
                              selected: false
                         }],
                         isCritical: false,
                         isScoringEnabledForQuestion: true,
                         questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:13px;color:#000000;">Set question</span></strong></p>',
                         numbering: 4,
                         showNumbering: true,
                         showNumberingDot: true
                    }
               }
          }, {
               id: 1056164074881,
               uuid: 'd31d4884-d8aa-4da5-a008-a75fccb4628d',
               type: 'datetime',
               elementData: {
                    attributes: {
                         visible: true,
                         appliedRuleCount: 0,
                         logic: true,
                         dateAttributes: {
                              elementType: 'date',
                              question: 'Set question',
                              visible: true,
                              required: false,
                              showErrorMsg: false,
                              subText: '',
                              isScorable: false,
                              answer: 1603655990000,
                              useCurrentDate: false,
                              dateFormats: ['dd-MMM-yyyy', 'MMM-dd-yyyy', 'yyyy-MMM-dd'],
                              dateFormat: 'dd-MMM-yyyy',
                              questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:13px;color:#000000;">Set question</span></strong></p>'
                         },
                         timeAttributes: {
                              elementType: 'time',
                              question: 'Set question',
                              visible: false,
                              required: false,
                              showErrorMsg: false,
                              subText: '',
                              isScorable: false,
                              answer: 1603655990000,
                              useCurrentTime: false,
                              timeFormats: ['12H', '24H'],
                              questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:13px;color:#000000;">Set question</span></strong></p>'
                         },
                         numbering: 5,
                         showNumbering: true,
                         showNumberingDot: true
                    }
               }
          }, {
               id: 1078720878664,
               uuid: '26c47612-97fd-4374-b9db-58d0711de170',
               type: 'dropdown',
               elementData: {
                    attributes: {
                         visible: true,
                         question: 'Set question',
                         isScorable: false,
                         appliedRuleCount: 0,
                         elementType: 'dropdown',
                         answer: [],
                         required: false,
                         showErrorMsg: false,
                         logic: true,
                         subText: '',
                         dropdownType: 'single',
                         itemList: [{
                              id: 'Choice 1',
                              label: 'Choice 1',
                              value: 'Choice 1'
                         }, { id: 'Choice 2', label: 'Choice 2', value: 'Choice 2' }],
                         questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:13px;color:#000000;">Set question</span></strong></p>',
                         numbering: 6,
                         showNumbering: true,
                         showNumberingDot: true
                    }
               }
          }, {
               id: 1077330334758,
               uuid: '54925390-4cba-4ea4-ab87-7a52fca63316',
               type: 'hyperlink',
               elementData: {
                    attributes: {
                         visible: true,
                         appliedRuleCount: 0,
                         question: 'Enter Text',
                         isScorable: false,
                         url: 'http://',
                         questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:13px;color:#007cbe;">Enter Text</span></strong></p>'
                    }
               }
          }, {
               id: 1061672146352,
               uuid: 'e0378a06-3c85-400a-9f44-10e4f1e01584',
               type: 'label',
               elementData: {
                    attributes: {
                         visible: true,
                         appliedRuleCount: 0,
                         question: 'Set Title',
                         isScorable: false,
                         questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:13px;color:#000000;">Set Title</span></strong></p>'
                    }
               }
          }, {
               id: 1045840485910,
               uuid: '4b168e87-caa7-46f7-8f5a-acbf55e1ed89',
               type: 'text',
               elementData: {
                    attributes: {
                         visible: true,
                         appliedRuleCount: 0,
                         question: 'Set question',
                         isScorable: false,
                         answer: '',
                         required: false,
                         prePopulatedHintText: '',
                         showErrorMsg: false,
                         questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:13px;color:#000000;">Set question</span></strong></p>',
                         numbering: 7,
                         showNumbering: true,
                         showNumberingDot: true
                    }
               }
          }, {
               id: 1079146084996,
               uuid: 'f49b2265-ff40-41bf-8b38-52171bfeb5b9',
               type: 'textarea',
               elementData: {
                    attributes: {
                         visible: true,
                         appliedRuleCount: 0,
                         question: 'Set question',
                         isScorable: false,
                         answer: '',
                         required: false,
                         prePopulatedHintText: '',
                         showErrorMsg: false,
                         subText: '',
                         limitCharacters: false,
                         limitCharactersText: 250,
                         questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:13px;color:#000000;">Set question</span></strong></p>',
                         numbering: 8,
                         showNumbering: true,
                         showNumberingDot: true
                    }
               }
          }, {
               id: 1079659574704,
               uuid: '6bd0d30c-145c-43ea-830f-2ece0e81697d',
               type: 'yesno',
               elementData: {
                    attributes: {
                         visible: true,
                         question: 'Set question',
                         isScorable: true,
                         appliedRuleCount: 0,
                         elementType: 'yes/no',
                         maxScore: 1,
                         answer: '',
                         required: false,
                         layout: 'vertical',
                         showErrorMsg: false,
                         logic: true,
                         subText: '',
                         choiceList: [{
                              label: 'Yes',
                              value: '1',
                              criticalQuestionCorrectChoice: true,
                              score: 1
                         }, { label: 'No', value: '2', criticalQuestionCorrectChoice: true, score: 0 }],
                         isCritical: false,
                         isScoringEnabledForQuestion: true,
                         questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:13px;color:#000000;">Set question</span></strong></p>',
                         numbering: 9,
                         showNumbering: true,
                         showNumberingDot: true
                    }
               }
          }, {
               id: 1086232264194,
               uuid: '08623226-72c9-4410-8415-d507a680d784',
               type: 'radio',
               elementData: {
                    attributes: {
                         visible: true,
                         question: 'Set question',
                         isScorable: true,
                         appliedRuleCount: 0,
                         elementType: 'radio',
                         maxScore: 1,
                         answer: '',
                         required: false,
                         layout: 'vertical',
                         showErrorMsg: false,
                         logic: true,
                         subText: '',
                         choiceList: [{
                              label: 'Choice 1',
                              value: '1',
                              criticalQuestionCorrectChoice: true,
                              score: 1
                         }, {
                              label: 'Choice 2',
                              value: '2',
                              criticalQuestionCorrectChoice: true,
                              score: 1
                         }],
                         isCritical: false,
                         isScoringEnabledForQuestion: true,
                         questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:13px;color:#000000;">Set question</span></strong></p>',
                         numbering: 10,
                         showNumbering: true,
                         showNumberingDot: true
                    }
               }
          }, {
               id: 1629257369482,
               uuid: '6292b573-5aba-46bd-8e9c-42971d8f8067',
               type: 'checkbox',
               elementData: {
                    attributes: {
                         visible: true,
                         question: 'Set question',
                         isScorable: true,
                         appliedRuleCount: 0,
                         elementType: 'checkbox',
                         maxScore: 2,
                         answer: [],
                         required: false,
                         layout: 'vertical',
                         showErrorMsg: false,
                         logic: true,
                         subText: '',
                         choiceList: [{
                              label: 'Choice 1',
                              value: '1',
                              criticalQuestionCorrectChoice: true,
                              score: 1,
                              selected: false
                         }, {
                              label: 'Choice 2',
                              value: '2',
                              criticalQuestionCorrectChoice: true,
                              score: 1,
                              selected: false
                         }],
                         isCritical: false,
                         isScoringEnabledForQuestion: true,
                         questionHTML: '<p><strong><span style="font-family:\'OpenSans\';font-size:13px;color:#000000;">Set question</span></strong></p>',
                         numbering: 11,
                         showNumbering: true,
                         showNumberingDot: true
                    }
               }
          }],
          rules: {},
          rulesAssociation: {},
          headerFields: [],
          ranking: {
               isRankingEnabled: false,
               totalCoverage: 101,
               ranges: [{ from: '0%', to: '50%', coverage: 51, displayText: 'Failed' }, {
                    from: '51%',
                    to: '100%',
                    coverage: 50,
                    displayText: 'Passed'
               }]
          },
          formMaxScore: 0,
          currentScore: 0,
          percentage: null
     })
};

let categories1 = ['Abandoned Call', 'Account Changes', 'Account Inquiries', 'Account Problems', 'Agent Condescending', 'Agent Curses', 'Agent Difficult to Understand', 'Agent Dismissive', 'Agent Efficient'];
let categories2 = ['Agent Polite', 'Agent Rude'];
let spanishCategories1 = ['Cliente escalado', 'Cliente transferido', 'Contactado varias veces', 'Cliente derivado'];
let spanishCategories2 = ['Agente desdeñosa', 'Maldiciones del agente'];
 
const formDesignerPage = new FormDesignerPagePO();
const formArea = new FormAreaComponentPo();
const createAutoAnswerRuleModal = new CreateAutoAnswerRulesPO();
const duplicateFormModalPO = new DuplicateFormModalPO();
const elementAttributes = new ElementAttributesComponentPo();
let manageFormsPO: any;

const addBehaviorRuleForYesNoQuestion = async function () {
     await formArea.clickElementOnFormArea('2. Set question', 'yesno');
     await formArea.clickAutoResponseRulesIcon('2. Set question', 'yesno');
     await createAutoAnswerRuleModal.clickBehaviourRuleType();
     await createAutoAnswerRuleModal.selectBehaviourOption('Actively listening', 0);
     await createAutoAnswerRuleModal.selectBehaviorType('strongly-negative', 0);
     await createAutoAnswerRuleModal.clickSaveBtn();
     await formArea.clickElementOnFormArea('2. Set question', 'yesno');
     let isPresent = await createAutoAnswerRuleModal.isAutoAnswerPresent();
     expect(isPresent).toBeTruthy();
}



const addBehaviorRuleForRadioQuestion = async function () {
     await formArea.clickElementOnFormArea('10. Set question', 'radio');
     await formArea.clickAutoResponseRulesIcon('10. Set question', 'radio');
     await createAutoAnswerRuleModal.clickBehaviourRuleType();
     await createAutoAnswerRuleModal.selectBehaviourOption('Acknowledge loyalty', 0);
     await createAutoAnswerRuleModal.selectBehaviorType('strongly-positive', 0);
     await createAutoAnswerRuleModal.selectBehaviourOption('Be empathetic', 1);
     await createAutoAnswerRuleModal.selectBehaviorType('neutral', 1);
     await createAutoAnswerRuleModal.clickSaveBtn();
     await formArea.clickElementOnFormArea('10. Set question', 'radio');
     let isPresent = await createAutoAnswerRuleModal.isAutoAnswerPresent();
     expect(isPresent).toBeTruthy();
}

const addBehaviorRuleForCheckboxQuestion = async function () {
     await formArea.clickElementOnFormArea('11. Set question', 'checkbox');
     await formArea.clickAutoResponseRulesIcon('11. Set question', 'checkbox');
     await createAutoAnswerRuleModal.clickBehaviourRuleType();
     await createAutoAnswerRuleModal.selectBehaviourOption('Inappropriate action', 0);
     await createAutoAnswerRuleModal.selectBehaviorType('moderately-negative', 0);
     await createAutoAnswerRuleModal.selectBehaviourOption('Set expectations', 1);
     await createAutoAnswerRuleModal.selectBehaviorType('moderately-positive', 1);
     await createAutoAnswerRuleModal.clickSaveBtn();
     await formArea.clickElementOnFormArea('11. Set question', 'checkbox');
     let isPresent = await createAutoAnswerRuleModal.isAutoAnswerPresent();
     expect(isPresent).toBeTruthy();
}

const verifyBehaviourRule = async function (indexs: number[], behaviourOptions: string[], behaviourTypes: string[]) {
     let selectedBehaviourOption = '';
     let selectedBehaviourType = '';
     for (let i = 0; i < indexs.length; i++) {
          selectedBehaviourOption = await createAutoAnswerRuleModal.getSelectedBehaviorOption(indexs[i]);
          selectedBehaviourType = await createAutoAnswerRuleModal.getSelectedBehaviorType(indexs[i], behaviourTypes[i]);
          expect(selectedBehaviourOption).toEqual(behaviourOptions[i]);
          expect(selectedBehaviourType).toContain('selected');
     }
}

const verifyBehaviourRulesForYesNoQuestion = async function (indexs: number[], behaviourOptions: string[], behaviourTypes: string[]) {
     await formArea.clickElementOnFormArea('2. Set question', 'yesno');
     await formArea.clickAutoResponseRulesIcon('2. Set question', 'yesno');
     await verifyBehaviourRule(indexs, behaviourOptions, behaviourTypes);
}

const editBehaviourRulesForYesNoQuestion = async function () {
     await createAutoAnswerRuleModal.selectBehaviourOption('Demonstrate ownership', 0);
     await createAutoAnswerRuleModal.selectBehaviorType('strongly-positive', 0);
     await createAutoAnswerRuleModal.clickSaveBtn();
     let isAutoAnswerRulesSaved = await createAutoAnswerRuleModal.isAutoAnswerPresent();
     expect(isAutoAnswerRulesSaved).toBeTruthy();
}


const verifyBehaviourRulesForRadioQuestion = async function (indexs: number[], behaviourOptions: string[], behaviourTypes: string[]) {
     await formArea.clickElementOnFormArea('10. Set question', 'radio');
     await formArea.clickAutoResponseRulesIcon('10. Set question', 'radio');
     await verifyBehaviourRule(indexs, behaviourOptions, behaviourTypes);

}

const editBehaviourRulesForRadioQuestion = async function () {
     await createAutoAnswerRuleModal.selectBehaviourOption('Build rapport', 0);
     await createAutoAnswerRuleModal.selectBehaviorType('moderately-positive', 0);
     await createAutoAnswerRuleModal.selectBehaviourOption('Inappropriate action', 1);
     await createAutoAnswerRuleModal.selectBehaviorType('strongly-negative', 1);
     await createAutoAnswerRuleModal.clickSaveBtn();
     let isAutoAnswerRulesSaved = await createAutoAnswerRuleModal.isAutoAnswerPresent();
     expect(isAutoAnswerRulesSaved).toBeTruthy();
}
const verifyBehaviourRulesForCheckBoxQuestion = async function (indexs: number[], behaviourOptions: string[], behaviourTypes: string[]) {
     await formArea.clickElementOnFormArea('11. Set question', 'checkbox');
     await formArea.clickAutoResponseRulesIcon('11. Set question', 'checkbox');
     await verifyBehaviourRule(indexs, behaviourOptions, behaviourTypes);
}


const editBehaviourRulesForCheckBoxQuestion = async function () {
     await createAutoAnswerRuleModal.selectBehaviourOption('Effective questioning', 0);
     await createAutoAnswerRuleModal.selectBehaviorType('neutral', 0);
     await createAutoAnswerRuleModal.selectBehaviourOption('Promote self-service', 1);
     await createAutoAnswerRuleModal.selectBehaviorType('strongly-negative', 1);
     await createAutoAnswerRuleModal.clickSaveBtn();
     let isAutoAnswerRulesSaved = await createAutoAnswerRuleModal.isAutoAnswerPresent();
     expect(isAutoAnswerRulesSaved).toBeTruthy();
}
const addAutoAnswerRulesForYesNoQuestion = async function () {
     await formArea.clickElementOnFormArea('9. Set question', 'yesno');
     await formArea.clickAutoResponseRulesIcon('9. Set question', 'yesno');
     await createAutoAnswerRuleModal.selectLanguage('English','yes');
     await createAutoAnswerRuleModal.selectCategories(categories1, 0);
     await createAutoAnswerRuleModal.selectCategories(categories2, 1);
     let selectedTag = await createAutoAnswerRuleModal.getSelectedTag(0);
     expect(selectedTag.includes('Abandoned Call', 'Account Changes', 'Account Inquiries', 'Account Problems', 'Agent Condescending', 'Agent Curses', 'Agent Difficult to Understand')).toBeTruthy();
     selectedTag = await createAutoAnswerRuleModal.getShowMoreSelectedText(0);
     expect(selectedTag.includes('Agent Dismissive', 'Agent Efficient')).toBeTruthy();
     selectedTag = await createAutoAnswerRuleModal.getSelectedTag(1);
     expect(selectedTag.includes('Agent Polite', 'Agent Rude')).toBeTruthy();
     await createAutoAnswerRuleModal.clickSaveBtn();
     let isPresent = await createAutoAnswerRuleModal.isAutoAnswerPresent();
     expect(isPresent).toBeTruthy();
}

const addAutoAnswerRuleForRadioQuestion = async function () {
     await formArea.clickElementOnFormArea('3. Set question', 'radio');
     await formArea.clickAutoResponseRulesIcon('3. Set question', 'radio');
     await createAutoAnswerRuleModal.selectLanguage('English','yes');
     await createAutoAnswerRuleModal.selectCategories(categories2, 1);
     let selectedTag = await createAutoAnswerRuleModal.getSelectedTag(1);
     expect(selectedTag.includes('Agent Polite', 'Agent Rude')).toBeTruthy();
     await createAutoAnswerRuleModal.clickSaveBtn();
     let isAutoAnswerRulesSaved = await createAutoAnswerRuleModal.isAutoAnswerPresent();
     expect(isAutoAnswerRulesSaved).toBeTruthy();
}

const addAutoAnswerRuleForCheckBoxQuestion = async function () {
     await formArea.clickElementOnFormArea('4. Set question', 'checkbox');
     await formArea.clickAutoResponseRulesIcon('4. Set question', 'checkbox');
     await createAutoAnswerRuleModal.selectLanguage('English' ,'yes');
     await createAutoAnswerRuleModal.selectCategories(categories2, 0);
     let selectedTag = await createAutoAnswerRuleModal.getSelectedTag(0);
     expect(selectedTag.includes('Agent Polite', 'Agent Rude')).toBeTruthy();
     await createAutoAnswerRuleModal.clickSaveBtn();
     let isAutoAnswerRulesSaved = await createAutoAnswerRuleModal.isAutoAnswerPresent();
     expect(isAutoAnswerRulesSaved).toBeTruthy();
}

const verifyEditRulesForYesNoQuestion = async function () {
     await formArea.clickElementOnFormArea('9. Set question', 'yesno');
     await formArea.clickAutoResponseRulesIcon('9. Set question', 'yesno');
     let isLanguagePresent = await createAutoAnswerRuleModal.selectLanguage('Spanish', 'yes');
     let selectedTag = await createAutoAnswerRuleModal.getSelectedTag(0);
     expect(selectedTag).toEqual([]);
     selectedTag = await createAutoAnswerRuleModal.getSelectedTag(1);
     expect(selectedTag).toEqual([]);
     await createAutoAnswerRuleModal.selectCategories(spanishCategories1, 0);
     await createAutoAnswerRuleModal.selectCategories(spanishCategories2, 1);
     selectedTag = await createAutoAnswerRuleModal.getSelectedTag(0);
     expect(selectedTag.includes('Cliente escalado', 'Cliente transferido', 'Contactado varias veces', 'Cliente derivado')).toBeTruthy();
     selectedTag = await createAutoAnswerRuleModal.getSelectedTag(1);
     expect(selectedTag.includes('Agente desdeñosa', 'Maldiciones del agente')).toBeTruthy();
     await createAutoAnswerRuleModal.clickSaveBtn();
     let isAutoAnswerRulesSaved = await createAutoAnswerRuleModal.isAutoAnswerPresent();
     expect(isAutoAnswerRulesSaved).toBeTruthy();
}

const verifyRulesRemovedForYesNoQuestion = async function () {
     await formArea.clickElementOnFormArea('9. Set question', 'yesno');
     await formArea.clickAutoResponseRulesIcon('9. Set question', 'yesno');
     let selectedTag = await createAutoAnswerRuleModal.getSelectedTag(0);
     expect(selectedTag.includes('Cliente derivado', 'Cliente transferido', 'Cliente escalado')).toBeTruthy();
     let selectedCategories = await createAutoAnswerRuleModal.getSelectedCategories(0);
     expect(selectedCategories).toEqual(['Cliente derivado', 'Cliente escalado', 'Cliente transferido', 'Contactado varias veces']);
     await createAutoAnswerRuleModal.removeSelectedCategoriesTag(['Cliente derivado', 'Contactado varias veces', 'Cliente transferido', 'Cliente escalado'], 0);
     await createAutoAnswerRuleModal.removeSelectedCategoriesTag(spanishCategories2, 1);
     await createAutoAnswerRuleModal.clickSaveBtn();
     let isAutoAnswerRulesSaved = await createAutoAnswerRuleModal.isAutoAnswerPresent();
     expect(isAutoAnswerRulesSaved).toBeFalsy();
}

const verifyEditRulesForCheckBoxQuestion = async function () {
     await formArea.clickElementOnFormArea('4. Set question', 'checkbox');
     await formArea.clickAutoResponseRulesIcon('4. Set question', 'checkbox');
     await createAutoAnswerRuleModal.selectLanguage('English','yes');
     let selectedTag = await createAutoAnswerRuleModal.getSelectedTag(0);
     expect(selectedTag.includes('Agent Polite', 'Agent Rude')).toBeTruthy();
     let selectedCategories = await createAutoAnswerRuleModal.getSelectedCategories(0);
     expect(selectedCategories).toEqual(['Agent Polite', 'Agent Rude']);
     await createAutoAnswerRuleModal.removeSelectedCategoriesTag(['Agent Rude'], 0);
     selectedCategories = await createAutoAnswerRuleModal.getSelectedCategories(0);
     expect(selectedCategories).toEqual(['Agent Polite']);
     await createAutoAnswerRuleModal.clickSaveBtn();
     let isAutoAnswerRulesSaved = await createAutoAnswerRuleModal.isAutoAnswerPresent();
     expect(isAutoAnswerRulesSaved).toBeTruthy();
}

const verifyRulesRemovedForCheckBoxQuestion = async function () {
     await formArea.clickElementOnFormArea('4. Set question', 'checkbox');
     await formArea.clickAutoResponseRulesIcon('4. Set question', 'checkbox');
     let selectedTag = await createAutoAnswerRuleModal.getSelectedTag(0);
     expect(selectedTag.includes('Agent Polite')).toBeTruthy();
     let selectedCategories = await createAutoAnswerRuleModal.getSelectedCategories(0);
     expect(selectedCategories).toEqual(['Agent Polite']);
     await createAutoAnswerRuleModal.removeSelectedCategoriesTag(['Agent Polite'], 0);
     await createAutoAnswerRuleModal.clickSaveBtn();
     let isAutoAnswerRulesSaved = await createAutoAnswerRuleModal.isAutoAnswerPresent();
     expect(isAutoAnswerRulesSaved).toBeFalsy();
}

const verifyEditRulesForRadioQuestion = async function () {
     await formArea.clickElementOnFormArea('3. Set question', 'radio');
     await formArea.clickAutoResponseRulesIcon('3. Set question', 'radio');
     await createAutoAnswerRuleModal.selectLanguage('English','yes');
     let selectedTag = await createAutoAnswerRuleModal.getSelectedTag(1);
     expect(selectedTag.includes('Agent Polite', 'Agent Rude')).toBeTruthy();
     let selectedCategories = await createAutoAnswerRuleModal.getSelectedCategories(1);
     expect(selectedCategories).toEqual(['Agent Polite', 'Agent Rude']);
     await createAutoAnswerRuleModal.removeSelectedCategoriesTag(['Agent Rude'], 1);
     selectedCategories = await createAutoAnswerRuleModal.getSelectedCategories(1);
     expect(selectedCategories).toEqual(['Agent Polite']);
     await createAutoAnswerRuleModal.clickSaveBtn();
     let isAutoAnswerRulesSaved = await createAutoAnswerRuleModal.isAutoAnswerPresent();
     expect(isAutoAnswerRulesSaved).toBeTruthy();
}

const verifyRulesRemovedForRadioQuestion = async function () {
     await formArea.clickElementOnFormArea('3. Set question', 'radio');
     await formArea.clickAutoResponseRulesIcon('3. Set question', 'radio');
     let selectedTag = await createAutoAnswerRuleModal.getSelectedTag(1);
     expect(selectedTag.includes('Agent Polite')).toBeTruthy();
     let selectedCategories = await createAutoAnswerRuleModal.getSelectedCategories(1);
     expect(selectedCategories).toEqual(['Agent Polite']);
     await createAutoAnswerRuleModal.removeSelectedCategoriesTag(['Agent Polite'], 1);
     await createAutoAnswerRuleModal.clickSaveBtn();
     let isAutoAnswerRulesSaved = await createAutoAnswerRuleModal.isAutoAnswerPresent();
     expect(isAutoAnswerRulesSaved).toBeFalsy();
}

const verifySentimentRulesForYesNoQuestion = async function (indexs: number[], sentimentSides: string[], sentimentTypes: string[]) {
     await formArea.clickElementOnFormArea('2. Set question', 'yesno');
     await formArea.clickAutoResponseRulesIcon('2. Set question', 'yesno');
     await verifySentimentRule(indexs, sentimentSides, sentimentTypes);

}

const editSentimentRulesForYesNoQuestion = async function () {
     await createAutoAnswerRuleModal.selectSentimentType('Neutral', 0);
     await createAutoAnswerRuleModal.selectSentimentSide('Customer side', 0);
     await createAutoAnswerRuleModal.clickSaveBtn();
     let isAutoAnswerRulesSaved = await createAutoAnswerRuleModal.isAutoAnswerPresent();
     expect(isAutoAnswerRulesSaved).toBeTruthy();
}

const verifySentimentRulesForRadioQuestion = async function (indexs: number[], sentimentSides: string[], sentimentTypes: string[]) {
     await formArea.clickElementOnFormArea('10. Set question', 'radio');
     await formArea.clickAutoResponseRulesIcon('10. Set question', 'radio');
     await verifySentimentRule(indexs, sentimentSides, sentimentTypes);

}

const editSentimentRulesForRadioQuestion = async function () {
     await createAutoAnswerRuleModal.selectSentimentType('Neutral', 0);
     await createAutoAnswerRuleModal.selectSentimentSide('Agent side', 0);
     await createAutoAnswerRuleModal.selectSentimentType('Neutral', 1);
     await createAutoAnswerRuleModal.selectSentimentSide('Customer side', 1);
     await createAutoAnswerRuleModal.clickSaveBtn();
     let isAutoAnswerRulesSaved = await createAutoAnswerRuleModal.isAutoAnswerPresent();
     expect(isAutoAnswerRulesSaved).toBeTruthy();
}

const verifySentimentRulesForCheckBoxQuestion = async function (indexs: number[], sentimentSides: string[], sentimentTypes: string[]) {
     await formArea.clickElementOnFormArea('11. Set question', 'checkbox');
     await formArea.clickAutoResponseRulesIcon('11. Set question', 'checkbox');
     await verifySentimentRule(indexs, sentimentSides, sentimentTypes);

}

const verifySentimentRule = async function (indexs: number[], sentimentSides: string[], sentimentTypes: string[]) {
     let selectedSentimentSide = '';
     let selectedSentimentType = '';
     for (let i = 0; i < indexs.length; i++) {
          selectedSentimentSide = await createAutoAnswerRuleModal.getSelectedSentimentSide(indexs[i]);
          selectedSentimentType = await createAutoAnswerRuleModal.getSelectedSentimentType(indexs[i]);
          expect(selectedSentimentSide).toEqual(sentimentSides[i]);
          expect(selectedSentimentType).toEqual(sentimentTypes[i]);
     }
}

const editSentimentRulesForCheckBoxQuestion = async function () {
     await createAutoAnswerRuleModal.selectSentimentType('Positive', 0);
     await createAutoAnswerRuleModal.selectSentimentSide('Customer side', 0);
     await createAutoAnswerRuleModal.selectSentimentType('Negative', 1);
     await createAutoAnswerRuleModal.selectSentimentSide('Agent side', 1);
     await createAutoAnswerRuleModal.clickSaveBtn();
     let isAutoAnswerRulesSaved = await createAutoAnswerRuleModal.isAutoAnswerPresent();
     expect(isAutoAnswerRulesSaved).toBeTruthy();
}

const addSentimentRuleForYesNoQuestion = async function () {
     await formArea.clickElementOnFormArea('2. Set question', 'yesno');
     await formArea.clickAutoResponseRulesIcon('2. Set question', 'yesno');
     await createAutoAnswerRuleModal.clickSentimentRuleType();
     await createAutoAnswerRuleModal.selectSentimentType('Mixed', 0);
     const ruleTypeChangeWarningPopupText = await createAutoAnswerRuleModal.getRuleTypeChangeWarningPopupText();
     expect(ruleTypeChangeWarningPopupText).toContain('Changing the rule type will remove the selected configuration.');
     await createAutoAnswerRuleModal.clickRuleTypeWarningPopupBtn('change');
     await createAutoAnswerRuleModal.selectSentimentSide('Agent side', 0);
     await createAutoAnswerRuleModal.clickSaveBtn();
     await formArea.clickElementOnFormArea('2. Set question', 'yesno');
     let isPresent = await createAutoAnswerRuleModal.isAutoAnswerPresent();
     expect(isPresent).toBeTruthy();
}

const addSentimentRuleForRadioQuestion = async function () {
     await formArea.clickElementOnFormArea('10. Set question', 'radio');
     await formArea.clickAutoResponseRulesIcon('10. Set question', 'radio');
     await createAutoAnswerRuleModal.clickSentimentRuleType();
     await createAutoAnswerRuleModal.selectSentimentType('Positive', 0);
     await expect(this.page.locator(createAutoAnswerRuleModal.elements.ruleTypeChangeWarningPopup).waitFor({state:'attached',timeout:10000});     const ruleTypeChangeWarningPopupText = await createAutoAnswerRuleModal.getRuleTypeChangeWarningPopupText();
     expect(ruleTypeChangeWarningPopupText).toContain('Changing the rule type will remove the selected configuration.');
     await createAutoAnswerRuleModal.clickRuleTypeWarningPopupBtn('change');
     await createAutoAnswerRuleModal.selectSentimentSide('Customer side', 0);
     await createAutoAnswerRuleModal.selectSentimentType('Negative', 1);
     await createAutoAnswerRuleModal.selectSentimentSide('Agent side', 1);
     await createAutoAnswerRuleModal.clickSaveBtn();
     await formArea.clickElementOnFormArea('10. Set question', 'radio');
     let isPresent = await createAutoAnswerRuleModal.isAutoAnswerPresent();
     expect(isPresent).toBeTruthy();
}


const addSentimentRuleForCheckboxQuestion = async function () {
     await formArea.clickElementOnFormArea('11. Set question', 'checkbox');
     await formArea.clickAutoResponseRulesIcon('11. Set question', 'checkbox');
     await createAutoAnswerRuleModal.clickSentimentRuleType();
     await createAutoAnswerRuleModal.selectSentimentType('Neutral', 0);
     const ruleTypeChangeWarningPopupText = await createAutoAnswerRuleModal.getRuleTypeChangeWarningPopupText();
     expect(ruleTypeChangeWarningPopupText).toContain('Changing the rule type will remove the selected configuration.');
     await createAutoAnswerRuleModal.clickRuleTypeWarningPopupBtn('change');
     await createAutoAnswerRuleModal.selectSentimentSide('Agent side', 0);
     await createAutoAnswerRuleModal.selectSentimentType('Mixed', 1);
     await createAutoAnswerRuleModal.selectSentimentSide('Customer side', 1);
     await createAutoAnswerRuleModal.clickSaveBtn();
     await formArea.clickElementOnFormArea('11. Set question', 'checkbox');
     let isPresent = await createAutoAnswerRuleModal.isAutoAnswerPresent();
     expect(isPresent).toBeTruthy();
}


BeforeAll({ timeout: 300 * 1000 }, async () => {
     browser = await chromium.launch({
          headless: false,
          args: ['--window-position=-8,0']
     });
     context = await browser.newContext();
     page = await context.newPage();
     userDetails.adminCreds = (await newGlobalTenantUtils.getDefaultTenantCredentials()).adminCreds;
     userDetails.orgName =  (await newGlobalTenantUtils.getDefaultTenantCredentials()).orgName;
     USER_TOKEN = await CommonNoUIUtils.login(userDetails.adminCreds.email, userDetails.adminCreds.password, true);
     await tmUtils.updateTenantLicenses(userDetails.orgName, ['QMP', 'WFM'], tmToken);
     USER_TOKEN = await CommonNoUIUtils.login(userDetails.adminCreds.email, userDetails.adminCreds.password, true);
     newOnPrepare = new OnPrepare();
     manageFormsPO = new ManageFormsPO(page);
     await newOnPrepare.OnStart();
     await newOnPrepare.toggleFeatureToggle(FEATURE_TOGGLES.RELEASE_NAVIGATION_REDESIGN, userDetails.orgName, userDetails.adminCreds.token);
     await newOnPrepare.toggleFeatureToggle(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userDetails.adminCreds.token);
     await newOnPrepare.toggleFeatureToggle(FEATURE_TOGGLES.AUTO_RESPONSE_SENTIMENT, userDetails.orgName, userDetails.adminCreds.token);
     await newOnPrepare.toggleFeatureToggle(FEATURE_TOGGLES.AUTO_RESPONSE_BEHAVIOR, userDetails.orgName, userDetails.adminCreds.token);
     await newOnPrepare.toggleFeatureToggle(FEATURE_TOGGLES.MOCK_CATEGORIES, userDetails.orgName, userDetails.adminCreds.token);
     await newOnPrepare.toggleFeatureToggle(FEATURE_TOGGLES.LANGUAGE_SELECTOR, userDetails.orgName, userDetails.adminCreds.token);
     await newOnPrepare.toggleFeatureToggle(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, true, userDetails.orgName, USER_TOKEN)
     await newOnPrepare.toggleFeatureToggle(FEATURE_TOGGLES.RELEASE_NAVIGATION_REDESIGN, true, userDetails.orgName, USER_TOKEN)
     await manageFormsPO.navigateTo();
     await formDesignerPage.navigate();
     await Utils.waitUntilVisible(await formArea.getFormArea());
     let response = await CommonNoUIUtils.createNewRoleByPermissions('customManager', 'Custom Manager 1', userDefaultPermissions.getUserDefaultApplications('manager'), userDetails.adminCreds.token);
     userDetails.managerCreds.role = response.roleName;
     await AccountUtils.createAndActivateUser(
          userDetails.managerCreds.email,
          userDetails.managerCreds.password,
          userDetails.managerCreds,
          userDetails.adminCreds.email,
          userDetails.orgName,
          userDetails.adminCreds.token);
          // await protrac.logout(true, 120000, userDetails.orgName, userDetails.adminCreds.token); //! insted of this used this logout
          await  Login.logout()
          await Login.login(userDetails.managerCreds.email, userDetails.managerCreds.password);

});

AfterAll({ timeout: 60 * 1000 }, async () => {
     await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.ANGULAR8_MIGRATION_SPRING20, userDetails.orgName, userDetails.adminCreds.token);
     await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.AUTO_RESPONSE_SENTIMENT, userDetails.orgName, userDetails.adminCreds.token);
     await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.AUTO_RESPONSE_BEHAVIOR, userDetails.orgName, userDetails.adminCreds.token);
     await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.MOCK_CATEGORIES, userDetails.orgName, userDetails.adminCreds.token);
     await FeatureToggleUtils.removeTenantFromFeature(FEATURE_TOGGLES.LANGUAGE_SELECTOR, userDetails.orgName, userDetails.adminCreds.token);
     await  Login.logout()
});



Given("Step 1:verify auto response rule icon should be visible to yesno,radio,checkbox type element only", { timeout: 60 * 1000 }, async () => {
     await CommonNoUIUtils.createForm(formDetails, USER_TOKEN);
     await manageFormsPO.navigateTo();
     await manageFormsPO.searchFormInGrid(formName);
     await manageFormsPO.openParticularForm(formName);
     await manageFormsPO.waitForSpinnerToDisappear();
     await Utils.waitUntilVisible(formDesignerPage.elements.sectionFormElement);
     await formArea.clickElementOnFormArea('1. Set Title', 'section');
     expect(Utils.isPresent(await formArea.getAutoResponseIcon('1. Set Title', 'section'))).toBeFalsy();
     await formArea.clickElementOnFormArea('2. Set question', 'yesno');
     expect(Utils.isPresent(await formArea.getAutoResponseIcon('2. Set question', 'yesno'))).toBeTruthy();
     await formArea.clickElementOnFormArea('3. Set question', 'radio');
     expect(Utils.isPresent(await formArea.getAutoResponseIcon('3. Set question', 'radio'))).toBeTruthy();
     await formArea.clickElementOnFormArea('4. Set question', 'checkbox');
     expect(Utils.isPresent(await formArea.getAutoResponseIcon('4. Set question', 'checkbox'))).toBeTruthy();
     await formArea.clickElementOnFormArea('5. Set question', 'datetime');
     expect(Utils.isPresent(await formArea.getAutoResponseIcon('5. Set question', 'datetime'))).toBeFalsy();
     await formArea.clickElementOnFormArea('6. Set question', 'dropdown');
     expect(Utils.isPresent(await formArea.getAutoResponseIcon('6. Set question', 'dropdown'))).toBeFalsy();
     await formArea.clickElementOnFormArea('Enter Text', 'hyperlink');
     expect(Utils.isPresent(await formArea.getAutoResponseIcon('Enter Text', 'hyperlink'))).toBeFalsy();
     await formArea.clickElementOnFormArea('Set Title', 'label');
     expect(Utils.isPresent(await formArea.getAutoResponseIcon('Set Title', 'label'))).toBeFalsy();
     await formArea.clickElementOnFormArea('7. Set question', 'text');
     expect(Utils.isPresent(await formArea.getAutoResponseIcon('7. Set question', 'text'))).toBeFalsy();
     await formArea.clickElementOnFormArea('8. Set question', 'textArea');
     expect(Utils.isPresent(await formArea.getAutoResponseIcon('8. Set question', 'textArea'))).toBeFalsy();
     await formArea.clickElementOnFormArea('9. Set question', 'yesno');
     expect(Utils.isPresent(await formArea.getAutoResponseIcon('9. Set question', 'yesno'))).toBeTruthy();
     await formArea.clickElementOnFormArea('10. Set question', 'radio');
     expect(Utils.isPresent(await formArea.getAutoResponseIcon('10. Set question', 'radio'))).toBeTruthy();
     await formArea.clickElementOnFormArea('11. Set question', 'checkbox');
     expect(Utils.isPresent(await formArea.getAutoResponseIcon('11. Set question', 'checkbox'))).toBeTruthy();

});

When("Step-2:Should open auto response modal, select behaviourCategories and save auto answer rules for each element", { timeout: 180 * 1000 }, async () => {
     await addBehaviorRuleForYesNoQuestion();
     await addBehaviorRuleForRadioQuestion();
     await addBehaviorRuleForCheckboxQuestion();
});

Then("STEP-3:should verify & edit saved behaviour auto response rules", { timeout: 180 * 1000 }, async () => {
     await verifyBehaviourRulesForYesNoQuestion([0], ['Actively listening'], ['strongly-negative']);
     await editBehaviourRulesForYesNoQuestion();
     await verifyBehaviourRulesForRadioQuestion([0, 1], ['Acknowledge loyalty', 'Be empathetic'], ['strongly-positive', 'neutral']);
     await editBehaviourRulesForRadioQuestion();
     await verifyBehaviourRulesForCheckBoxQuestion([0, 1], ['Inappropriate action', 'Set expectations'], ['moderately-negative', 'moderately-positive']);
     await editBehaviourRulesForCheckBoxQuestion();
});

Then("STEP-4:should verify & edit saved behaviour auto response rules", { timeout: 180 * 1000 }, async () => {
     await verifyBehaviourRulesForYesNoQuestion([0], ['Actively listening'], ['strongly-negative']);
     await editBehaviourRulesForYesNoQuestion();
     await verifyBehaviourRulesForRadioQuestion([0, 1], ['Acknowledge loyalty', 'Be empathetic'], ['strongly-positive', 'neutral']);
     await editBehaviourRulesForRadioQuestion();
     await verifyBehaviourRulesForCheckBoxQuestion([0, 1], ['Inappropriate action', 'Set expectations'], ['moderately-negative', 'moderately-positive']);
     await editBehaviourRulesForCheckBoxQuestion();
});

Then("STEP-5:Should not allow save auto answer rules and display warning message when selecting identical behaviourCategories", { timeout: 180 * 1000 }, async () => {
     await formArea.clickElementOnFormArea('10. Set question', 'radio');
     await formArea.clickAutoResponseRulesIcon('10. Set question', 'radio');
     await createAutoAnswerRuleModal.clickBehaviourRuleType();
     await createAutoAnswerRuleModal.selectBehaviourOption('Actively listening', 0);
     await createAutoAnswerRuleModal.selectBehaviorType('moderately-negative', 0);
     await createAutoAnswerRuleModal.selectBehaviourOption('Actively listening', 1);
     await createAutoAnswerRuleModal.selectBehaviorType('moderately-negative', 1);

     await expect(page.locator(createAutoAnswerRuleModal.elements.saveBtn).waitFor({state:'attached',timeout:10000}))
     await createAutoAnswerRuleModal.elements.saveBtn.click();
     const text = await createAutoAnswerRuleModal.getErrorText();
     expect(text).toContain('The criteria for answers cannot be identical.');
     await createAutoAnswerRuleModal.clickCancelBtn();
});

Then("STEP-6:Should not allow save auto answer rules and display warning message when selecting identical sentiments", { timeout: 180 * 1000 }, async () => {
     await formArea.clickElementOnFormArea('10. Set question', 'radio');
     await formArea.clickAutoResponseRulesIcon('10. Set question', 'radio');
     await createAutoAnswerRuleModal.clickSentimentRuleType();
     await createAutoAnswerRuleModal.selectSentimentType('Positive', 0);
     const ruleTypeChangeWarningPopupText = await createAutoAnswerRuleModal.getRuleTypeChangeWarningPopupText();
     expect(ruleTypeChangeWarningPopupText).toContain('Changing the rule type will remove the selected configuration.');
     await createAutoAnswerRuleModal.clickRuleTypeWarningPopupBtn('change');
     await createAutoAnswerRuleModal.selectSentimentSide('Customer side', 0);
     await createAutoAnswerRuleModal.selectSentimentType('Positive', 1);
     await createAutoAnswerRuleModal.selectSentimentSide('Customer side', 1);

     await expect(page.locator(createAutoAnswerRuleModal.elements.saveBtn).waitFor({state:'attached',timeout:10000}))
     
     await createAutoAnswerRuleModal.elements.saveBtn.click();
     const text = await createAutoAnswerRuleModal.getErrorText();
     expect(text).toEqual('The criteria for answers cannot be identical.');
     await createAutoAnswerRuleModal.clickCancelBtn();
});

Then("STEP-7:Should open auto response modal, select sentiments and save auto answer rules for each element", { timeout: 180 * 1000 }, async () => {
     await addSentimentRuleForYesNoQuestion();
     await addSentimentRuleForRadioQuestion();
     await addSentimentRuleForCheckboxQuestion();
});

Then("STEP-8:should verify & edit saved sentiment auto response rules", { timeout: 180 * 1000 }, async () => {
     await verifySentimentRulesForYesNoQuestion([0], ['Agent side'], ['Mixed']);
     await editSentimentRulesForYesNoQuestion();
     await verifySentimentRulesForRadioQuestion([0, 1], ['Customer side', 'Agent side'], ['Positive', 'Negative']);
     await editSentimentRulesForRadioQuestion();
     await verifySentimentRulesForCheckBoxQuestion([0, 1], ['Agent side', 'Customer side'], ['Neutral', 'Mixed']);
     await editSentimentRulesForCheckBoxQuestion();
});

Then("STEP-9:should verify saved sentiment auto response rules when changing ruletype to behaviour is canceled", { timeout: 180 * 1000 }, async () => {
     await formArea.clickElementOnFormArea('10. Set question', 'radio');
     await formArea.clickAutoResponseRulesIcon('10. Set question', 'radio');
     await createAutoAnswerRuleModal.clickBehaviourRuleType();
     await createAutoAnswerRuleModal.selectBehaviourOption('Actively listening', 0);
     await expect(page.locator(createAutoAnswerRuleModal.elements.ruleTypeChangeWarningPopup).waitFor({state:'attached',timeout:10000}))
     const ruleTypeChangeWarningPopupText = await createAutoAnswerRuleModal.getRuleTypeChangeWarningPopupText();
     expect(ruleTypeChangeWarningPopupText).toContain('Changing the rule type will remove the selected configuration.');
     await createAutoAnswerRuleModal.clickRuleTypeWarningPopupBtn('cancel');
     await createAutoAnswerRuleModal.clickSentimentRuleType();
     await verifySentimentRule([0, 1], ['Agent side', 'Customer side'], ['Neutral', 'Neutral']);
     await createAutoAnswerRuleModal.clickCancelBtn();
});
Then("STEP-10:Should open auto response modal, select categories and save auto answer rules for each element", { timeout: 180 * 1000 }, async () => {
     await addAutoAnswerRulesForYesNoQuestion();
     await addAutoAnswerRuleForRadioQuestion();
     await addAutoAnswerRuleForCheckBoxQuestion();
});

Then("STEP-11:should verify & edit saved auto answer rules", { timeout: 180 * 1000 }, async () => {
     await verifyEditRulesForYesNoQuestion();
     await verifyEditRulesForRadioQuestion();
     await verifyEditRulesForCheckBoxQuestion();
});

Then("STEP-12:should save form as draft and verify auto-answer rules", { timeout: 180 * 1000 }, async () => {
     await formDesignerPage.saveFormAsDraft();
     await manageFormsPO.navigateTo();
});

Then("STEP-13:should duplicate form and verify auto-answer rules", { timeout: 180 * 1000 }, async () => {
     await manageFormsPO.searchFormInGrid(formName);
     const menuItem = await manageFormsPO.getHamburgerMenuItem(formName, 'Duplicate');
     await menuItem.click();
    await expect(page.locator('cxone-modal').waitFor({state:'attached',timeout:20000}))
     await duplicateFormModalPO.enterFormName(duplicateFormName);
     expect(await duplicateFormModalPO.checkSaveButton()).toBe(true);
     await duplicateFormModalPO.clickSaveButton();
     await manageFormsPO.waitForSpinnerToDisappear();
     await manageFormsPO.searchFormInGrid(duplicateFormName);
     await manageFormsPO.openParticularForm(duplicateFormName);
     await manageFormsPO.waitForSpinnerToDisappear();
   
});
Then("STEP-14:should publish form and verify auto-answer rules", { timeout: 180 * 1000 }, async () => {
     await formDesignerPage.saveAndActivateForm();
     await manageFormsPO.waitForSpinnerToDisappear();
     await manageFormsPO.searchFormInGrid(duplicateFormName);
     await manageFormsPO.openParticularForm(duplicateFormName);
     await manageFormsPO.waitForSpinnerToDisappear();
     await manageFormsPO.navigateTo();
});

Then("STEP-15:should be able to remove auto answer rules for each question", { timeout: 180 * 1000 }, async () => {
     await manageFormsPO.searchFormInGrid(formName);
     await manageFormsPO.openParticularForm(formName);
     await manageFormsPO.waitForSpinnerToDisappear();
     await verifyRulesRemovedForYesNoQuestion();
     await verifyRulesRemovedForRadioQuestion();
     await verifyRulesRemovedForCheckBoxQuestion();
});