import { by, element, ElementFinder } from 'protractor';
import { RadioPO } from 'cxone-components/radio.po';

export class EvaluationTypePO {
    public ancestor: ElementFinder;
    public collaborativeRadio: RadioPO;
    public standardRadio: RadioPO;

    public constructor() {
        this.ancestor = element(by.css('.evaluation-type-container'));
        this.collaborativeRadio = new RadioPO('type-collaborative');
        this.standardRadio = new RadioPO('type-standard');
    }

    public async getSelectedEvaluationType(): Promise<string> {
        let isStandard = await this.standardRadio.isChecked();
        if (isStandard) {
            return 'Standard';
        } else {
            return 'Collaborative';
        }
    }

    public async setStandardEvaluationType() {
        await this.standardRadio.click();
    }

    public async setCollaborativeEvaluationType() {
        await this.collaborativeRadio.click();
    }

    public async isEnabled() {
        const isStandardEnabled = await this.standardRadio.isEnabled();
        const isCollaborativeEnabled = await this.collaborativeRadio.isEnabled();
        return isStandardEnabled && isCollaborativeEnabled;
    }
}
