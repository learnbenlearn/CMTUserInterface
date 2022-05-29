import { LightningElement, track } from 'lwc';

import getCMTs from '@salesforce/apex/CmtUiService.getCMTs';
import getCMTRecordsSingleCall from '@salesforce/apex/CmtUiService.getCMTRecordsSingleCall';
import setupCmtUi from '@salesforce/apex/CmtUiService.setupCmtUi';

export default class CmtUiContainer extends LightningElement {
    cmtRecordsByType;
    cmtRecords;
    cmtNames;
    @track cmtOptions;
    customFieldDescribeResults;
    displayRecord;
    selectedRecord;
    selectedType;
    showSpinner = true;

    connectedCallback() {
        this.getCMTNames();
    }

    async getCMTNames() {
        try {
            let getCMTsResponse = await getCMTs();

            if(getCMTsResponse.length > 0) {
                this.cmtNames = [];
                this.cmtOptions = [];

                for(let cmt of getCMTsResponse) {
                    this.cmtNames.push(cmt.DeveloperName);

                    this.cmtOptions.push({
                        label: cmt.MasterLabel,
                        value: cmt.DeveloperName
                    });
                }

                this.cmtRecordsByType = await getCMTRecordsSingleCall({cmts: this.cmtNames});
            }
            this.showSpinner = false;

        } catch(error) {
            console.error(error);
        }
    }

    async handleSetupCMTRecords() {
        try {
            this.showSpinner = true;
            await setupCmtUi();
            this.getCMTNames();
        } catch(error) {
            console.error(error)
        }
    }
    
    handleRefreshCMTRecords() {
        this.getCMTNames();
        this.showSpinner = false;
    }

    handleCMTChange(event) {
        this.selectedType = event.detail.value + '__mdt';
        this.cmtRecords = this.cmtRecordsByType[this.selectedType].recordMap;
    }

    handleRecordSelected(event) {
        this.selectedRecord = this.cmtRecords[event.detail];
        this.customFieldDescribeResults = this.cmtRecordsByType[this.selectedType]['customFieldDescribeResults'];


        if(!this.displayRecord) {
            this.displayRecord = true;
        }
    }
}