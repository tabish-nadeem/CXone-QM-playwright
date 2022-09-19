import { RadioPO } from 'cxone-components/radio.po';
import {expect, Locator, Page} from "@playwright/test";
import { Utils } from "../common/utils";

export class EvaluationTypePO {
    public collaborativeRadio: RadioPO;
    public standardRadio: RadioPO;
    readonly utils:Utils;
    readonly page:Page;

    public constructor() {
        this.page = this.page.locator(('.evaluation-type-container'));
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
