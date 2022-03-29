import { LightningElement, wire } from 'lwc';

import { refreshApex } from '@salesforce/apex';

import getCMTs from '@salesforce/apex/CmtUiService.getCMTs';
import setupCmtUi from '@salesforce/apex/CmtUiService.setupCmtUi';

export default class CmtUiContainer extends LightningElement {
    cmtNames;

    @wire(getCMTs)
    parseCMTNames({error, data}) {
        if(data && data.length > 0) {
            this.cmtNames = data;
        } else if(error) {
            console.error(error);
        }
    }

    async handleSetupCMTRecords() {
        try {
            await setupCmtUi();
        } catch(error) {
            console.error(error)
        }
    }
    
    handleRefreshCMTRecords() {
        refreshApex(this.cmtNames);
    }
}